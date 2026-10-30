/* VORA — Footer (Etapa 14) */
(() => {
  'use strict';
  const footer = document.getElementById('rodape');
  const back = footer?.querySelector('.hi-footer__back');
  const header = document.getElementById('site-header');
  if (!footer || !back) return;
  // Keep the full PT/EN phrase INSIDE the seal, with no overlap where
  // the first and last words meet. Reserve a small, consistent seam.
  const ringText = footer.querySelector('.hi-footer__ringText');
  const ringPathText = ringText?.querySelector('textPath');
  const ringPath = footer.querySelector('#vora-footer-ring-path');
  function fitRingText() {
    if (!ringText || !ringPathText || !ringPath) return;
    const mobile = matchMedia('(max-width: 760px)').matches;
    ringPath.setAttribute('d', mobile
      ? 'M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0'
      : 'M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0');

    if (!mobile) {
      ringText.style.fontSize = '';
      ringText.style.letterSpacing = '';
      ringPathText.setAttribute('textLength', '480');
      ringPathText.setAttribute('lengthAdjust', 'spacing');
      return;
    }

    // Measure NATURAL glyph lengths first. A stable SVG textLength then
    // avoids Safari stretching words or allowing them to collide at the seam.
    ringPathText.removeAttribute('textLength');
    ringPathText.removeAttribute('lengthAdjust');
    ringText.style.letterSpacing = '0px';
    ringText.style.fontSize = '18px';
    const natural = ringPathText.getComputedTextLength();
    const perimeter = ringPath.getTotalLength();
    const target = perimeter - 13; // ~= 452 units on the 74-unit radius.
    if (natural > 0) {
      const fittedSize = Math.max(16.5, Math.min(20, 18 * target / natural));
      ringText.style.fontSize = `${fittedSize.toFixed(2)}px`;
    }
    ringPathText.setAttribute('textLength', target.toFixed(2));
    ringPathText.setAttribute('lengthAdjust', 'spacing');
  }
  fitRingText();
  addEventListener('resize', fitRingText, { passive: true });
  document.addEventListener('vora:languagechange', fitRingText);
  if (document.fonts) document.fonts.ready.then(fitRingText).catch(() => {});

  const year = document.getElementById('vora-year');
  if (year) year.textContent = String(new Date().getFullYear());

  back.addEventListener('click', () => {
    if (window.voraSmoothNavigate) window.voraSmoothNavigate(document.getElementById('inicio'), '#inicio');
    else window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  });

  let scheduled = false;
  function checkTone() {
    scheduled = false;
    const markerY = (header?.getBoundingClientRect().height || 90) * 0.6;
    const r = footer.getBoundingClientRect();
    const active = r.top <= markerY && r.bottom > markerY;
    header?.classList.toggle('is-on-footer', active);
    document.body.classList.toggle('is-on-footer', active);
  }
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(checkTone);
  }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  checkTone();
})();
