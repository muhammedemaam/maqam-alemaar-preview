/* Maqam Al-Emaar: shared behaviour. Every feature checks that its elements exist, so inner pages can reuse this file. */
(function(){
'use strict';
var H=document.documentElement,B=document.body,L='ar';
var $=function(s,c){return(c||document).querySelector(s)},$$=function(s,c){return[].slice.call((c||document).querySelectorAll(s))};
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
/* language */
L=store('mq-lang')||'ar';
function applyAl(){$$('[data-al]').forEach(function(e){var v=e.dataset.al.split('|');e.setAttribute('aria-label',v[H.lang==='ar'?0:1]||v[0])})}
function setLang(l){L=l;H.lang=l;H.dir=l==='ar'?'rtl':'ltr';
 var t=B.dataset['title'+(l==='ar'?'Ar':'En')],d=B.dataset['desc'+(l==='ar'?'Ar':'En')];
 if(t)document.title=t;var md=$('meta[name=description]');if(md&&d)md.setAttribute('content',d);
 $$('.lg2 button').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.l===l)});
 applyAl();store('mq-lang',l);
 var a=$('#wa');if(a)a.href='https://wa.me/966549566027?text='+encodeURIComponent(l==='ar'?'السلام عليكم، أود الاستفسار عن خدمات الأرضيات الصناعية.':'Hello, I would like to enquire about your industrial flooring services.');
 document.dispatchEvent(new CustomEvent('mq-lang',{detail:l}))}
$$('.lg2 button').forEach(function(b){b.addEventListener('click',function(){setLang(b.dataset.l)})});
/* motion toggle (WCAG 2.2.2): stops every animation, auto-advance and marquee */
var mo=$('#mo'),nomo=null;
/* motion state lasts for the browser session only (a stale 'stopped' flag must never freeze the site for good) */
try{nomo=sessionStorage.getItem('mq-mo-s');localStorage.removeItem('mq-mo')}catch(e){}
if(nomo===null)nomo=reduce?'1':'0';
function setMo(v){nomo=v?'1':'0';H.classList.toggle('nomo',!!v);if(mo)mo.setAttribute('aria-pressed',!!v);try{sessionStorage.setItem('mq-mo-s',nomo)}catch(e){}document.dispatchEvent(new CustomEvent('mq-motion',{detail:!!v}))}
if(mo)mo.addEventListener('click',function(){setMo(nomo!=='1')});
setMo(nomo==='1');setLang(L);
function still(){return H.classList.contains('nomo')||H.classList.contains('shot')}
/* preloader, progress, header, top, cookies, menu */
if(/[?&]shot/.test(location.search))H.classList.add('shot');
var pre=$('#pre');function hidePre(){if(pre)pre.classList.add('done')}
setTimeout(hidePre,250);
var hd=$('#hd'),bar=$('#bar'),top=$('#top'),tk=false;
function onS(){var y=scrollY,h=H.scrollHeight-innerHeight;if(hd)hd.classList.toggle('sc',y>40);if(bar)bar.style.transform='scaleX('+(h>0?y/h:0)+')';if(top)top.classList.toggle('on',y>700);tk=false}
addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(onS)}},{passive:true});onS();
if(top)top.addEventListener('click',function(){scrollTo({top:0,behavior:still()?'auto':'smooth'})});
var bg=$('.burger'),nv=$('#nav');
if(bg&&nv){bg.addEventListener('click',function(){var o=nv.classList.toggle('open');bg.setAttribute('aria-expanded',o)});
 $$('#nav a').forEach(function(a){a.addEventListener('click',function(){nv.classList.remove('open');bg.setAttribute('aria-expanded',false)})})}
var ck=$('#ck');
if(ck){if(!store('mq-ck'))setTimeout(function(){ck.classList.add('on')},1400);
 var cs=function(v){store('mq-ck',v);ck.classList.remove('on')};
 var y=$('#cky'),n=$('#ckn');if(y)y.addEventListener('click',function(){cs('all')});if(n)n.addEventListener('click',function(){cs('essential')})}
