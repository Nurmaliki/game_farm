import Phaser from 'phaser/src/phaser-core.js';
import type { GameState, Tool } from '$lib/domain/state';
import { ANIMALS } from '$lib/content/animals';

const worldWidth = 960, worldHeight = 540, tileSize = 45, farmX = 302, farmY = 214;

interface FarmSceneCallbacks { getState:()=>GameState; getTool:()=>Tool; onScene:(scene:Phaser.Scene)=>void; move:(x:number,y:number)=>void; toolAt:(index:number,tool:Tool)=>void; }
const toolColors:Record<Tool,number>={hoe:0xc68b4d,seed:0x8fd05f,water:0x55c9f3,fertilizer:0xf4e39b,hand:0xffdc66,feed:0xe99c54};

export function drawWorld(target:Phaser.Scene,state:GameState){
  const scene=target as FarmScene, graphics=scene.worldGraphics;
  if(!graphics)return; graphics.clear();
  graphics.fillStyle(0x173928,.28).fillRoundedRect(farmX-17,farmY-17,394,304,18);
  graphics.lineStyle(2,0xf2cf78,.38).strokeRoundedRect(farmX-17,farmY-17,394,304,18);
  state.plots.forEach((tile,index)=>{
    const x=farmX+tile.x*tileSize,y=farmY+tile.y*tileSize;
    const soil=tile.watered?0x43362f:tile.tilled?0x70492f:0x5f9348;
    graphics.fillStyle(0x102b1f,.28).fillRoundedRect(x+3,y+5,40,38,8);
    graphics.fillStyle(soil,tile.tilled?.96:.78).fillRoundedRect(x+2,y+2,40,38,8);
    graphics.lineStyle(1,tile.fertilized?0xf8df82:0xb7dc7d,.46).strokeRoundedRect(x+2,y+2,40,38,8);
    if(tile.tilled){graphics.lineStyle(1,0x2a201b,.28);for(let row=0;row<3;row+=1)graphics.lineBetween(x+8,y+11+row*9,x+36,y+11+row*9);}
    if(tile.watered)graphics.fillStyle(0x7edcf4,.36).fillEllipse(x+22,y+33,25,3);
    if(tile.cropId){
      const stage=Math.min(3,tile.wateredDays),sway=Math.sin(scene.animationTime*.0025+index)*(1.2+stage*.3),stemX=x+22+sway;
      graphics.lineStyle(3,0x244d2f,.95).lineBetween(x+22,y+33,stemX,y+17-stage*2);
      const color=stage>=3?0xf7c948:stage>=2?0x74bd49:0x42a756;
      graphics.fillStyle(color).fillEllipse(stemX-5,y+23,11+stage*2,7).fillEllipse(stemX+6,y+19,11+stage*2,7);
      if(stage>=3)graphics.fillStyle(0xffe58b).fillCircle(stemX,y+13,5);
    }
  });
  state.animals.forEach((animal,index)=>{
    const x=760+(index%3)*48,y=330+Math.floor(index/3)*45+Math.sin(scene.animationTime*.003+index)*2,size=animal.kind==='chicken'?11:15;
    graphics.fillStyle(0x10251d,.24).fillEllipse(x,y+size,size*2.3,7);
    graphics.fillStyle(ANIMALS[animal.kind].color).fillEllipse(x,y,size*2,size*1.55);
    graphics.fillStyle(0xfff0d3).fillCircle(x+size*.68,y-size*.46,size*.55);
    graphics.fillStyle(0x1b241e).fillCircle(x+size*.85,y-size*.55,1.5);
    if(animal.productReady)graphics.fillStyle(0xffd85e).fillCircle(x,y-size-7,4);
  });
  if(state.timeMinutes>1080)graphics.fillStyle(0x112345,.4).fillRect(0,0,worldWidth,worldHeight);
  if(state.weather==='berawan')graphics.fillStyle(0x9ab7bb,.13).fillRect(0,0,worldWidth,worldHeight);
}

