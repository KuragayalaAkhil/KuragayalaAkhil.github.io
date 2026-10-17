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
