const $=s=>document.querySelector(s);
function createArrow(){const ns='http://www.w3.org/2000/svg';const icon=document.createElementNS(ns,'svg');icon.setAttribute('class','arrow-icon');icon.setAttribute('viewBox','0 0 24 24');icon.setAttribute('width','16');icon.setAttribute('height','16');icon.setAttribute('aria-hidden','true');icon.setAttribute('focusable','false');const path=document.createElementNS(ns,'path');path.setAttribute('d','M5 19 19 5M5 5h14v14');icon.append(path);return icon;}
$('#year').textContent=new Date().getFullYear();
const menu=$('.menu'),nav=$('#navigation');
function closeNavigation(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',open);menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');nav.classList.toggle('open',open)});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeNavigation));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){closeNavigation();menu.focus();}});
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const dialog=$('#video-dialog'),player=dialog.querySelector('video');
const media=window.WEBAR_MEDIA||{projects:[]};
let returnFocus;
function openVideo(project){returnFocus=document.activeElement;document.querySelectorAll('video').forEach(v=>v.pause());$('#video-title').textContent=project.title;$('#video-description').textContent=[project.client,project.role,project.description].filter(Boolean).join(' / ');player.src=project.full||project.preview;dialog.showModal();document.body.style.overflow='hidden';player.play().catch(()=>{});}
$('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const b=dialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)dialog.close()}});
dialog.addEventListener('close',()=>{player.pause();player.removeAttribute('src');player.load();document.body.style.overflow='';returnFocus?.focus();});const categoryTargets={
  'podcast-trailer':$('#podcast-trailer-grid'),
  'talking-head':$('#talking-head-grid'),
  documentary:$('#documentary-grid'),
  reels:$('#reels-grid')
};
const projectItems=[
  ...(media.highlights||[]).map(p=>({...p,category:'podcast-trailer'})),
  ...(media.projects||[]),
  ...(media.shortForm?.preview||media.shortForm?.full?[{...media.shortForm,category:'reels'}]:[])
].filter(p=>p.title&&(p.preview||p.full)&&p.poster);
function makeProjectCard(p){
  const card=document.createElement('button');card.className='project';card.type='button';
  const img=document.createElement('img');img.src=p.poster;img.alt=p.title;img.loading='lazy';card.append(img);
  const src=p.preview||p.full;
  if(src){const v=document.createElement('video');v.dataset.src=src;v.muted=true;v.loop=true;v.playsInline=true;v.preload='none';v.hidden=true;card.append(v);card.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'&&!reduced.matches){img.hidden=true;v.hidden=false;if(!v.src)v.src=v.dataset.src;v.play().catch(()=>{img.hidden=false;v.hidden=true;});}});card.addEventListener('pointerleave',()=>{v.pause();v.hidden=true;img.hidden=false;});}
  const title=document.createElement('h3');title.textContent=p.title+' ';title.append(createArrow());
  const caption=document.createElement('p');caption.textContent=[p.client,p.role].filter(Boolean).join(' / ');card.append(title,caption);
  card.addEventListener('click',()=>openVideo(p));return card;
}
for(const p of projectItems){const target=categoryTargets[p.category];if(target)target.append(makeProjectCard(p));}
for(const target of Object.values(categoryTargets)){if(!target.children.length){const empty=document.createElement('div');empty.className='category-empty';empty.textContent='More work coming soon';target.append(empty);}}$('#enquiry').addEventListener('submit',e=>{e.preventDefault();if(!e.currentTarget.reportValidity())return;const f=new FormData(e.currentTarget);const brief=`Hello Emmanuel, I’d like to discuss a project.\n\nName: ${f.get('name')}\nEmail: ${f.get('email')}\nChannel: ${f.get('channel')||'Not provided'}\nServices: ${f.getAll('service').join(', ')||'To discuss'}\n\nProject: ${f.get('details')}\nTimeline: ${f.get('timeline')||'To discuss'}`;const url='https://wa.me/2348123051817?text='+encodeURIComponent(brief);const win=window.open(url,'_blank','noopener,noreferrer');$('#form-status').replaceChildren();const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.textContent='Open your prepared brief in WhatsApp ';a.append(createArrow());a.className='text-link';$('#form-status').append(a);});
