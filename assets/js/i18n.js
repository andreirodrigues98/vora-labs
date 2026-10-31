/* ======================================
   VORA / IDIOMAS — PT-BR E EN-US
   ETAPA 02: textos do header e menu mobile.
   ====================================== */
(() => {
  'use strict';

  const translations = {
    'pt-BR': {
      pageTitle: 'VORA — Estúdio Criativo Digital',
      pageDescription: 'VORA — Desenvolvendo soluções criativas para seu negócio!',
      languageAria: 'Selecionar idioma',
      loadingAria: 'Carregamento do site',
      studio: 'SOLUÇÕES CRIATIVAS',
      based: 'SITES, INTERFACES E SOFTWARES',
      nextLabel: 'PRÓXIMA ETAPA',
      nextDescription: 'A página principal será construída aqui, etapa por etapa.',
      homeAria: 'VORA — Início',
      menuAria: 'Menu principal',
      mobileMenuAria: 'Menu de navegação mobile',
      menuOpenAria: 'Abrir menu',
      navWork: 'Projetos',
      navAbout: 'Sobre',
      navContact: 'Contato',
      heroEyebrow: "Tecnologia, estratégia e criatividade.",
      heroTitle: "Desenvolvendo soluções criativas para seu negócio!",
      heroDescription: "Entendemos o contexto antes de definir a solução. Unimos criatividade, estratégia e tecnologia para desenvolver sites, sistemas e aplicações que transformam necessidades reais em experiências digitais únicas.",
      heroCta: 'Explorar projetos',
      projectsUpcoming: 'Projetos selecionados — próxima etapa.',
      projectsEyebrow: '02 / TRABALHOS SELECIONADOS',
      projectsTitle: 'Projetos que ganharam forma.',
      projectsGesture: 'ARRASTE PARA EXPLORAR ↔',
      projectsStageAria: 'Projetos em uma galeria circular. Arraste para navegar ou use as setas do teclado.',
      projectsFiltersAria: 'Filtrar projetos por tipo',
      projectsFilterAll: 'Todos',
      projectsFilterSites: 'Sites',
      projectsFilterCommerce: 'E-commerce',
      projectsFilterSystems: 'Sistemas & Apps',
      projectsFilterAutomation: 'Automações',
      projectsPrevAria: 'Vista anterior',
      projectsNextAria: 'Próxima vista',
      aboutEyebrow: '03 / SOBRE A VORA',
      aboutLine1: "Criatividade aplicada.",
      aboutLine2: "Experiências digitais.",
      aboutLine3: "Sites, softwares e sistemas.",
      aboutLine4: "Tecnologia com propósito.",
      aboutSideNote: "ESTRATÉGIA / CRIATIVIDADE / TECNOLOGIA",
      aboutDescription1: "Na VORA, cada projeto começa pela compreensão do desafio.",
      aboutDescription2: "Unimos pensamento criativo, estratégia e desenvolvimento tecnológico para construir soluções digitais que conectam as necessidades de cada negócio a experiências funcionais, intuitivas e bem executadas.",
      aboutDescription3: "Não partimos de soluções prontas. Exploramos possibilidades e desenvolvemos o que faz sentido para cada realidade.",
      faqEyebrow: '04 / PERGUNTAS FREQUENTES',
      faqTitle: 'Antes de começar.',
      faqLead: 'Algumas respostas sobre ideias, projetos e como trabalhamos.',
      faqQuestion1: "O que a VORA desenvolve?",
      faqAnswer1: "Desenvolvemos sites institucionais, landing pages, e-commerces, softwares, sistemas personalizados, aplicações SaaS, interfaces digitais e automações.",
      faqAnswer1b: "Cada solução é pensada a partir das necessidades do negócio, combinando estratégia, criatividade e tecnologia para entregar experiências funcionais, intuitivas e bem construídas.",
      faqQuestionProducts: "Posso contratar uma solução já desenvolvida pela VORA?",
      faqAnswerProducts: "Sim. Além de desenvolver projetos personalizados, a VORA disponibiliza soluções digitais para necessidades específicas de diferentes negócios.",
      faqAnswerProductsB: "Entre elas estão OnTable, Controly, RodaPay e ConciliaPy. As modalidades de contratação, como assinatura ou aquisição, variam conforme cada solução.",
      faqAnswerProductsC: "Entre em contato para conhecer funcionalidades, condições e entender qual opção faz sentido para sua operação.",
      faqQuestion2: "Como um projeto começa?",
      faqAnswer2: "Tudo começa com uma conversa.",
      faqAnswer2b: "Buscamos compreender seu negócio, seus objetivos e o que precisa ser melhorado ou desenvolvido.",
      faqAnswer2c: "A partir desse entendimento, avaliamos as possibilidades e definimos a solução mais adequada, considerando funcionalidades, experiência e viabilidade técnica.",
      faqQuestion3: "A VORA trabalha com sistemas e sites já existentes?",
      faqAnswer3: "Sim. Também podemos atuar na modernização e evolução de soluções digitais existentes.",
      faqAnswer3b: "Analisamos a estrutura atual para identificar possibilidades de melhoria, novas funcionalidades, integrações e aprimoramentos na experiência de uso.",
      faqQuestion4: "Preciso ter minha ideia totalmente definida?",
      faqAnswer4: "Não. Você pode chegar com uma ideia, uma necessidade ou até mesmo um problema que ainda não sabe como resolver.",
      faqAnswer4b: "Ajudamos a transformar esse ponto de partida em uma proposta clara, definindo as possibilidades e o caminho mais adequado para o desenvolvimento.",
      faqQuestion5: "A VORA também desenvolve automações?",
      faqAnswer5: "Sim. Desenvolvemos automações para simplificar processos, reduzir tarefas repetitivas e conectar diferentes etapas da operação.",
      faqAnswer5b: "O objetivo é fazer com que a tecnologia trabalhe a favor do negócio, proporcionando mais organização, agilidade e eficiência no dia a dia.",
      faqQuestion6: "Qual a diferença entre uma solução pronta e um sistema personalizado?",
      faqAnswer6: "Soluções prontas são desenvolvidas para atender necessidades comuns a diferentes negócios.",
      faqAnswer6b: "Já um sistema personalizado é projetado considerando processos, funcionalidades e particularidades de uma operação específica.",
      faqAnswer6c: "Na VORA, avaliamos cada necessidade para entender quando o desenvolvimento sob medida realmente faz sentido.",
      faqQuestion7: "Como posso solicitar um projeto?",
      faqAnswer7: "Basta entrar em contato e contar um pouco sobre o que você precisa.",
      faqAnswer7b: "Pode ser um novo site, um sistema para sua empresa, uma automação ou uma ideia de produto digital.",
      faqAnswer7c: "A partir dessa primeira conversa, podemos entender o desafio e avaliar os próximos passos para transformar sua necessidade em uma solução.",
      // ETAPA 06 / CONTATO
      footerKicker: 'TEM UMA IDEIA EM MENTE?',
      footerStart: 'INICIAR UM PROJETO',
      footerWork: 'PROJETOS',
      footerAbout: 'SOBRE',
      footerBack: 'VOLTAR AO TOPO',
      footerBackAria: 'Voltar ao início da página',
      footerCircleAria: 'Conversar com a VORA sobre um projeto',
      footerCircleText: "VORA • ESTRATÉGIA • CRIATIVIDADE • INOVAÇÃO •",
      footerWord1: 'ESTRATÉGIA', footerWord2: 'DESIGN',
      footerWord3: 'TECNOLOGIA', footerWord4: 'EXPERIÊNCIAS DIGITAIS',
      footerWord5: 'IDEIAS', footerWord6: 'PRODUTOS',
      footerWord7: 'SISTEMAS', footerWord8: 'SOLUÇÕES COM PROPÓSITO',
      footerMarquee: "SOLUÇÕES CRIATIVAS PARA O SEU NEGÓCIO.",
      footerTagline: "SOLUÇÕES CRIATIVAS PARA O SEU NEGÓCIO.",
      contactEyebrow: '05 / INICIAR UM PROJETO',
      contactTitle1: 'VAMOS DAR FORMA',
      contactTitle2: 'À SUA IDEIA.',
      contactDescription: 'Conte o que você quer criar, transformar ou melhorar. O melhor caminho começa por entender o desafio.',
      contactNameLabel: 'SEU NOME *',
      contactNamePlaceholder: 'Como podemos chamar você?',
      contactNameError: 'Informe seu nome.',
      contactCompanyLabel: 'EMPRESA / PROJETO',
      contactOptional: 'OPCIONAL',
      contactCompanyPlaceholder: 'Nome da empresa ou projeto',
      contactWhatsappError: 'Informe um telefone com DDD.',
      contactEmailLabel: 'SEU E-MAIL *',
      contactEmailPlaceholder: 'voce@exemplo.com',
      contactEmailError: 'Informe um e-mail válido.',
      contactTypeLabel: 'SOBRE O QUE VAMOS CONVERSAR? *',
      contactTypePlaceholder: 'Selecione uma opção',
      contactTypeExperience: 'Experiência digital',
      contactTypeProduct: 'Produto digital ou sistema',
      contactTypeVoraSolution: 'Conhecer uma solução da VORA',
      contactSolutionLabel: 'QUAL SOLUÇÃO DESPERTOU SEU INTERESSE? *',
      contactSolutionPlaceholder: 'Selecione uma solução',
      contactSolutionUndecided: 'Ainda não sei qual escolher',
      contactSolutionError: 'Escolha uma solução ou indique que ainda não decidiu.',
      contactTypeEvolution: 'Evolução de uma solução existente',
      contactTypeAutomation: 'Automação ou integração',
      contactTypeOther: 'Tenho uma ideia / outro desafio',
      contactTypeError: 'Escolha uma opção.',
      contactMessageLabel: 'CONTE UM POUCO SOBRE SEU DESAFIO *',
      contactMessagePlaceholder: 'Pode começar com uma ideia, um desafio ou algo que você queira melhorar.',
      contactMessageError: 'Escreva pelo menos 10 caracteres.',
      contactSubmit: 'INICIAR CONVERSA',

      contactCopy: 'COPIAR MENSAGEM',
    },
    'en-US': {
      pageTitle: 'VORA — Creative Digital Studio',
      pageDescription: 'VORA — Strategy, design, and technology creating purposeful digital experiences.',
      languageAria: 'Select language',
      loadingAria: 'Website loading screen',
      studio: 'CREATIVE SOLUTIONS',
      based: 'WEBSITES, INTERFACES & SOFTWARE',
      nextLabel: 'NEXT STEP',
      nextDescription: 'The main page will be built here, one step at a time.',
      homeAria: 'VORA — Home',
      menuAria: 'Main navigation',
      mobileMenuAria: 'Mobile navigation',
      menuOpenAria: 'Open menu',
      navWork: 'Work',
      navAbout: 'About',
      navContact: 'Contact',
      heroEyebrow: "Technology, strategy, and creativity.",
      heroTitle: "Developing creative solutions for your business!",
      heroDescription: "We understand the context before defining the solution. We bring together creativity, strategy, and technology to develop websites, systems, and applications that turn real needs into unique digital experiences.",
      heroCta: 'Explore our work',
      projectsUpcoming: 'Selected work — coming next.',
      projectsEyebrow: '02 / SELECTED WORK',
      projectsTitle: 'Ideas brought to life.',
      projectsGesture: 'DRAG TO EXPLORE ↔',
      projectsStageAria: 'Projects in a circular gallery. Drag to navigate or use the arrow keys.',
      projectsFiltersAria: 'Filter projects by type',
      projectsFilterAll: 'All',
      projectsFilterSites: 'Websites',
      projectsFilterCommerce: 'E-commerce',
      projectsFilterSystems: 'Systems & Apps',
      projectsFilterAutomation: 'Automations',
      projectsPrevAria: 'Previous view',
      projectsNextAria: 'Next view',
      aboutEyebrow: '03 / ABOUT VORA',
      aboutLine1: "Creativity in action.",
      aboutLine2: "Digital experiences.",
      aboutLine3: "Websites, software, and systems.",
      aboutLine4: "Technology with purpose.",
      aboutSideNote: "STRATEGY / CREATIVITY / TECHNOLOGY",
      aboutDescription1: "At VORA, every project begins with understanding the challenge.",
      aboutDescription2: "We combine creative thinking, strategy, and technological development to build digital solutions that connect each business’s needs with functional, intuitive, and carefully crafted experiences.",
      aboutDescription3: "We don’t start with ready-made solutions. We explore possibilities and develop what makes sense for each unique situation.",
      faqEyebrow: '04 / FREQUENTLY ASKED QUESTIONS',
      faqTitle: 'Before we start.',
      faqLead: 'A few answers about ideas, projects, and how we work.',
      faqQuestion1: "What does VORA develop?",
      faqAnswer1: "We develop corporate websites, landing pages, e-commerce stores, software, custom systems, SaaS applications, digital interfaces, and automations.",
      faqAnswer1b: "Every solution is shaped around the needs of the business, combining strategy, creativity, and technology to deliver functional, intuitive, and well-crafted experiences.",
      faqQuestionProducts: "Can I subscribe to or purchase an existing VORA solution?",
      faqAnswerProducts: "Yes. Alongside custom development, VORA offers digital solutions designed for specific business needs.",
      faqAnswerProductsB: "These include OnTable, Controly, RodaPay, and ConciliaPy. Subscription and purchase options depend on the solution.",
      faqAnswerProductsC: "Get in touch to explore features, availability, and which option suits your operations.",
      faqQuestion2: "How does a project begin?",
      faqAnswer2: "It all starts with a conversation.",
      faqAnswer2b: "We seek to understand your business, your goals, and what needs to be improved or developed.",
      faqAnswer2c: "With that understanding, we explore the possibilities and define the most suitable solution, considering functionality, user experience, and technical feasibility.",
      faqQuestion3: "Does VORA work with existing websites and systems?",
      faqAnswer3: "Yes. We can also help modernize and evolve existing digital solutions.",
      faqAnswer3b: "We assess the current structure to identify improvements, new features, integrations, and ways to enhance the user experience.",
      faqQuestion4: "Do I need to have my idea fully defined?",
      faqAnswer4: "No. You can come to us with an idea, a need, or even a problem you don’t yet know how to solve.",
      faqAnswer4b: "We help turn that starting point into a clear proposal, exploring possibilities and defining the most appropriate development path.",
      faqQuestion5: "Does VORA also develop automations?",
      faqAnswer5: "Yes. We build automations to simplify processes, reduce repetitive tasks, and connect different parts of an operation.",
      faqAnswer5b: "Our goal is to make technology work for the business, bringing more organization, agility, and efficiency to everyday operations.",
      faqQuestion6: "What is the difference between an off-the-shelf solution and a custom system?",
      faqAnswer6: "Off-the-shelf solutions are built to address needs shared by many businesses.",
      faqAnswer6b: "A custom system, on the other hand, is designed around the processes, features, and specific requirements of an individual operation.",
      faqAnswer6c: "At VORA, we assess each need to determine when custom development genuinely makes sense.",
      faqQuestion7: "How can I request a project?",
      faqAnswer7: "Simply get in touch and tell us a little about what you need.",
      faqAnswer7b: "It might be a new website, a system for your company, an automation, or a digital product idea.",
      faqAnswer7c: "From that first conversation, we can understand the challenge and explore the next steps to turn your need into a solution.",
      // ETAPA 06 / CONTACT
      footerKicker: 'HAVE AN IDEA IN MIND?',
      footerStart: 'START A PROJECT',
      footerWork: 'WORK',
      footerAbout: 'ABOUT',
      footerBack: 'BACK TO TOP',
      footerBackAria: 'Back to the top of the page',
      footerCircleAria: 'Talk to VORA about a project',
      footerCircleText: "VORA • STRATEGY • CREATIVITY • INNOVATION •",
      footerWord1: 'STRATEGY', footerWord2: 'DESIGN',
      footerWord3: 'TECHNOLOGY', footerWord4: 'DIGITAL EXPERIENCES',
      footerWord5: 'IDEAS', footerWord6: 'PRODUCTS',
      footerWord7: 'SYSTEMS', footerWord8: 'SOLUTIONS WITH PURPOSE',
      footerMarquee: "CREATIVE SOLUTIONS FOR YOUR BUSINESS.",
      footerTagline: "CREATIVE SOLUTIONS FOR YOUR BUSINESS.",
      contactEyebrow: '05 / START A PROJECT',
      contactTitle1: "LET'S SHAPE",
      contactTitle2: "WHAT'S NEXT.",
      contactDescription: 'Tell us what you want to create, change, or improve. The right solution starts with understanding the challenge.',
      contactNameLabel: 'YOUR NAME *',
      contactNamePlaceholder: 'What should we call you?',
      contactNameError: 'Please enter your name.',
      contactCompanyLabel: 'COMPANY / PROJECT',
      contactOptional: 'OPTIONAL',
      contactCompanyPlaceholder: 'Company or project name',
      contactWhatsappError: 'Enter a valid number with area code.',
      contactEmailLabel: 'YOUR EMAIL *',
      contactEmailPlaceholder: 'you@example.com',
      contactEmailError: 'Enter a valid email address.',
      contactTypeLabel: 'WHAT WOULD YOU LIKE TO DISCUSS? *',
      contactTypePlaceholder: 'Select an option',
      contactTypeExperience: 'Digital experience',
      contactTypeProduct: 'Digital product or system',
      contactTypeVoraSolution: 'Explore an existing VORA solution',
      contactSolutionLabel: 'WHICH SOLUTION INTERESTS YOU? *',
      contactSolutionPlaceholder: 'Select a solution',
      contactSolutionUndecided: 'I am not sure yet',
      contactSolutionError: 'Select a solution or indicate that you are undecided.',
      contactTypeEvolution: 'Improving an existing solution',
      contactTypeAutomation: 'Automation or integration',
      contactTypeOther: 'I have an idea / another challenge',
      contactTypeError: 'Please select an option.',
      contactMessageLabel: 'TELL US ABOUT YOUR CHALLENGE *',
      contactMessagePlaceholder: 'Start with an idea, a challenge, or something you would like to improve.',
      contactMessageError: 'Please enter at least 10 characters.',
      contactSubmit: 'START A CONVERSATION',

      contactCopy: 'COPY MESSAGE',
    }
  };

  const storageKey = 'vora-language';
  const buttons = document.querySelectorAll('[data-language]');

  function readStoredLanguage() {
    try { return localStorage.getItem(storageKey); }
    catch { return null; }
  }

  function storeLanguage(language) {
    try { localStorage.setItem(storageKey, language); }
    catch { /* O site continua funcionando se o storage estiver bloqueado. */ }
  }

  function setLanguage(language) {
    const selected = translations[language] ? language : 'pt-BR';
    const t = translations[selected];

    document.documentElement.lang = selected;
    document.title = t.pageTitle;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = t.pageDescription;

    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.dataset.i18n;
      if (t[key]) element.textContent = t[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
      const key = element.dataset.i18nPlaceholder;
      if (t[key]) element.setAttribute('placeholder', t[key]);
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
      const key = element.dataset.i18nAriaLabel;
      if (t[key]) element.setAttribute('aria-label', t[key]);
    });

    buttons.forEach((button) => {
      const active = button.dataset.language === selected;
      button.classList.toggle('is-current', active);
      button.setAttribute('aria-pressed', String(active));
    });

    storeLanguage(selected);
    document.dispatchEvent(new CustomEvent('vora:languagechange', { detail: { language: selected } }));
  }

  buttons.forEach((button) => {
    button.addEventListener('click', () => setLanguage(button.dataset.language));
  });

  setLanguage(readStoredLanguage() || 'pt-BR');
})();
