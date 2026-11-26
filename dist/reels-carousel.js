(()=>{
function initialize({trackId,prefix,label}){
 const track=document.querySelector(trackId);
 if(!track)return;
 const cards=[...track.querySelectorAll('.project')];
 if(!cards.length)return;
 const count=document.querySelector(`#${prefix}-count`);
 const dotsContainer=document.querySelector(`#${prefix}-dots`);
 const previous=document.querySelector(`#${prefix}-prev`);
 const next=document.querySelector(`#${prefix}-next`);
 const dots=[];
 let active=0,scrollTarget=null;
 const offset=index=>cards[index].offsetLeft-cards[0].offsetLeft;
 const update=()=>{
  count.textContent=`${String(active+1).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')}`;
  dots.forEach((dot,index)=>dot.setAttribute('aria-pressed',String(index===active)));
  previous.disabled=active===0;
  next.disabled=active===cards.length-1;
 };
 const goTo=index=>{
  active=Math.max(0,Math.min(cards.length-1,index));
  update();
  const left=Math.min(offset(active),track.scrollWidth-track.clientWidth);
  scrollTarget=Math.abs(track.scrollLeft-left)>2?left:null;
  track.scrollTo({left,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 };
 cards.forEach((card,index)=>{
  const dot=document.createElement('button');
  dot.type='button';
  dot.setAttribute('aria-label',`Go to ${label} ${index+1}: ${card.querySelector('h3')?.textContent||''}`);
  dot.addEventListener('click',()=>goTo(index));
  dotsContainer.append(dot);
  dots.push(dot);
 });
 track.addEventListener('scroll',()=>{
  if(scrollTarget!==null){if(Math.abs(track.scrollLeft-scrollTarget)<2)scrollTarget=null;return;}
  let nearest=0;
  cards.forEach((card,index)=>{if(Math.abs(offset(index)-track.scrollLeft)<Math.abs(offset(nearest)-track.scrollLeft))nearest=index;});
  active=nearest;
  update();
 },{passive:true});
 ['pointerdown','wheel','touchstart'].forEach(event=>track.addEventListener(event,()=>{scrollTarget=null;},{passive:true}));
 track.addEventListener('keydown',event=>{
  if(event.target!==track)return;
  if(event.key==='ArrowRight'){event.preventDefault();goTo(active+1);}
  if(event.key==='ArrowLeft'){event.preventDefault();goTo(active-1);}
  if(event.key==='Home'){event.preventDefault();goTo(0);}
  if(event.key==='End'){event.preventDefault();goTo(cards.length-1);}
 });
 previous.addEventListener('click',()=>goTo(active-1));
 next.addEventListener('click',()=>goTo(active+1));
 new ResizeObserver(()=>{track.scrollTo({left:Math.min(offset(active),track.scrollWidth-track.clientWidth),behavior:'instant'});update();}).observe(track);
 update();
}
initialize({trackId:'#advertisements-grid',prefix:'reels',label:'reel'});
initialize({trackId:'#shortform-grid',prefix:'documentary',label:'documentary'});
initialize({trackId:'#longform-grid',prefix:'talking-head',label:'talking head video'});
})();
