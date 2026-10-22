(function(){
'use strict';
var f=document.getElementById('cf');if(!f)return;
var H=document.documentElement,TO='info@maqamalemaar.com',WA='966549566027';
var $=function(s){return document.querySelector(s)};
var M={
 req:{ar:'هذا الحقل مطلوب.',en:'This field is required.'},
 email:{ar:'أدخل بريداً إلكترونياً صحيحاً، مثل name@example.com.',en:'Enter a valid email address, for example name@example.com.'},
 tel:{ar:'أدخل رقم هاتف صحيحاً، أرقام فقط مع رمز الدولة إن وجد.',en:'Enter a valid phone number, digits only, with the country code if you have one.'},
 sumT:{ar:'يوجد خطأ في النموذج. صحّح الحقول التالية:',en:'There is a problem with the form. Please correct these fields:'},
 stMail:{ar:'تم فتح البريد. إن لم يفتح، راسلنا على info@maqamalemaar.com.',en:'Your email app is open. If not, write to info@maqamalemaar.com.'},
 stWa:{ar:'تم فتح واتساب.',en:'WhatsApp is open.'},
 stSending:{ar:'جارٍ الإرسال...',en:'Sending...'},
 stOk:{ar:'تم إرسال استفسارك بنجاح. سنتواصل معك قريباً.',en:'Your enquiry was sent. We will get back to you soon.'},
 stLimit:{ar:'أرسلت عدة رسائل خلال وقت قصير. حاول لاحقاً أو راسلنا على واتساب.',en:'Too many messages in a short time. Try later or message us on WhatsApp.'},
 body:{ar:'السلام عليكم،',en:'Hello,'}
};
var order=['name','phone','email','msg'];
var need={name:1,phone:1};
var state={errs:{},st:''},T0=Date.now();
function L(){return H.lang==='en'?'en':'ar'}
function t(k){return M[k][L()]}
function labelOf(id){var l=id==='svc'?document.getElementById('svc-l'):f.querySelector('label[for='+id+']');if(!l)return id;var s=l.querySelector('.'+L());return (s||l).textContent.replace(/\s*\*\s*$/,'').trim()}
function valOf(id){if(id==='svc'){var r=f.querySelector('input[name=svc]:checked');return r?r.nextElementSibling.querySelector('.'+L()).textContent.trim():''}var e=document.getElementById(id);if(!e)return '';if(e.tagName==='SELECT'){var o=e.options[e.selectedIndex];return o&&o.value?o.textContent.trim():''}return e.value.trim()}
function opts(){[].forEach.call(f.querySelectorAll('option[data-ar]'),function(o){o.textContent=o.getAttribute('data-'+L())})}
function check(id){
 var v=valOf(id);
 if(need[id]&&!v)return 'req';
 if(id==='email'&&v&&!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v))return 'email';
 if(id==='phone'&&v&&!/^\+?[0-9\s\-().]{7,20}$/.test(v))return 'tel';
 return '';
}
function paint(){
 order.forEach(function(id){
  var e=document.getElementById(id),p=document.getElementById(id+'-e'),k=state.errs[id];
  if(!e||!p)return;
  if(k){e.setAttribute('aria-invalid','true');p.textContent=(L()==='ar'?'خطأ: ':'Error: ')+t(k)}
  else{e.removeAttribute('aria-invalid');p.textContent=''}
 });
 var s=document.getElementById('st');if(s)s.textContent=state.st?t(state.st):'';
}
function summary(focus){
 var ids=order.filter(function(i){return state.errs[i]});
 if(focus&&ids.length){var e=document.getElementById(ids[0]);if(e)e.focus()}
}
function validate(){
 state.errs={};var any=false;
 order.forEach(function(id){var k=check(id);if(k){state.errs[id]=k;any=true}});
 paint();summary(true);return !any;
}
function text(){
 var lines=[t('body'),''];
 order.forEach(function(id){var v=valOf(id);if(v)lines.push(labelOf(id)+': '+v)});
 return {subject:(L()==='ar'?'طلب تواصل':'Contact request')+(valOf('svc')?' - '+valOf('svc'):'')+' - '+valOf('name'),body:lines.join('\n')};
}
function raw(id){var e=document.getElementById(id);return e?e.value.trim():''}
function mailto(){var x=text();state.st='stMail';paint();window.location.href='mailto:'+TO+'?subject='+encodeURIComponent(x.subject)+'&body='+encodeURIComponent(x.body)}
f.addEventListener('submit',function(e){
 e.preventDefault();state.st='';
 if(!validate())return;
 var btn=f.querySelector('button[type=submit]'),data={website:raw('website'),t:Date.now()-T0};
 order.forEach(function(id){data[id]=valOf(id)});
 btn.disabled=true;btn.setAttribute('aria-busy','true');state.st='stSending';paint();
 fetch('send.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})
  .then(function(r){return r.json().catch(function(){return {ok:false,error:'server'}})})
  .then(function(r){
   btn.disabled=false;btn.removeAttribute('aria-busy');
   if(r.ok){f.reset();opts();state.errs={};state.st='stOk';paint();var s=document.getElementById('st');if(s)s.focus();return}
   if(r.error==='fields'){(r.fields||[]).forEach(function(id){state.errs[id]=id==='email'?'email':id==='phone'?'tel':'req'});state.st='';paint();summary(true);return}
   if(r.error==='limit'){state.st='stLimit';paint();return}
   mailto(); // server could not send: fall back to the visitor's mail app
  })
  .catch(function(){btn.disabled=false;btn.removeAttribute('aria-busy');mailto()});
});
var wb=document.getElementById('wab');
if(wb)wb.addEventListener('click',function(){
 state.st='';
 if(!validate())return;
 var x=text();state.st='stWa';paint();
 window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(x.subject+'\n\n'+x.body),'_blank','noopener');
});
order.forEach(function(id){
 var e=document.getElementById(id);if(!e)return;
 e.addEventListener('blur',function(){
  if(!valOf(id)&&!state.errs[id])return;
  var k=check(id);if(k)state.errs[id]=k;else delete state.errs[id];
  paint();
 });
});
document.addEventListener('mq-lang',function(){opts();paint();});
opts();
})();
