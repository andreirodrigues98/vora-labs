/* VORA — Cases: bilingual project pages, mobile navigation & drag. */
(() => {
  'use strict';
  const languageButtons = [...document.querySelectorAll('[data-case-language]')];
  const source = document.querySelector('.case-intro__name')?.textContent?.replace(/\.$/, '').trim() || 'Case';
  const langStore = 'vora-language';
  function language(lang) {
    const active = lang === 'en-US' ? 'en-US' : 'pt-BR';
    document.documentElement.lang = active;
    const key = active === 'en-US' ? 'en' : 'pt';
    document.querySelectorAll('[data-pt][data-en]').forEach(el => { el.textContent = el.dataset[key]; });
    languageButtons.forEach(b => { const on = b.dataset.caseLanguage === active; b.classList.toggle('is-current',on); b.setAttribute('aria-pressed',String(on)); });
    // A project keeps the same brand-first browser title in both languages.
    document.title = `Vora Labs — ${source === 'OnTable' ? 'Ontable' : source}`;
    try {localStorage.setItem(langStore,active);}catch {}
    document.dispatchEvent(new CustomEvent('vora:languagechange',{detail:{language:active}}));
  }
  languageButtons.forEach(b => b.addEventListener('click',()=>language(b.dataset.caseLanguage)));
  let stored='pt-BR';try {stored=localStorage.getItem(langStore)||'pt-BR';}catch{}
  language(stored);

  // The cases use the SAME .site-header/.mobile-menu structure and
  // header.js interactions as index.html. No competing dropdown menu here.

  // Per-section directions: subtle, alternate and only animate when seen.
  function initReveals() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const targets = [];
    const put = (selector, direction, step=0) => {
      document.querySelectorAll(selector).forEach((element,index) => {
        if (element.hasAttribute('data-case-reveal')) return;
        element.dataset.caseReveal = typeof direction === 'function' ? direction(index) : direction;
        element.style.setProperty('--case-reveal-delay', `${Math.min(index*step,360)}ms`);
        targets.push(element);
      });
    };
    put('.case-intro__top','down');
    put('.case-intro__name','up');
    put('.case-intro__grid > .case-section-label','left');
    put('.case-meta__row','right',65);
    put('.case-intro__copy h2','up');
    put('.case-intro__copy p','left');
    put('.case-visuals__heading','down');
    put('.case-visuals__item',index=>index%2?'right':'left',100);
    put('.case-story > .case-section-label',index=>index%2?'right':'left');
    put('.case-story__body p',index=>index%2?'left':'up');
    put('.case-details > .case-section-label','left');
    put('.case-details__content h2','up');
    put('.case-feature li','right',65);
    put('.case-related__head','down');
    put('.case-related__card','up',55);
    if (!targets.length || reduced.matches || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries=>{
      for(const entry of entries){
        if(!entry.isIntersecting)continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    },{threshold:0.1,rootMargin:'0px 0px -3% 0px'});
    document.body.classList.add('case-reveal-ready');
    targets.forEach(target=>observer.observe(target));
    reduced.addEventListener?.('change', event=>{
      if(!event.matches)return;
      observer.disconnect();
      targets.forEach(target=>target.classList.add('is-visible'));
      document.body.classList.remove('case-reveal-ready');
    });
  }
  initReveals();

  const rail=document.querySelector('#case-related-rail');
  if(!rail)return;
  let startX=0,startScroll=0,down=false,moved=false;
  rail.addEventListener('pointerdown',event=>{
    // Native touch swipe, keyboard and ordinary links remain untouched.
    if(event.pointerType!=='mouse'||event.button!==0)return;
    down=true;moved=false;startX=event.clientX;startScroll=rail.scrollLeft;
    // Do NOT capture here: doing so retargets normal card clicks to the rail.
  });
  rail.addEventListener('pointermove',event=>{
    if(!down||event.pointerType!=='mouse')return;
    const dx=event.clientX-startX;
    if(!moved && Math.abs(dx)>6){
      moved=true;rail.classList.add('is-dragging');
      try {rail.setPointerCapture(event.pointerId);}catch {}
    }
    if(moved)rail.scrollLeft=startScroll-dx;
  });
  function finish(){down=false;rail.classList.remove('is-dragging');}
  rail.addEventListener('pointerup',finish);
  rail.addEventListener('pointercancel',finish);
  rail.addEventListener('pointerleave',()=>{if(down&&!moved)finish();});
  rail.addEventListener('lostpointercapture',finish);
  rail.addEventListener('click',event=>{
    if(!moved)return;
    event.preventDefault();event.stopPropagation();moved=false;
  },true);
})();