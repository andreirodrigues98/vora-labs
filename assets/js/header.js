/* ===============================================
   VORA / HEADER — ETAPA 02
   Abrir/fechar menu mobile + acessibilidade.
   =============================================== */
(() => {
  'use strict';

  const header = document.getElementById('site-header');
  const toggle = document.querySelector('.site-header__toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = [...mobileMenu.querySelectorAll('a')];
  const desktopBreakpoint = window.matchMedia('(min-width: 761px)');
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const themeColorOriginal = themeColor?.getAttribute('content') || '#E4E5F2';

  function syncButtonLabel() {
    const english = document.documentElement.lang === 'en-US';
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-label', english
      ? (open ? 'Close menu' : 'Open menu')
      : (open ? 'Fechar menu' : 'Abrir menu'));
  }

  function setMenuOpen(open, restoreFocus = false) {
    if (open && desktopBreakpoint.matches) return;

    document.body.classList.toggle('menu-is-open', open);
    if (themeColor) themeColor.setAttribute('content', open ? '#0E0F28' : themeColorOriginal);
    mobileMenu.classList.toggle('is-open', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    mobileMenu.inert = !open;
    toggle.setAttribute('aria-expanded', String(open));
    syncButtonLabel();

    if (open) {
      mobileLinks[0].focus({ preventScroll: true });
    } else if (restoreFocus && !desktopBreakpoint.matches) {
      toggle.focus({ preventScroll: true });
    }
  }

  toggle.addEventListener('click', () => {
    const shouldOpen = toggle.getAttribute('aria-expanded') !== 'true';
    setMenuOpen(shouldOpen, !shouldOpen);
  });

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (!document.body.classList.contains('menu-is-open')) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      setMenuOpen(false, true);
      return;
    }

    if (event.key !== 'Tab') return;
    const selectors = [
      '.site-header__logo', '.language__button',
      '.site-header__toggle', '.mobile-menu__link'
    ];
    const interactive = selectors.flatMap(selector =>
      [...document.querySelectorAll(selector)]
    ).filter(el => el.getClientRects().length > 0 && !el.closest('[inert]'));
    const first = interactive[0];
    const last = interactive[interactive.length - 1];
    if (!interactive.includes(document.activeElement)) {
      event.preventDefault();
      first.focus();
    } else if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  desktopBreakpoint.addEventListener('change', (event) => {
    if (event.matches) setMenuOpen(false);
  });

  function updateScrollState() {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', updateScrollState, { passive: true });
  updateScrollState();
  document.addEventListener('vora:languagechange', syncButtonLabel);
  syncButtonLabel();
})();