/* reveal + counters */
if('IntersectionObserver' in window){
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -40px 0px'});
 $$('.rv').forEach(function(x){io.observe(x)});
 var run={};
 var count=function(el){var t=+el.dataset.n,pre=el.dataset.pre||'',id=el.dataset.id||(el.dataset.id=Math.random());cancelAnimationFrame(run[id]);
  if(still()){el.textContent=pre+t;return}
  var s=null;function f(ts){s=s||ts;var k=Math.min((ts-s)/1500,1);el.textContent=pre+Math.round(t*(1-Math.pow(1-k,4)));if(k<1)run[id]=requestAnimationFrame(f)}run[id]=requestAnimationFrame(f)};
 var co=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)count(e.target)})},{threshold:.5});
 $$('[data-n]').forEach(function(x){x.textContent=(x.dataset.pre||'')+x.dataset.n;co.observe(x)});
 var pz=new IntersectionObserver(function(es){es.forEach(function(e){e.target.classList.toggle('pz',!e.isIntersecting)})},{rootMargin:'120px'});
 $$('.tick .tr,.mq .tr').forEach(function(x){pz.observe(x)});
}else{$$('.rv').forEach(function(x){x.classList.add('in')})}
/* hero + ticker + interactive notch */
var hero=$('#hero');
if(hero){
 var sl=$$('.sl'),tb=$$('.tb'),cur=0,tm,paused=false;
 var go=function(i){cur=(i+sl.length)%sl.length;sl.forEach(function(s,k){s.classList.toggle('on',k===cur);s.setAttribute('aria-hidden',k===cur?'false':'true')});tb.forEach(function(t,k){t.classList.remove('on');t.removeAttribute('aria-current');if(k===cur){void t.offsetWidth;t.classList.add('on');t.setAttribute('aria-current','true')}});restart()};
 var restart=function(){clearTimeout(tm);if(!paused&&!still())tm=setTimeout(function(){go(cur+1)},6500)};
 tb.forEach(function(t,k){t.addEventListener('click',function(){go(k)})});
 var hp=$('#hp');
 if(hp)hp.addEventListener('click',function(){paused=!paused;hp.setAttribute('aria-pressed',paused);hp.dataset.al=paused?'تشغيل العرض التلقائي|Play slideshow':'إيقاف العرض التلقائي|Pause slideshow';applyAl();hero.classList.toggle('paused',paused);$('#hpi').innerHTML=paused?'<path d="M7 4l13 8-13 8z"/>':'<path d="M8 5v14M16 5v14"/>';restart()});
 document.addEventListener('mq-motion',restart);restart();
 var lazy=function(){$$('.bg[data-bg]').forEach(function(b){b.style.backgroundImage='url('+b.dataset.bg+')';b.removeAttribute('data-bg')})};
 addEventListener('load',function(){setTimeout(lazy,300)});setTimeout(lazy,2500);
 /* the V notch under the hero follows the pointer along the hero's lower edge and the ticker */
 var nx=innerWidth/2,tgt=nx,raf=0,tick=$('.tick');
 var move=function(){nx+=(tgt-nx)*.18;H.style.setProperty('--nx',nx.toFixed(1)+'px');if(Math.abs(tgt-nx)>.5)raf=requestAnimationFrame(move);else raf=0};
 var aim=function(x){tgt=Math.max(60,Math.min(innerWidth-60,x));if(still()){nx=tgt;H.style.setProperty('--nx',nx+'px')}else if(!raf)raf=requestAnimationFrame(move)};
 var zone=function(e){var r=hero.getBoundingClientRect();return e.clientY>r.bottom-150&&e.clientY<r.bottom+90};
 H.style.setProperty('--nx','50%');
 addEventListener('pointermove',function(e){if(e.pointerType==='touch')return;if(zone(e))aim(e.clientX)},{passive:true});
 if(tick)tick.addEventListener('pointerleave',function(){aim(innerWidth/2)});
}
var tickEl=$('#tick');
if(tickEl){
 var T={ar:['أرضيات الخرسانة','الأرضيات الراتنجية','إصلاح الخرسانة','العزل المائي والحراري','المعيار الأوروبي TR.34','التسوية بآلات الليزر','فريق إصلاح معتمد','FM1 · FM2 · FM3'],en:['Concrete flooring','Resinous flooring','Concrete repair','Waterproofing and thermal insulation','European code TR.34','Laser screeding machines','Certified repair team','FM1 · FM2 · FM3']};
 var bt=function(){var a=T[H.lang==='ar'?'ar':'en'].map(function(x){return'<span>'+x+'</span>'}).join('');tickEl.innerHTML=a+a+a+a};
 bt();document.addEventListener('mq-lang',bt)}
