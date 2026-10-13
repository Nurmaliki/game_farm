# NUSANTARA FARM
# MASTER PROMPT FINAL v4.0
## Complete Production-Grade Game Development Specification
### For Codex / OpenCode Autonomous Coding Agents

---

# 0. PROJECT IDENTITY

**Project Name:** Nusantara Farm

**Genre:** Farming, Ranching, Fishing, Crafting, Building, Exploration & Village Life Simulation RPG

**Visual Style:** Premium Handcrafted 2D Pixel Art

**World Theme:** Fictional Tropical Indonesian Countryside

**Camera:** Orthographic Top-Down 3/4

**Target Platforms:** Desktop Browser, Mobile Browser, Installable PWA

**Primary UI Language:** Bahasa Indonesia

**Technology Stack:**
- SvelteKit
- TypeScript
- Phaser 3
- Tailwind CSS
- IndexedDB
- Dexie.js
- Zod
- Service Worker
- Cache Storage
- Vitest
- Playwright

**Deployment:** Vercel Static Hosting

**Backend:** NONE

**Remote Database:** NONE

**Cloud Save:** NONE

**Multiplayer:** NONE

**Required Internet Connection:** Only for initial download and updates

**Primary Objective:** Build a complete, playable, polished, offline-first browser game that is technically ready for production release after passing all required quality gates.

---

# 1. YOUR ROLE

You are an autonomous multidisciplinary senior game development team working inside the current repository.

Assume the responsibilities of:

1. Principal Software Architect
2. Senior SvelteKit Developer
3. Senior TypeScript Developer
4. Senior Phaser 3 Developer
5. Game Systems Engineer
6. Gameplay Designer
7. Game Economy Designer
8. Pixel Art Technical Artist
9. UI/UX Designer
10. Audio Integration Engineer
11. Database and Persistence Engineer
12. QA Automation Engineer
13. Performance Engineer
14. Security Engineer
15. DevOps Engineer
16. Technical Documentation Engineer

Your responsibility is to implement actual working software.

Do not merely explain how the game could be built.

Do not stop after producing architecture documents, pseudocode, mockups, or static demonstrations.

You must write code, integrate modules, execute tests, diagnose errors, repair failures, and maintain implementation documentation.

A feature is considered complete only when it is implemented, integrated, tested, and verified.

---

# 2. ABSOLUTE DEVELOPMENT RULES

## 2.1 Mandatory rules

- Inspect the existing repository before modifying it.
- Preserve useful existing code.
- Respect the existing package manager.
- Use strict TypeScript.
- Keep gameplay logic separate from rendering.
- Keep game state authoritative and centralized.
- Use deterministic simulation where practical.
- Implement actual gameplay interactions.
- Use data-driven content definitions.
- Write automated tests.
- Run validation after each phase.
- Fix errors rather than suppressing them.
- Preserve player saves across compatible updates.
- Maintain technical documentation.
- Support desktop and mobile.
- Support offline gameplay.
- Use original or appropriately licensed assets.

## 2.2 Strict prohibitions

Do not implement:

- PostgreSQL
- MySQL
- MongoDB
- Firebase
- Supabase
- Remote database services
- Gameplay backend APIs
- Mandatory login
- Authentication servers
- Cloud synchronization
- Multiplayer servers
- Online marketplaces
- Real-money transactions
- Pay-to-win mechanics
- Mandatory AI APIs
- Server-side game simulation

Do not introduce any backend without explicit authorization.

Do not use emojis as final game sprites.

Do not copy copyrighted artwork from existing games.

Do not claim production readiness without evidence.

Do not perform destructive Git operations, overwrite unrelated work, push, merge, or deploy without appropriate authorization.

---

# 3. GAME VISION

Build Nusantara Farm, an original premium pixel-art life simulation RPG inspired by the beauty and culture of Indonesian countryside.

The player inherits a neglected farm and gradually develops it into a successful agricultural community.

The game must support multiple meaningful activities:

- Farming
- Ranching
- Fishing
- Mining
- Foraging
- Bug catching
- Building
- Crafting
- Cooking
- Trading
- Exploration
- NPC relationships
- Quests
- Village reputation
- Festivals
- Museum collections
- Home decoration
- Pets and mounts
- Orchard farming
- Beekeeping
- Fish ponds
- Achievements

All systems must connect to a coherent progression loop.

The game must be relaxing, rewarding, accessible, and visually polished.

Avoid excessive grinding, unfair progression, and unnecessary complexity.

---

