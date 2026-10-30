/* VORA — Hero 3D (Spline)
   O runtime mantém a cena interativa e permite assegurar a rotação automática.
   O Viewer oficial continua disponível como alternativa de carregamento. */
(() => {
  'use strict';

  const hero = document.querySelector('.hero');
  const header = document.getElementById('site-header');
  const stage = document.querySelector('.hero__spline-stage');
  const viewer = document.getElementById('hero-spline-viewer');
  const status = document.getElementById('hero-spline-status');
  if (!hero) return;

  function updateHeaderTone() {
    if (!header) return;
    const rect = hero.getBoundingClientRect();
    const middle = (header.offsetHeight || 100) / 2;
    const overHero = rect.top <= middle && rect.bottom > middle;
    header.classList.toggle('is-on-light-hero', overHero);
    document.body.classList.toggle('is-on-light-hero', overHero);
  }
  window.addEventListener('scroll', updateHeaderTone, { passive: true });
  window.addEventListener('resize', updateHeaderTone, { passive: true });
  updateHeaderTone();

  if (!stage || !viewer) return;

  // A roda do mouse deve rolar a PÁGINA, nunca ampliar/reduzir o objeto 3D.
  // O Spline normalmente captura o wheel e impede o scroll. Encaminhamos
  // apenas esse gesto ao documento, preservando hover, clique e arraste no 3D.
  function scrollPageOverSpline(event) {
    if (event.ctrlKey || !event.composedPath().includes(stage)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const multiplier = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1;
    window.scrollBy({
      top: event.deltaY * multiplier,
      left: event.deltaX * multiplier,
      behavior: 'instant'
    });
  }
  window.addEventListener('wheel', scrollPageOverSpline, { capture: true, passive: false });

  // Solução local para o selo do Viewer usado como fallback.
  // A remoção oficial de branding depende das condições da licença Spline.
  let badgeObserver = null;
  function removeViewerBadge() {
    const root = viewer.shadowRoot;
    if (!root) return false;
    root.querySelector('#logo')?.remove();
    if (!badgeObserver) {
      badgeObserver = new MutationObserver(() => root.querySelector('#logo')?.remove());
      badgeObserver.observe(root, { childList: true, subtree: true });
    }
    return true;
  }

  let finished = false;
  function markReady() {
    if (finished) return;
    finished = true;
    hero.classList.add('hero--spline-ready');
    hero.classList.remove('hero--spline-error');
    if (status) status.hidden = true;
  }
  function markError(error) {
    if (finished) return;
    hero.classList.add('hero--spline-error');
    if (status) status.hidden = false;
    console.warn('VORA: a cena 3D não pôde ser carregada.', error);
  }

  const sceneUrl = viewer.getAttribute('url');
  const runtimeScripts = [
    'https://cdn.jsdelivr.net/npm/@splinetool/runtime@2.0.111/build/runtime.js',
    'https://unpkg.com/@splinetool/runtime@2.0.111/build/runtime.js'
  ];
  const viewerScripts = [
    'https://cdn.spline.design/@splinetool/viewer@2.0.111/build/spline-viewer.js',
    'https://unpkg.com/@splinetool/viewer@2.0.111/build/spline-viewer.js'
  ];

  // A cena exportada possui eventos Start e animações próprias.
  // Caso a rotação não comece no runtime, este controle a restaura no objeto
  // principal, sem trocar o arquivo Spline nem bloquear interações do mouse.
  function ensureAutomaticRotation(app) {
    const candidates = ['Model', 'Group']
      .map(name => app.findObjectByName(name))
      .filter(Boolean);
    if (!candidates.length) return;

    const readTransforms = object => ({
      position: { x: object.position.x, y: object.position.y, z: object.position.z },
      rotation: { x: object.rotation.x, y: object.rotation.y, z: object.rotation.z }
    });
    let previous = candidates.map(readTransforms);
    let consecutiveStillChecks = 0;

    function animateFallback() {
      const object = app.findObjectByName('Model') || app.findObjectByName('Group');
      if (!object) return;
      const speed = (2 * Math.PI) / 30; // uma volta suave a cada 30 segundos
      let lastFrame = performance.now();
      const rotate = now => {
        if (!stage.isConnected) return;
        const seconds = Math.min((now - lastFrame) / 1000, 0.05);
        lastFrame = now;
        object.rotation.y += speed * seconds;
        requestAnimationFrame(rotate);
      };
      requestAnimationFrame(rotate);
    }

    // Observa também animações que param depois de algum tempo, em vez de
    // conferir somente o primeiro frame. A animação nativa tem prioridade.
    const watch = window.setInterval(() => {
      if (!stage.isConnected) {
        clearInterval(watch);
        return;
      }
      const current = candidates.map(readTransforms);
      const changed = current.some((value, i) => ['position', 'rotation'].some(property =>
        ['x', 'y', 'z'].some(axis =>
          Math.abs(value[property][axis] - previous[i][property][axis]) > 0.001
        )
      ));
      previous = current;
      consecutiveStillChecks = changed ? 0 : consecutiveStillChecks + 1;
      if (consecutiveStillChecks >= 2) {
        clearInterval(watch);
        animateFallback();
      }
    }, 2500);
  }

  // Arraste real para celulares, tablets e pré-visualização responsiva.
  // O canvas pode perder eventos de toque por causa dos controles internos do
  // Spline. Uma superfície separada recebe os gestos sem impedir o scroll.
  function enableResponsiveDrag(app) {
    const interactionViewport = window.matchMedia('(max-width: 1024px), (pointer: coarse)');
    const object = app.findObjectByName('Model') || app.findObjectByName('Group');
    if (!object || !object.rotation) {
      console.warn('VORA: objeto para rotação manual não encontrado na cena.');
      return;
    }

    const surface = document.createElement('div');
    surface.className = 'hero__spline-drag-surface';
    surface.setAttribute('aria-hidden', 'true');
    stage.appendChild(surface);

    let active = null;
    const clear = () => {
      if (active && surface.hasPointerCapture?.(active.id)) {
        surface.releasePointerCapture(active.id);
      }
      active = null;
      surface.classList.remove('is-dragging');
    };

    surface.addEventListener('pointerdown', event => {
      if (!interactionViewport.matches || active || !event.isPrimary ||
          (event.pointerType === 'mouse' && event.button !== 0)) return;
      active = {
        id: event.pointerId,
        startX: event.clientX, startY: event.clientY,
        lastX: event.clientX, lastY: event.clientY,
        moved: false,
        initialX: object.rotation.x
      };
      // Mantém os movimentos após o dedo sair dos limites da superfície.
      surface.setPointerCapture?.(event.pointerId);
    });

    surface.addEventListener('pointermove', event => {
      if (!active || event.pointerId !== active.id) return;
      const overallX = event.clientX - active.startX;
      const overallY = event.clientY - active.startY;
      if (!active.moved) {
        // Deslizamento vertical pertence à rolagem normal do documento.
        if (Math.abs(overallX) < 5 || Math.abs(overallX) <= Math.abs(overallY)) return;
        active.moved = true;
        surface.classList.add('is-dragging');
      }

      const dx = event.clientX - active.lastX;
      const dy = event.clientY - active.lastY;
      active.lastX = event.clientX;
      active.lastY = event.clientY;

      // Rotaciona o objeto 3D, não uma imagem plana nem a página.
      // O Spline continua renderizando e executando a rotação automática.
      object.rotation.y += dx * 0.012;
      object.rotation.x = Math.max(active.initialX - 0.85, Math.min(active.initialX + 0.85,
        object.rotation.x + dy * 0.006));
      app.requestRender?.();
      if (event.cancelable) event.preventDefault();
    }, { passive: false });

    surface.addEventListener('pointerup', clear);
    surface.addEventListener('pointercancel', clear);
    surface.addEventListener('lostpointercapture', clear);
    window.addEventListener('blur', clear);
    interactionViewport.addEventListener?.('change', () => {
      if (!interactionViewport.matches) clear();
    });
  }

  async function startRuntime() {
    for (const scriptUrl of runtimeScripts) {
      let canvas;
      let app;
      try {
        const module = await import(scriptUrl);
        if (typeof module.Application !== 'function') throw new Error('Spline Application indisponível');
        canvas = document.createElement('canvas');
        canvas.className = 'hero__spline-canvas';
        stage.appendChild(canvas);
        app = new module.Application(canvas, { renderMode: 'continuous' });
        await app.load(sceneUrl);
        // Não parar a animação quando o sistema pede movimento reduzido:
        // o usuário escolheu preservar a rotação contínua desta cena.
        viewer.remove();
        markReady();
        ensureAutomaticRotation(app);
        enableResponsiveDrag(app);
        return true;
      } catch (error) {
        app?.dispose?.();
        canvas?.remove();
        console.warn('VORA: falha no carregamento do runtime Spline.', error);
      }
    }
    return false;
  }

  async function startViewerFallback() {
    viewer.hidden = false;
    viewer.addEventListener('load-complete', () => {
      markReady();
      removeViewerBadge();
    }, { once: true });
    viewer.addEventListener('context-loss', () => markError('Contexto gráfico indisponível.'));

    const badgeCheck = window.setInterval(() => {
      if (removeViewerBadge() || !viewer.isConnected) clearInterval(badgeCheck);
    }, 250);
    window.setTimeout(() => clearInterval(badgeCheck), 12000);

    for (const scriptUrl of viewerScripts) {
      try {
        await import(scriptUrl);
        if (customElements.get('spline-viewer')) return;
      } catch (error) {
        console.warn('VORA: falha no carregamento do Viewer Spline.', error);
      }
    }
    markError('Confira a conexão e a disponibilidade do Spline.');
  }

  (async () => {
    if (!(await startRuntime())) await startViewerFallback();
  })();
})();
