/* Procedural game art: no remote assets or runtime network calls. */
class MineScene {
 constructor(canvas,getGame){this.cv=canvas;this.ctx=canvas.getContext('2d');this.getGame=getGame;this.particles=[];this.swing=0;this.shake=0;this.time=0;this.last=0;this.raf=null;this.paused=false;this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;this.resize=()=>{this.w=canvas.clientWidth;this.h=canvas.clientHeight;const d=Math.min(2,devicePixelRatio||1);canvas.width=this.w*d;canvas.height=this.h*d;this.ctx.setTransform(d,0,0,d,0,0);};window.addEventListener('resize',this.resize);this.resize();this.resume();}
 poly(points,color){const c=this.ctx;c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();}
 line(points,color,width=1){const c=this.ctx;c.strokeStyle=color;c.lineWidth=width;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();}
 gem(x,y,size,color,shape=0){const c=this.ctx;c.save();c.translate(x,y);c.scale(size/12,size/12);if(shape%3===0){this.poly([[-9,1],[-4,-14],[6,-12],[11,0],[3,12],[-6,8]],color);this.poly([[-9,1],[-4,-14],[0,-2]],'#ffffff8a');this.poly([[0,-2],[6,-12],[11,0],[3,12]],'#0002');}else if(shape%3===1){this.poly([[-9,0],[-4,-15],[5,-17],[10,-1],[5,10],[-4,10]],color);this.poly([[-4,-15],[5,-17],[0,2]],'#ffffff9c');this.poly([[0,2],[10,-1],[5,10],[-4,10]],'#0003');}else{this.poly([[-10,-4],[-3,-12],[8,-10],[13,0],[3,12],[-8,8]],color);this.line([[-10,-4],[2,-1],[8,-10]],'#ffffff80',1);this.poly([[2,-1],[13,0],[3,12]],'#0004');}c.restore();}
 impact(ore,result,bomb){this.swing=1;this.shake=this.reduced?0:bomb?17:result.critical?10:4;const count=result.reward?32:bomb?22:8;for(let i=0;i<count;i++)this.particles.push({x:this.w/2,y:this.h*.54,vx:(Math.random()-.5)*8,vy:-2-Math.random()*6,life:1,c:DeepMine.ORES[ore][2],size:2+Math.random()*3});this.particles=this.particles.slice(-180);if(result.reward)this.flash=.3;}
 pause(){this.paused=true;if(this.raf!==null)cancelAnimationFrame(this.raf);this.raf=null;this.last=0;}
 resume(){if(this.raf!==null)return;this.paused=false;this.raf=requestAnimationFrame(t=>this.draw(t));}
 draw(stamp){if(this.paused)return;const dt=this.last?Math.min(.04,(stamp-this.last)/1000):1/60;this.last=stamp;this.time+=dt;const c=this.ctx,w=this.w,h=this.h,t=this.time,game=this.getGame(),s=game.s,z=DeepMine.ZONES[s.zone],o=DeepMine.ORES[s.ore],tier=s.ore%10;
 c.clearRect(0,0,w,h);const bg=c.createRadialGradient(w/2,h*.55,15,w/2,h*.55,w*.8);bg.addColorStop(0,z.bg);bg.addColorStop(1,'#0b1420');c.fillStyle=bg;c.fillRect(0,0,w,h);
 // Layered cave walls, rock seams and a small rail track.
 for(let layer=0;layer<3;layer++){const inset=layer*20;this.poly([[0,0],[75-inset,0],[62-inset,42],[74-inset,102],[27-inset,145],[45-inset,210],[0,h-50]],['#172b38','#1b303c','#233844'][layer]);this.poly([[w,0],[w-63+inset,0],[w-81+inset,65],[w-49+inset,110],[w-68+inset,186],[w,h-50]],['#152733','#1b2f3a','#203641'][layer]);}
 this.poly([[0,h-82],[55,h-97],[135,h-69],[w-90,h-92],[w,h-87],[w,h],[0,h]],'#132630');
 for(let i=0;i<9;i++){const x=(i*73+21)%w,y=115+(i*41)%(h-160);this.line([[x,y],[x+10,y-5],[x+19,y+4]],'#93b8ba0c');}
 for(let i=0;i<5;i++){const y=h-56+i*14;this.line([[w*.3-i*20,y],[w*.7+i*20,y]],'#56616a40',5);}this.line([[w*.42,h-80],[w*.16,h]],'#849a9c40',2);this.line([[w*.58,h-80],[w*.84,h]],'#849a9c40',2);
 // Distinct biome foregrounds: beams, crystal garden, ice, lava, cosmic dust.
 if(s.zone===0){c.fillStyle='#524c43';c.fillRect(18,12,9,h-102);c.fillRect(w-27,12,9,h-102);c.fillRect(15,82,w-30,10);this.line([[24,84],[60,120]],'#7f7158',4);this.line([[w-24,84],[w-60,120]],'#7f7158',4);for(const x of [23,w-23]){c.fillStyle='#efbd6e';c.fillRect(x-4,103,8,13);const glow=c.createRadialGradient(x,110,1,x,110,30);glow.addColorStop(0,'#ffd18238');glow.addColorStop(1,'#ffd18200');c.fillStyle=glow;c.fillRect(x-30,80,60,60);}}
 else if(s.zone===1){for(let i=0;i<8;i++)this.gem(i<4?20+i*9:w-25-(i-4)*10,h-88-i%3*13,9+i%3*4,'#9883e170',i);}
 else if(s.zone===2){for(let i=0;i<9;i++){const x=i*w/8;this.poly([[x-10,0],[x+10,0],[x+3,35+(i*17)%40]],'#82c6e039');}for(let i=0;i<5;i++)this.gem(i<3?21+i*10:w-22-(i-3)*12,h-77,11,'#95e2ff60',1);}
 else if(s.zone===3){this.poly([[0,h-52],[65,h-68],[130,h-45],[200,h-60],[w,h-45],[w,h-25],[0,h-30]],'#e05f2828');this.line([[0,h-42],[60,h-57],[140,h-36],[235,h-48],[w,h-34]],'#ff933868',3);}
 for(let i=0;i<(s.zone===4?28:13);i++){const x=(i*47.73+Math.sin(t*.4+i)*8)%w,y=90+(i*37.5-t*(s.zone===3?10:3)+10000)%(h-140);c.globalAlpha=.15+Math.sin(t+i)*.1;c.fillStyle=z.color;c.fillRect(x,y,s.zone===4?2:1,s.zone===4?2:1);}c.globalAlpha=1;
 const cx=w/2+(Math.random()-.5)*this.shake,cy=h*.55;this.shake*=Math.pow(.72,dt*60);c.save();c.translate(cx,cy);if(!this.reduced)c.translate(0,Math.sin(t*1.8)*1.8);
 c.fillStyle='#020b1180';c.beginPath();c.ellipse(0,65,84,13,0,0,Math.PI*2);c.fill();
 if(tier>=5||s.boss){c.save();c.rotate(t*.2);c.strokeStyle=s.boss?'#ffbd8750':o[2]+'30';c.lineWidth=s.boss?2:1;c.setLineDash([5,10]);c.beginPath();c.arc(0,0,89,0,Math.PI*2);c.stroke();c.restore();}
 if(s.boss){this.poly([[-88,23],[-75,-32],[-33,-65],[36,-59],[86,-20],[91,30],[52,67],[-45,66]],'#6b5250');this.poly([[-75,-32],[-33,-65],[0,-22],[-21,24],[-88,23]],'#927765');this.poly([[-33,-65],[36,-59],[86,-20],[0,-22]],'#af8c6e');this.poly([[0,-22],[86,-20],[91,30],[52,67],[14,42]],'#58424b');for(let i=0;i<5;i++)this.gem(Math.sin(i*2)*55,Math.cos(i*2)*34,16,z.color,i);this.gem(0,0,26,'#ffce83',1);}
 else if(tier>=8){this.gem(0,2,51,o[2],tier);this.gem(-48,30,18,o[2],1);this.gem(42,24,15,o[2],2);}
 else{this.poly([[-77,20],[-67,-31],[-30,-57],[31,-54],[75,-20],[86,25],[49,59],[-41,60]],'#435764');this.poly([[-77,20],[-67,-31],[-30,-57],[-12,-7],[-34,31]],'#627680');this.poly([[-30,-57],[31,-54],[75,-20],[25,4],[-12,-7]],'#7b8e94');this.poly([[25,4],[75,-20],[86,25],[49,59],[6,41]],'#2d424e');this.poly([[-34,31],[-12,-7],[25,4],[6,41],[-41,60]],'#506b76');for(let i=0;i<6;i++)this.gem(Math.sin(i*9+s.ore)*49,Math.cos(i*7+2)*31,9+tier*.8,o[2],s.ore+i);}
 const cracks=1-s.hp/game.maxHp();if(cracks>.1){this.line([[-18,-43],[5,-15],[-6,8],[20,31]],'#071723',2.3);if(cracks>.5){this.line([[-6,8],[-39,19]],'#071723',2.3);this.line([[5,-15],[40,-5]],'#071723',2.3);}}
 c.restore();
 // The tool head changes as the pickaxe is upgraded.
 c.save();c.translate(cx+64,cy-40);c.rotate(-.65-Math.sin(this.swing*Math.PI)*1.4);c.fillStyle='#8a5c3e';c.fillRect(-5,-8,10,94);c.fillStyle='#d0ad70';c.fillRect(-3,35,6,40);const head=s.levels[0]>=30?'#d8b1ff':s.levels[0]>=15?'#e4c379':s.levels[0]>=5?'#6edccc':'#bdd7df';this.poly([[-40,-5],[-28,-21],[12,-24],[43,-7],[49,9],[17,-3],[-19,-5]],head);this.poly([[-40,-5],[-28,-21],[12,-24],[0,-13]],'#edf7f9b0');c.restore();this.swing=Math.max(0,this.swing-dt*5);
 if(game.autoRate()>0){c.save();c.translate(w-49,139+Math.sin(t*2)*4);c.fillStyle='#203b49';c.fillRect(-14,-8,28,16);c.fillStyle=z.color;c.fillRect(-9,-3,5,5);c.fillRect(4,-3,5,5);this.line([[-22,-13],[-8,-13]],'#87a9b9',2);this.line([[8,-13],[22,-13]],'#87a9b9',2);c.restore();}
 this.particles=this.particles.filter(p=>p.life>0);for(const p of this.particles){p.x+=p.vx*dt*60;p.y+=p.vy*dt*60;p.vy+=dt*10;p.life-=dt*1.7;c.globalAlpha=Math.max(0,p.life);c.fillStyle=p.c;c.fillRect(p.x,p.y,p.size,p.size);}c.globalAlpha=1;
 if(this.flash>0){c.fillStyle='#defff0';c.globalAlpha=this.flash*.4;c.fillRect(0,0,w,h);c.globalAlpha=1;this.flash-=dt;}
 this.raf=requestAnimationFrame(t=>this.draw(t));
 }
}
