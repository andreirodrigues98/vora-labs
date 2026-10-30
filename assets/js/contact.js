/* VORA | ETAPA 06 / FORMULÁRIO DE CONTATO
 * Configure um número comercial antes de publicar.
 * Exemplo: "5571999999999" (código do país + DDD + número, sem símbolos).
 * NÃO copie o número existente no projeto de referência Commit Labs.
 */
(() => {
  'use strict';

  const VORA_WHATSAPP_NUMBER = ''; // PREENCHER COM O NÚMERO OFICIAL DA VORA
  const form = document.getElementById('vora-contact-form');
  if (!form) return;
  const fallback = document.getElementById('vora-contact-fallback');
  const fallbackMessage = document.getElementById('vora-contact-fallback-message');
  const copyButton = document.getElementById('vora-contact-copy');
  let lastMessage = '';
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
  function message() {
    const selected = form.elements.namedItem('projectType');
    const type = selected instanceof HTMLSelectElement ? selected.selectedOptions[0]?.textContent?.trim() : '';
    const company = value('company') || tr('Não informado', 'Not provided');
    const solution = value('projectType') === 'vora-solution'
      ? solutionSelect.selectedOptions[0]?.textContent?.trim() || ''
      : '';
    const solutionLine = solution ? tr(`\nSolução: ${solution}`, `\nSolution: ${solution}`) : '';
    return tr(
      `Olá, VORA!\n\nMeu nome é ${value('name')}.\nEmpresa / projeto: ${company}\nWhatsApp: ${value('whatsapp')}\nE-mail: ${value('email')}\nInteresse: ${type}${solutionLine}\n\nSobre a necessidade:\n${value('message')}`,
      `Hello, VORA!\n\nMy name is ${value('name')}.\nCompany / project: ${company}\nWhatsApp: ${value('whatsapp')}\nEmail: ${value('email')}\nInterested in: ${type}${solutionLine}\n\nAbout your needs:\n${value('message')}`
    );
  }
  form.addEventListener('input', event => {
    const element = event.target;
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
      if (element.name) mark(element.name, false);
    }
  });
  form.addEventListener('change', event => {
    const element = event.target;
    if (element instanceof HTMLSelectElement && element.name) mark(element.name, false);
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    fallback.hidden = true;
    if (!validate()) return;
    lastMessage = message();

    const number = VORA_WHATSAPP_NUMBER.replace(/\D/g, '');
    if (!number || number.length < 11) {
      fallbackMessage.textContent = tr(
        'O canal de atendimento da VORA ainda não foi configurado neste site. Sua mensagem não foi enviada. Você pode copiá-la para guardar os dados.',
        'VORA’s contact channel has not been configured on this site yet. Your message was not sent. You can copy it to keep the details.'
      );
      fallback.hidden = false;
      return;
    }

    const destination = `https://wa.me/${number}?text=${encodeURIComponent(lastMessage)}`;
    const popup = window.open(destination, '_blank');
    if (popup) { try { popup.opener = null; } catch {} }
    // O WhatsApp será aberto para confirmação manual pelo visitante;
    // abrir a aba não significa que a mensagem foi enviada.
    if (!popup) {
      fallbackMessage.textContent = tr(
        'Não foi possível abrir o WhatsApp. Copie a mensagem ou tente novamente. Nada foi enviado.',
        'We could not open WhatsApp. Copy the message or try again. Nothing has been sent.'
      );
      fallback.hidden = false;
    }
  });
  copyButton?.addEventListener('click', async () => {
    if (!lastMessage) return;
    try {
      await navigator.clipboard.writeText(lastMessage);
    } catch {
      const field = document.createElement('textarea');
      field.value = lastMessage; field.style.position = 'fixed'; field.style.opacity = '0';
      document.body.appendChild(field); field.select();
      try { document.execCommand('copy'); } finally { field.remove(); }
    }
    copyButton.textContent = tr('COPIADO', 'COPIED');
    window.setTimeout(() => { copyButton.textContent = tr('COPIAR MENSAGEM', 'COPY MESSAGE'); }, 1500);
  });
})();
