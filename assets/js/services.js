/* Services page: the four services are tabs (same pattern as the home page). Without JS every section stays visible. */
(function(){
 var nav=document.querySelector('.sv-nav');if(!nav)return;
 var tabs=[].slice.call(nav.querySelectorAll('a[href^="#"]'));
 var secs=tabs.map(function(a){return document.getElementById(a.getAttribute('href').slice(1))});
 if(!tabs.length||secs.some(function(s){return!s}))return;
 nav.setAttribute('role','tablist');
 tabs.forEach(function(a,i){
  a.setAttribute('role','tab');a.id='svt-'+i;a.setAttribute('aria-controls',secs[i].id);
  secs[i].setAttribute('role','tabpanel');secs[i].setAttribute('aria-labelledby','svt-'+i);
  a.addEventListener('click',function(e){e.preventDefault();show(i,true);history.replaceState(null,'','#'+secs[i].id)});
  a.addEventListener('keydown',function(e){
   var rtl=document.documentElement.dir==='rtl',n=i;
   if(e.key==='ArrowRight')n=i+(rtl?-1:1);else if(e.key==='ArrowLeft')n=i+(rtl?1:-1);else if(e.key==='Home')n=0;else if(e.key==='End')n=tabs.length-1;else return;
   e.preventDefault();show((n+tabs.length)%tabs.length,true)});
 });
 function show(k,focus){
  tabs.forEach(function(a,i){var on=i===k;a.setAttribute('aria-selected',on);a.tabIndex=on?0:-1;secs[i].hidden=!on;});
  if(focus)tabs[k].focus();
 }
 function fromHash(scroll){
  var id=decodeURIComponent(location.hash.slice(1)),k=0,target=null;
  if(id){target=document.getElementById(id);
   secs.forEach(function(s,i){if(s.id===id||(target&&s.contains(target)))k=i})}
  show(k,false);
  if(scroll&&id){requestAnimationFrame(function(){var el=target&&!secs.includes(target)?target:nav;var y=el.getBoundingClientRect().top+scrollY-110;window.scrollTo({top:y,behavior:'auto'})})}
 }
 window.addEventListener('hashchange',function(){fromHash(true)});
 fromHash(true);
})();
