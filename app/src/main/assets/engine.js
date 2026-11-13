(function (root) {
'use strict';
const BASE = [
 ['석탄','COMMON','#8c9cae',60,8,5], ['구리','COMMON','#dc9565',22,12,12],
 ['철','UNCOMMON','#accada',10,19,25], ['은','RARE','#d5e6ff',4.7,28,65],
 ['금','RARE','#ffd36c',2,40,150], ['에메랄드','EPIC','#4ce1af',.8,56,400],
 ['루비','EPIC','#ff6989',.35,76,900], ['사파이어','EPIC','#7299ff',.12,100,2000],
 ['다이아몬드','LEGENDARY','#8cfff8',.025,140,6500], ['별빛석','MYTHIC','#e1a4ff',.005,200,30000]
];
const ZONES = [
 {name:'고요한 동굴',sub:'처음 만나는 작은 행운',color:'#5de5cb',bg:'#193a43',mined:0,cost:0,hp:1,value:1,boss:'태초의 거석'},
 {name:'수정 숲',sub:'어둠 속에 피어난 결정',color:'#ac9cff',bg:'#30294c',mined:100,cost:3000,hp:1.8,value:3,boss:'수정의 파수꾼'},
 {name:'빙하 균열',sub:'얼음 아래 잠든 푸른 심장',color:'#8fe4ff',bg:'#193d55',mined:600,cost:60000,hp:3.2,value:8,boss:'빙하의 심장'},
 {name:'잿불 심층',sub:'타오르는 지하의 보물',color:'#ffad72',bg:'#512a29',mined:2500,cost:800000,hp:5.5,value:20,boss:'용암의 핵'},
 {name:'별의 심연',sub:'광산 끝에서 만나는 우주',color:'#f1a1e8',bg:'#382247',mined:10000,cost:12000000,hp:9,value:50,boss:'공허의 군주'}
];
const EXTRAS = [
 [['석영','#e6c6ff'],['형석','#a6eab3'],['황철석','#d8ba60'],['자수정','#ad84ff'],['전기석','#fd9cc6'],['페리도트','#c8ff79'],['스피넬','#f57ca6'],['알렉산드라이트','#87e9d7'],['오팔','#e8d7ff'],['세계수 결정','#b7ffcd']],
 [['암염','#eedce7'],['청금석','#638def'],['아쿠아마린','#90e9ef'],['문스톤','#d8e8ff'],['라리마','#67cde2'],['블루 토파즈','#7bdcff'],['탄자나이트','#9c8dff'],['파라이바','#45ffd5'],['빙하 다이아','#c4f9ff'],['영원의 서리','#dcfaff']],
 [['현무암','#9b8f91'],['흑요석','#aa9ab8'],['황','#f5e86b'],['석류석','#d9516e'],['지르콘','#ffb992'],['선스톤','#ffac55'],['파이어 오팔','#ff6c49'],['용혈석','#ff405c'],['피닉스 루비','#ffbe7b'],['용의 심장','#ffebae']],
 [['운철','#a0a4c5'],['코발트','#8fa6ff'],['티타늄','#c7c6e3'],['팔라듐','#e7d6ff'],['백금','#faf1d9'],['미스릴','#87fff1'],['오리할콘','#ffaacf'],['아다만타이트','#a9a0ff'],['성운 결정','#e4b7ff'],['태초의 별','#fff1b3']]
];
const ORES = BASE.map(o=>[...o]);
EXTRAS.forEach((list,z)=>list.forEach(([name,color],i)=>ORES.push([name,BASE[i][1],color,BASE[i][3],Math.ceil(BASE[i][4]*ZONES[z+1].hp),Math.floor(BASE[i][5]*ZONES[z+1].value)])));
const KEYS=['power','luck','crit','auto','value'];
const RESEARCH=[{name:'강철 공학',desc:'전체 피해 +12%',base:4},{name:'광맥 공명',desc:'풍부한 광맥 확률 +1%',base:5},{name:'작업 효율',desc:'자동 타격·오프라인 수익 +6%',base:4}];
const ACHIEVEMENTS=[
 {id:'mine25',name:'곡괭이 입문',desc:'광석 25개 채굴',target:25,metric:'mined',coins:200,shards:2},
 {id:'mine100',name:'동굴의 단골',desc:'광석 100개 채굴',target:100,metric:'mined',coins:1500,shards:5},
 {id:'mine500',name:'산 하나쯤이야',desc:'광석 500개 채굴',target:500,metric:'mined',coins:15000,shards:15},
 {id:'mine2000',name:'심연의 개척자',desc:'광석 2,000개 채굴',target:2000,metric:'mined',coins:100000,shards:40},
 {id:'book5',name:'반짝임 수집가',desc:'서로 다른 광물 5종 발견',target:5,metric:'book',coins:400,shards:3},
 {id:'book20',name:'광물학자',desc:'서로 다른 광물 20종 발견',target:20,metric:'book',coins:8000,shards:12},
 {id:'book50',name:'움직이는 박물관',desc:'모든 광물 50종 발견',target:50,metric:'book',coins:300000,shards:100},
 {id:'boss1',name:'거석 파괴자',desc:'보스 광맥 1회 격파',target:1,metric:'boss',coins:1000,shards:5},
 {id:'boss10',name:'광산의 지배자',desc:'보스 광맥 10회 격파',target:10,metric:'boss',coins:20000,shards:20}
];
// Original achievement IDs remain valid across updates.
const addGoals=(metric,targets,title,coins,shards)=>targets.forEach((target,i)=>ACHIEVEMENTS.push({id:metric+'_'+target,name:title+' '+(i+1),desc:({mined:'누적 광석',boss:'보스 격파',book:'발견한 광물',sold:'누적 판매 골드',prestige:'환생',depth:'최고 심도',crafts:'제작',expeditions:'탐사 완료',taps:'직접 타격',criticals:'치명타'})[metric]+' '+target.toLocaleString('ko-KR')+(metric==='sold'?' G':''),metric,target,coins:Math.floor(coins*Math.pow(2.2,i)),shards:shards*(i+1)}));
addGoals('mined',[5000,10000,25000,50000,100000,250000],'곡괭이의 전설',30000,10);
addGoals('boss',[25,50,100,250,500,1000],'거석 정복자',8000,8);
addGoals('book',[10,30,40,45],'빛의 기록',1500,4);
addGoals('sold',[1000,10000,100000,1000000,10000000,100000000,1000000000],'광물 상인',250,2);
addGoals('prestige',[1,3,5,10,25,50],'다시 태어난 광부',5000,10);
addGoals('depth',[1,3,5,10,20,40],'끝없는 심연',3000,6);
addGoals('crafts',[1,10,50,100],'광산 장인',500,3);
addGoals('expeditions',[1,5,25,100,500],'먼 길의 보물',500,3);
addGoals('taps',[100,1000,10000,100000,1000000],'멈추지 않는 손',300,2);
addGoals('criticals',[10,100,1000,10000],'결정의 약점',500,3);
const BOSS_INTERVAL=50;
const PRESTIGE_REQUIREMENTS={mined:10000,sold:12000000};
const TALENTS=[{name:'영혼의 곡괭이',desc:'전체 피해 +10% / 레벨',cap:50,base:2},{name:'황금의 기억',desc:'판매가 +8% / 레벨',cap:50,base:2},{name:'개척자의 유산',desc:'환생 시 시작 골드 +1,000 / 레벨',cap:20,base:1},{name:'영원의 동력',desc:'자동 타격·오프라인 수익 +8% / 레벨',cap:25,base:2}];
const EXPEDITIONS=[{name:'주변 수색',ms:300000,mult:1,count:3},{name:'광맥 정찰',ms:1800000,mult:3,count:12},{name:'심층 원정',ms:7200000,mult:8,count:40}];
const DAILY_GOALS=[{id:'mine',name:'오늘 광석 100개',metric:'mined',target:100,coins:500,shards:3},{id:'boss',name:'오늘 보스 2회',metric:'boss',target:2,coins:1000,shards:5},{id:'sell',name:'오늘 판매 5,000 G',metric:'sold',target:5000,coins:1000,shards:3}];
const RECIPES=[{name:'폭탄 묶음',desc:'폭탄 3개',coins:100,items:[[0,5],[1,3]],bombs:3},{name:'탐사 드론',desc:'영구 자동 타격 +0.25회/초 (최대 10대)',coins:2500,items:[[2,5],[3,2]],drone:true}];
function dayKey(now){const d=new Date(now);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function yesterdayKey(now){let d=new Date(now);d.setDate(d.getDate()-1);return dayKey(d.getTime());}
const finite=(n,def=0,max=1e100)=>Number.isFinite(n)&&n>=0?Math.min(n,max):def;
class Mine {
 constructor(saved,random=Math.random){
  this.random=random;this.s={v:3,coins:0,bag:Array(50).fill(0),found:Array(50).fill(0),keep:Array(50).fill(false),levels:[0,0,0,0,0],mined:0,pity:0,ore:0,hp:8,vein:false,bombs:3,quest:0,last:Date.now(),zone:0,unlocked:[true,false,false,false,false],zoneMined:[0,0,0,0,0],boss:false,bossKills:0,shards:0,research:[0,0,0],drones:0,claimed:[],daily:'',streak:0,expedition:null,skillUntil:0,skillReady:0,sound:false,bossNotices:true,discoveryNotices:true,prestiges:0,cores:0,coresEarned:0,talents:[0,0,0,0],runMined:0,runBoss:0,runGold:0,totalSold:0,totalTaps:0,totalCrits:0,crafts:0,expeditions:0,depth:0,depthMined:0,bestDepth:0,dailyBoard:null};
  if(saved&&[1,2,3].includes(saved.v)){
   for(const k of ['coins','mined','pity','bombs','quest','last','bossKills','shards','drones','streak','skillUntil','skillReady','prestiges','cores','coresEarned','runMined','runBoss','runGold','totalSold','totalTaps','totalCrits','crafts','expeditions','depth','depthMined','bestDepth'])this.s[k]=finite(saved[k],this.s[k],k==='drones'?10:1e100);
   for(const k of ['bag','found','levels','research','zoneMined','talents'])if(Array.isArray(saved[k]))this.s[k]=this.s[k].map((_,i)=>Math.floor(finite(saved[k][i],0,k==='levels'?100:k==='research'?50:k==='talents'?50:1e12)));
   if(Array.isArray(saved.keep))this.s.keep=this.s.keep.map((_,i)=>saved.keep[i]===true);
   if(Array.isArray(saved.unlocked))this.s.unlocked=this.s.unlocked.map((v,i)=>v||saved.unlocked[i]===true);
   this.s.zone=Number.isInteger(saved.zone)&&saved.zone>=0&&saved.zone<5&&this.s.unlocked[saved.zone]?saved.zone:0;
   if(saved.v===1)this.s.zoneMined[0]=this.s.mined;
   this.s.boss=saved.boss===true;this.s.vein=saved.vein===true&&!this.s.boss;
   if(Number.isInteger(saved.ore)&&saved.ore>=this.s.zone*10&&saved.ore<this.s.zone*10+10)this.s.ore=saved.ore;else this.s.ore=this.s.zone*10;
   this.s.hp=Math.max(1,Math.min(this.maxHp(),finite(saved.hp,8)));
   this.s.claimed=Array.isArray(saved.claimed)?saved.claimed.filter(x=>ACHIEVEMENTS.some(a=>a.id===x)):[];
   this.s.daily=typeof saved.daily==='string'?saved.daily:'';this.s.sound=saved.sound===true;this.s.bossNotices=saved.bossNotices!==false;this.s.discoveryNotices=saved.discoveryNotices!==false;
   if(saved.expedition&&Number.isFinite(saved.expedition.end)&&Number.isInteger(saved.expedition.zone)&&saved.expedition.zone>=0&&saved.expedition.zone<5&&this.s.unlocked[saved.expedition.zone])this.s.expedition={end:saved.expedition.end,zone:saved.expedition.zone,kind:Number.isInteger(saved.expedition.kind)&&saved.expedition.kind>=0&&saved.expedition.kind<3?saved.expedition.kind:0};
  }
  if(saved&&[1,2].includes(saved.v)){this.s.runMined=this.s.mined;this.s.runBoss=this.s.bossKills;this.s.crafts=this.s.drones;}
  if(saved?.v===3&&saved.dailyBoard&&typeof saved.dailyBoard.day==='string')this.s.dailyBoard={day:saved.dailyBoard.day,mined:finite(saved.dailyBoard.mined),boss:finite(saved.dailyBoard.boss),sold:finite(saved.dailyBoard.sold),claimed:Array.isArray(saved.dailyBoard.claimed)?saved.dailyBoard.claimed.filter(x=>DAILY_GOALS.some(g=>g.id===x)):[]};
  this.s.talents=this.s.talents.map((n,i)=>Math.min(n,TALENTS[i].cap));
  this.s.depth=Math.min(200,Math.floor(this.s.depth));this.s.bestDepth=Math.min(200,Math.floor(this.s.bestDepth));
  if(saved&&[1,2].includes(saved.v)&&this.s.boss)this.s.hp=Math.max(1,Math.ceil(this.s.hp*1.5));
  this.ensureDaily();this.combo=0;this.lastTap=0;
 }
 tier(i){return i%10;}
 weights(zone=this.s.zone){return ORES.map((o,i)=>Math.floor(i/10)!==zone?0:o[3]*(i%10>=3?1+this.s.levels[1]*.13:1));}
 odds(zone=this.s.zone){const w=this.weights(zone),sum=w.reduce((a,b)=>a+b,0);return w.map(x=>x/sum*100);}
 maxHp(){return Math.ceil(ORES[this.s.ore][4]*this.depthHp()*(this.s.boss?6:this.s.vein?2:1));}
 depthHp(){return this.s.zone===4?Math.pow(1.28,this.s.depth):1;}
 depthValue(i){return Math.floor(i/10)===4?Math.pow(1.18,this.s.depth):1;}
 price(i){return Math.floor(ORES[i][5]*(1+this.s.levels[4]*.15)*(1+this.bookCount()*.02)*(1+this.s.prestiges*.1)*(1+this.s.talents[1]*.08)*this.depthValue(i));}
 bookCount(){return this.s.found.filter(x=>x>0).length;}
 total(){return this.s.bag.reduce((a,n,i)=>a+(this.s.keep[i]?0:n*this.price(i)),0);}
 cost(i){return Math.floor([35,100,80,350,120][i]*Math.pow([1.29,1.30,1.28,1.30,1.30][i],this.s.levels[i]));}
 buy(i){if(!Number.isInteger(i)||i<0||i>=5||this.s.levels[i]>=100||this.s.coins<this.cost(i))return false;this.s.coins-=this.cost(i);this.s.levels[i]++;return true;}
 sell(now=Date.now()){this.ensureDaily(now);const n=this.total();this.s.coins+=n;this.s.totalSold+=n;this.s.runGold+=n;this.s.bag=this.s.bag.map((v,i)=>this.s.keep[i]?v:0);return n;}
 toggleKeep(i){if(!Number.isInteger(i)||i<0||i>=50)return false;this.s.keep[i]=!this.s.keep[i];return true;}
 roll(){const w=this.weights(),sum=w.reduce((a,b)=>a+b,0);let r=this.random()*sum,ore=this.s.zone*10+9;for(let i=0;i<w.length;i++){r-=w[i];if(r<0){ore=i;break;}}if(this.s.pity>=79)ore=Math.max(this.s.zone*10+5,ore);this.s.ore=ore;this.s.vein=!this.s.boss&&this.random()<.05+this.s.research[1]*.01;this.s.hp=this.maxHp();}
 damage(now=Date.now(),automatic=false){return Math.ceil((2+this.s.levels[0]*2+Math.floor(Math.pow(Math.max(0,this.s.levels[0]-10),1.45)))*(1+this.s.research[0]*.12)*(1+this.s.prestiges*.1)*(1+this.s.talents[0]*.1)*(now>0&&now<this.s.skillUntil?3:1)*(!automatic?1+Math.floor(this.combo/5)*.1:1));}
 hit(now=Date.now(),automatic=false,bomb=false){
  this.ensureDaily(now);if(bomb&&this.s.bombs<=0)return null;if(bomb)this.s.bombs--;
  if(!automatic){this.s.totalTaps++;this.combo=now-this.lastTap<850?Math.min(20,this.combo+1):1;this.lastTap=now;}
  const critical=!automatic&&!bomb&&this.random()<Math.min(.55,.05+this.s.levels[2]*.015);
  if(critical)this.s.totalCrits++;
  const damage=bomb?Math.ceil(this.maxHp()*(this.s.boss?.2:.6)):this.damage(now,automatic)*(critical?3:1);this.s.hp-=damage;
  let reward=null;
  if(this.s.hp<=0){
   const i=this.s.ore,boss=this.s.boss,n=boss?5:this.s.vein?3:1,first=this.s.found[i]===0;
   this.s.bag[i]+=n;this.s.found[i]+=n;this.s.mined++;this.s.runMined++;if(this.s.zone===4)this.s.depthMined++;this.s.pity=i%10>=5?0:this.s.pity+1;
   const shards=boss?6+this.s.zone*3:i%10>=5?1:0;this.s.shards+=shards;
   if(boss){this.s.bossKills++;this.s.runBoss++;this.s.boss=false;this.s.zoneMined[this.s.zone]=0;}else this.s.zoneMined[this.s.zone]++;
   reward={i,n,boss,shards,first};
   if(!boss&&this.s.zoneMined[this.s.zone]>=BOSS_INTERVAL){this.s.boss=true;this.s.ore=this.s.zone*10+(this.s.pity>=79?5:4);this.s.vein=false;this.s.hp=this.maxHp();}else this.roll();
  }
  return {damage,critical,reward};
 }
 changeZone(z){if(!Number.isInteger(z)||z<0||z>=5||z===this.s.zone||this.s.boss)return false;const zone=ZONES[z];if(!this.s.unlocked[z]){if(this.s.mined<zone.mined||this.s.coins<zone.cost)return false;this.s.coins-=zone.cost;this.s.unlocked[z]=true;}this.s.zone=z;this.combo=0;this.roll();return true;}
 claim(){const goal=(this.s.quest+1)*25;if(this.s.mined<goal)return 0;const amount=150+Math.floor(75*Math.sqrt(this.s.quest));this.s.coins+=amount;this.s.bombs++;this.s.quest++;return amount;}
 researchCost(i){return RESEARCH[i].base+Math.floor(Math.pow(this.s.research[i],1.5)*4);}
 research(i){if(!Number.isInteger(i)||i<0||i>=3||this.s.research[i]>=50||this.s.shards<this.researchCost(i))return false;this.s.shards-=this.researchCost(i);this.s.research[i]++;return true;}
 autoRate(){return (this.s.levels[3]*.12+this.s.drones*.25)*(1+this.s.research[2]*.06)*(1+this.s.talents[3]*.08);}
 // Offline credits are 22% of expected automatic gold output (no drops or boss kills).
 offlineRate(){if(!this.autoRate())return 0;const odds=this.odds(),dmg=this.damage(0,true),vein=.05+this.s.research[1]*.01;let gold=0,hits=0;for(let i=this.s.zone*10;i<this.s.zone*10+10;i++){const hp=ORES[i][4]*this.depthHp();gold+=odds[i]/100*this.price(i)*(1+2*vein);hits+=odds[i]/100*((1-vein)*Math.ceil(hp/dmg)+vein*Math.ceil(hp*2/dmg));}const boss=this.s.zone*10+4;gold+=this.price(boss)*5/BOSS_INTERVAL;hits+=Math.ceil(ORES[boss][4]*this.depthHp()*6/dmg)/BOSS_INTERVAL;return this.autoRate()*gold/Math.max(1,hits)*.22;}
 offline(now=Date.now()){const sec=Math.max(0,Math.min(14400,(now-this.s.last)/1000)),earned=Math.floor(sec*this.offlineRate());this.s.coins+=earned;this.s.last=now;return earned;}
 activate(now=Date.now()){if(now<this.s.skillReady)return false;this.s.skillUntil=now+10000;this.s.skillReady=now+60000;return true;}
 craftable(i){const r=RECIPES[i];return !!r&&(!r.drone||this.s.drones<10)&&this.s.coins>=r.coins&&r.items.every(([id,n])=>this.s.bag[id]>=n);}
 craft(i){if(!Number.isInteger(i)||!this.craftable(i))return false;const r=RECIPES[i];this.s.crafts++;this.s.coins-=r.coins;r.items.forEach(([id,n])=>this.s.bag[id]-=n);if(r.bombs)this.s.bombs+=r.bombs;if(r.drone)this.s.drones++;return true;}
 progress(a){return ({book:this.bookCount(),boss:this.s.bossKills,mined:this.s.mined,sold:this.s.totalSold,prestige:this.s.prestiges,depth:this.s.bestDepth,crafts:this.s.crafts,expeditions:this.s.expeditions,taps:this.s.totalTaps,criticals:this.s.totalCrits})[a.metric]||0;}
 achievement(id){const a=ACHIEVEMENTS.find(x=>x.id===id);if(!a||this.s.claimed.includes(id)||this.progress(a)<a.target)return false;this.s.claimed.push(id);this.s.coins+=a.coins;this.s.shards+=a.shards;return true;}
 daily(now=Date.now()){const today=dayKey(now);if(this.s.daily>=today)return null;this.s.streak=this.s.daily===yesterdayKey(now)?this.s.streak%7+1:1;this.s.daily=today;const coins=this.s.streak*100,shards=this.s.streak===7?10:1;this.s.coins+=coins;this.s.shards+=shards;this.s.bombs++;return{coins,shards,streak:this.s.streak};}
 expeditionCost(kind=0){return EXPEDITIONS[kind]?200*(1+this.s.zone*2)*EXPEDITIONS[kind].mult:Infinity;}
 sendExpedition(now=Date.now(),kind=0){if(!Number.isInteger(kind)||kind<0||kind>=3||this.s.expedition||this.s.coins<this.expeditionCost(kind))return false;this.s.coins-=this.expeditionCost(kind);this.s.expedition={zone:this.s.zone,end:now+EXPEDITIONS[kind].ms,kind};return true;}
 claimExpedition(now=Date.now()){const e=this.s.expedition;if(!e||now<e.end)return null;const config=EXPEDITIONS[e.kind||0],i=e.zone*10+3,n=config.count;this.s.bag[i]+=n;this.s.found[i]+=n;const shards=(2+e.zone)*config.mult;this.s.shards+=shards;this.s.expeditions++;this.s.expedition=null;return{i,n,shards};}
 prestigeReward(){if(this.s.runMined<PRESTIGE_REQUIREMENTS.mined||this.s.runGold<PRESTIGE_REQUIREMENTS.sold||!this.s.unlocked[4])return 0;return Math.floor(3+Math.sqrt(this.s.runGold/1000000)+Math.sqrt(this.s.runMined/1000));}
 prestige(){const reward=this.prestigeReward();if(!reward)return 0;this.s.prestiges++;this.s.cores+=reward;this.s.coresEarned+=reward;this.s.coins=this.s.talents[2]*1000;this.s.bag.fill(0);this.s.levels.fill(0);this.s.zone=0;this.s.unlocked=[true,false,false,false,false];this.s.zoneMined.fill(0);this.s.boss=false;this.s.vein=false;this.s.bombs=Math.max(3,this.s.bombs);this.s.depth=0;this.s.depthMined=0;this.s.runMined=0;this.s.runBoss=0;this.s.runGold=0;this.s.pity=0;this.s.expedition=null;this.s.skillUntil=0;this.s.skillReady=0;this.combo=0;this.roll();return reward;}
 talentCost(i){return TALENTS[i].base+Math.floor(this.s.talents[i]/3);}
 talent(i){if(!Number.isInteger(i)||i<0||i>=4||this.s.talents[i]>=TALENTS[i].cap||this.s.cores<this.talentCost(i))return false;this.s.cores-=this.talentCost(i);this.s.talents[i]++;return true;}
 depthCost(){return Math.floor(100000*Math.pow(1.32,this.s.depth));}
 depthGoal(){return 40+this.s.depth*5;}
 descend(){if(this.s.zone!==4||this.s.boss||this.s.depth>=200||this.s.depthMined<this.depthGoal()||this.s.coins<this.depthCost())return false;this.s.coins-=this.depthCost();this.s.depth++;this.s.bestDepth=Math.max(this.s.bestDepth,this.s.depth);this.s.depthMined=0;this.s.shards+=3+this.s.depth;this.roll();return true;}
 ensureDaily(now=Date.now()){const day=dayKey(now);if(!this.s.dailyBoard||day>this.s.dailyBoard.day)this.s.dailyBoard={day,mined:this.s.mined,boss:this.s.bossKills,sold:this.s.totalSold,claimed:[]};return this.s.dailyBoard;}
 dailyProgress(goal,now=Date.now()){const b=this.ensureDaily(now),value=goal.metric==='mined'?this.s.mined:goal.metric==='boss'?this.s.bossKills:this.s.totalSold;return Math.max(0,value-b[goal.metric]);}
 dailyGoal(id,now=Date.now()){const goal=DAILY_GOALS.find(g=>g.id===id),b=this.ensureDaily(now);if(!goal||b.claimed.includes(id)||this.dailyProgress(goal,now)<goal.target)return false;b.claimed.push(id);this.s.coins+=goal.coins;this.s.shards+=goal.shards;return true;}
 serialize(){this.s.last=Date.now();return JSON.stringify(this.s);}
}
root.DeepMine={Mine,ORES,ZONES,KEYS,RESEARCH,ACHIEVEMENTS,RECIPES,BOSS_INTERVAL,PRESTIGE_REQUIREMENTS,TALENTS,EXPEDITIONS,DAILY_GOALS,dayKey};if(typeof module!=='undefined')module.exports=root.DeepMine;
})(typeof window!=='undefined'?window:globalThis);