# 4. CORE GAMEPLAY LOOP

The primary gameplay loop:

Wake Up
→ Check Weather and Calendar
→ Manage Crops
→ Care for Animals
→ Collect Farm Products
→ Fish / Mine / Forage
→ Craft / Cook
→ Trade / Complete Quests
→ Build / Upgrade
→ Interact with NPCs
→ Sleep
→ Advance Day

Each activity must provide meaningful rewards through:

- Coins
- Experience
- Resources
- Unlocks
- Relationships
- Achievements
- Collection progress

The player must always have several useful activities available.

---

# 5. ARCHITECTURE

Use a modular monolith with strict separation between domain, application, presentation, and persistence.

## 5.1 Architecture layers

**Domain Layer**

Pure TypeScript gameplay logic.

Contains:

- Farming rules
- Animal simulation
- Fishing simulation
- Mining
- Foraging
- Inventory
- Economy
- Building
- Crafting
- Cooking
- Game clock
- Weather
- Quests
- NPC relationships
- Progression

The domain layer must not import Phaser, Svelte, IndexedDB, or browser-specific APIs.

**Application Layer**

Coordinates:

- Commands
- Events
- Use cases
- Transactions
- State updates
- Save operations

**Phaser Layer**

Handles:

- Tilemap rendering
- Player rendering
- NPC rendering
- Animal sprites
- Animations
- Camera
- Collision
- World interactions
- Particle effects
- Audio
- Scene transitions

**Svelte Layer**

Handles:

- Main menu
- HUD
- Inventory
- Shops
- Building menus
- Crafting
- Cooking
- Quest journal
- Map
- Settings
- Save manager
- Notifications

**Persistence Layer**

Handles:

- IndexedDB
- Save slots
- Autosave
- Backup
- Restore
- Schema migration
- Validation
- Recovery

## 5.2 Single authoritative state

Use one authoritative game state.

Commands must validate prerequisites before modifying state.

Use typed events to notify rendering and UI systems.

Avoid direct mutations from UI components.

## 5.3 Simulation rules

- One authoritative game clock.
- Seeded random number generation.
- Deterministic day processing.
- Atomic inventory and economy transactions.
- No duplicate rewards.
- No negative inventory or currency.
- No simulation based on uncontrolled wall-clock jumps.

---

# 6. PROJECT STRUCTURE

Create or adapt the following structure:

src/
  routes/
    +page.svelte
    play/+page.svelte
    settings/+page.svelte
    about/+page.svelte

  lib/
    game/
      bootstrap/
      scenes/
      entities/
      input/
      camera/
      animation/
      collision/
      effects/
      audio/

    domain/
      player/
      farming/
      ranching/
      fishing/
      mining/
      foraging/
      insects/
      building/
      crafting/
      cooking/
      orchard/
      beekeeping/
      fishpond/
      inventory/
      economy/
      exploration/
      clock/
      weather/
      npc/
      quests/
      progression/
      museum/
      festivals/
      reputation/
      pets/
      customization/

    application/
      commands/
      events/
      services/
      state/

    persistence/
      database/
      repositories/
      migrations/
      backup/
      validation/

    content/
      crops/
      animals/
      fish/
      insects/
      minerals/
      items/
      buildings/
      recipes/
      npc/
      quests/
      festivals/

    ui/
      hud/
      inventory/
      shops/
      building/
      crafting/
      cooking/
      fishing/
      dialogs/
      journal/
      settings/
      notifications/

    shared/
      types/
      constants/
      utils/

static/
  assets/
    characters/
    animals/
    crops/
    fish/
    insects/
    buildings/
    tilesets/
    maps/
    environment/
    ui/
    effects/
    audio/

tests/
  unit/
  integration/
  e2e/
  performance/
  fixtures/

scripts/
  validate-assets/
  generate-atlas/
  balance-simulation/

docs/
  architecture/
  game-design/
  art-bible/
  assets/
  testing/
  deployment/
  progress/

Do not create empty files simply to satisfy the structure.

---

# 7. PREMIUM PIXEL ART SPECIFICATION

## 7.1 Visual direction

The game must feature:

- Premium handcrafted pixel art
- Tropical Indonesian countryside
- Warm lighting
- Lush vegetation
- Expressive characters
- Cozy buildings
- Animated water
- Detailed environmental props
- Seasonal color variation
- Subtle weather effects

Perspective:

Orthographic top-down 3/4.

Do not mix incompatible visual perspectives.

## 7.2 Pixel dimensions

