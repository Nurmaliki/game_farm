import Dexie, { type EntityTable } from 'dexie';
import { GameStateSchema, migrateState, type GameState } from '../domain/state';

interface SaveRecord {
  slot: number;
  name: string;
  updatedAt: number;
  state: GameState;
}

interface BackupRecord {
  id?: number;
  slot: number;
  createdAt: number;
  state: GameState;
}

const db = new Dexie('nusantara-farm') as Dexie & { saves: EntityTable<SaveRecord, 'slot'>; backups: EntityTable<BackupRecord, 'id'> };
db.version(1).stores({ saves: '&slot, updatedAt' });
db.version(2).stores({ saves: '&slot, updatedAt', backups: '++id, slot, createdAt' });

export async function saveGame(slot: number, name: string, state: GameState): Promise<void> {
  const validated = GameStateSchema.parse({ ...state, lastSavedAt: Date.now() });
  try {
    await db.transaction('rw', db.saves, db.backups, async () => {
      const previous = await db.saves.get(slot);
      if (previous) {
        await db.backups.add({ slot, createdAt: Date.now(), state: previous.state });
      }
      await db.saves.put({ slot, name, updatedAt: validated.lastSavedAt, state: validated });
      const old = await db.backups.where('slot').equals(slot).sortBy('createdAt');
      if (old.length > 5) {
        await db.backups.bulkDelete(old.slice(0, -5).map((item) => item.id!));
      }
    });
    announceSave(slot, validated.lastSavedAt);
  } catch (error) {
    if (error instanceof DOMException && ['QuotaExceededError', 'UnknownError'].includes(error.name)) {
      throw new Error('Penyimpanan perangkat penuh. Ekspor save lalu kosongkan ruang.');
    }
    throw error;
  }
}

export async function loadGame(slot: number): Promise<GameState | null> {
  const record = await db.saves.get(slot);
  return record ? migrateState(record.state) : null;
}

export async function listSaves(): Promise<Array<Pick<SaveRecord, 'slot' | 'name' | 'updatedAt'>>> {
  return (await db.saves.toArray()).map(({ slot, name, updatedAt }) => ({ slot, name, updatedAt }));
}

export function exportSave(state: GameState): string {
  return JSON.stringify(GameStateSchema.parse(state), null, 2);
}

export function importSave(source: string): GameState {
  if (new Blob([source]).size > 1_000_000) throw new Error('Ukuran save melebihi 1 MB.');
  return migrateState(JSON.parse(source));
}

export async function restoreLatestBackup(slot: number): Promise<GameState | null> {
  const records = await db.backups.where('slot').equals(slot).sortBy('createdAt');
  const latest = records.at(-1);
  if (!latest) return null;
  const state = migrateState(latest.state);
  const updatedAt = Date.now();
  await db.saves.put({ slot, name: 'Kebun Keluarga', updatedAt, state: { ...state, lastSavedAt: updatedAt } });
  announceSave(slot, updatedAt);
  return state;
}

const channel =
  typeof window !== 'undefined' && typeof BroadcastChannel !== 'undefined'
    ? new BroadcastChannel('nusantara-farm-saves')
    : null;
let conflictHandler: (slot: number) => void = () => undefined;

channel?.addEventListener('message', (event: MessageEvent<{ slot: number }>) =>
  conflictHandler(event.data.slot)
);

function announceSave(slot: number, updatedAt: number) {
  channel?.postMessage({ slot, updatedAt });
}

export function onExternalSave(handler: (slot: number) => void) {
  conflictHandler = handler;
  return () => {
    conflictHandler = () => undefined;
  };
}
