/* VORA | Formulário -> Apps Script -> Google Sheets -> WhatsApp.
 * POST no-cors + consulta de protocolo em modo leitura (JSONP).
 * O WhatsApp só é liberado depois de confirmar o protocolo no Sheets.
 */
(() => {
  'use strict';

  const VORA_WHATSAPP_NUMBER = '5571982564207';
  const VORA_CONTACT_API_URL = 'https://script.google.com/macros/s/AKfycbziZcMPeEicHUvwplrTqxWINTWV421-rjxqi7NOsBAJ9SeT0kSK1Sntq1U2uyKEQQX_/exec';
  const form = document.getElementById('vora-contact-form');
  if (!form) return;
  const errorMessage = document.getElementById('vora-contact-error');
  const submitButton = form.querySelector('.project-form__submit');
  const submitText = form.querySelector('.project-form__submit-text');
  let lastSubmissionId = '';
  let saving = false;
  let stored = false;
  const projectTypeSelect = document.getElementById('contact-project-type');
  const solutionField = document.getElementById('vora-solution-field');
  const solutionSelect = document.getElementById('contact-vora-solution');
  const messageNumber = document.getElementById('contact-message-number');
  const whatsappInput = document.getElementById('contact-whatsapp');

  // Máscara brasileira: bloqueia caracteres não numéricos ANTES da digitação.
  // A entrada permanece do tipo "tel" para abrir o teclado numérico no celular.
  const digitsOnly = text => String(text).replace(/\D/g, '');

  function phoneDigits(text) {
    let digits = digitsOnly(text);
    // Permite colar números com o código brasileiro (+55), sem duplicá-lo no campo.
    if (digits.length > 11 && digits.startsWith('55')) digits = digits.slice(2);
    return digits.slice(0, 11);
  }

  function formatWhatsapp(digits) {
    if (!digits) return '';
    if (digits.length <= 2) return `(${digits}`;

    const area = digits.slice(0, 2);
    const subscriber = digits.slice(2);
    // Celular: (71) 98256-4207; fixo: (71) 3256-4207.
    const firstGroupSize = subscriber.startsWith('9') || digits.length === 11 ? 5 : 4;
    const first = subscriber.slice(0, firstGroupSize);
    const last = subscriber.slice(firstGroupSize);
    return `(${area}) ${first}${last ? `-${last}` : ''}`;
  }

  function cursorAfterDigits(formatted, count) {
    if (count === 0) return 0;
    let seen = 0;
    for (let i = 0; i < formatted.length; i++) {
      if (/\d/.test(formatted[i]) && ++seen === count) return i + 1;
    }
    return formatted.length;
  }

  function updateWhatsapp(rawDigits, caretDigits, atEnd = false) {
    const digits = phoneDigits(rawDigits);
    const formatted = formatWhatsapp(digits);
    whatsappInput.value = formatted;
    const cursor = atEnd ? formatted.length : cursorAfterDigits(formatted, Math.min(caretDigits, digits.length));
    try { whatsappInput.setSelectionRange(cursor, cursor); } catch { /* Navegador sem seleção de tel. */ }
  }

  function normalizeWhatsapp() {
    if (!whatsappInput) return;
    const original = whatsappInput.value;
    const start = whatsappInput.selectionStart ?? original.length;
    const caretDigits = digitsOnly(original.slice(0, start)).length;
    const atEnd = start === original.length;
    const allDigits = digitsOnly(original);
    const prefixLength = allDigits.length > 11 && allDigits.startsWith('55') ? 2 : 0;
    updateWhatsapp(original, Math.max(0, caretDigits - prefixLength), atEnd);
  }

  if (whatsappInput) {
    // Proteção para teclado físico e para teclados que usam o evento beforeinput.
    whatsappInput.addEventListener('keydown', event => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key.length === 1 && !/^[0-9]$/.test(event.key)) event.preventDefault();
    });

    whatsappInput.addEventListener('beforeinput', event => {
      if (event.inputType === 'insertText' && event.data && /[^0-9]/.test(event.data)) {
        event.preventDefault();
        return;
      }
      // Backspace/Delete removem um dígito, nunca ficam presos nos parênteses ou hífen.
      if (event.inputType !== 'deleteContentBackward' && event.inputType !== 'deleteContentForward') return;
      const start = whatsappInput.selectionStart;
      const end = whatsappInput.selectionEnd;
      if (start === null || end === null || start !== end) return;

      const oldDigits = digitsOnly(whatsappInput.value);
      const index = digitsOnly(whatsappInput.value.slice(0, start)).length;
      const remove = event.inputType === 'deleteContentBackward' ? index - 1 : index;
      if (remove < 0 || remove >= oldDigits.length) return;
      event.preventDefault();
      updateWhatsapp(oldDigits.slice(0, remove) + oldDigits.slice(remove + 1), remove);
      whatsappInput.dispatchEvent(new Event('input', { bubbles: true }));
    });

    // Colagem insere apenas os dígitos e já aplica a máscara (inclui números com +55).
    whatsappInput.addEventListener('paste', event => {
      event.preventDefault();
      const pasted = event.clipboardData?.getData('text') || '';
      const inserted = digitsOnly(pasted);
      if (!inserted) return;
      const start = whatsappInput.selectionStart ?? whatsappInput.value.length;
      const end = whatsappInput.selectionEnd ?? start;
      const before = digitsOnly(whatsappInput.value.slice(0, start));
      const after = digitsOnly(whatsappInput.value.slice(end));
      const combined = before + inserted + after;
      const skipCountry = combined.length > 11 && combined.startsWith('55') ? 2 : 0;
      updateWhatsapp(combined, Math.max(0, before.length + inserted.length - skipCountry), !after);
      whatsappInput.dispatchEvent(new Event('input', { bubbles: true }));
    });

    // Segurança para autofill, ditado, arrastar texto e teclados sem beforeinput.
    whatsappInput.addEventListener('input', normalizeWhatsapp);
    whatsappInput.addEventListener('change', normalizeWhatsapp);
    normalizeWhatsapp();
  }

  function syncSolutionField() {
    const visible = value('projectType') === 'vora-solution';
    solutionField.hidden = !visible;
    solutionSelect.disabled = !visible;
    solutionSelect.required = visible;
    messageNumber.textContent = visible ? '07' : '06';
    if (!visible) {
      solutionSelect.value = '';
      mark('voraSolution', false);
    }
  }
  projectTypeSelect?.addEventListener('change', syncSolutionField);
  syncSolutionField();

  function language() { return document.documentElement.lang.toLowerCase().startsWith('en') ? 'en' : 'pt'; }
  function tr(pt, en) { return language() === 'en' ? en : pt; }
  function value(name) { return String(form.elements.namedItem(name)?.value || '').trim(); }
  function mark(name, invalid) {
    const parent = form.querySelector(`[data-field="${name}"]`);
    const element = form.elements.namedItem(name);
    parent?.classList.toggle('is-invalid', invalid);
    if (element) element.setAttribute('aria-invalid', String(invalid));
  }
  function validate() {
    normalizeWhatsapp();
    const digits = phoneDigits(value('whatsapp'));
    const checks = {
      name: value('name').length >= 2,
      whatsapp: digits.length === 10 || digits.length === 11,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value('email')),
      projectType: Boolean(value('projectType')),
      ...(value('projectType') === 'vora-solution' ? { voraSolution: Boolean(value('voraSolution')) } : {}),
      message: value('message').length >= 10
    };
    Object.entries(checks).forEach(([name, valid]) => mark(name, !valid));
    if (Object.values(checks).every(Boolean)) return true;
    form.querySelector('.project-form__field.is-invalid input, .project-form__field.is-invalid select, .project-form__field.is-invalid textarea')?.focus();
    return false;
  }
  // O registro completo segue para o Sheets. O WhatsApp recebe somente um resumo.
  function choiceLabel(name) {
    const select = form.elements.namedItem(name);
    return select instanceof HTMLSelectElement
      ? select.selectedOptions[0]?.textContent?.trim() || ''
      : '';
  }

  function generateSubmissionId() {
    if (window.crypto?.randomUUID) return `vora-${window.crypto.randomUUID()}`;
    const bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);
    return `vora-${Array.from(bytes, value => value.toString(16).padStart(2, '0')).join('')}`;
  }

  function payload() {
    if (!lastSubmissionId) lastSubmissionId = generateSubmissionId();
    const chosenType = value('projectType');
    return {
      id: lastSubmissionId,
      name: value('name'),
      company: value('company'),
      whatsapp: value('whatsapp'),
      email: value('email'),
      projectType: chosenType,
      projectTypeLabel: choiceLabel('projectType'),
      voraSolution: chosenType === 'vora-solution' ? value('voraSolution') : '',
      voraSolutionLabel: chosenType === 'vora-solution' ? choiceLabel('voraSolution') : '',
      message: value('message'),
      language: document.documentElement.lang || 'pt-BR',
      page: `${window.location.origin}${window.location.pathname}`,
      website: value('website') // Honeypot anti-spam (campo invisível).
    };
  }

  // Uma mensagem autoexplicativa: o atendimento funciona mesmo sem consultar a planilha.
  // O ID permanece interno, apenas para verificar gravação/evitar duplicidade.
  function whatsappMessage() {
    const name = value('name');
    const company = value('company');
    const type = choiceLabel('projectType');
    const solution = value('projectType') === 'vora-solution' ? choiceLabel('voraSolution') : '';
    const challenge = value('message');
    return tr(
      `Olá, equipe VORA! Sou ${name} e gostaria de conversar sobre meu projeto.\n\n` +
      `*Interesse:* ${type}\n` +
      (solution ? `*Solução:* ${solution}\n` : '') +
      (company ? `*Empresa/projeto:* ${company}\n` : '') +
      `*WhatsApp:* ${value('whatsapp')}\n` +
      `*E-mail:* ${value('email')}\n\n` +
      `*O que preciso:*\n${challenge}\n\n` +
      `Podemos conversar sobre os próximos passos?`,
      `Hello, VORA team! I'm ${name}, and I'd like to discuss my project.\n\n` +
      `*I'm interested in:* ${type}\n` +
      (solution ? `*Solution:* ${solution}\n` : '') +
      (company ? `*Company/project:* ${company}\n` : '') +
      `*WhatsApp:* ${value('whatsapp')}\n` +
      `*Email:* ${value('email')}\n\n` +
      `*What I'm looking for:*\n${challenge}\n\n` +
      `Could we talk about the next steps?`
    );
  }

  function showError(message = '') {
    errorMessage.textContent = message;
    errorMessage.hidden = !message;
  }

  function resetResult() {
    if (saving) return;
    stored = false;
    lastSubmissionId = '';
    showError();
  }

  function openWhatsapp() {
    // Navegação na aba atual funciona após o processamento assíncrono,
    // sem pop-up nem necessidade de um segundo clique.
    const url = `https://wa.me/${VORA_WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage())}`;
    window.location.assign(url);
  }

  function setSaving(active) {
    saving = active;
    submitButton.disabled = active;
    form.setAttribute('aria-busy', String(active));
    submitText.textContent = active
      ? tr('INICIANDO...', 'STARTING...')
      : tr('INICIAR CONVERSA', 'START A CONVERSATION');
  }

  document.addEventListener('vora:languagechange', () => {
    setSaving(saving);
    if (!errorMessage.hidden) showError(tr(
      'Não conseguimos iniciar a conversa agora. Tente novamente em instantes.',
      'We couldn’t start the conversation right now. Please try again in a moment.'
    ));
  });

  form.addEventListener('input', event => {
    const element = event.target;
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
      if (element.name) mark(element.name, false);
      resetResult();
    }
  });
  form.addEventListener('change', event => {
    const element = event.target;
    if (element instanceof HTMLSelectElement && element.name) mark(element.name, false);
    resetResult();
  });

  // O navegador não pode ler diretamente a resposta do POST do Apps Script por CORS.
  // Portanto, o envio é no-cors e a confirmação é uma consulta SOMENTE-LEITURA
  // por protocolo aleatório. O Apps Script não retorna dados pessoais no status.
  function queryRecordStatus(id) {
    return new Promise(resolve => {
      const random = new Uint8Array(12);
      window.crypto.getRandomValues(random);
      const callback = '__voraStatus_' + Array.from(random, n => n.toString(16).padStart(2, '0')).join('');
      const script = document.createElement('script');
      let settled = false;
      let timeout;
      const done = result => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeout);
        script.remove();
        delete window[callback];
        resolve(result);
      };
      window[callback] = result => done(result);
      script.onerror = () => done(null);
      const query = new URLSearchParams({ action: 'status', id, callback, _: String(Date.now()) });
      script.src = `${VORA_CONTACT_API_URL}?${query}`;
      script.async = true;
      script.referrerPolicy = 'no-referrer';
      timeout = window.setTimeout(() => done(null), 6500);
      document.head.appendChild(script);
    });
  }

  async function checkSheetConfirmation(id) {
    for (let attempt = 0; attempt < 5; attempt++) {
      const response = await queryRecordStatus(id);
      if (response?.ok === true && response?.id === id && response?.found === true) return true;
      if (attempt < 4) await new Promise(resolve => window.setTimeout(resolve, 1500));
    }
    return false;
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (saving) return;
    if (stored) {
      openWhatsapp();
      return;
    }
    if (!validate()) return;

    const data = payload();
    setSaving(true);
    showError();
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      // O POST não expõe a resposta em navegadores comuns (CORS).
      // O Apps Script confirma a gravação por uma consulta somente-leitura.
      try {
        await fetch(VORA_CONTACT_API_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(data),
          signal: controller.signal,
          cache: 'no-store'
        });
      } catch (error) {
        console.warn('VORA: envio sem resposta; conferindo o registro.', error);
      }
      const confirmed = await checkSheetConfirmation(data.id);
      if (!confirmed) throw new Error('Registro não confirmado');

      stored = true;
      openWhatsapp();
    } catch (error) {
      console.warn('VORA: não foi possível confirmar a solicitação:', error);
      // O mesmo ID interno será usado na próxima tentativa; evita duplicação.
      showError(tr(
        'Não conseguimos iniciar a conversa agora. Tente novamente em instantes.',
        'We couldn’t start the conversation right now. Please try again in a moment.'
      ));
    } finally {
      window.clearTimeout(timeout);
      setSaving(false);
    }
  });

})();