Base tile: 16×16 pixels

Player sprite: 32×48 pixels

Small animals: 32×32 or 48×48 pixels

Large animals: 48×48 or 64×64 pixels

Crops: 16×16 or 16×32 pixels

Trees: 32×48 to 64×96 pixels

UI icons: 16×16 or 32×32 pixels

Use nearest-neighbor filtering.

Prefer integer scaling.

## 7.3 Required animation

Player:

- Idle, four directions
- Walk, four directions
- Hoe
- Water
- Harvest
- Fish
- Mine
- Chop
- Catch insects
- Interact
- Sleep

Animals:

- Idle
- Walk
- Eat
- Sleep
- Produce
- Interact

Environment:

- Water
- Rain
- Fireflies
- Leaves
- Smoke
- Harvest particles
- Fishing splashes

## 7.4 Asset management

Maintain an asset registry containing:

- Asset ID
- File path
- Type
- Dimensions
- Frame count
- Animation metadata
- License
- Source
- Production status

Validate all asset references.

Use original or properly licensed assets.

If final premium art is unavailable, use clearly marked temporary assets and report the release blocker.

Never present placeholder art as finished production art.

---

# 8. PLAYER SYSTEM

Implement:

- Four-direction movement
- Camera following
- Collision
- Interaction range
- Tool use
- Stamina
- Leveling
- Experience
- Skill progression
- Safe spawn
- Responsive controls

Desktop:

WASD / Arrow Keys: Move

E: Interact

Mouse Click: Use selected tool

I: Inventory

M: Map

Esc: Pause

1–8: Hotbar

Mobile:

- Virtual joystick
- Interaction button
- Action button
- Inventory shortcut
- Responsive hotbar

Prevent movement through blocked objects.

---

# 9. FARMING SYSTEM

Implement:

- Soil tilling
- Planting
- Watering
- Fertilizing
- Crop growth
- Harvesting
- Regrowth
- Crop quality
- Seasonal conditions
- Tool upgrades

Initial crops:

- Rice
- Corn
- Carrot
- Tomato
- Chili
- Cassava
- Strawberry
- Watermelon

All crop definitions must be data-driven.

Each crop requires:

- ID
- Name
- Growth duration
- Growth stages
- Seasonal availability
- Water requirements
- Regrowth rules
- Seed price
- Sale price
- Experience reward

No duplicate harvest rewards.

---

# 10. RANCHING SYSTEM

Initial animals:

- Chicken
- Cow
- Goat
- Sheep

Attributes:

- Hunger
- Happiness
- Health
- Cleanliness
- Friendship

Implement:

- Buying
- Feeding
- Petting
- Cleaning
- Housing
- Product collection
- Animal AI
- Upgrades

Animal AI states:

IDLE → WANDER → EAT → REST → PRODUCE

Poor care reduces productivity but does not permanently kill animals due to inactivity.

---

# 11. FISHING SYSTEM

Fishing is a major gameplay pillar.

## 11.1 Locations

- River
- Lake
- Forest pond
- Beach
- Farm fish pond

## 11.2 Equipment

- Bamboo rod
- Basic rod
- Reinforced rod
- Advanced rod

Support bait and upgrades.

## 11.3 Fishing flow

IDLE
→ AIMING
→ CASTING
→ WAITING
→ BITE
→ HOOKED
→ MINIGAME
→ CAUGHT / ESCAPED

## 11.4 Fishing minigame

Implement:

- Moving fish target
- Player-controlled catch zone
- Catch progress
- Line tension
- Fish difficulty
- Equipment modifiers
- Escape conditions

Support mouse, keyboard, and touch.

## 11.5 Fish species

Initial species:

- Lele
- Nila
- Gurame
- Patin
- Mujair
- Gabus
- Ikan Mas
- Bandeng
- Kakap
- Tuna
- Arwana
- Legendary fictional fish

Fish availability depends on:

- Location
- Time
- Weather
- Season
- Bait
- Fishing skill

Implement Fish Encyclopedia and catch records.

---

# 12. MINING SYSTEM

Implement mine exploration.

Resources:

- Stone
- Copper
- Iron
- Gold
- Coal
- Crystal
- Rare minerals

Features:

- Mineable nodes
- Pickaxe upgrades
- Stamina consumption
- Resource drops
- Respawn rules
- Unlockable areas
- Crafting integration

Prevent infinite mining rewards.

---

# 13. FORAGING SYSTEM

Implement resource gathering in forests and natural areas.

