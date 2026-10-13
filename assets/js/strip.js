(function(){var s=document.querySelector('.topstrip');if(!s)return;var r=document.documentElement;
function f(){r.style.setProperty('--tsh',s.offsetHeight+'px')}
f();addEventListener('resize',f);addEventListener('load',f);document.addEventListener('mq-lang',f);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(f);})();
