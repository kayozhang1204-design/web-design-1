'use strict';
const $=s=>document.querySelector(s), clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x)), lerp=(a,b,t)=>a+(b-a)*t, smooth=t=>{t=clamp(t);return t*t*t*(t*(t*6-15)+10)}, reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let W=innerWidth,H=innerHeight, target=0,current=0,last=0,seed=431, sound=false,audio=null,lastStrike=-1,pulse=0,burst=0,mouseX=0,mouseY=0;
const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
const scenes=['type','press','web','digital','ai','ending'].map(id=>$('#'+id));
const SCROLL_SCALE=.5;
const boundaries=[2.3,4.1,5.9,7.5,10.2], transitionWidth=.8;
const ranges=[[0,2.7],[1.9,4.5],[3.7,6.3],[5.5,7.9],[7.1,10.6],[9.8,11]];
const labels=['01 / A SINGLE KEYSTROKE','02 / THE POWER OF A COPY','03 / A WORLD CONNECTED','04 / IDEAS WITHOUT BORDERS','05 / INFINITE POSSIBILITIES','06 / A QUESTION REMAINS'];
const words=[],prints=[];
function makeText(container,count,isPrint){const arr=[];for(let i=0;i<count;i++){const el=document.createElement('div');el.className='word'+(isPrint?' impression':'');el.innerHTML=isPrint?'tools shape thought.<br>craft continues.':i%2?'not a moment.':'creation is a process.';$(container).append(el);let x=(i%2?1:-1)*(.19+rnd()*.27),y=(rnd()-.5)*.78;if(i>10){x=(rnd()-.5)*.9;y=(i%2?1:-1)*(.24+rnd()*.18)}arr.push({el,x,y,angle:(rnd()-.5)*24,delay:i/count*.68});}return arr}
words.push(...makeText('#typed-field',48,false));prints.push(...makeText('#print-field',24,true));
function textMotion(arr,t,isPrint){for(let i=0;i<arr.length;i++){let a=arr[i],q=clamp((t-(isPrint?.12:.24)-a.delay)*4),ease=smooth(q),dx=a.x*W,dy=a.y*H;let spread=smooth((t-.54)*2.2);let angle=a.angle*spread;let x=lerp(-50,dx,ease),y=lerp(-40,dy,ease);a.el.style.left='50%';a.el.style.top='50%';a.el.style.opacity=q;a.el.style.transform=`translate(${x}px,${y}px) translate(-50%,-50%) rotate(${angle}deg)`;}}
const webTemplates=[
['Yahoo! — Microsoft Internet Explorer','<h3 class="yahoo">Yahoo!</h3><a>Arts & Humanities</a><br><a>Business and Economy</a><br><a>Computers and Internet</a><br><a>News and Media</a><br><a>Science</a>'],
['CERN — Netscape','<div class="cern">CERN</div><p>European Laboratory for Particle Physics</p><a>About CERN</a><br><a>Experiments</a><br><a>Computing</a>'],
['The World Wide Web','<h3>The World Wide Web</h3><p>A universe of linked information.</p><a>What is hypertext?</a><br><a>Software Products</a><br><a>Technical details</a>'],
['Welcome to the Internet','<h3>My home page</h3><p>Hello, world.</p><hr><a>My interests</a><br><a>Useful links</a><p>Last updated: 1996</p>'],
['The WWW Virtual Library','<h3>Virtual Library</h3><a>Art and culture</a><br><a>Architecture</a><br><a>Engineering</a><br><a>Literature</a><br><a>Music</a>']];
const webNodes=webTemplates.map((v,i)=>{let el=document.createElement('div');el.className='floating-web';el.innerHTML=`<div class="win-title">${v[0]} <b>− □ ×</b></div><div class="win-menu">File　Edit　View　Go　Help</div><div class="web-content">${v[1]}</div>`;$('#web-field').append(el);return {el,x:[-.32,.29,-.29,.33,0][i],y:[-.13,-.17,.22,.22,-.32][i]}});
// The artwork atlas keeps the image payload small while every card remains independently animated.
const crops=[[37,434,154,225],[240,421,128,132],[414,418,165,113],[470,539,145,132],[900,413,139,127],[1055,427,105,151],[1207,420,118,164],[1346,419,143,127],[211,549,204,121],[1422,581,64,86],[936,585,224,85],[1174,597,199,57],[27,723,123,117],[159,714,130,134],[329,732,105,97],[512,718,105,116],[802,715,131,115],[1068,716,139,123],[1255,714,88,127],[1378,713,132,169],[311,848,188,133],[611,872,186,111],[805,848,181,134],[1150,884,174,94]];
crops.push(...Array.from({length:24},(_,i)=>[(i%6)*256,Math.floor(i/6)*256,256,256]));
function art(i,size,parent){let [x,y,w,h]=crops[i%crops.length];let el=document.createElement('div');el.className='art photo';let sw=size,sh=size*h/w;el.style.width=sw+'px';el.style.height=sh+'px';el.style.backgroundImage=i%crops.length>=24?"url('assets/art-expanded.png')":"url('assets/art.png')";el.style.backgroundSize=`${1536/w*sw}px ${1024/h*sh}px`;el.style.backgroundPosition=`${-x/w*sw}px ${-y/h*sh}px`;parent.append(el);return el}
const worldLayout=[[-.36,-.32],[-.12,-.35],[.12,-.32],[.36,-.34],[-.38,-.1],[-.23,-.15],[-.38,.15],[-.24,.15],[.24,-.13],[.39,-.08],[.24,.15],[.39,.16],[-.36,.35],[-.12,.34],[.12,.35],[.36,.35]];
const worldDescriptions=["A street market in Vietnam", "People sharing a Paris caf\u00e9 terrace", "Surfers in turquoise water", "A night crossing in Tokyo", "Hands shaping a clay vessel", "A seaside basketball game", "Mountains through a train window", "An everyday market in Hong Kong", "An afternoon at a Paris caf\u00e9", "Hikers climbing a mountain trail", "Learning pottery together", "People passing on a New York street", "A colorful street market", "Two surfers sharing a wave", "A New York crosswalk", "Friends hiking in the Alps"];
const digital=worldLayout.map(([x,y],i)=>{
 const el=document.createElement('img');el.className='art world-photo';el.src=`assets/world/${String(i+1).padStart(2,'0')}.jpg`;el.alt=worldDescriptions[i];el.decoding='async';el.draggable=false;$('#digital-field').append(el);
 return{el,x,y,angle:[-2,1,-1,2,1,-2,2,0,-1,2,0,-2,1,-1,2,-1][i],portrait:[3,4,7,10,11,14].includes(i)};
});
const cloud=Array.from({length:240},(_,i)=>{let cluster=i%9,theta=cluster*Math.PI*2/9+(rnd()-.5)*.48;let radius=.25+rnd()*.16;let size=i<18?38+rnd()*35:14+rnd()*30;let el=art(i,size,$('#cloud'));return{el,theta,radius,size,x:Math.cos(theta)*radius,y:Math.sin(theta)*radius,depth:rnd(),rotation:(rnd()-.5)*22,delay:i/240}});
// The original paper, browser, journal and input are hosted in ONE persistent surface.
// It never appears only for a transition: it is the visible paper/screen in every scene.
const medium=document.createElement('div');medium.id='medium';$('#stage').append(medium);
const layers=[$('.paper-copy'),$('.press-sheet'),$('.crt-screen'),$('.laptop-screen'),$('.prompt'),$('.final-copy')];
layers.forEach((el,i)=>{el.classList.add('medium-layer');el.dataset.layer=i;medium.append(el)});
$('.transition-glyph').remove();
const promptSlot=document.createElement('div');promptSlot.className='journal-prompt-space';layers[3].append(promptSlot);
let machineW=0,machineH=0;
function measureMachine(){machineW=$('.machine').offsetWidth;machineH=$('.machine').offsetHeight}
measureMachine();
function rectFor(stage){
 const m=machineW,h=machineH;
 const coords=[[.29,.14,.54,.22],[.28,.485,.47,.065],[.182,.255,.595,.325],[.087,.271,.766,.379]];
 if(stage<4){const [x,y,w,z]=coords[stage];return{x:(x+w/2-.5)*m,y:(y+z/2-.5)*h,w:w*m,h:z*h}}
 if(stage===4)return{x:0,y:0,w:Math.min(410,Math.max(275,W*.28)),h:60};
 return{x:0,y:-H*.02,w:Math.min(W*.9,1000),h:230};
}
const colors=[[248,242,229],[248,242,229],[0,128,131],[247,245,238],[249,250,248],[220,223,221]];
function mediumMotion(p){
 let from=0,to=0,q=0;
 for(let i=0;i<boundaries.length;i++){
  if(p>=boundaries[i]+.4){from=i+1;to=i+1}
  else if(p>boundaries[i]-.4){from=i;to=i+1;q=clamp((p-boundaries[i]+.4)/.8);break}
  else break;
 }
 const a=rectFor(from),b=rectFor(to),t=smooth(q);
 // Local handoff: the same surface travels between actual paper/screen bounds.
 // Its size never exceeds either endpoint. Hardware dissolves gently behind it.
 const w=lerp(a.w,b.w,t),h=lerp(a.h,b.h,t);
 medium.style.width=w+'px';medium.style.height=h+'px';
 medium.style.transform=`translate(-50%,-50%) translate3d(${lerp(a.x,b.x,t)}px,${lerp(a.y,b.y,t)}px,0)`;
 medium.style.setProperty('--surface-width',w+'px');
 medium.style.clipPath='none';
 layers[1].querySelector('span').style.opacity=0;
 const c=colors[from].map((v,k)=>Math.round(lerp(v,colors[to][k],t)));
 const ending=from===5?1:to===5?t:0;
 // The photographed press bed remains unobstructed; blend paper into the local screen.
 const pressSurface=from===1&&to===1?0:from===1?t:to===1?1-t:1;
 medium.style.background=`rgba(${c.join(',')},${from>=3?0:(1-ending)*pressSurface})`;
 medium.style.borderRadius=lerp(from===4?28:from<2||from===5?0:3,to===4?28:to<2||to===5?0:3,t)+'px';
 medium.style.boxShadow='none';
 layers.forEach((el,i)=>{let op=from===to?(i===from?1:0):i===from?1-t:i===to?t:0;el.style.opacity=op;el.style.visibility=op>.0001?'visible':'hidden';el.inert=op<.5});
 // The same real form is already present along the laptop page's bottom edge.
 const inLaptop=from===3&&to===3, intoPrompt=from===3&&to===4;
 if(inLaptop||intoPrompt){
  const u=intoPrompt?t:0;
  layers[4].style.borderRadius=lerp(4,28,u)+'px';
  layers[4].style.padding=`${lerp(2,9,u)}px ${lerp(2,12,u)}px ${lerp(2,9,u)}px ${lerp(2,16,u)}px`;
  layers[4].style.gap=lerp(2,6,u)+'px';
  layers[4].style.visibility='visible';layers[4].style.opacity=1;layers[4].inert=u<.99;
  layers[4].style.top=lerp(78,0,u)+'%';layers[4].style.left=lerp(4,0,u)+'%';
  layers[4].style.width=lerp(92,100,u)+'%';layers[4].style.height=lerp(18,100,u)+'%';
  layers[4].style.setProperty('--input-font',lerp(5,12,u)+'px');
  layers[4].style.setProperty('--send-size',lerp(12,29,u)+'px');
  layers[4].classList.toggle('mini-prompt',u<.95);
 }else{layers[4].style.borderRadius='28px';layers[4].style.padding='9px 12px 9px 16px';layers[4].style.gap='6px';layers[4].style.top='0';layers[4].style.left='0';layers[4].style.width='100%';layers[4].style.height='100%';layers[4].style.setProperty('--input-font','12px');layers[4].style.setProperty('--send-size','29px');layers[4].classList.remove('mini-prompt')}
 medium.style.pointerEvents=(from===4||to===4||from===5||to===5)?'auto':'none';
}
let noiseBuffer=null,lastAudioAt=-1,lastAudioTick='',lastAudioStage=0;
function syncSoundState(){
 const running=!!audio&&audio.state==='running',button=$('#sound');
 button.dataset.audioState=!sound?'off':running?'playing':'waiting';
 button.innerHTML=!sound?'<span class="sound-hand" aria-hidden="true">☞</span><span>SOUND OFF · CLICK TO ENABLE</span>':running?'SOUND ON':'CLICK TO START SOUND';
 button.setAttribute('aria-label',!sound?'Enable sound':running?'Disable sound':'Start sound');
 button.setAttribute('aria-pressed',String(sound));
}
function audioReady(){
 try{
  if(!audio){
   audio=new(window.AudioContext||window.webkitAudioContext)();
   audio.addEventListener('statechange',syncSoundState);
  }
  if(!noiseBuffer){noiseBuffer=audio.createBuffer(1,Math.floor(audio.sampleRate*.3),audio.sampleRate);let d=noiseBuffer.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}
  // Resume directly within click/touch/key events as well as trying permitted autoplay.
  const resumed=audio.resume();
  if(resumed&&resumed.then)resumed.then(()=>{
   syncSoundState();if(sound&&audio.state==='running'){lastAudioTick='';modemStage=-1;lastStrike=-1;dirty=true;soundMotion(current)}
  }).catch(syncSoundState);
  syncSoundState();
 }catch{syncSoundState()}
}
function ping(freq,duration,volume,kind='sine',endFreq=freq){if(!audio)return;let o=audio.createOscillator(),g=audio.createGain(),now=audio.currentTime;o.type=kind;o.frequency.setValueAtTime(freq,now);o.frequency.exponentialRampToValueAtTime(endFreq,now+duration);g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(volume,now+.005);g.gain.exponentialRampToValueAtTime(.0001,now+duration);o.connect(g);g.connect(audio.destination);o.start(now);o.stop(now+duration+.01)}
function rustle(duration,volume,frequency){if(!audio||!noiseBuffer)return;let n=audio.createBufferSource(),f=audio.createBiquadFilter(),g=audio.createGain(),now=audio.currentTime;n.buffer=noiseBuffer;f.type='bandpass';f.frequency.value=frequency;f.Q.value=.7;g.gain.setValueAtTime(volume,now);g.gain.exponentialRampToValueAtTime(.0001,now+duration);n.connect(f);f.connect(g);g.connect(audio.destination);n.start();n.stop(now+duration)}
function fx(kind){if(!sound||!audio||audio.state!=='running')return;let now=audio.currentTime;if(now-lastAudioAt<.045)return;lastAudioAt=now;
 if(kind==='key'){rustle(.028,.055,2300);ping(180,.035,.012,'triangle',90)}
 if(kind==='press'){ping(90,.16,.055,'sine',38);rustle(.16,.045,550)}
 if(kind==='paper'){rustle(.24,.035,1700)}
 if(kind==='digital'){rustle(.018,.065,1850);ping(780,.016,.013,'triangle',420)}
 if(kind==='ai'){ambientLevel(current)}
}
function tone(){fx('key')}
let ambientBus=null,ambientTarget=-1,ambientNext=0,ambientStep=0,ambientDry=null;
let modemBus=null,modemStage=-1;
// A short synthesized modem handshake, once per visit, with its own fade-out bus.
function startModem(){
 if(!audio)return;
 stopModem();modemBus=audio.createGain();modemBus.gain.value=.055;modemBus.connect(audio.destination);
 const bus=modemBus,now=audio.currentTime;
 function note(f,start,len,volume=.2,end=f,type='sine'){
  const o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.setValueAtTime(f,now+start);o.frequency.exponentialRampToValueAtTime(end,now+start+len);
  g.gain.setValueAtTime(0,now+start);g.gain.linearRampToValueAtTime(volume,now+start+.015);g.gain.setTargetAtTime(0,now+start+len-.04,.012);
  o.connect(g);g.connect(bus);o.start(now+start);o.stop(now+start+len+.1);
 }
 [350,440].forEach(f=>note(f,0,.5,.13));
 const digits=[[697,1209],[770,1336],[852,1477],[697,1336],[941,1209]];
 digits.forEach((pair,i)=>pair.forEach(f=>note(f,.55+i*.16,.10,.12)));
 note(2100,1.55,.65,.2);note(1650,2.25,.55,.16,1850,'triangle');
 for(let i=0;i<12;i++)note(i%2?1200:2400,2.85+i*.065,.055,.15);
 const n=audio.createBufferSource(),f=audio.createBiquadFilter(),g=audio.createGain();n.buffer=noiseBuffer;n.loop=true;f.type='bandpass';f.frequency.value=1800;f.Q.value=.8;
 g.gain.setValueAtTime(0,now);g.gain.setValueAtTime(.16,now+3.65);g.gain.linearRampToValueAtTime(.025,now+4.8);g.gain.linearRampToValueAtTime(0,now+5.2);
 n.connect(f);f.connect(g);g.connect(bus);n.start(now+3.65);n.stop(now+5.3);
}
function stopModem(){if(modemBus){modemBus.gain.cancelScheduledValues(audio.currentTime);modemBus.gain.setTargetAtTime(0,audio.currentTime,.06);modemBus=null}}
function ensureAmbience(){
 if(!audio||ambientBus)return;
 ambientBus=audio.createGain();ambientBus.gain.value=0;ambientBus.connect(audio.destination);
 ambientDry=audio.createBiquadFilter();ambientDry.type='lowpass';ambientDry.frequency.value=2200;ambientDry.Q.value=.3;ambientDry.connect(ambientBus);
 const delay=audio.createDelay(2),feedback=audio.createGain(),wet=audio.createGain();delay.delayTime.value=.67;feedback.gain.value=.34;wet.gain.value=.28;
 ambientDry.connect(delay);delay.connect(feedback);feedback.connect(delay);delay.connect(wet);wet.connect(ambientBus);
 // Air and slow filter motion add space without a beat or notification sound.
 const air=audio.createBufferSource(),airFilter=audio.createBiquadFilter(),airGain=audio.createGain();
 air.buffer=noiseBuffer;air.loop=true;airFilter.type='lowpass';airFilter.frequency.value=450;airGain.gain.value=.025;air.connect(airFilter);airFilter.connect(airGain);airGain.connect(ambientDry);air.start();
 const lfo=audio.createOscillator(),depth=audio.createGain();lfo.frequency.value=.09;depth.gain.value=650;lfo.connect(depth);depth.connect(ambientDry.frequency);lfo.start();
 ambientNext=audio.currentTime;
}
function ambientPhrase(now){
 // Cmaj9, Am9, Fmaj9, Gsus: overlapping slow envelopes, no hard chord changes.
 const chords=[[130.81,196,246.94,293.66],[110,164.81,246.94,261.63],[87.31,174.61,220,329.63],[98,196,261.63,293.66]];
 const chord=chords[ambientStep++%chords.length];
 function voice(freq,start,duration,gain,type,detune){
  const o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.value=freq;o.detune.value=detune;
  g.gain.setValueAtTime(0,start);g.gain.linearRampToValueAtTime(gain,start+duration*.32);g.gain.linearRampToValueAtTime(gain*.7,start+duration*.6);g.gain.linearRampToValueAtTime(0,start+duration);
  o.connect(g);g.connect(ambientDry);o.start(start);o.stop(start+duration+.1);
 }
 chord.forEach((f,i)=>{voice(f,now+i*.18,10,.13,'sine',i%2?4:-4);voice(f*2,now+i*.18,10,.025,'triangle',i%2?-3:3)});
 // Sparse upper notes emerge as a texture, with soft attacks and long tails.
 voice(chord[2]*2,now+1.6,5,.045,'sine',0);voice(chord[3]*2,now+4,5,.035,'sine',-2);
 ambientNext=now+7;
}
function ambientLevel(p){
 if(!audio)return;
 const level=sound&&!document.hidden ? .10*smooth((p-7.45)/.65)*(1-smooth((p-9.8)/.75)) : 0;
 if(level>0){ensureAmbience();if(audio.currentTime>=ambientNext)ambientPhrase(audio.currentTime)}
 if(ambientBus&&Math.abs(level-ambientTarget)>.00015){ambientBus.gain.setTargetAtTime(level,audio.currentTime,level===0?.2:.6);ambientTarget=level}
}
function soundMotion(p){
 ambientLevel(p);
 const stage=boundaries.filter(b=>p>b).length;
 if(!sound||!audio||audio.state!=='running'||document.hidden){stopModem();modemStage=-1;return}
 if(stage!==modemStage){if(stage===2)startModem();else stopModem();modemStage=stage}
 if(stage!==lastAudioStage){if(stage<2)fx('paper');lastAudioStage=stage}
 const tick=stage===3?'m'+Math.floor(clamp((p-5.98)/1.3)*8):'';
 if(tick&&tick!==lastAudioTick){fx('digital');lastAudioTick=tick}
}
function showScene(i,p){
 const enter=i===0?1:smooth((p-boundaries[i-1]+transitionWidth/2)/transitionWidth);
 const leave=i===5?0:smooth((p-boundaries[i]+transitionWidth/2)/transitionWidth);
 const op=enter*(1-leave), travel=reduced?0:((1-enter)*55-leave*55);
 scenes[i].style.opacity=op;
 scenes[i].style.transform='none';
 scenes[i].classList.toggle('active',op>.5);
 scenes[i].style.visibility=op>.001?'visible':'hidden';
 scenes[i].inert=op<=.5;
 return op;
}
function render(){let p=current;let active=0;for(let i=0;i<6;i++){if(i>0&&p>boundaries[i-1])active=i;showScene(i,p)}document.body.classList.toggle('started',p>.06);$('#chapter').textContent=labels[active];$('#progress').textContent=String(Math.round(p/11*100)).padStart(2,'0')+' — 100';document.querySelectorAll('nav button').forEach((el,i)=>{el.classList.toggle('current',i===active);el.setAttribute('aria-current',i===active?'step':'false')});$('#scroll-cue').style.opacity=p>10?0:1;$('#scroll-cue').style.pointerEvents=p>10?'none':'auto';
 if(p<2.71){ const t=clamp(p/2.2);textMotion(words,t,false);let phrase='creation is a process.\nnot a moment.',n=Math.floor(clamp(p/.72)*phrase.length);$('#paper-text').textContent=phrase.slice(0,n);if(n!==lastStrike&&p<1){tone();pulse=reduced?0:1;lastStrike=n}pulse*=.75;document.documentElement.style.setProperty('--hit',pulse);document.documentElement.style.setProperty('--key',n%10);document.documentElement.style.setProperty('--carriage',(p<.8?-n*.16:0)+'px');document.documentElement.style.setProperty('--caret',n>0&&n<phrase.length?1:0);
 } if(p>1.89&&p<4.51){ // Impressions follow scroll progress, so a quick scroll never skips their reveal.
 textMotion(prints,clamp((p-2.35)/1.6),true);
 } if(p>3.69&&p<6.31){ const wt=clamp((p-4.18)/1.5);webNodes.forEach((a,i)=>{let q=smooth((wt-i*.11)*3);a.el.style.opacity=q;a.el.style.left='50%';a.el.style.top='50%';a.el.style.transform=`translate(${a.x*W*q}px,${a.y*H*q}px) translate(-50%,-50%) scale(${.3+.7*q})`});
 } if(p>5.49&&p<7.91){ const dt=clamp((p-5.95)/1.15);digital.forEach((a,i)=>{
 const mobile=W<600,hidden=mobile&&[5,7,8,10].includes(i),q=smooth((dt-i*.018)*3.3);
 a.el.style.display=hidden?'none':'block';
 const width=mobile?Math.min(90,W*.20):Math.min(190,W*.132);
 a.el.style.width=width+'px';a.el.style.height=Math.min(H*(mobile?.14:.19),width*(a.portrait?1.18:.73))+'px';
 a.el.style.opacity=q;a.el.style.transform=`translate(${a.x*W*q}px,${a.y*H*q}px) translate(-50%,-50%) rotate(${a.angle*q}deg)`;
 });
 } if(p>7.09&&p<10.61){
 const at=clamp((p-7.48)/2.55), scatter=smooth((at-.35)/.4), exit=smooth((p-9.85)/.7);
 const mobile=W<600, columns=mobile?4:8, primaryCount=mobile?32:48, cardWidth=mobile?Math.min(72,W*.205):Math.min(150,W*.111);
 cloud.forEach((a,i)=>{
  const primary=i<primaryCount;
  const reveal=primary?smooth((at-(i%8)*.006)*12):smooth((scatter-a.delay*.5)*3);
  const col=i%columns,row=Math.floor(i/columns);
  const layoutX=(col-(columns-1)/2)*cardWidth*1.04;
  const rowPositions=mobile?[-.41,-.31,-.21,-.11,.11,.21,.31,.41]:[-.39,-.265,-.14,.14,.265,.39];
  const layoutY=(rowPositions[row%(mobile?8:6)])*H;
  const angle=a.theta+(reduced?0:scatter*.16+burst*.08);
  const ringX=Math.cos(angle)*a.radius*W*(1+exit*2.8);
  const ringY=Math.sin(angle)*a.radius*H*1.3*(1+exit*2.8);
  const depth=a.depth;
  const x=lerp(primary?layoutX:0,ringX,scatter)+(reduced?0:mouseX*depth*10*scatter);
  const y=lerp(primary?layoutY:0,ringY,scatter)+(reduced?0:mouseY*depth*10*scatter);
  const aspect=crops[i%crops.length][3]/crops[i%crops.length][2];
  const fitWidth=Math.min(cardWidth,H*(mobile?.095:.122)/aspect);
  const scale=lerp(primary?fitWidth/a.size:.2,primary?.9:.65,scatter)*(1+exit*.8);
  a.el.style.opacity=reveal*lerp(1,.4+depth*.6,scatter)*(1-exit);
  a.el.style.transform=`translate3d(${x}px,${y}px,0) translate(-50%,-50%) scale(${scale}) rotate(${a.rotation*scatter}deg)`;
 });

 }
 mediumMotion(p);
}

