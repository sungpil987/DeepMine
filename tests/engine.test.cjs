const assert=require('node:assert/strict');
const {Mine,ORES,ZONES,ACHIEVEMENTS}=require('../app/src/main/assets/engine.js');
let checks=0;function test(name,fn){fn();checks++;console.log('PASS:',name);}
const make=()=>new Mine(null,()=>.5);
test('50 stable mineral IDs, five distinct biomes, normalized probabilities',()=>{
 assert.equal(ORES.length,50);assert.equal(new Set(ORES.map(o=>o[0])).size,50);
 assert.equal(ORES[0][0],'석탄');assert.equal(ORES[9][0],'별빛석');
 const m=make();for(let z=0;z<5;z++){const odds=m.odds(z);assert(Math.abs(odds.reduce((a,b)=>a+b,0)-100)<1e-8);assert.equal(odds.filter(x=>x>0).length,10);assert(odds.slice(z*10,z*10+10).every(x=>x>0));}
});
test('v1 migration preserves money, bag, discovery, upgrades and partial ore',()=>{
 const old={v:1,coins:5781,bag:[4,3,2,0,1,0,0,0,0,1],found:[5,4,3,0,2,0,0,0,0,1],levels:[3,2,1,2,4],mined:81,pity:30,ore:4,hp:17,vein:false,bombs:7,quest:2,last:123};
 const m=new Mine(old);assert.equal(m.s.v,2);for(const k of ['coins','levels','mined','pity','ore','hp','bombs','quest','last'])assert.deepEqual(m.s[k],old[k]);assert.deepEqual(m.s.bag.slice(0,10),old.bag);assert.deepEqual(m.s.found.slice(0,10),old.found);assert(m.s.bag.slice(10).every(n=>n===0));assert.equal(m.s.zoneMined[0],81);
 const restored=new Mine(JSON.parse(m.serialize()));assert.deepEqual(restored.s,m.s);
});
test('mining, first discovery and sale cannot duplicate money',()=>{
 const m=make();let r;for(let i=0;i<4;i++)r=m.hit(1000+i*100);assert.equal(m.s.mined,1);assert(r.reward.first);assert.equal(m.s.bag[0],1);assert(m.sell()>0);assert.equal(m.total(),0);assert.equal(m.sell(),0);assert.equal(m.buy(0),false);m.s.coins=1000;assert(m.buy(0));assert.equal(m.s.coins,965);assert.equal(m.buy(-1),false);
});
test('selling locks protect materials and crafting consumes once',()=>{
 const m=make();m.s.bag[0]=7;m.s.bag[1]=4;m.s.coins=1000;m.toggleKeep(0);m.sell();assert.equal(m.s.bag[0],7);assert.equal(m.s.bag[1],0);m.s.bag[1]=3;const bombs=m.s.bombs;assert(m.craft(0));assert.equal(m.s.bombs,bombs+3);assert.equal(m.s.bag[0],2);assert.equal(m.s.bag[1],0);assert.equal(m.craft(0),false);assert.equal(m.craft(-1),false);assert.equal(m.toggleKeep(99),false);
 m.s.coins=1e6;m.s.bag[2]=100;m.s.bag[3]=100;for(let i=0;i<10;i++)assert(m.craft(1));assert.equal(m.craft(1),false);assert.equal(m.autoRate(),10);
});
test('zone unlock charges once, blocks locked/boss travel, uses local minerals',()=>{
 const m=make();assert.equal(m.changeZone(1),false);m.s.mined=30;m.s.coins=2000;assert(m.changeZone(1));assert.equal(m.s.coins,1000);assert(m.s.ore>=10&&m.s.ore<20);assert(m.changeZone(0));assert(m.changeZone(1));assert.equal(m.s.coins,1000);m.s.boss=true;assert.equal(m.changeZone(0),false);
});
test('80th ore pity works in every zone and boss insertion',()=>{
 const m=make();for(let z=0;z<5;z++){m.s.zone=z;m.s.pity=79;m.roll();assert(m.s.ore>=z*10+5&&m.s.ore<z*10+10);}m.s.zone=0;m.s.ore=0;m.s.hp=1;m.s.pity=78;m.s.zoneMined[0]=24;m.hit(1000);assert(m.s.boss);assert(m.s.ore%10>=5);
});
test('boss cycle, rewards, and boss state survive reload',()=>{
 const m=make();m.s.zoneMined[0]=24;m.s.hp=1;m.hit(1000);assert(m.s.boss);assert.equal(m.s.hp,m.maxHp());let restored=new Mine(JSON.parse(m.serialize()));assert(restored.s.boss);assert.equal(restored.s.hp,m.s.hp);m.s.hp=1;const r=m.hit(1100);assert(r.reward.boss);assert.equal(r.reward.n,5);assert.equal(m.s.bossKills,1);assert.equal(m.s.shards,3);assert.equal(m.s.zoneMined[0],0);assert(!m.s.boss);
});
test('bomb damage uses 60% normal and 20% boss max HP',()=>{
 const m=make();m.s.ore=4;m.s.hp=m.maxHp();m.hit(1,false,true);assert.equal(m.s.hp,16);m.s.boss=true;m.s.hp=m.maxHp();const hp=m.maxHp();m.hit(2,false,true);assert.equal(m.s.hp,hp-Math.ceil(hp*.2));m.s.bombs=0;assert.equal(m.hit(3,false,true),null);
});
test('research costs, limits, damage and automation scale',()=>{
 const m=make();assert.equal(m.research(0),false);m.s.shards=10000;assert(m.research(0));assert.equal(m.s.shards,9996);assert(m.damage(0)>2);assert.equal(m.research(-1),false);m.s.levels[3]=2;m.research(2);assert.equal(m.autoRate(),2.2);m.s.research[0]=20;assert.equal(m.research(0),false);
});
test('overdrive has persistent 10s duration and 60s cooldown',()=>{
 const m=make();assert(m.activate(1000));assert.equal(m.damage(1001),6);assert.equal(m.damage(11000),2);assert.equal(m.activate(59000),false);const n=new Mine(JSON.parse(m.serialize()));assert.equal(n.activate(2000),false);assert(n.activate(61000));
});
test('offline cap and no duplicate collection',()=>{
 const m=make();m.s.levels[3]=2;m.s.last=1000;assert.equal(m.offline(3601000),1800);assert.equal(m.offline(3601000),0);m.s.last=0;assert.equal(m.offline(999999999),7200);m.s.last=1000;assert.equal(m.offline(0),0);
});
test('quests and achievements are claimed exactly once',()=>{
 const m=make();m.s.mined=25;assert.equal(m.claim(),150);assert.equal(m.claim(),0);assert(m.achievement('mine25'));assert.equal(m.achievement('mine25'),false);assert.equal(m.achievement('mine100'),false);assert.equal(m.s.shards,2);assert.equal(m.achievement('fake'),false);
});
test('daily reward is once per local day, 7-day streak wraps',()=>{
 const m=make(),start=new Date(2026,10,13,12).getTime();assert.equal(m.daily(start).streak,1);assert.equal(m.daily(start),null);for(let i=1;i<7;i++)assert.equal(m.daily(start+i*86400000).streak,i+1);assert.equal(m.s.shards,16);assert.equal(m.daily(start+7*86400000).streak,1);assert.equal(m.daily(start),null);
});
test('expedition persists, waits five minutes, rewards once',()=>{
 const m=make();assert.equal(m.sendExpedition(0),false);m.s.coins=400;assert(m.sendExpedition(1000));assert.equal(m.sendExpedition(1000),false);assert.equal(m.claimExpedition(300999),null);const n=new Mine(JSON.parse(m.serialize()));const r=n.claimExpedition(301000);assert.equal(r.i,3);assert.equal(n.s.bag[3],3);assert.equal(n.s.shards,2);assert.equal(n.claimExpedition(301000),null);
});
test('malformed saved values are bounded without wiping valid original fields',()=>{
 const m=new Mine({v:2,coins:123,zone:99,ore:1000,hp:NaN,bag:[-1,Infinity,'bad'],levels:[-2,Infinity],research:[Infinity],claimed:['fake'],drones:999});assert.equal(m.s.coins,123);assert.equal(m.s.zone,0);assert.equal(m.s.ore,0);assert.equal(m.s.drones,10);assert(m.s.bag.every(x=>Number.isFinite(x)&&x>=0));assert(m.s.levels.every(x=>Number.isFinite(x)&&x>=0));assert.equal(m.s.claimed.length,0);
});
test('100,000 seeded draws maintain relative rarities; luck improves rare odds',()=>{
 let seed=123;const rng=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};const m=new Mine(null,rng),counts=Array(50).fill(0);for(let i=0;i<100000;i++){m.roll();counts[m.s.ore]++;}assert(counts[0]>counts[1]*2);assert(counts[8]<100);assert(counts[9]<30);assert(counts[5]>500);const base=m.odds()[9];m.s.levels[1]=10;assert(m.odds()[9]>base);
});
console.log(checks+' scenario groups passed.');
