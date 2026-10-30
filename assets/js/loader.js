/* =========================================
   VORA / ANIMAÇÃO DO CARREGAMENTO
   O número é uma animação de progresso,
   não uma medição exata de bytes baixados.
   O 100% só aparece depois que página e
   fontes estão prontas, e após o tempo
   mínimo de apresentação da marca.
   ========================================= */
(() => {
  'use strict';

  const loader = document.getElementById('loader');
  const progressNumber = document.getElementById('progress-number');
  const siteContent = document.getElementById('site-content');
  const stageItems = [...document.querySelectorAll('[data-stage]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  function setProgress(value) {
    const percent = Math.max(0, Math.min(100, Math.round(value)));
    progressNumber.textContent = String(percent);

    // As três mensagens ganham destaque uma após a outra.
    stageItems.forEach((element, index) => {
      const active = percent >= 95 ||
        (index === 0 && percent < 34) ||
        (index === 1 && percent >= 34 && percent < 69) ||
        (index === 2 && percent >= 69 && percent < 95);
      element.classList.toggle('is-active', active);
    });
  }

  function waitForWindowLoad() {
    if (document.readyState === 'complete') return Promise.resolve();
    return new Promise((resolve) => window.addEventListener('load', resolve, { once: true }));
  }

  function waitForFonts() {
    return document.fonts ? document.fonts.ready : Promise.resolve();
  }

  function revealSite() {
    siteContent.removeAttribute('inert');
    siteContent.removeAttribute('aria-hidden');
    siteContent.classList.add('is-visible');
    document.body.classList.remove('is-loading');
    loader.classList.add('is-finished');

    // O elemento deixa de existir para tecnologias assistivas ao final.
    window.setTimeout(() => {
      loader.setAttribute('aria-hidden', 'true');
    }, reducedMotion ? 0 : 700);
  }

  setProgress(0);

  if (reducedMotion) {
    Promise.all([waitForWindowLoad(), waitForFonts()]).then(() => {
      setProgress(100);
      revealSite();
    });
    return;
  }

  const startedAt = performance.now();
  const minDuration = 1900; // Tempo mínimo para ver a identidade sem alongar o acesso.
  const finishDuration = 420;
  let resourcesReady = false;
  let finishingAt = null;
  let finalStartValue = 0;

  Promise.all([waitForWindowLoad(), waitForFonts()])
    .then(() => { resourcesReady = true; })
    .catch(() => { resourcesReady = true; });

  function tick(now) {
    const elapsed = now - startedAt;
    // Aproxima-se suavemente de 92%; não mostra 100% antes de estar pronto.
    const preliminary = 92 * (1 - Math.exp(-elapsed / 760));

    if (finishingAt === null) {
      setProgress(preliminary);

      if (resourcesReady && elapsed >= minDuration) {
        finishingAt = now;
        finalStartValue = preliminary;
      }
    }

    if (finishingAt !== null) {
      const t = Math.min((now - finishingAt) / finishDuration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(finalStartValue + (100 - finalStartValue) * eased);

      if (t === 1) {
        setProgress(100);
        window.setTimeout(revealSite, 230);
        return;
      }
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();