Resources:

- Wild berries
- Mushrooms
- Bamboo
- Medicinal plants
- Flowers
- Fallen branches
- Rare herbs

Spawn conditions depend on location, season, weather, and game day.

Integrate with inventory, cooking, quests, and economy.

---

# 14. BUG CATCHING SYSTEM

Implement insect catching using nets.

Initial insects:

- Butterfly
- Dragonfly
- Beetle
- Firefly
- Grasshopper
- Rare tropical insects

Implement:

- Spawn conditions
- Movement
- Catch range
- Catch animation
- Rarity
- Collection records
- Museum donation

---

# 15. BUILDING SYSTEM

Implement grid-based building placement.

Features:

- Building catalog
- Placement preview
- Valid/invalid placement
- Resource validation
- Collision validation
- Confirmation
- Cancellation
- Upgrades
- Relocation
- Persistence

Buildings:

- Farmhouse
- Chicken coop
- Cow barn
- Storage shed
- Silo
- Workshop
- Processing station
- Well
- Greenhouse
- Fish pond
- Beehive
- Fence
- Path
- Decorations

Deduct resources only after successful placement.

---

# 16. CRAFTING SYSTEM

Implement:

- Recipes
- Ingredient requirements
- Building requirements
- Production queues
- Processing time
- Output collection
- Crafting experience

Examples:

Milk → Cheese

Eggs → Mayonnaise

Fruit → Jam

Wool → Fabric

Wood + Stone → Construction materials

Use game-time processing.

---

# 17. COOKING SYSTEM

Implement cooking using farm and gathered ingredients.

Initial recipes:

- Nasi Goreng
- Sup Sayur
- Ikan Bakar
- Telur Dadar
- Sate Jamur
- Jus Buah
- Roti
- Village Special Dish

Food provides:

- Stamina restoration
- Temporary buffs
- Quest items
- Sale products

All recipes must have obtainable ingredients.

---

# 18. ORCHARD SYSTEM

Implement fruit trees:

- Mango
- Banana
- Coconut
- Orange
- Guava

Features:

- Planting
- Growth
- Seasonal production
- Harvesting
- Regrowth
- Tree health
- Collision

---

# 19. BEEKEEPING SYSTEM

Implement:

- Beehives
- Honey production
- Flower influence
- Seasonal productivity
- Honey collection
- Upgrades

---

# 20. FISH POND SYSTEM

Implement:

- Pond construction
- Fish stocking
- Feeding
- Pond condition
- Production
- Harvesting
- Capacity upgrades

Use game-day simulation.

---

# 21. INVENTORY SYSTEM

Implement:

- Item categories
- Stack limits
- Capacity
- Hotbar
- Tooltips
- Item transfers
- Item consumption
- Item selling
- Crafting ingredients

Never allow negative quantities or duplicated transactions.

---

# 22. ECONOMY

Implement:

- Coins
- Shops
- Buy/sell
- Village orders
- Quest rewards
- Building costs
- Upgrade costs
- Progression economy

All prices must be data-driven.

Test for:

- Infinite money exploits
- Duplicate rewards
- Negative currency
- Progression dead ends
- Excessive grinding

---

# 23. WORLD AND EXPLORATION

Initial world:

- Farm
- Village
- Forest

Expansion:

- Mine
- Beach
- River
- Special areas

Implement:

- Map transitions
- Collision
- Resource gathering
- Area unlocks
- Interactive objects
- Persistence

---

# 24. TIME, WEATHER, AND SEASONS

One game day = 20 real minutes.

Day starts at 06:00.

Day ends at 02:00.

One season = 28 days.

Four seasons = one year.

Weather:

- Sunny
- Cloudy
- Rainy
- Stormy

Game time must pause appropriately.

Do not advance uncontrolled amounts of game time when browser tabs are inactive.

---

# 25. NPC SYSTEM

Initial NPCs:

- Pak Jaya — Seed Merchant
- Bu Sari — Ranching Mentor
- Raka — Carpenter
- Naya — Plant Researcher
- Dimas — Market Trader
- Lila — Forest Guide

Implement:

- Dialogue
- Schedules
- Interaction
- Friendship
- Quests
- Rewards

Use data-driven dialogue trees.

---

# 26. QUEST AND ACHIEVEMENT SYSTEM

Quest categories:

- Tutorial
- Farming
- Ranching
- Fishing
- Mining
- Foraging
- Building
- Cooking
- Exploration
- Delivery
- Story

Implement at least 20 initial quests.

