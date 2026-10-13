(function(){
'use strict';
var m=document.getElementById('nwm');if(!m)return;
var box=m.querySelector('.nwm-box'),fig=m.querySelector('.nwm-f'),meta=m.querySelector('.nwm-m'),ttl=document.getElementById('nwm-t'),con=m.querySelector('.nwm-c'),last=null;
function open(a){
 var art=a.closest('article');if(!art)return;last=a;
 var im=art.querySelector('img');fig.innerHTML='';if(im){var c=im.cloneNode();c.removeAttribute('loading');fig.appendChild(c)}
 meta.innerHTML=art.querySelector('.nw-meta').innerHTML;
 ttl.textContent=art.querySelector('.nw-t').textContent;
 var full=art.querySelector('.nw-full');
 con.innerHTML=full?full.innerHTML:'<p>'+art.querySelector('.nw-s').textContent+'</p>';
 m.classList.add('on');m.setAttribute('aria-hidden','false');document.documentElement.classList.add('nwm-open');
 box.scrollTop=0;box.focus();
}
function close(){if(!m.classList.contains('on'))return;m.classList.remove('on');m.setAttribute('aria-hidden','true');document.documentElement.classList.remove('nwm-open');if(last)last.focus()}
document.addEventListener('click',function(e){
 var a=e.target.closest('.nw-a');
 if(a){e.preventDefault();open(a);return}
 var art=e.target.closest('.nw-grid article');
 if(art){var l=art.querySelector('.nw-a');if(l){e.preventDefault();open(l)}}
});
m.addEventListener('click',function(e){if(e.target===m||e.target.closest('.nwm-x'))close()});
document.addEventListener('keydown',function(e){
 if(!m.classList.contains('on'))return;
 if(e.key==='Escape'){close();return}
 if(e.key==='Tab'){var f=[].slice.call(m.querySelectorAll('button,a[href]'));if(!f.length){e.preventDefault();return}var i=f.indexOf(document.activeElement);if(e.shiftKey&&(i<=0)){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}}
});
})();
