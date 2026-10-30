/* VORA / PROJETOS — edite somente este arquivo para adicionar ou reorganizar trabalhos.
   type: "external" abre uma página publicada em nova aba.
   type: "case" aponta para uma página interna da VORA.
   A galeria pode repetir capas dos MESMOS projetos: não inventa novos trabalhos.
*/
window.VORA_PROJECTS = Object.freeze([
  {
    id: 'nava', name: 'NAVA studio', category: { 'pt-BR': 'Identidade e presença digital', 'en-US': 'Identity & digital presence' },
    cover: 'assets/images/projects/nava.webp',
    type: 'external', url: 'https://andreirodrigues98.github.io/navastudio/'
  },
  {
    id: 'dudoce', name: 'Dudôce', category: { 'pt-BR': 'Experiência de compra', 'en-US': 'E-commerce experience' },
    cover: 'assets/images/projects/dudoce.webp',
    type: 'external', url: 'https://dudoce.netlify.app/'
  },
  {
    id: 'ontable', name: 'OnTable', category: { 'pt-BR': 'Experiência e gestão', 'en-US': 'Operations & experience' },
    cover: 'assets/images/projects/ontable.webp',
    type: 'case', url: 'cases/ontable.html'
  },
  {
    id: 'rodapay', name: 'RodaPay', category: { 'pt-BR': 'Produto digital', 'en-US': 'Digital product' },
    cover: 'assets/images/projects/rodapay.webp',
    type: 'case', url: 'cases/rodapay.html'
  }
]);
