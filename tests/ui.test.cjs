const assert=require('node:assert/strict');
const path=require('node:path');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file://'+path.resolve(__dirname,'../app/src/main/assets/index.html'));
 await page.locator('#scene').tap({position:{x:175,y:180}});assert(await page.evaluate(()=>game.s.hp<8));
 await page.locator('#daily').click();const coins=await page.evaluate(()=>game.s.coins);assert.equal(coins,100);await page.locator('#daily').click();assert.equal(await page.evaluate(()=>game.s.coins),coins);
 await page.locator('[data-buy="0"]').click();assert.equal(await page.evaluate(()=>game.s.levels[0]),1);
 await page.locator('[data-tab="book"]').click();assert.equal(await page.locator('.orecard').count(),10);await page.locator('[data-keep="0"]').click();assert.equal(await page.evaluate(()=>game.s.keep[0]),true);
 for(let i=1;i<5;i++){await page.locator('[data-bookzone="'+i+'"]').click();assert.equal(await page.locator('.orecard').count(),10);}
 await page.evaluate(()=>{game.s.mined=800;game.s.coins=1000000;render();});
 await page.locator('[data-tab="map"]').click();for(let i=1;i<5;i++){await page.locator('[data-zone="'+i+'"]').click();assert.equal(await page.evaluate(()=>game.s.zone),i);}
 await page.locator('[data-exp-send]').click();assert(await page.evaluate(()=>!!game.s.expedition));await page.evaluate(()=>{game.s.expedition.end=Date.now()-1000;skillClock();});await page.locator('[data-exp-claim]').click();assert.equal(await page.evaluate(()=>game.s.expedition),null);
 await page.locator('[data-tab="craft"]').click();await page.evaluate(()=>{game.s.bag[0]=10;game.s.bag[1]=10;game.s.bag[2]=10;game.s.bag[3]=10;render();});await page.locator('[data-craft="0"]').click();await page.locator('[data-craft="1"]').click();assert.equal(await page.evaluate(()=>game.s.drones),1);
 await page.locator('[data-tab="goals"]').click();await page.locator('[data-ach="mine25"]').click();assert(await page.evaluate(()=>game.s.claimed.includes('mine25')));
 await page.evaluate(()=>{game.s.boss=true;game.s.ore=44;game.s.hp=1;render();});await page.locator('#scene').tap({position:{x:175,y:180}});assert.equal(await page.locator('#discovery').isVisible(),true);await page.locator('#discover-close').click();
 await page.locator('[data-tab="settings"]').click();await page.locator('#sound').click();await page.locator('#export').click();const backup=await page.locator('#backup').inputValue();assert.equal(JSON.parse(backup).v,2);await page.locator('#import').click();assert.equal(await page.locator('#import').textContent(),'이 기록으로 복원');await page.locator('#import').click();assert.equal(await page.evaluate(()=>game.s.zone),4);
 await page.reload();assert.equal(await page.evaluate(()=>game.s.zone),4);assert.equal(await page.evaluate(()=>game.s.keep[0]),true);
 await page.locator('[data-tab="upgrade"]').click();await page.evaluate(()=>{scene.pause();game.s.levels[3]=0;game.s.drones=0;game.s.zone=1;game.s.ore=15;game.s.hp=game.maxHp();render();scene.resume();});await page.waitForTimeout(150);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:process.env.SCREENSHOT_PATH||'/tmp/deepmine-v2-mobile.png',fullPage:true});
 for(const width of [320,430]){await page.setViewportSize({width,height:844});await page.waitForTimeout(100);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'horizontal overflow at '+width);}
 assert.deepEqual(errors,[]);console.log('PASS: mobile mining, daily, upgrades, 50 ore cards, five zones, crafting, expedition, achievement, boss modal, backup restore, reload, responsive widths and no JS errors.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