Achievements cover farming, fishing, exploration, collection, economy, and progression.

Rewards must not be claimable twice.

---

# 27. MUSEUM SYSTEM

Implement a village museum.

Collections:

- Fish
- Insects
- Minerals
- Artifacts
- Rare plants

Donations unlock rewards and village reputation.

Donation records must persist.

---

# 28. VILLAGE REPUTATION

Implement reputation earned from:

- Quests
- Deliveries
- Museum donations
- Festivals
- NPC assistance

Reputation unlocks new content.

---

# 29. FESTIVAL SYSTEM

Initial festivals:

- Harvest Festival
- Fishing Competition
- Animal Festival
- Night Market
- Village Anniversary

Use a data-driven event system.

Festivals operate entirely offline.

---

# 30. PETS AND MOUNTS

Implement:

- Cat
- Dog
- Horse

Pets support basic interactions.

Horse supports mounting and faster travel.

All states must persist.

---

# 31. HOME CUSTOMIZATION

Implement:

- Furniture placement
- Wallpaper
- Flooring
- House upgrades
- Interior decoration

Use grid-based validation.

---

# 32. RANDOM WORLD EVENTS

Implement:

- Traveling merchant
- Rare fish activity
- Unusual weather
- Special forage spawns
- NPC visits
- Seasonal bonuses

Use seeded randomness.

---

# 33. PHOTO MODE

Implement:

- Hide HUD
- Camera positioning
- Zoom
- Screenshot export
- Pause simulation

Screenshots remain local.

---

# 34. CALENDAR

Implement a game calendar showing:

- Day
- Season
- Festivals
- NPC birthdays
- Quest deadlines
- Farm reminders

---

# 35. LOCAL DATA STORAGE

Use IndexedDB through Dexie.js.

Store:

- Player
- World
- Crops
- Animals
- Fish records
- Mining
- Foraging
- Insects
- Buildings
- Inventory
- Crafting
- Cooking
- Quests
- NPC relationships
- Museum
- Reputation
- Festivals
- Pets
- Customization
- Achievements

Implement:

- Multiple save slots
- Autosave
- Manual save
- Save/load
- JSON export/import
- Versioned schemas
- Migration
- Backup
- Recovery
- Storage quota handling
- Multi-tab conflict protection

Do not erase saves during application updates.

---

# 36. CACHE AND PWA

Use Cache Storage for static game assets.

Implement:

- Service Worker
- Offline asset caching
- Installable PWA
- Versioned caches
- Safe updates
- Offline startup
- Offline save/load

Do not use Cache Storage as the primary save database.

---

# 37. UI/UX

Required screens:

- Main Menu
- New Game
- Load Game
- HUD
- Inventory
- Shop
- Building
- Crafting
- Cooking
- Fishing Minigame
- Quest Journal
- World Map
- Calendar
- Museum
- Encyclopedia
- Settings
- Pause Menu
- Save Manager

Use consistent pixel-art UI.

Support responsive desktop and mobile layouts.

---

# 38. AUDIO

Implement:

- Background music
- Environmental ambience
- Farming sounds
- Animal sounds
- Fishing sounds
- Mining sounds
- UI sounds
- Weather audio

Provide volume controls.

Respect browser autoplay restrictions.

Use original or properly licensed audio.

---

# 39. PERFORMANCE

Targets:

- 60 FPS desktop
- 30–60 FPS mobile
- Efficient texture atlases
- Lazy loading
- Camera culling
- Object pooling
- Off-screen AI throttling
- Optimized audio
- Memory cleanup

Measure performance on representative devices.

Provide graphics quality settings.

---

# 40. SECURITY

Implement:

- Save import validation
- File size limits
- Zod schemas
- Safe text rendering
- CSP
- Security headers
- Dependency audits
- Error handling

No private secrets in client code.

---

# 41. TESTING

Use Vitest and Playwright.

Test:

- Farming
- Ranching
- Fishing
- Mining
- Foraging
- Bug catching
- Building
- Crafting
- Cooking
- Inventory
- Economy
- Quests
- NPCs
- Museum
- Festivals
- Save/load
- Backup/restore
- Offline mode
- Mobile controls
- Browser refresh
- Storage errors
- Schema migration

Required commands:

npm run check

npm run lint

npm run test

npm run test:e2e

npm run build

npm run validate:assets

Do not fabricate test results.

---

# 42. DEVELOPMENT ROADMAP

## PHASE 0 — Foundation

