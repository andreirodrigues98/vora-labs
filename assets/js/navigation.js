/* VORA — Navegação suave e acessível entre âncoras (Etapa 14) */
(() => {
  'use strict';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let running = 0;
  let cancelCurrent = null;

  function navigate(target, hash, updateHistory = true) {
    if (!target) return;
    if (cancelCurrent) cancelCurrent();
    const header = document.getElementById('site-header');
    const headerSize = header?.getBoundingClientRect().height || 0;
    const isTop = target.id === 'inicio' || target.id === 'site-content';
    const to = isTop ? 0 : Math.max(0, window.scrollY + target.getBoundingClientRect().top - headerSize - 12);
    const start = window.scrollY;
    const distance = to - start;

    if (updateHistory && hash && location.hash !== hash) history.pushState(null, '', hash);
    if (reducedMotion.matches || Math.abs(distance) < 2) {
      window.scrollTo({top: to, behavior: 'instant'});
      return;
    }

    const duration = Math.min(1250, Math.max(680, 680 + Math.abs(distance) * .16));
    const t0 = performance.now();
    let finished = false;
    function cleanup() {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(running);
      ['wheel','touchstart','pointerdown','keydown'].forEach(type => removeEventListener(type, stopOnUser, true));
      cancelCurrent = null;
    }
    function stopOnUser(event) {
      if (event.type === 'pointerdown' && event.target.closest('a[href^="#"]')) return;
      cleanup();
    }
    cancelCurrent = cleanup;
    ['wheel','touchstart','pointerdown','keydown'].forEach(type => addEventListener(type, stopOnUser, {passive:true, capture:true}));
    function step(now) {
      const t = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      window.scrollTo({top: start + distance * eased, behavior: 'instant'});
      if (t < 1 && !finished) running = requestAnimationFrame(step);
      else cleanup();
    }
    running = requestAnimationFrame(step);
  }

  window.voraSmoothNavigate = navigate;
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
    const hash = link.getAttribute('href');
    if (!hash || hash === '#') return;
    const target = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!target) return;
    event.preventDefault();
    // O handler do menu mobile fecha o overlay antes desta etapa.
    requestAnimationFrame(() => navigate(target, hash));
  });
})();
