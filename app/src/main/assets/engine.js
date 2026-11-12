(function(root){
'use strict';
const ORES=[
 ['석탄','COMMON', '#8c9cae',60,8,5],['구리','COMMON','#dc9565',22,12,12],['철','UNCOMMON','#accada',10,19,25],['은','RARE','#d5e6ff',4.7,28,65],['금','RARE','#ffd36c',2,40,150],['에메랄드','EPIC','#4ce1af',.8,56,400],['루비','EPIC','#ff6989',.35,76,900],['사파이어','EPIC','#7299ff',.12,100,2000],['다이아몬드','LEGENDARY','#8cfff8',.025,140,6500],['별빛석','MYTHIC','#e1a4ff',.005,200,30000]
];
const KEYS=['power','luck','crit','auto','value'];
class Mine {
 constructor(saved,random=Math.random){this.random=random;this.s={v:1,coins:0,bag:Array(10).fill(0),found:Array(10).fill(0),levels:[0,0,0,0,0],mined:0,pity:0,ore:0,hp:8,vein:false,bombs:3,quest:0,last:Date.now()};if(saved&&saved.v===1){for(const k of ['coins','mined','pity','bombs','quest','last'])if(Number.isFinite(saved[k])&&saved[k]>=0)this.s[k]=saved[k];for(const k of ['bag','found','levels'])if(Array.isArray(saved[k]))this.s[k]=this.s[k].map((_,i)=>Math.min(k==='levels'?100:1e9,Math.max(0,Math.floor(Number(saved[k][i])||0))));if(Number.isInteger(saved.ore)&&saved.ore>=0&&saved.ore<10){this.s.ore=saved.ore;this.s.vein=!!saved.vein;this.s.hp=Math.max(1,Math.min(this.maxHp(),Number(saved.hp)||1));}}this.combo=0;this.lastTap=0;}
 weights(){return ORES.map((o,i)=>o[3]*(i>=3?1+this.s.levels[1]*.13:1));}
 odds(){let w=this.weights(),sum=w.reduce((a,b)=>a+b,0);return w.map(x=>x/sum*100);}
 maxHp(){return ORES[this.s.ore][4]*(this.s.vein?2:1);}
 price(i){return Math.floor(ORES[i][5]*(1+this.s.levels[4]*.15)*(1+this.s.found.filter(x=>x>0).length*.02));}
 total(){return this.s.bag.reduce((a,n,i)=>a+n*this.price(i),0);}
 cost(i){return Math.floor([35,100,80,250,120][i]*Math.pow(1.48,this.s.levels[i]));}
 buy(i){if(!Number.isInteger(i)||i<0||i>=5||this.s.levels[i]>=100||this.s.coins<this.cost(i))return false;this.s.coins-=this.cost(i);this.s.levels[i]++;return true;}
 sell(){let n=this.total();this.s.coins+=n;this.s.bag.fill(0);return n;}
 roll(){let w=this.weights(),sum=w.reduce((a,b)=>a+b,0),r=this.random()*sum,ore=9;for(let i=0;i<w.length;i++){r-=w[i];if(r<0){ore=i;break;}}if(this.s.pity>=79)ore=Math.max(5,ore);this.s.ore=ore;this.s.vein=this.random()<.05;this.s.hp=this.maxHp();}
 hit(now=Date.now(),automatic=false,bomb=false){if(bomb&&this.s.bombs<=0)return null;if(bomb)this.s.bombs--;if(!automatic){this.combo=now-this.lastTap<850?Math.min(20,this.combo+1):1;this.lastTap=now;}let critical=!automatic&&this.random()<Math.min(.55,.05+this.s.levels[2]*.015);let damage=bomb?Math.ceil(this.maxHp()*.6):Math.ceil((2+this.s.levels[0]*2)*(critical?3:1)*(!automatic?1+Math.floor(this.combo/5)*.1:1));this.s.hp-=damage;let reward=null;if(this.s.hp<=0){let i=this.s.ore,n=this.s.vein?3:1;this.s.bag[i]+=n;this.s.found[i]+=n;this.s.mined++;this.s.pity=i>=5?0:this.s.pity+1;reward={i,n};this.roll();}return{damage,critical,reward};}
 claim(){let goal=(this.s.quest+1)*25;if(this.s.mined<goal)return 0;let amount=150*(this.s.quest+1);this.s.coins+=amount;this.s.bombs++;this.s.quest++;return amount;}
 offline(now=Date.now()){let sec=Math.max(0,Math.min(14400,(now-this.s.last)/1000)),earned=Math.floor(sec*this.s.levels[3]*.25);this.s.coins+=earned;this.s.last=now;return earned;}
 serialize(){this.s.last=Date.now();return JSON.stringify(this.s);}
}
root.DeepMine={Mine,ORES,KEYS};if(typeof module!=='undefined')module.exports=root.DeepMine;
})(typeof window!=='undefined'?window:globalThis);
