const menu=document.getElementById('menu'),nav=document.getElementById('nav');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-pressed','false')});btn.classList.add('active');btn.setAttribute('aria-pressed','true');document.querySelectorAll('.project').forEach(card=>card.hidden=btn.dataset.filter!=='all'&&!card.dataset.tags.split(' ').includes(btn.dataset.filter))}));document.getElementById('year').textContent=new Date().getFullYear();

// Progressive enhancement: content remains visible without JavaScript.
if("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches){const targets=document.querySelectorAll(".section-title,.project,.skill-card,.cert,.experience-card,.about-grid,.contact-box");const obs=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");obs.unobserve(e.target)}})},{threshold:.08,rootMargin:"0px 0px -25px 0px"});targets.forEach(el=>{el.classList.add("reveal");obs.observe(el)})}

// V5: lightweight scroll feedback, no external dependencies.
(()=>{const progress=document.createElement('div');progress.className='scroll-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);const back=document.createElement('a');back.className='back-to-top';back.href='#home';back.textContent='↑';back.setAttribute('aria-label','Back to top');document.body.append(back);const header=document.querySelector('.top');let ticking=false;function update(){const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max>0?scrollY/max:0})`;header?.classList.toggle('scrolled',scrollY>28);back.classList.toggle('show',scrollY>600);ticking=false}addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(update);ticking=true}},{passive:true});addEventListener('resize',update);update();})();

// Highlight current section in navigation.
if('IntersectionObserver' in window){const links=[...document.querySelectorAll('nav a[href^="#"]')];const sections=[...document.querySelectorAll('main section[id]')];const active=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))}})},{rootMargin:'-25% 0px -60% 0px'});sections.forEach(s=>active.observe(s))}

// V9: tasteful staggered reveals and a brief transition when filtering work.
if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  document.querySelectorAll('.project-grid,.skills-grid,.cert-grid').forEach(group=>{
    [...group.children].forEach((card,index)=>card.classList.add('stagger-'+(index%4)));
  });
  document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{
    document.querySelectorAll('.project:not([hidden])').forEach(card=>{
      card.classList.remove('filter-enter');void card.offsetWidth;card.classList.add('filter-enter');
    });
  }));
}


// V13 — editorial coverflow. One focused card, adjacent cards recede behind it.
(()=>{
 const groups=[['.project-grid','Projects'],['.skills-grid','Skills'],['.cert-grid','Certifications'],['.training-grid','Training']];
 const instances=[];
 for(const [selector,label] of groups){
  const track=document.querySelector(selector);if(!track)continue;
  const frame=document.createElement('div');frame.className='coverflow';frame.setAttribute('aria-label',label+' carousel');frame.setAttribute('role','region');frame.setAttribute('tabindex','0');
  track.parentNode.insertBefore(frame,track);frame.appendChild(track);track.classList.add('coverflow-track');
  const toolbar=document.createElement('div');toolbar.className='coverflow-toolbar';
  const prev=document.createElement('button');prev.type='button';prev.className='coverflow-arrow prev';prev.innerHTML='&#8592;';prev.setAttribute('aria-label','Previous '+label);
  const next=document.createElement('button');next.type='button';next.className='coverflow-arrow next';next.innerHTML='&#8594;';next.setAttribute('aria-label','Next '+label);
  const footer=document.createElement('div');footer.className='coverflow-footer';const dots=document.createElement('div');dots.className='coverflow-dots';dots.setAttribute('aria-label',label+' slides');const status=document.createElement('span');status.className='coverflow-status';status.setAttribute('aria-live','polite');
  footer.append(dots,status);toolbar.append(prev,next);frame.append(toolbar,footer);
  let index=0;let timer;
  const activeCards=()=>[...track.children].filter(c=>!c.hidden);
  function render(){const cards=activeCards();if(index>=cards.length)index=Math.max(0,cards.length-1);const total=cards.length;
   [...track.children].forEach(c=>{c.classList.remove('cf-active','cf-near','cf-far');c.style.removeProperty('--shift');c.style.removeProperty('--depth');c.style.removeProperty('--tilt');c.style.removeProperty('--layer');c.style.removeProperty('--alpha');c.setAttribute('aria-hidden','true');c.querySelectorAll('a,button').forEach(a=>a.setAttribute('tabindex','-1'));});
   cards.forEach((c,i)=>{let d=i-index;const abs=Math.abs(d);c.classList.add(abs===0?'cf-active':abs===1?'cf-near':'cf-far');c.style.setProperty('--shift',String(d));c.style.setProperty('--depth',String(Math.min(abs,3)));c.style.setProperty('--tilt',String(d===0?0:d<0?1:-1));c.style.setProperty('--layer',String(total-abs));c.style.setProperty('--alpha',String(abs>2?0:1));c.setAttribute('aria-hidden',String(abs!==0));c.inert=abs!==0;c.querySelectorAll('a,button').forEach(a=>{if(abs===0)a.removeAttribute('tabindex')});});
   dots.replaceChildren();cards.forEach((c,i)=>{const b=document.createElement('button');b.type='button';b.className='coverflow-dot'+(i===index?' selected':'');b.setAttribute('aria-label','Show '+label+' '+(i+1));b.setAttribute('aria-current',String(i===index));b.addEventListener('click',()=>go(i));dots.append(b)});
   status.textContent=String(index+1).padStart(2,'0')+' / '+String(total).padStart(2,'0');prev.disabled=index===0;next.disabled=index===total-1;frame.classList.toggle('single',total<=1);
  }
  function go(n){index=Math.max(0,Math.min(activeCards().length-1,n));render();}
  prev.addEventListener('click',()=>go(index-1));next.addEventListener('click',()=>go(index+1));
  frame.addEventListener('keydown',e=>{if(e.target.closest('a,input,textarea'))return;if(e.key==='ArrowRight'){e.preventDefault();go(index+1)}if(e.key==='ArrowLeft'){e.preventDefault();go(index-1)}});
  let startX=null;frame.addEventListener('touchstart',e=>{startX=e.changedTouches[0].screenX},{passive:true});frame.addEventListener('touchend',e=>{if(startX===null)return;const dx=e.changedTouches[0].screenX-startX;if(Math.abs(dx)>55)go(index+(dx<0?1:-1));startX=null},{passive:true});
  instances.push({render,reset:()=>{index=0;render()}});render();
 }
 document.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',()=>requestAnimationFrame(()=>instances[0]?.reset())));
})();
