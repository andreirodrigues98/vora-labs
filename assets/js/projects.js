/* VORA · Work — galeria panorâmica em White Blue.
   Valores da referência: perspectiva 2000px, origem Z 500px,
   profundidade -500px e passo angular de 36°.
   Dez projetos, dez painéis. Cada filtro mostra somente os projetos da
   categoria correspondente, sem duplicar trabalhos na galeria. */
(() => {
  'use strict';
  const section = document.getElementById('projetos');
  const stage = document.getElementById('projects-stage');
  const ring = document.getElementById('ring');
  const dragger = document.getElementById('dragger');
  const nameEl = document.getElementById('projects-name');
  const visitEl = document.getElementById('projects-visit');
  const visitLabelEl = document.getElementById('projects-visit-label');
  if (!section || !stage || !ring || !dragger || !nameEl || !visitEl || !visitLabelEl) return;

  // Cada trabalho aparece uma única vez. As categorias correspondem
  // aos trabalhos reais selecionados para o portfólio da VORA.
  const projects = [
    { name: 'OnTable', categories: ['systems'], kind: 'case', url: 'cases/ontable.html', image: 'ontable_work1.png' },
    { name: 'Controly', categories: ['systems'], kind: 'case', url: 'cases/controly.html', image: 'controly.png' },
    { name: 'RodaPay', categories: ['systems'], kind: 'case', url: 'cases/rodapay.html', image: 'rodapay.png' },
    { name: 'Dudôce', categories: ['commerce'], kind: 'site', url: 'https://dudoce.netlify.app/', image: 'dudoce.png' },
    { name: 'Alagim Jagun', categories: ['sites'], kind: 'site', url: 'https://sacerdotealagim.github.io/allanmoraes/', image: 'alagim-jagun.png' },
    { name: 'Ateliê Azul Virgem', categories: ['commerce'], kind: 'site', url: 'https://andreirodrigues98.github.io/azulvirgem/', image: 'azul-virgem.png' },
    { name: 'Aphrodite Sex Shop', categories: ['commerce'], kind: 'site', url: 'https://aphroditesex-shop.netlify.app/', image: 'sex-shop2.png' },
    { name: 'Automação de Cadastros', categories: ['automations'], kind: 'case', url: 'cases/automacao-cadastros.html', image: 'automacao-cadastros.png' },
    { name: 'ConciliaPy', categories: ['systems', 'automations'], kind: 'case', url: 'cases/conciliapy.html', image: 'conciliapy.png' },
    { name: 'Agência Modelo', categories: ['sites'], kind: 'site', url: 'https://studiovoralabs.github.io/agencia-modelo/', image: 'agencia-modelo.png' }
  ];
  const cards = Array.from(ring.querySelectorAll('.img'));
  const filters = Array.from(section.querySelectorAll('[data-project-filter]'));
  if (cards.length !== projects.length) return;
  let visibleProjects = projects.slice();

  const header = document.getElementById('site-header');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const STEP = 36;
  const DRAG_PER_DEGREE = 2.4; // Sensibilidade próxima à referência GSAP.
  let position = 0; // OnTable frontal ao abrir a seção.
  let selected = -1;
  let dragging = false;
  let lastX = 0;
  let pointerId = null;
  let frame = 0;

  function shortestOffset(i) {
    let offset = i - position;
    // Mantém uma única imagem de cada projeto e reutiliza o painel apenas
    // quando ele sai da área frontal do anel.
    offset -= Math.round(offset / visibleProjects.length) * visibleProjects.length;
    return offset;
  }

  function selectedInfo(index) {
    if (index !== selected) {
      selected = index;
      nameEl.textContent = visibleProjects[index].name;
      visitEl.href = visibleProjects[index].url;
      if (visibleProjects[index].kind === 'case') {
        visitEl.removeAttribute('target');
        visitEl.removeAttribute('rel');
      } else {
        visitEl.target = '_blank';
        visitEl.rel = 'noopener noreferrer';
      }
      if (!reducedMotion && nameEl.animate) {
        nameEl.animate([{opacity:.55, transform:'translateY(3px)'}, {opacity:1,transform:'translateY(0)'}], {duration:180,easing:'ease-out'});
      }
    }
    const en = document.documentElement.lang.toLowerCase().startsWith('en');
    const label = visibleProjects[index].kind === 'case'
      ? (en ? 'View case' : 'Ver case')
      : (en ? 'Visit website' : 'Visitar site');
    visitLabelEl.textContent = label;
    visitEl.setAttribute('aria-label', `${label}: ${visibleProjects[index].name}`);
  }

  function paint() {
    frame = 0;
    let nearestIndex = 0;
    let nearestDistance = Infinity;
    cards.forEach((card, i) => {
      if (i >= visibleProjects.length) {
        card.style.visibility = 'hidden';
        card.style.opacity = '0';
        return;
      }
      const offset = shortestOffset(i);
      const distance = Math.abs(offset);
      const degrees = 180 - offset * STEP;
      // O deslocamento Z e o ponto de origem replicam a construção original.
      card.style.transform = `translateZ(-500px) rotateY(${degrees.toFixed(3)}deg)`;
      // As bordas do quarto painel se apagam antes do seu retorno ao outro lado.
      const opacity = Math.max(0, Math.min(1, (2.03 - distance) / .43));
      card.style.opacity = opacity.toFixed(3);
      card.style.visibility = opacity < .002 ? 'hidden' : 'visible';
      // Os mockups da VORA são verticais; deslocamentos de 400px apagariam
      // a imagem, ao contrário das fotos horizontais de 700px da demo.
      // Preserva o parallax em proporção ao enquadramento disponível.
      card.style.backgroundPosition = `${(50 + offset * 8).toFixed(1)}% 50%`;
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = i;
      }
    });
    selectedInfo(nearestIndex);
  }
  const requestPaint = () => { if (!frame) frame = requestAnimationFrame(paint); };

  function chooseCategory(category) {
    visibleProjects = category === 'all'
      ? projects.slice()
      : projects.filter(project => project.categories.includes(category));
    if (!visibleProjects.length) return;

    position = 0;
    selected = -1;
    cards.forEach((card, i) => {
      const project = visibleProjects[i];
      card.style.backgroundImage = project
        ? `url("assets/images/projects/${project.image}")`
        : 'none';
    });
    stage.classList.toggle('is-single-project', visibleProjects.length === 1);
    filters.forEach(button => {
      const active = button.dataset.projectFilter === category;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    paint();
  }

  filters.forEach(button => button.addEventListener('click', () => {
    chooseCategory(button.dataset.projectFilter);
  }));
  chooseCategory('all');

  // Movimento na direção natural: arrastar à direita faz o centro acompanhar.
  function move(dx) {
    if (visibleProjects.length < 2) return;
    position -= dx / (STEP * DRAG_PER_DEGREE);
    requestPaint();
  }
  function begin() { dragging = true; stage.classList.add('is-dragging'); }
  function end() { dragging = false; stage.classList.remove('is-dragging'); }
  // A referência usa GSAP Draggable. Ele assume o arraste quando carregado;
  // Pointer Events mantém o mesmo gesto funcionando quando o CDN está indisponível.
  if (window.gsap && window.Draggable) {
    window.gsap.registerPlugin(window.Draggable);
    window.Draggable.create(dragger, {
      type: 'x',
      onPress() { lastX = this.pointerX; begin(); },
      onDrag() {
        const currentX = this.pointerX;
        move(currentX - lastX);
        lastX = currentX;
      },
      onRelease() { end(); window.gsap.set(dragger, { x: 0, y: 0 }); }
    });
  } else {
    dragger.addEventListener('pointerdown', event => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      pointerId = event.pointerId;
      lastX = event.clientX;
      begin();
      dragger.setPointerCapture(pointerId);
    });
    dragger.addEventListener('pointermove', event => {
      if (!dragging || event.pointerId !== pointerId) return;
      move(event.clientX - lastX);
      lastX = event.clientX;
    });
    const finish = event => { if (event.pointerId === pointerId) { pointerId = null; end(); } };
    dragger.addEventListener('pointerup', finish);
    dragger.addEventListener('pointercancel', finish);
    dragger.addEventListener('lostpointercapture', () => { pointerId = null; end(); });
  }

  stage.addEventListener('keydown', event => {
    if (!['ArrowLeft','ArrowRight'].includes(event.key) || visibleProjects.length < 2) return;
    event.preventDefault();
    position += event.key === 'ArrowRight' ? 1 : -1;
    requestPaint();
  });
  document.addEventListener('vora:languagechange', () => {
    if (visibleProjects.length) selectedInfo(Math.max(0, Math.min(selected, visibleProjects.length - 1)));
  });

  function syncHeaderTone() {
    if (!header) return;
    const rect = section.getBoundingClientRect();
    const h = header.getBoundingClientRect().height || 100;
    const onProjects = rect.top <= h + 8 && rect.bottom > h;
    header.classList.toggle('is-on-projects', onProjects);
    document.body.classList.toggle('is-on-projects', onProjects);
  }
  addEventListener('scroll', syncHeaderTone, {passive:true});
  addEventListener('resize', syncHeaderTone, {passive:true});
  syncHeaderTone();
})();
