/* VORA | FAQ: troca de respostas sem engasgos de visibilidade/grid.
   Duas transições de altura podem ocorrer ao mesmo tempo; não há espera
   entre fechar a pergunta anterior e abrir a próxima. */
(() => {
  'use strict';

  const items = Array.from(document.querySelectorAll('.faq__item'));
  if (!items.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const running = new WeakMap();
  const DURATION = 260;
  const EASING = 'cubic-bezier(.22, .68, .25, 1)';

  function change(item, open, initial = false) {
    const button = item.querySelector('.faq__trigger');
    const panel = item.querySelector('.faq__answer');
    if (!button || !panel) return;

    // Captura a altura real antes de interromper qualquer transição em curso.
    const fromHeight = panel.getBoundingClientRect().height;
    const previous = running.get(panel);
    if (previous) {
      previous.cancel();
      running.delete(panel);
    }

    item.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', String(open));
    panel.setAttribute('aria-hidden', String(!open));
    panel.inert = !open;

    const targetHeight = open ? panel.scrollHeight : 0;
    const targetOpacity = open ? 1 : 0;

    if (initial || reduceMotion.matches || !panel.animate) {
      panel.style.height = open ? 'auto' : '0px';
      panel.style.opacity = String(targetOpacity);
      return;
    }

    // O texto esmaece enquanto a altura encolhe, em vez de desaparecer
    // abruptamente por visibility:hidden ao final da transição.
    const currentOpacity = Number.parseFloat(getComputedStyle(panel).opacity);
    panel.style.height = `${fromHeight}px`;
    const animation = panel.animate(
      [
        { height: `${fromHeight}px`, opacity: Number.isFinite(currentOpacity) ? currentOpacity : Number(!open) },
        { height: `${targetHeight}px`, opacity: targetOpacity }
      ],
      { duration: DURATION, easing: EASING, fill: 'forwards' }
    );
    running.set(panel, animation);

    animation.onfinish = () => {
      if (running.get(panel) !== animation) return;
      panel.style.height = open ? 'auto' : '0px';
      panel.style.opacity = String(targetOpacity);
      running.delete(panel);
      animation.cancel();
    };
    animation.oncancel = () => {
      if (running.get(panel) === animation) running.delete(panel);
    };
  }

  items.forEach((item) => {
    change(item, false, true);
    item.querySelector('.faq__trigger').addEventListener('click', () => {
      const shouldOpen = !item.classList.contains('is-open');
      items.forEach((other) => {
        const targetOpen = other === item && shouldOpen;
        if (other.classList.contains('is-open') !== targetOpen) change(other, targetOpen);
      });
    });
  });

  // Ajustes do sistema ou da tradução não deixam alturas presas em pixels.
  reduceMotion.addEventListener('change', () => {
    items.forEach((item) => change(item, item.classList.contains('is-open'), true));
  });
  document.addEventListener('vora:languagechange', () => {
    items.forEach((item) => {
      const panel = item.querySelector('.faq__answer');
      const animation = running.get(panel);
      if (animation) animation.cancel();
      running.delete(panel);
      panel.style.height = item.classList.contains('is-open') ? 'auto' : '0px';
      panel.style.opacity = item.classList.contains('is-open') ? '1' : '0';
    });
  });
})();