- Repository audit
- Dependency setup
- Architecture
- Phaser integration
- IndexedDB setup
- Testing
- Static deployment configuration

## PHASE 1 — Playable Vertical Slice

- Main menu
- Farm map
- Player movement
- Collision
- Rice planting
- Watering
- Harvesting
- Inventory
- Basic chicken
- Shop
- Save/load

## PHASE 2 — Core Farming and Ranching

- Eight crops
- Four animals
- Farming upgrades
- Animal AI
- Animal products

## PHASE 3 — Fishing and Foraging

- Fishing equipment
- Fishing minigame
- Fish species
- Fish encyclopedia
- Foraging resources

## PHASE 4 — Building, Crafting, and Cooking

- Construction
- Upgrades
- Crafting
- Processing
- Cooking

## PHASE 5 — Mining and Exploration

- Mine
- Forest
- Village
- Resource gathering
- Area transitions

## PHASE 6 — Advanced Farm Systems

- Orchard
- Beekeeping
- Fish ponds
- Advanced production

## PHASE 7 — Village Life

- NPC relationships
- Quests
- Museum
- Reputation
- Festivals
- Calendar

## PHASE 8 — Personalization and Collections

- Pets
- Mounts
- Home decoration
- Bug catching
- Achievements
- Photo mode

## PHASE 9 — Premium Visual Polish

- Final pixel art
- Animations
- Lighting
- Weather effects
- Audio
- UI polish

## PHASE 10 — Production Hardening

- PWA
- Offline tests
- Save migrations
- Browser compatibility
- Performance
- Security
- Regression testing

## PHASE 11 — Release Preparation

- Production build
- Vercel configuration
- Deployment documentation
- Release checklist
- Smoke tests
- Rollback plan

---

# 43. AUTONOMOUS AGENT EXECUTION

For every phase:

1. Inspect repository.
2. Review existing implementation.
3. Plan tasks.
4. Write source code.
5. Integrate systems.
6. Write tests.
7. Run validation.
8. Diagnose failures.
9. Fix errors.
10. Rerun tests.
11. Update documentation.
12. Report results.
13. Continue to the next safe local development phase.

Do not stop at planning.

Do not suppress errors.

Do not disable tests merely to pass CI.

Do not claim unverified functionality is complete.

---

# 44. PROGRESS REPORT FORMAT

At the end of each phase report:

PROJECT: Nusantara Farm

PHASE:

STATUS:

IMPLEMENTED:

FILES CREATED:

FILES MODIFIED:

TYPE CHECK RESULT:

LINT RESULT:

UNIT TEST RESULT:

INTEGRATION TEST RESULT:

E2E TEST RESULT:

BUILD RESULT:

PERFORMANCE RESULTS:

KNOWN ISSUES:

BLOCKERS:

NEXT ACTION:

Only include verified results.

---

# 45. PRODUCTION DEFINITION OF DONE

The game is production-ready only when:

- Core gameplay works.
- Required release content is integrated.
- Final assets are original or properly licensed.
- Save/load is reliable.
- Backup/restore works.
- Offline gameplay works.
- Desktop controls work.
- Mobile controls work.
- Browser compatibility is verified.
- No critical gameplay exploits remain.
- Automated tests pass.
- Production build passes.
- Performance targets are measured.
- Security review passes.
- Deployment is validated.
- Documentation is complete.
- No critical or high-severity release blockers remain.

A successful build alone does not establish production readiness.

---

# 46. FINAL EXECUTION COMMAND

Start by auditing the existing repository.

If the project is empty, initialize a compatible SvelteKit + TypeScript application.

Configure Phaser 3, IndexedDB, testing, and static Vercel deployment.

Implement Phase 0 and Phase 1 first.

Create a playable farm where the player can move, plant rice, water crops, harvest, manage inventory, interact with a chicken, trade in a shop, and save progress locally.

Write automated tests.

Run type checking, linting, unit tests, and production build.

Repair errors and retest.

After the Vertical Slice passes acceptance criteria, continue through the remaining phases.

Preserve existing working code.

Do not introduce a backend.

Do not introduce a remote database.

Do not replace gameplay with mockups.

Do not claim production readiness without verification.

**BUILD THE ACTUAL GAME.**

**TEST THE GAME.**

**FIX THE ERRORS.**

**DOCUMENT THE RESULTS.**

**CONTINUE UNTIL THE AUTHORIZED DEVELOPMENT SCOPE IS COMPLETE.**

**BEGIN IMPLEMENTATION NOW.**