let pressStrokeStart=-1,pressRequested=0,pressCompleted=0,pressCycleTarget=0,pressHit=false,pressOutput=0;
function operatePress(time){
 const el=$('.press'),visible=current>2.65&&current<3.85;
 if(!visible){pressStrokeStart=-1;pressCompleted=0;pressRequested=0;pressOutput=0;el.style.setProperty('--lever-angle','0deg');el.style.setProperty('--platen-angle','0deg');el.style.setProperty('--platen-y','0px');return}
 pressRequested=Math.max(1,Math.ceil(clamp((current-2.65)/1.12)*8));
 if(pressRequested<pressCompleted){pressCompleted=pressRequested-1;pressOutput=pressCompleted/8}
 if(pressStrokeStart<0&&pressRequested>pressCompleted){pressStrokeStart=time;pressCycleTarget=pressRequested;pressHit=false}
 let stroke=0;
 if(pressStrokeStart>=0){
  const t=clamp((time-pressStrokeStart)/850);
  stroke=t<.45?smooth(t/.45):t<.58?1:1-smooth((t-.58)/.42);
  if(t>=.45&&!pressHit){fx('press');pressHit=true}
  if(t>=.58)pressOutput=lerp(pressCompleted/8,pressCycleTarget/8,smooth((t-.58)/.42));
  if(t>=1){pressCompleted=pressCycleTarget;pressStrokeStart=-1}
 }
 el.style.setProperty('--lever-angle',(reduced?0:stroke*38)+'deg');
 el.style.setProperty('--platen-angle',(reduced?0:stroke*-34)+'deg');
 el.style.setProperty('--platen-y',(reduced?0:-stroke*machineH*.025)+'px');
 // Hardware timing must not reset the scroll-driven impression field.
}

