/* Projects: built from the tables in the HTML (they stay for crawlers / no-JS).
   Default view = featured + one horizontal rail per category (short page).
   Filter or search = paged grid with numbered pagination. */
(function(){
 var H=document.documentElement;
 var src=[['t-l','l'],['t-e','e'],['t-r','r'],['t-w1','w1'],['t-w2','w2'],['t-w3','w3']];
 var data=[];
 function num(s){var m=/([\d][\d,]*)\s*(?:m2|m²)/i.exec(s||'');return m?parseInt(m[1].replace(/,/g,''),10):0}
 src.forEach(function(p){
  var t=document.getElementById(p[0]);if(!t)return;
  [].forEach.call(t.querySelectorAll('tbody tr'),function(tr){
   var th=tr.querySelector('th'),td=[].map.call(tr.querySelectorAll('td'),function(x){return x.textContent.replace(/\s+/g,' ').trim()});
   var o={g:p[1],code:'',title:'',client:'',scope:'',contractor:'',qty:'',st:''};
   if('ler'.indexOf(p[1])>-1){o.code=th?th.textContent.trim():'';o.title=td[0];o.scope=td[1];o.client=td[2];o.qty=td[3]}
   else if(p[1]==='w1'||p[1]==='w2'){o.client=td[0];o.contractor=td[1];o.title=td[2];o.st=p[1]}
   else{o.title=td[0];o.client=td[1];o.contractor=td[2];o.qty=td[3]}
   try{o.ph=JSON.parse(tr.getAttribute('data-ph')||'[]')}catch(e){o.ph=[]}o.i=data.length;o.cl=tr.getAttribute('data-cl')||'';o.co=tr.getAttribute('data-co')||'';
   o.area=num(o.qty);o.hay=(o.title+' '+o.client+' '+o.contractor+' '+o.scope+' '+o.code).toLowerCase();
   data.push(o);
  });
 });
 if(!data.length)return;
 var T={
  photos:['صور المشروع (%n)','Project photos (%n)'],show:['عرض الصور','View photos'],close:['إغلاق','Close'],prev:['السابقة','Previous'],next:['التالية','Next'],
  all:['الكل','All'],c:['أرضيات الخرسانة','Concrete flooring'],e:['أرضيات الإيبوكسي','Epoxy flooring'],r:['إصلاح الخرسانة','Concrete repair'],w:['العزل المائي','Waterproofing'],p:['أعمال سابقة','Earlier works'],
  done:['مكتمل','Completed'],run:['قيد التنفيذ','Running'],search:['ابحث باسم المشروع أو العميل أو المقاول','Search by project, client or contractor'],
  big:['أكبر المشاريع بالمساحة','Largest projects by area'],count:['%a مشروعاً','%a projects'],none:['لا توجد نتائج مطابقة.','No matching projects.'],
  client:['العميل','Client'],contractor:['المقاول','Contractor'],prev:['السابق','Previous'],next:['التالي','Next'],page:['صفحة','Page'],
  scrollp:['السابق','Previous'],scrolln:['التالي','Next']
 };
 var filters=[['all',null],['c',['l']],['e',['e']],['r',['r']],['w',['w1','w2']],['p',['w3']]];
 var gl={l:'c',e:'e',r:'r',w1:'w',w2:'w',w3:'p'};
 function L(k){return T[k][H.lang==='en'?1:0]}
 function esc(s){return String(s||'').replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
 function fmt(n){return n.toLocaleString('en-US')}
 var host=document.querySelector('.series');if(!host)return;
 var mount=document.createElement('div');mount.className='pj';mount.id='pj';
 mount.innerHTML='<div class="pj-bar"><label class="pj-s"><span class="sr" id="pj-sl"></span><input type="search" id="pj-q" autocomplete="off"></label><div class="pj-f" id="pj-f" role="group"></div></div><div id="pj-out"></div>';
 host.parentNode.insertBefore(mount,host);
 H.classList.add('pj-on');
 var cur=0,q='',page=0,PER=12;
 var elF=document.getElementById('pj-f'),elO=document.getElementById('pj-out'),elQ=document.getElementById('pj-q');
 /* photo gallery (lightbox) */
 var lb=null,lbList=[],lbAt=0,lbBack=null;
 function lbShow(){var p=lbList[lbAt],im=lb.querySelector('img');im.src=p[0];im.width=p[1];im.height=p[2];lb.querySelector('.lb-n').textContent=(lbAt+1)+' / '+lbList.length;var one=lbList.length<2;lb.querySelector('.lb-p').hidden=one;lb.querySelector('.lb-x2').hidden=one;
  [lbAt+1,lbAt-1].forEach(function(k){if(lbList[k]){var pre=new Image();pre.src=lbList[k][0]}})}
 function lbGo(d){lbAt=(lbAt+d+lbList.length)%lbList.length;lbShow()}
 function lbClose(){if(!lb)return;lb.remove();lb=null;document.removeEventListener('keydown',lbKey);H.style.overflow='';if(lbBack)lbBack.focus()}
 function lbKey(e){if(e.key==='Escape')lbClose();else if(e.key==='ArrowLeft')lbGo(H.dir==='rtl'?1:-1);else if(e.key==='ArrowRight')lbGo(H.dir==='rtl'?-1:1);else if(e.key==='Tab'){var f=lb.querySelectorAll('button:not([hidden])'),a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}}
 function lbOpen(o,btn){
  lbList=o.ph;lbAt=0;lbBack=btn;
  lb=document.createElement('div');lb.className='pj-lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label',L('photos').replace('%n',o.ph.length)+': '+o.title);
  lb.innerHTML='<div class="lb-top"><p class="lb-t" lang="en" dir="ltr">'+esc(o.title)+'</p><span class="lb-n" dir="ltr"></span><button type="button" class="lb-x" aria-label="'+esc(L('close'))+'"><i></i></button></div><div class="lb-st"><button type="button" class="lb-p" aria-label="'+esc(L('prev'))+'"><i></i></button><img alt=""><button type="button" class="lb-x2 lb-nx" aria-label="'+esc(L('next'))+'"><i></i></button></div>';
  document.body.appendChild(lb);H.style.overflow='hidden';
  lb.querySelector('.lb-x').onclick=lbClose;lb.querySelector('.lb-p').onclick=function(){lbGo(-1)};lb.querySelector('.lb-nx').onclick=function(){lbGo(1)};
  lb.addEventListener('click',function(e){if(e.target===lb||e.target.classList.contains('lb-st'))lbClose()});
  var sx=null;lb.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});lb.addEventListener('touchend',function(e){if(sx==null)return;var d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>40)lbGo((d<0?1:-1)*(H.dir==='rtl'?-1:1));sx=null});
  document.addEventListener('keydown',lbKey);lbShow();lb.querySelector('.lb-x').focus();
 }
 elO.addEventListener('click',function(e){var b=e.target.closest('.pj-ph');if(!b)return;var o=data[+b.getAttribute('data-i')];if(o&&o.ph&&o.ph.length)lbOpen(o,b)});
 function card(o,feat){
  var chips='<span class="pj-c">'+esc(L(gl[o.g]))+'</span>'+(o.code?'<span class="pj-code" dir="ltr">'+esc(o.code)+'</span>':'')+(o.st?'<span class="pj-st '+o.st+'">'+esc(L(o.st==='w1'?'done':'run'))+'</span>':'');
  var meta='';
  var lg=function(src){return src?'<img class="pj-lg" src="'+esc(src)+'" alt="" loading="lazy" decoding="async">':''};
  if(o.client)meta+='<div><dt>'+esc(L('client'))+'</dt><dd lang="en" dir="ltr">'+lg(o.cl)+esc(o.client)+'</dd></div>';
  if(o.contractor&&!feat)meta+='<div><dt>'+esc(L('contractor'))+'</dt><dd lang="en" dir="ltr">'+lg(o.co)+esc(o.contractor)+'</dd></div>';
  var area=o.area?'<div class="pj-a"><b dir="ltr">'+fmt(o.area)+'</b><span>m²</span></div>':(o.qty?'<div class="pj-a sm"><span dir="ltr">'+esc(o.qty)+'</span></div>':'');
  var ph=o.ph&&o.ph.length?'<button type="button" class="pj-ph" data-i="'+o.i+'" aria-label="'+esc(L('photos').replace('%n',o.ph.length)+': '+o.title)+'"><span class="pj-tn"><img src="'+esc(o.ph[0][0])+'" alt="" loading="lazy" decoding="async" width="'+o.ph[0][1]+'" height="'+o.ph[0][2]+'"><span class="pj-phn" aria-hidden="true">'+o.ph.length+'</span></span><span class="pj-pl" aria-hidden="true">'+esc(L('show'))+'</span></button>':'';
  return '<article class="pjc'+(feat?' feat':'')+(ph?' has-ph':'')+' g-'+o.g+'"><div class="pj-top">'+chips+'</div><h3 lang="en" dir="ltr">'+esc(o.title)+'</h3>'+(o.scope?'<p class="pj-sc" lang="en" dir="ltr">'+esc(o.scope)+'</p>':'')+'<dl>'+meta+'</dl>'+(ph?'<div class="pj-ft">'+area+ph+'</div>':area)+'</article>';
 }
 function view(){
  var g=filters[cur][1];
  if(!g&&!q){ // overview: featured + rails
   var feat=data.filter(function(o){return o.area>=40000}).sort(function(a,b){return b.area-a.area}).slice(0,3);
   var h='<h3 class="pj-h">'+esc(L('big'))+'</h3><div class="pj-bg">'+feat.map(function(o){return card(o,true)}).join('')+'</div>';
   filters.slice(1).forEach(function(f,i){
    var items=data.filter(function(o){return f[1].indexOf(o.g)>-1});
    h+='<section class="pj-rail" data-i="'+(i+1)+'"><div class="pj-rh"><h3>'+esc(L(f[0]))+' <span>'+esc(L('count').replace('%a',items.length))+'</span></h3><div class="pj-ra"><button type="button" data-d="1" aria-label="'+esc(L('scrollp'))+'"><i></i></button><button type="button" data-d="-1" aria-label="'+esc(L('scrolln'))+'"><i></i></button></div></div><div class="pj-rl" tabindex="0" role="region" aria-label="'+esc(L(f[0]))+'">'+items.map(function(o){return card(o,false)}).join('')+'</div></section>';
   });
   elO.innerHTML=h;
   [].forEach.call(elO.querySelectorAll('.pj-ra button'),function(b){b.addEventListener('click',function(){var rl=b.closest('.pj-rail').querySelector('.pj-rl');var d=+b.dataset.d;rl.scrollBy({left:d*(H.dir==='rtl'?-1:1)*-1*rl.clientWidth*.8,behavior:'smooth'})})});
   return;
  }
  var list=data.filter(function(o){return(!g||g.indexOf(o.g)>-1)&&(!q||o.hay.indexOf(q)>-1)});
  var pages=Math.max(1,Math.ceil(list.length/PER));if(page>=pages)page=pages-1;
  var slice=list.slice(page*PER,page*PER+PER);
  var h='<p class="pj-n" aria-live="polite">'+(list.length?esc(L('count').replace('%a',list.length)):esc(L('none')))+'</p><div class="pj-g">'+slice.map(function(o){return card(o,false)}).join('')+'</div>';
  if(pages>1){
   h+='<nav class="pj-pg" aria-label="'+esc(L('page'))+'"><button type="button" data-p="'+(page-1)+'" '+(page?'':'disabled')+' aria-label="'+esc(L('prev'))+'"><i class="r"></i></button>';
   for(var i=0;i<pages;i++)h+='<button type="button" data-p="'+i+'" '+(i===page?'aria-current="page"':'')+'>'+(i+1)+'</button>';
   h+='<button type="button" data-p="'+(page+1)+'" '+(page<pages-1?'':'disabled')+' aria-label="'+esc(L('next'))+'"><i class="l"></i></button></nav>';
  }
  elO.innerHTML=h;
  [].forEach.call(elO.querySelectorAll('.pj-pg button'),function(b){b.addEventListener('click',function(){page=+b.dataset.p;view();mount.scrollIntoView({block:'start'})})});
 }
 function ui(){
  elF.innerHTML='';filters.forEach(function(f,i){var b=document.createElement('button');b.type='button';b.textContent=L(f[0]);b.setAttribute('aria-pressed',i===cur);b.addEventListener('click',function(){cur=i;page=0;ui();view()});elF.appendChild(b)});
  elQ.placeholder=L('search');document.getElementById('pj-sl').textContent=L('search');
 }
 var t;elQ.addEventListener('input',function(){clearTimeout(t);t=setTimeout(function(){q=elQ.value.trim().toLowerCase();page=0;view()},160)});
 document.addEventListener('mq-lang',function(){ui();view()});
 ui();view();
})();
