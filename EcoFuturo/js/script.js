/* EcoFuturo: menu, tema, navegação, curiosidades e formulários */
document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false');
    }));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') { nav.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.focus(); }
    });
  }

  const themeToggle = document.querySelector('.theme-toggle');
  const savedTheme = localStorage.getItem('ecofuturo-theme');
  if (savedTheme === 'dark') body.classList.add('dark-theme');
  const updateThemeLabel = () => {
    if (!themeToggle) return;
    themeToggle.setAttribute('aria-label', body.classList.contains('dark-theme') ? 'Ativar tema claro' : 'Ativar tema escuro');
    themeToggle.title = body.classList.contains('dark-theme') ? 'Ativar tema claro' : 'Ativar tema escuro';
  };
  updateThemeLabel();
  themeToggle?.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    localStorage.setItem('ecofuturo-theme', body.classList.contains('dark-theme') ? 'dark' : 'light');
    updateThemeLabel();
  });

  const backTop = document.querySelector('.back-top');
  const updateBackTop = () => backTop?.classList.toggle('visible', window.scrollY > 420);
  window.addEventListener('scroll', updateBackTop, { passive: true }); updateBackTop();
  backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const revealTargets = document.querySelectorAll('.topic-card,.action-card,.pillar-card,.issue-row,.solution-card,.belief-image,.quote-panel,.contact-form');
  revealTargets.forEach(el => el.classList.add('reveal'));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    revealTargets.forEach(el => observer.observe(el));
  } else revealTargets.forEach(el => el.classList.add('is-visible'));

  const facts = [
    'Árvores e outras plantas ajudam a retirar dióxido de carbono da atmosfera durante a fotossíntese.',
    'A biodiversidade inclui a variedade de genes, espécies e ecossistemas que compõem a vida na Terra.',
    'A água doce disponível para uso humano representa apenas uma parte da água existente no planeta.',
    'Reciclar é importante, mas reduzir o consumo e reutilizar materiais também ajudam a evitar resíduos.',
    'Ecossistemas saudáveis podem contribuir para regular o clima, proteger solos e sustentar a vida.'
  ];
  const factText = document.querySelector('#fact-text');
  document.querySelector('#new-fact')?.addEventListener('click', () => {
    let next; do { next = Math.floor(Math.random() * facts.length); } while (factText?.textContent === facts[next]);
    if (factText) factText.textContent = facts[next];
  });

  const impactForm = document.querySelector('#impact-form');
  impactForm?.addEventListener('submit', event => {
    event.preventDefault();
    if (!impactForm.reportValidity()) return;
    const shower = Number(impactForm.elements.shower.value);
    const trips = Number(impactForm.elements.trips.value);
    const bags = Number(impactForm.elements.bags.value);
    const recycling = impactForm.elements.recycling.checked;
    const suggestions = [];
    if (shower > 10) suggestions.push('Observe se é possível reduzir alguns minutos do banho, sem comprometer suas necessidades.');
    else suggestions.push('Seu tempo informado de banho já é um bom ponto de partida; procure evitar desperdício enquanto a água aquece.');
    if (trips > 3) suggestions.push('Para trajetos seguros e viáveis, avalie combinar viagens, compartilhar caronas ou usar transporte coletivo.');
    else suggestions.push('Quando couber na rotina, caminhar ou pedalar em trajetos curtos pode ser uma alternativa.');
    if (bags > 0) suggestions.push('Experimente levar uma sacola reutilizável nas próximas compras.');
    else suggestions.push('Continue evitando sacolas descartáveis e mantenha uma alternativa reutilizável à mão.');
    suggestions.push(recycling ? 'Ótimo: mantenha a separação conforme as regras de coleta da sua região.' : 'Veja como funciona a coleta seletiva na sua região e comece separando materiais aceitos.');
    const result = document.querySelector('#impact-result');
    result.innerHTML = '<strong>Seu retrato educativo</strong><p>As respostas ajudam a refletir sobre hábitos; não são uma medição científica do seu impacto.</p><ul>' + suggestions.map(item => `<li>${item}</li>`).join('') + '</ul>';
  });

  const contactForm = document.querySelector('#contact-form');
  contactForm?.addEventListener('submit', event => {
    event.preventDefault();
    const fields = ['name', 'email', 'subject', 'message'];
    const errors = { name: 'Informe seu nome (ao menos 2 caracteres).', email: 'Digite um e-mail válido.', subject: 'Selecione um assunto.', message: 'Escreva uma mensagem com pelo menos 10 caracteres.' };
    let valid = true;
    fields.forEach(name => {
      const input = contactForm.elements[name];
      const wrapper = input.closest('.field');
      const error = document.querySelector(`#${name}-error`);
      let ok = input.checkValidity();
      if (name === 'email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      wrapper?.classList.toggle('invalid', !ok);
      if (error) error.textContent = ok ? '' : errors[name];
      if (!ok) valid = false;
    });
    const result = document.querySelector('#contact-result');
    if (!valid) {
      result.className = 'contact-result error'; result.textContent = 'Revise os campos indicados antes de continuar.';
      contactForm.querySelector('.field.invalid input, .field.invalid select, .field.invalid textarea')?.focus(); return;
    }
    result.className = 'contact-result';
    result.textContent = `Obrigado, ${contactForm.elements.name.value.trim()}! Esta é uma confirmação demonstrativa: a mensagem não foi transmitida nem armazenada.`;
    contactForm.reset();
  });
  contactForm?.querySelectorAll('input,select,textarea').forEach(input => input.addEventListener('input', () => {
    input.closest('.field')?.classList.remove('invalid');
    const error = document.querySelector(`#${input.name}-error`); if (error) error.textContent = '';
  }));
});
