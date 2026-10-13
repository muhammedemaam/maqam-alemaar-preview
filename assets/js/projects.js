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
   o.area=num(o.qty);o.hay=(o.title+' '+o.client+' '+o.contractor+' '+o.scope+' '+o.code).toLowerCase();
   data.push(o);
  });
 });
 if(!data.length)return;
 var T={
  all:['الكل','All'],c:['أرضيات الخرسانة','Concrete flooring'],e:['الأرضيات الراتنجية','Resinous flooring'],r:['إصلاح الخرسانة','Concrete repair'],w:['العزل المائي','Waterproofing'],p:['أعمال سابقة','Earlier works'],
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
 function card(o,feat){
  var chips='<span class="pj-c">'+esc(L(gl[o.g]))+'</span>'+(o.code?'<span class="pj-code" dir="ltr">'+esc(o.code)+'</span>':'')+(o.st?'<span class="pj-st '+o.st+'">'+esc(L(o.st==='w1'?'done':'run'))+'</span>':'');
  var meta='';
  if(o.client)meta+='<div><dt>'+esc(L('client'))+'</dt><dd lang="en" dir="ltr">'+esc(o.client)+'</dd></div>';
  if(o.contractor&&!feat)meta+='<div><dt>'+esc(L('contractor'))+'</dt><dd lang="en" dir="ltr">'+esc(o.contractor)+'</dd></div>';
  var area=o.area?'<div class="pj-a"><b dir="ltr">'+fmt(o.area)+'</b><span>m²</span></div>':(o.qty?'<div class="pj-a sm"><span dir="ltr">'+esc(o.qty)+'</span></div>':'');
  return '<article class="pjc'+(feat?' feat':'')+' g-'+o.g+'"><div class="pj-top">'+chips+'</div><h3 lang="en" dir="ltr">'+esc(o.title)+'</h3>'+(o.scope?'<p class="pj-sc" lang="en" dir="ltr">'+esc(o.scope)+'</p>':'')+'<dl>'+meta+'</dl>'+area+'</article>';
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
