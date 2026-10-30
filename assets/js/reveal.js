/* VORA | Scroll reveal dos títulos (sem dependências).
 * Hero e títulos de seção entram ao serem vistos.
 * Não interfere no carrossel 3D, no FAQ ou no formulário.
 */
(() => {
  'use strict';

  const shell = document.getElementById('site-content');
  const targets = Array.from(document.querySelectorAll('[data-reveal]'));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!shell || !targets.length || reduced.matches || !('IntersectionObserver' in window)) {
    targets.forEach((target) => target.classList.add('is-revealed'));
    return;
  }

  // Atrasos discretos apenas nas linhas de um mesmo título.
  document.querySelectorAll('[data-reveal-group]').forEach((group) => {
    group.querySelectorAll('[data-reveal]').forEach((line, index) => {
      line.style.setProperty('--reveal-delay', `${index * 95}ms`);
    });
  });

  let observer;
  const revealAll = () => {
    targets.forEach((target) => target.classList.add('is-revealed'));
    if (observer) observer.disconnect();
  };

  // Só oculta títulos quando o observador pode fazer a revelação.
  // Evita textos invisíveis caso o JavaScript não seja executado.
  document.documentElement.classList.add('has-scroll-reveals');

  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const target = entry.target;
      target.classList.add('is-revealed');
      observer.unobserve(target);
    }
  }, { threshold: 0.1, rootMargin: '0px 0px -4% 0px' });

  function observeWhenReady() {
    // Um frame após sair do loader, evitando disparos atrás da sobreposição.
    requestAnimationFrame(() => {
      targets.forEach((target) => observer.observe(target));
    });
  }

  if (shell.classList.contains('is-visible')) {
    observeWhenReady();
  } else {
    const visibilityWatcher = new MutationObserver(() => {
      if (!shell.classList.contains('is-visible')) return;
      visibilityWatcher.disconnect();
      observeWhenReady();
    });
    visibilityWatcher.observe(shell, { attributes: true, attributeFilter: ['class'] });
  }

  // Troca de preferência durante a navegação também remove movimentos.
  if (typeof reduced.addEventListener === 'function') {
    reduced.addEventListener('change', (event) => {
      if (event.matches) revealAll();
    });
  }
})();
