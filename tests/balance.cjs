// Strategy model, not a promise about a player's real completion time.
const assert=require('node:assert/strict');
const {Mine,ZONES,ACHIEVEMENTS,DAILY_GOALS}=require('../app/src/main/assets/engine.js');
function simulate(seed,taps=7,seconds=7200){
 const rng=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const m=new Mine(null,rng),start=Date.now(),milestones=[0,null,null,null,null];m.daily(start);let firstPrestige=null,acc=0;
 for(let t=0;t<seconds;t++){
  const now=start+t*1000;if(now>=m.s.skillReady)m.activate(now);
  for(let k=0;k<taps;k++)m.hit(now+k*1000/Math.max(1,taps));
  acc+=m.autoRate();const n=Math.floor(acc);acc-=n;for(let k=0;k<n;k++)m.hit(now,true);
  if(t%5===0){m.sell(now);while(m.claim()){}for(const a of ACHIEVEMENTS)m.achievement(a.id);for(const g of DAILY_GOALS)m.dailyGoal(g.id,now);}
  const next=m.s.unlocked.indexOf(false),reserve=next>=0&&m.s.mined>=ZONES[next].mined?ZONES[next].cost:0;
  if(next>=0&&reserve&&m.s.coins>=reserve&&!m.s.boss){m.changeZone(next);milestones[next]=t;}
  else if(m.s.coins>reserve){for(let repeat=0;repeat<4;repeat++){const ids=[0,3,4,1,2].filter(i=>m.s.levels[i]<100).sort((a,b)=>m.s.levels[a]/[1.3,.8,.6,1,.8][a]-m.s.levels[b]/[1.3,.8,.6,1,.8][b]);if(!ids.length||m.s.coins-m.cost(ids[0])<reserve)break;m.buy(ids[0]);}}
  for(let i=0;i<3;i++)m.research(i);
  if(firstPrestige===null&&m.prestigeReward())firstPrestige=t;
 }
 return {tapsPerSecond:taps,firstPrestigeMin:firstPrestige===null?null:+(firstPrestige/60).toFixed(1),zonesAtMin:milestones.map(n=>n===null?null:+(n/60).toFixed(1)),mined:m.s.mined,levels:m.s.levels,offlinePerHour:Math.floor(m.offlineRate()*3600)};
}
const rows=[simulate(11,2),simulate(22,7),simulate(33,7)];
for(const r of rows){assert(r.firstPrestigeMin!==null&&r.firstPrestigeMin>8&&r.firstPrestigeMin<90);assert(r.zonesAtMin.every(x=>x!==null));assert(r.levels[0]<100);}
console.log(JSON.stringify({model:'2 hours; uninterrupted inputs, auto-buy equipment/research, periodic sale/claims; no crafting or rebirth',runs:rows},null,2));