class FarmScene extends Phaser.Scene{
  player!:Phaser.GameObjects.Image; playerShadow!:Phaser.GameObjects.Ellipse; cursors!:Phaser.Types.Input.Keyboard.CursorKeys;
  keys!:Record<string,Phaser.Input.Keyboard.Key>; worldGraphics!:Phaser.GameObjects.Graphics; atmosphereGraphics!:Phaser.GameObjects.Graphics;
  animationTime=0; private lastWorldFrame=0; private motes:Array<{x:number;y:number;speed:number;phase:number}>=[];
  constructor(private callbacks:FarmSceneCallbacks){super('farm');}
  preload(){this.load.image('farm-morning','/assets/environment/nusantara-farm-morning.png');this.load.image('nusantara-atlas','/assets/pixel-art/nusantara-atlas-v1.png');}
  create(){
    const state=this.callbacks.getState();this.callbacks.onScene(this);
    this.add.image(worldWidth/2,worldHeight/2,'farm-morning').setDisplaySize(worldWidth,worldHeight).setDepth(0);
    this.worldGraphics=this.add.graphics().setDepth(2);this.atmosphereGraphics=this.add.graphics().setDepth(8);
    this.motes=Array.from({length:24},(_,index)=>({x:(index*149)%worldWidth,y:110+(index*83)%370,speed:.012+(index%4)*.004,phase:index*.71}));
    drawWorld(this,state);
    this.playerShadow=this.add.ellipse(state.player.x,state.player.y+23,32,10,0x122219,.3).setDepth(3);
    this.player=this.add.image(state.player.x,state.player.y,'nusantara-atlas').setCrop(14,8,86,142).setDisplaySize(39,64).setDepth(4);
    this.cursors=this.input.keyboard!.createCursorKeys();this.keys=this.input.keyboard!.addKeys('W,A,S,D') as Record<string,Phaser.Input.Keyboard.Key>;
    this.input.on('pointerdown',(pointer:Phaser.Input.Pointer)=>{const tx=Math.floor((pointer.x-farmX)/tileSize),ty=Math.floor((pointer.y-farmY)/tileSize);if(tx>=0&&tx<8&&ty>=0&&ty<6){const tool=this.callbacks.getTool();this.callbacks.toolAt(ty*8+tx,tool);this.createToolBurst(farmX+tx*tileSize+22,farmY+ty*tileSize+21,tool);}});
    this.cameras.main.setRoundPixels(true);this.cameras.main.fadeIn(700,19,41,31);
  }
  private createToolBurst(x:number,y:number,tool:Tool){
    for(let index=0;index<7;index+=1){const particle=this.add.circle(x,y,2+(index%2),toolColors[tool],.95).setDepth(10),angle=Math.PI*2*index/7;this.tweens.add({targets:particle,x:x+Math.cos(angle)*24,y:y+Math.sin(angle)*20,alpha:0,scale:.2,duration:420,ease:'Cubic.easeOut',onComplete:()=>particle.destroy()});}
    this.cameras.main.shake(90,.0015);
  }
  private drawAtmosphere(state:GameState){
    const graphics=this.atmosphereGraphics;graphics.clear();
    this.motes.forEach((mote,index)=>{const x=(mote.x+this.animationTime*mote.speed)%worldWidth,y=mote.y+Math.sin(this.animationTime*.0015+mote.phase)*7;graphics.fillStyle(index%5===0?0xa8db69:0xffe58e,index%5===0?.48:.35);if(index%5===0)graphics.fillEllipse(x,y,6,3);else graphics.fillCircle(x,y,1.4);});
    graphics.lineStyle(2,0xc6fbff,.55);for(let index=0;index<6;index+=1){const y=180+(index*67+this.animationTime*.035)%340;graphics.beginPath().moveTo(32,y).lineTo(54,y-3).lineTo(72,y+1).strokePath();}
    if(state.weather==='hujan'||state.weather==='badai'){graphics.lineStyle(2,0xc7ecf5,state.weather==='badai'?.75:.48);const offset=this.animationTime*.38%42;for(let index=0;index<58;index+=1){const x=(index*89+state.day*17)%(worldWidth+30),y=(index*53+offset)%worldHeight;graphics.lineBetween(x,y,x-8,y+19);}graphics.fillStyle(0x244b5b,.14).fillRect(0,0,worldWidth,worldHeight);}
  }
  update(time:number,delta:number){
    this.animationTime=time;const state=this.callbacks.getState(),speed=.18*delta;let dx=0,dy=0;
    if(this.cursors.left.isDown||this.keys.A.isDown)dx-=speed;if(this.cursors.right.isDown||this.keys.D.isDown)dx+=speed;if(this.cursors.up.isDown||this.keys.W.isDown)dy-=speed;if(this.cursors.down.isDown||this.keys.S.isDown)dy+=speed;
    if(dx||dy){this.player.x=Phaser.Math.Clamp(this.player.x+dx,92,910);this.player.y=Phaser.Math.Clamp(this.player.y+dy,145,500);this.player.setFlipX(dx<0);this.player.rotation=Math.sin(time*.018)*.035;this.callbacks.move(this.player.x,this.player.y);}else{this.player.y+=Math.sin(time*.004)*.025;this.player.rotation*=.82;}
    this.playerShadow.setPosition(this.player.x,this.player.y+25);this.drawAtmosphere(state);if(time-this.lastWorldFrame>80){drawWorld(this,state);this.lastWorldFrame=time;}
  }
}

export function createFarmGame(parent:HTMLDivElement,callbacks:FarmSceneCallbacks){return new Phaser.Game({type:Phaser.CANVAS,parent,width:worldWidth,height:worldHeight,backgroundColor:'#173d2d',scene:new FarmScene(callbacks),scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH}});}
