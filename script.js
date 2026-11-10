(() => {
 'use strict';
 const WA='919745499443';
 const $=s=>document.querySelector(s);
 const root=document.documentElement;
 const button=$('#themeToggle'), themeName=$('#themeName');
 const modes=['auto','light','dark'];
 function currentMode(){return root.dataset.theme||'auto'}
 function applyMode(mode){if(mode==='auto'){delete root.dataset.theme;try{localStorage.removeItem('fly-theme')}catch(e){}}else{root.dataset.theme=mode;try{localStorage.setItem('fly-theme',mode)}catch(e){}}themeName.textContent=mode[0].toUpperCase()+mode.slice(1);button.setAttribute('title','Theme: '+mode+' (click to change)');button.setAttribute('aria-label','Theme: '+mode+'. Change theme');}
 applyMode(currentMode());
 button.addEventListener('click',()=>applyMode(modes[(modes.indexOf(currentMode())+1)%modes.length]));
 const menuBtn=$('#menuToggle'), nav=$('#mobileNav');
 function menu(open){menuBtn.setAttribute('aria-expanded',String(open));menuBtn.setAttribute('aria-label',open?'Close menu':'Open menu');nav.hidden=!open;document.body.classList.toggle('menu-open',open)}
 menuBtn.addEventListener('click',()=>menu(menuBtn.getAttribute('aria-expanded')!=='true'));
 nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu(false)));
 document.addEventListener('keydown',e=>{if(e.key==='Escape')menu(false)});
 window.addEventListener('resize',()=>{if(window.innerWidth>990)menu(false)});
 const date=$('#eventDate'),today=new Date(),pad=n=>String(n).padStart(2,'0');
 date.min=`${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}`;
 document.querySelectorAll('[data-service]').forEach(a=>a.addEventListener('click',()=>{$('#eventType').value=a.dataset.service}));
 const toast=$('#toast');let toastTimeout;
 function notify(s){toast.textContent=s;toast.classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>toast.classList.remove('show'),5500)}
 $('#bookingForm').addEventListener('submit',e=>{
  e.preventDefault();const f=e.currentTarget;if(!f.reportValidity())return;
  const d=new FormData(f);const value=k=>String(d.get(k)||'').trim();
  const phone=value('phone');if(!/^[+\d\s().-]{8,20}$/.test(phone)){notify('Please enter a valid contact phone number.');f.elements.phone.focus();return}
  const formattedDate=value('date')?new Date(value('date')+'T12:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'}):'Not specified';
  const lines=['Hello FLY Wedding Decors,','I would like to enquire about event decoration.','','Name: '+value('name'),'Phone: '+phone,'Event: '+value('event'),'Date: '+formattedDate,'Location: '+value('location')];
  if(value('budget'))lines.push('Estimated budget: '+value('budget'));
  if(value('details'))lines.push('Ideas / requirements: '+value('details'));
  lines.push('','Please share availability and details.');
  const url='https://wa.me/'+WA+'?text='+encodeURIComponent(lines.join('\n'));
  const w=window.open(url,'_blank','noopener,noreferrer');if(!w){window.location.href=url;return}notify('WhatsApp opened. Please send the message there to complete your enquiry.');
 });
 $('#year').textContent=String(new Date().getFullYear());
 let installPrompt=null;const install=$('#installButton');
 window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;install.title='Install FLY Wedding Decors'});
 window.addEventListener('appinstalled',()=>{installPrompt=null;notify('FLY Wedding Decors was installed.');});
 const standalone=()=>window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;
 install.addEventListener('click',async()=>{
  if(standalone()){notify('The website is already installed on this device.');return}
  if(installPrompt){const prompt=installPrompt;installPrompt=null;prompt.prompt();try{await prompt.userChoice}catch(e){}return}
  const ua=navigator.userAgent||'';
  if(/iphone|ipad|ipod/i.test(ua))notify('On iPhone: tap Share in Safari, then Add to Home Screen.');
  else if(/android/i.test(ua))notify('Open your browser menu (⋮) and choose Install app or Add to Home screen.');
  else notify('Open the browser menu and choose Install or Create shortcut. Install is supported on HTTPS.');
 });
 if('serviceWorker' in navigator && (location.protocol==='https:' || location.hostname==='localhost'))window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));
})();
