import fs from 'fs';
const [W,H,out]=process.argv.slice(2);
const shots=[
['group-piazza',0,1.6,1.08,1.187,0,0],
['run-park-cheer',1.6,0.8,1.12,1.18,0,-1],
['handshake-piazza',2.4,0.8,1.15,1.15,2,-2],
['crowd-saucony-van',3.2,1.2,1.1,1.16,0,0,'whip'],
['pasta-shop-team',4.4,0.8,1.18,1.12,0,0],
['nonno-ravioli',5.2,0.8,1.1,1.2,0,0],
['wings-tees',6.0,0.8,1.12,1.16,-2,2],
['girl-journal',6.8,0.8,1.16,1.1,0,0],
['hanging-shoes',7.6,1.2,1.1,1.17,0,1],
['group-piazza',8.8,1.2,1.0,1.08,0,0,'whip'],
];
const OV=0.22;
let divs='',js='';
shots.forEach(([img,s,d,a,b,x0,x1,tr],i)=>{
  const nextWhip=shots[i+1]?.[7]==='whip';
  const dur=nextWhip?d+OV:d, st=tr?s-OV:s;
  const realStart=tr?s-OV:s, realDur=(nextWhip?d+OV:d)+(tr?OV:0);
  divs+=`<div id="s${i}" class="clip shot" data-start="${realStart.toFixed(2)}" data-duration="${realDur.toFixed(2)}" data-track-index="${tr?2:1}"><img id="i${i}" src="assets/${img}.jpg"></div>\n`;
  const t0=realStart;
  js+=`tl.fromTo("#i${i}",{scale:${a},xPercent:${x0}},{scale:${b},xPercent:${x1},duration:${realDur.toFixed(2)},ease:"none"},${t0.toFixed(2)});\n`;
  if(tr) js+=`tl.fromTo("#s${i}",{xPercent:100,filter:"blur(24px)"},{xPercent:0,filter:"blur(0px)",duration:${OV},ease:"power2.inOut"},${t0.toFixed(2)});\n`;
  if(nextWhip) js+=`tl.to("#s${i}",{xPercent:-60,filter:"blur(24px)",duration:${OV},ease:"power2.inOut"},${(s+d-OV).toFixed(2)});\n`;
});
for(let f=0;f<300;f+=2) js+=`tl.set("#grain",{backgroundPosition:"${(f*137)%512}px ${(f*271)%512}px"},${(f/30).toFixed(3)});\n`;
fs.writeFileSync(out,`<!doctype html><html lang="en"><head><meta charset="UTF-8"/>
<meta name="viewport" content="width=${W}, height=${H}"/>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>*{margin:0;padding:0;box-sizing:border-box}html,body{width:${W}px;height:${H}px;overflow:hidden;background:#111}
#root{position:relative;width:${W}px;height:${H}px;overflow:hidden}
.shot{position:absolute;inset:0;overflow:hidden}.shot img{width:100%;height:100%;object-fit:cover;display:block}
#grain{position:absolute;inset:0;opacity:.07;mix-blend-mode:overlay;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='512' height='512'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
#vig{position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,.35))}
</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="10" data-width="${W}" data-height="${H}">
${divs}<div id="vig" class="clip" data-start="0" data-duration="10" data-track-index="3"></div>
<div id="grain" class="clip" data-start="0" data-duration="10" data-track-index="4"></div>
</div><script>const tl=gsap.timeline({paused:true});
${js}window.__timelines["main"]=tl;tl.seek(0);</script></body></html>`);