let previousTime=0,previousTarget=-1,dirty=true,scrollVelocity=0;
function frame(time){
 const dt=Math.min(64,time-previousTime||16);previousTime=time;
 target=clamp(scrollY/(H*SCROLL_SCALE),0,11);
 const moving=Math.abs(current-target)>.00002||Math.abs(scrollVelocity)>.0001;
 if(moving||dirty||pulse>.005){
  if(reduced){current=target;scrollVelocity=0}else{
   const omega=17,seconds=dt/1000,error=current-target,decay=Math.exp(-omega*seconds),step=(scrollVelocity+omega*error)*seconds;
   current=clamp(target+(error+step)*decay,0,11);scrollVelocity=(scrollVelocity-omega*step)*decay;
   if(Math.abs(current-target)<.00002&&Math.abs(scrollVelocity)<.0001){current=target;scrollVelocity=0}
  }
  render();dirty=false;
 }
 operatePress(time);soundMotion(current);
 requestAnimationFrame(frame);
}

function jump(to){scrollTo({top:to*H*SCROLL_SCALE,behavior:'instant'});dirty=true}
document.querySelectorAll('[data-to]').forEach(el=>el.addEventListener('click',()=>jump(+el.dataset.to)));$('#scroll-cue').onclick=()=>jump(Math.min(10.5,target+.65));$('#restart').onclick=()=>{lastStrike=-1;jump(0)};$('#sound').onclick=()=>{
 if(sound&&(!audio||audio.state!=='running')){audioReady();return}
 sound=!sound;if(sound)audioReady();syncSoundState();soundMotion(current)
};$('#prompt-form').onsubmit=e=>{e.preventDefault();burst++;dirty=true;jump(Math.min(9.55,Math.max(target+.45,8.7)));$('#idea').blur()};addEventListener('pointermove',e=>{mouseX=e.clientX/W-.5;mouseY=e.clientY/H-.5;if(current>7&&current<10.6)dirty=true});addEventListener('resize',()=>{W=innerWidth;H=innerHeight;measureMachine();dirty=true});addEventListener('keydown',e=>{if(e.target.tagName==='INPUT')return;if(e.key==='Home'){e.preventDefault();jump(0)}if(e.key==='End'){e.preventDefault();jump(11)}});requestAnimationFrame(frame);

document.addEventListener("visibilitychange",()=>soundMotion(current));
document.addEventListener("pointerdown",e=>{if(current>6.3&&current<7.1&&e.target.id!=="sound")fx("digital")});

// Keep the user's default-on preference separate from the browser playback state.
function unlockSound(event){
 if(event?.target?.closest?.('#sound'))return;
 if(sound&&(!audio||audio.state!=='running'))audioReady();
}
['click','pointerup','touchend','keydown'].forEach(type=>document.addEventListener(type,unlockSound,{capture:true,passive:true}));
// Wheel does not unlock every browser, but can resume when autoplay is already permitted.
document.addEventListener('wheel',unlockSound,{passive:true,once:true});
syncSoundState();