/* systems tabs with sliding indicator */
var st=$$('.stabs [role=tab]');
if(st.length){
 var ind=$('.ind'),pn=$$('.pane');
 var place=function(t){if(!ind||!t)return;var p=t.parentNode,rtl=H.dir==='rtl',off=rtl?-(p.clientWidth-(t.offsetLeft+t.offsetWidth)):t.offsetLeft;ind.style.width=t.offsetWidth+'px';ind.style.transform='translateX('+off+'px)'};
 var sel=function(t){st.forEach(function(x){var on=x===t;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1});pn.forEach(function(p,k){p.classList.toggle('on',k===st.indexOf(t))});place(t)};
 st.forEach(function(t){t.addEventListener('click',function(){sel(t)});t.addEventListener('keydown',function(e){var d=e.key==='ArrowRight'?(H.dir==='rtl'?-1:1):e.key==='ArrowLeft'?(H.dir==='rtl'?1:-1):0;if(d){var n=st[(st.indexOf(t)+d+st.length)%st.length];n.focus();sel(n);e.preventDefault()}})});

 sel(st[0]);addEventListener('resize',function(){place($('.stabs [aria-selected=true]'))});document.addEventListener('mq-lang',function(){setTimeout(function(){place($('.stabs [aria-selected=true]'))},30)});
}
/* process: scroll driven (desktop), click or timer (small screens). Geometry is cached, nothing is measured per frame. */
var proc=$('#proc');
if(proc){
 var rws=[].slice.call(document.querySelectorAll('#rows .rw')),pvi=$$('#pv img'),pa=-1,top0=0,tot=1,ptm,desk=function(){return innerWidth>1020};
 var geo=function(){top0=proc.getBoundingClientRect().top+scrollY;tot=Math.max(1,proc.offsetHeight-innerHeight)};
 var show=function(i){if(i===pa)return;pa=i;rws.forEach(function(r,k){r.classList.toggle('on',k===i);r.classList.toggle('seen',k<i);r.setAttribute('aria-expanded',k<=i)});pvi.forEach(function(m,k){m.classList.toggle('on',k===i)});
  var t=rws[i].dataset.t.split('|');$('#pvn').textContent='0'+(i+1)+' / 0'+rws.length;$('#pvt').textContent=H.lang==='ar'?t[0]:t[1];var s=$('#spn');if(s)s.textContent='0'+(i+1)+' / 0'+rws.length};
 var pf=-1,pk=false;
 var prog=function(){pk=false;if(!desk())return;var p=Math.max(0,Math.min(1,(scrollY-top0)/tot)),x=p*rws.length,i=Math.min(rws.length-1,Math.floor(x));show(i);
  var f=(x-i).toFixed(2);if(f!==pf){pf=f;rws.forEach(function(w,k){w.style.setProperty('--f',k<i?1:k===i?f:0)});proc.style.setProperty('--tp',p.toFixed(2))}};
 addEventListener('scroll',function(){if(!pk){pk=true;requestAnimationFrame(prog)}},{passive:true});
 addEventListener('resize',function(){geo();prog()});
 var autoRows=function(){clearTimeout(ptm)};
 var vis=null;
 var watch=function(){if(vis){vis.disconnect();vis=null}if(desk()||!('IntersectionObserver' in window))return;vis=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)show(rws.indexOf(e.target))})},{rootMargin:'-42% 0px -48% 0px'});rws.forEach(function(r){vis.observe(r)})};
 watch();addEventListener('resize',watch);
 rws.forEach(function(r,k){r.setAttribute('role','button');r.tabIndex=0;
  var act=function(){if(desk())scrollTo({top:top0+tot*(k+.5)/rws.length,behavior:still()?'auto':'smooth'});else{show(k);autoRows()}};
  r.addEventListener('click',act);r.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();act()}})});
 geo();show(0);prog();autoRows();addEventListener('resize',autoRows);document.addEventListener('mq-motion',autoRows);
 document.addEventListener('mq-lang',function(){var c=pa;pa=-1;show(c<0?0:c)});
 addEventListener('load',geo);
}
/* projects rail: arrows, drag, clickable segmented progress, counter, autoplay (off when motion is off) */
var rail=$('#rail');
if(rail){
 var cards=$$('.pc',rail),segs=$('#segs'),pgn=$('#pgn'),cur2=0,ato,dur=5000,moved=false,over=false;
 var segsEls=[];
 cards.forEach(function(c,i){var b=document.createElement('button');b.className='seg';b.type='button';b.setAttribute('aria-label',(H.lang==='ar'?'المشروع ':'Project ')+(i+1));b.innerHTML='<i></i>';b.addEventListener('click',function(){goTo(i)});segs.appendChild(b);segsEls.push(b)});
 var rtl=function(){return H.dir==='rtl'};
 var nearest=function(){var r=rail.getBoundingClientRect(),best=0,bd=1e9;cards.forEach(function(c,i){var d=Math.abs((rtl()?c.getBoundingClientRect().right-r.right:c.getBoundingClientRect().left-r.left));if(d<bd){bd=d;best=i}});return best};
 var mark=function(i){cur2=i;segsEls.forEach(function(s,k){s.classList.remove('on','done');if(k<i)s.classList.add('done');if(k===i){void s.offsetWidth;s.style.setProperty('--dur',dur+'ms');s.classList.add('on');s.setAttribute('aria-current','true')}else s.removeAttribute('aria-current')});
  pgn.textContent=('0'+(i+1)).slice(-2)+' / '+('0'+cards.length).slice(-2);arm()};
 var inV=false;if('IntersectionObserver' in window)new IntersectionObserver(function(es){inV=es[0].isIntersecting;if(inV)arm();else clearTimeout(ato)},{threshold:.35}).observe(rail);
 var goTo=function(i){i=(i+cards.length)%cards.length;var r=rail.getBoundingClientRect(),c=cards[i].getBoundingClientRect(),d=rtl()?c.right-r.right:c.left-r.left;rail.scrollTo({left:rail.scrollLeft+d,behavior:still()?'auto':'smooth'});mark(i)};
 var arm=function(){clearTimeout(ato);if(still()||over||!inV||innerWidth<=700)return;ato=setTimeout(function(){goTo(cur2+1)},dur)};
 var sc=false;rail.addEventListener('scroll',function(){if(sc)return;sc=true;requestAnimationFrame(function(){sc=false;var n=nearest();if(n!==cur2)mark(n)})},{passive:true});
 var nx2=$('#nx'),pv2=$('#prv');if(nx2)nx2.addEventListener('click',function(){goTo(cur2+1)});if(pv2)pv2.addEventListener('click',function(){goTo(cur2-1)});
 var down=false,sx,ss;
 rail.addEventListener('pointerdown',function(e){if(e.pointerType==='touch')return;down=true;moved=false;sx=e.clientX;ss=rail.scrollLeft});
 addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx;if(Math.abs(dx)>5){moved=true;rail.classList.add('drag')}rail.scrollLeft=ss-dx});
 addEventListener('pointerup',function(){down=false;rail.classList.remove('drag')});
 [rail,segs].forEach(function(el){el.addEventListener('mouseenter',function(){over=true;clearTimeout(ato);$$('.seg.on').forEach(function(s){s.style.animationPlayState='paused'})});el.addEventListener('mouseleave',function(){over=false;mark(cur2)});el.addEventListener('focusin',function(){over=true;clearTimeout(ato)});el.addEventListener('focusout',function(){over=false;arm()})});
 document.addEventListener('mq-motion',function(){mark(cur2)});
 mark(0);
 window.__mqMoved=function(){var m=moved;moved=false;return m};
}
var lbx=$('#lx');
/* one lightbox for every content photo on every page */
(function(){
 var lb=$('#lb');if(!lb)return;var li=$('img',lb),last=null;
 var ok=function(im){return im.closest('main')&&!im.closest('.a-logos,#pre,button,.stabs,.series,.sys .stabs')&&!(im.closest('a[href]')&&!im.closest('[data-lb]'))&&(im.getAttribute('width')|0)>=300};
 var src=function(el){var a=el.closest('[data-lb]');if(a)return a.dataset.lb;return el.currentSrc||el.src};
 var open=function(el){var im=el.tagName==='IMG'?el:$('img',el);last=el;li.removeAttribute('width');li.removeAttribute('height');li.src=src(el);li.alt=im?im.alt:'';lb.classList.add('on');lb.setAttribute('aria-hidden','false');$('#lx').focus()};
 $$('main img').forEach(function(im){if(ok(im)&&!im.closest('[data-lb]')){im.style.cursor='zoom-in';im.setAttribute('tabindex','0');im.setAttribute('role','button')}});
 document.addEventListener('click',function(e){
  var t=e.target.closest('[data-lb]')||(e.target.tagName==='IMG'&&ok(e.target)?e.target:null);
  if(!t)return;
  if(typeof window.__mqMoved==='function'&&window.__mqMoved())return;
  e.preventDefault();open(t)});
 document.addEventListener('keydown',function(e){if((e.key==='Enter'||e.key===' ')&&e.target.tagName==='IMG'&&e.target.getAttribute('role')==='button'){e.preventDefault();open(e.target)}});
 lb.addEventListener('transitionend',function(){});
 var cl=function(){if(last&&lb.classList.contains('on')){try{last.focus()}catch(x){}}};
 $('#lx').addEventListener('click',cl);
})();
if(lbx){var lb2=$('#lb');var cl=function(){if(!lb2.classList.contains('on'))return;lb2.classList.remove('on');lb2.setAttribute('aria-hidden','true')};lbx.addEventListener('click',cl);lb2.addEventListener('click',function(e){if(e.target===lb2)cl()});addEventListener('keydown',function(e){if(e.key==='Escape')cl()})}
/* quality dialogs: content lives in the card (.mc), so it stays in the HTML for crawlers */
var mod=$('#mod');
if(mod){
 var lastM=null,mh=$('#mh'),mp=$('#mp');
 var openM=function(w){lastM=w;mh.innerHTML=$('.mt',w).innerHTML;mp.innerHTML=$('.mc',w).innerHTML;mod.classList.add('on');mod.setAttribute('aria-hidden','false');$('#mx').focus()};
 var closeM=function(){if(!mod.classList.contains('on'))return;mod.classList.remove('on');mod.setAttribute('aria-hidden','true');if(lastM)lastM.focus()};
 $$('.wi').forEach(function(w){w.addEventListener('click',function(){openM(w)});w.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openM(w)}})});
 $('#mx').addEventListener('click',closeM);mod.addEventListener('click',function(e){if(e.target===mod)closeM()});
 addEventListener('keydown',function(e){if(e.key==='Escape')closeM()});
 mod.addEventListener('keydown',function(e){if(e.key==='Tab'){var f=$$('button,a[href]',mod);if(!f.length)return;var a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){z.focus();e.preventDefault()}else if(!e.shiftKey&&document.activeElement===z){a.focus();e.preventDefault()}}});
}
/* logo marquees: duplicated list for a seamless loop */
var m1=$('#m1'),m2=$('#m2');
if(m1&&m2){
 var build=function(el,ids){var h=ids.map(function(i){return'<div class="lg"><img src="assets/img/logos/'+i+'.webp" alt="" loading="lazy" decoding="async"></div>'}).join('');$('.tr',el).innerHTML=h+h};
 var P=[],C=[];for(var r=0;r<4;r++)for(var c=0;c<5;c++){P.push('p'+r+c);C.push('c'+r+c)}for(r=0;r<4;r++)for(c=0;c<5;c++)C.push('d'+r+c);
 build(m1,P);build(m2,C)}
})();
