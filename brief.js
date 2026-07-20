const form = document.querySelector('#site-brief');
const steps = [...document.querySelectorAll('.brief-step')];
const nextButton = document.querySelector('[data-next]');
const prevButton = document.querySelector('[data-prev]');
const submitButton = document.querySelector('[data-submit]');
const roleInputs = [...form.querySelectorAll('[name="role"]')];
const launchInputs = [...form.querySelectorAll('[name="launchMode"]')];
const paymentInputs = [...form.querySelectorAll('[name="paymentMode"]')];
const resultDialog = document.querySelector('#brief-result');
const scheduleDialog = document.querySelector('#schedule-dialog');
const aiDialog = document.querySelector('#ai-dialog');
let currentStep = 1;
let uploadedPhoto = '';
let uploadedGallery = [];

const text = (name) => form.elements[name]?.value?.trim?.() || '';
const value = (name) => form.elements[name]?.value || '';
const checked = (name) => form.querySelector(`[name="${name}"]:checked`)?.value || '';

const stepMeta = [
  ['Способ запуска', 'Выберите, кто заполнит данные'],
  ['Тип страницы', 'Настроим структуру под вашу роль'],
  ['Информация', 'Заполним содержимое страницы'],
  ['Проверка', 'Подтвердите сценарий запуска']
];

function setStep(number, shouldScroll = true) {
  currentStep = Math.max(1, Math.min(4, number));
  steps.forEach((step, index) => {
    const active = index === currentStep - 1;
    step.hidden = !active;
    step.classList.toggle('is-active', active);
  });
  document.querySelector('[data-progress-number]').textContent = currentStep;
  document.querySelector('[data-progress-title]').textContent = stepMeta[currentStep - 1][0];
  document.querySelector('[data-progress-note]').textContent = stepMeta[currentStep - 1][1];
  document.querySelector('[data-progress-bar]').style.width = `${currentStep * 25}%`;
  document.querySelectorAll('.brief-progress li').forEach((item, index) => item.classList.toggle('is-active', index <= currentStep - 1));
  prevButton.hidden = currentStep === 1;
  nextButton.hidden = currentStep === 4;
  nextButton.disabled = currentStep === 4;
  submitButton.hidden = currentStep !== 4;
  if (currentStep === 3) updateDetailsMode();
  if (currentStep === 4) renderSummary();
  if (shouldScroll) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateRoleFields() {
  const instructor = checked('role') === 'instructor';
  document.querySelector('[data-instructor-payment]').hidden = !instructor;
  document.querySelector('[data-master-fields]').hidden = instructor;
  document.querySelector('[data-instructor-fields]').hidden = !instructor;
  document.querySelector('[data-payment-connection]').hidden = !(instructor && checked('paymentMode') === 'online');
}

function updateDetailsMode() {
  const short = checked('launchMode') === 'manager';
  document.querySelector('[data-short-brief]').hidden = !short;
  document.querySelector('[data-extended-brief]').hidden = short;
  document.querySelector('[data-details-title]').textContent = short ? 'Оставьте источники и контакты' : 'Расскажите о себе и своих услугах';
  document.querySelector('[data-details-lead]').textContent = short
    ? 'Менеджер изучит материалы, при необходимости свяжется с вами и самостоятельно заполнит расширенный бриф.'
    : 'Эти данные автоматически попадут в персональный шаблон.';
  updateRoleFields();
}

function activeRequiredFields() {
  const step = steps[currentStep - 1];
  return [...step.querySelectorAll('[required]')].filter(field => !field.closest('[hidden]'));
}

function validateStep() {
  const invalid = activeRequiredFields().find(field => !field.checkValidity());
  if (invalid) {
    invalid.reportValidity();
    invalid.focus();
    return false;
  }
  return true;
}

function summaryCard(label, title, note) {
  return `<article><small>${label}</small><strong>${title}</strong><span>${note}</span></article>`;
}

function renderSummary() {
  const manager = checked('launchMode') === 'manager';
  const instructor = checked('role') === 'instructor';
  const online = instructor && checked('paymentMode') === 'online';
  const cards = [];
  cards.push(summaryCard('Сценарий', manager ? 'Создание менеджером' : 'Автоматическое создание', manager ? 'Менеджер заполнит расширенный бриф по вашим источникам.' : 'После отправки откроется готовый персональный шаблон.'));
  cards.push(summaryCard('Тип страницы', instructor ? 'Инструктор или эксперт' : 'Мастер или специалист', instructor ? 'Страница обучения, курсов и набора учеников.' : 'Страница услуг, цен и записи клиентов.'));
  if (instructor) cards.push(summaryCard('Оплата', online ? 'Нужно подключить эквайринг' : 'Без онлайн-оплаты', online ? 'Страница сразу собирает заявки, а менеджеру ставится задача на эквайринг.' : 'Страница сразу работает как витрина и форма заявки.'));
  cards.push(summaryCard('Следующий шаг', manager ? 'Заявка менеджеру' : 'Предпросмотр страницы', manager ? 'На боевом сайте заявка создаст процесс в Битрикс24.' : 'Вы увидите результат и сможете вернуться к редактированию.'));
  document.querySelector('[data-summary]').innerHTML = cards.join('');
}

function slugify(input) {
  return input.toLowerCase().trim().replace(/[а-яё]/g, char => ({а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'e',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'c',ч:'ch',ш:'sh',щ:'sch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya'})[char] || '').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}

function parseItems(source) {
  return source.split('\n').map(line => line.trim()).filter(Boolean).map(line => {
    const [name, price = '', meta = ''] = line.split('|').map(part => part.trim());
    return { name, price, meta };
  });
}

function parseLines(source) {
  return source.split('\n').map(line => line.trim()).filter(Boolean);
}

function parseReviews(source) {
  return parseLines(source).map(line => {
    const [author, ...parts] = line.split('|').map(part => part.trim());
    return { author: parts.length ? author : 'Клиент', text: parts.length ? parts.join(' | ') : author };
  });
}

function collectExtendedData() {
  const instructor = checked('role') === 'instructor';
  const paymentMode = instructor ? checked('paymentMode') : 'services';
  const displayName = text('displayName');
  return {
    version: 1,
    createdAt: new Date().toISOString(),
    role: instructor ? 'instructor' : 'master',
    paymentMode,
    displayName,
    profession: text('profession'),
    city: text('city'),
    slug: text('slug') || slugify(displayName),
    headline: text('headline'),
    about: text('about'),
    phone: text('phone'),
    messenger: text('messenger'),
    social: text('social'),
    bookingLink: text('bookingLink'),
    address: text('address'),
    schedule: text('schedule'),
    theme: checked('theme') || 'coral',
    photo: uploadedPhoto,
    advantages: parseLines(text('advantages')),
    gallery: uploadedGallery,
    reviews: parseReviews(text('reviews')).slice(0, 8),
    experience: text('experience'),
    workplace: text('workplace'),
    bookingMode: checked('bookingMode') || 'app',
    audience: text('audience'),
    courseFormat: value('courseFormat'),
    legalStatus: value('legalStatus'),
    acquiring: text('acquiring'),
    items: parseItems(instructor ? text('courses') : text('masterServices')),
    paymentConnectionRequired: instructor && paymentMode === 'online'
  };
}

function collectRequestData() {
  return {
    version: 1,
    createdAt: new Date().toISOString(),
    role: checked('role'),
    paymentMode: checked('role') === 'instructor' ? checked('paymentMode') : 'services',
    name: text('requestName'),
    phone: text('requestPhone'),
    city: text('requestCity'),
    contactMethod: value('contactMethod'),
    contentSources: text('contentSources'),
    sourceNotes: text('sourceNotes'),
    comment: text('requestComment')
  };
}

function saveDraft() {
  const data = {};
  new FormData(form).forEach((val, key) => { if (!(val instanceof File)) data[key] = val; });
  localStorage.setItem('seeuBriefDraft', JSON.stringify(data));
}

function restoreDraft() {
  const raw = localStorage.getItem('seeuBriefDraft');
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    Object.entries(data).forEach(([name, val]) => {
      const fields = [...form.querySelectorAll(`[name="${name}"]`)];
      fields.forEach(field => {
        if (field.type === 'radio' || field.type === 'checkbox') field.checked = field.value === val;
        else if (field.type !== 'file') field.value = val;
      });
    });
  } catch (_) {}
}

function showResult(manager, data) {
  const title = document.querySelector('[data-result-title]');
  const resultText = document.querySelector('[data-result-text]');
  const actions = document.querySelector('[data-result-actions]');
  if (manager) {
    title.textContent = 'Заявка подготовлена';
    resultText.textContent = 'В рабочей версии она создаст процесс в Битрикс24. Менеджер откроет расширенный бриф, изучит указанные источники и подготовит страницу.';
    actions.innerHTML = `<a class="button button-dark" href="create-site.html?manager=1&role=${data.role}&payment=${data.paymentMode}">Открыть бриф менеджера <span>→</span></a><button class="button button-light" type="button" data-close-result>Закрыть</button>`;
  } else {
    title.textContent = 'Черновик страницы готов';
    resultText.textContent = data.paymentConnectionRequired ? 'Страница уже может собирать заявки. Для запуска онлайн-оплаты дополнительно потребуется подключение эквайринга.' : 'Откройте автоматически собранный шаблон и проверьте содержание и оформление.';
    actions.innerHTML = '<a class="button button-dark" href="generated-site.html">Посмотреть страницу <span>→</span></a><button class="button button-light" type="button" data-close-result>Продолжить редактирование</button>';
  }
  resultDialog.showModal();
}

function resizeImage(file, maxSide = 1200, quality = .78) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      image.onerror = reject;
      image.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function readPhotos() {
  const mainFile = form.elements.photo?.files?.[0];
  if (mainFile) uploadedPhoto = await resizeImage(mainFile, 1400, .8);
  const files = [...(form.elements.portfolioPhotos?.files || [])];
  if (files.length > 10) throw new Error('Можно загрузить не более 10 дополнительных фотографий.');
  uploadedGallery = [];
  for (const file of files) uploadedGallery.push(await resizeImage(file, 900, .7));
}

const dayNames = [
  ['Пн', 'Понедельник'], ['Вт', 'Вторник'], ['Ср', 'Среда'], ['Чт', 'Четверг'],
  ['Пт', 'Пятница'], ['Сб', 'Суббота'], ['Вс', 'Воскресенье']
];

function timeOptions(selected) {
  const options = [];
  for (let hour = 8; hour <= 22; hour += 1) {
    for (const minute of [0, 30]) {
      if (hour === 22 && minute === 30) continue;
      const value = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      options.push(`<option${value === selected ? ' selected' : ''}>${value}</option>`);
    }
  }
  return options.join('');
}

function initSchedule() {
  const grid = document.querySelector('[data-schedule-grid]');
  grid.innerHTML = dayNames.map(([short, full], index) => `<div class="schedule-row"><label><input type="checkbox" data-day="${short}"${index < 5 ? ' checked' : ''}><span><b>${short}</b><small>${full}</small></span></label><div class="schedule-time"><select data-time-from aria-label="Начало работы">${timeOptions('09:00')}</select><i>—</i><select data-time-to aria-label="Конец работы">${timeOptions('18:00')}</select></div><em>Выходной</em></div>`).join('');
  grid.querySelectorAll('[data-day]').forEach(input => input.addEventListener('change', () => input.closest('.schedule-row').classList.toggle('is-off', !input.checked)));
  grid.querySelectorAll('[data-day]:not(:checked)').forEach(input => input.closest('.schedule-row').classList.add('is-off'));
}

function saveSchedule() {
  const rows = [...document.querySelectorAll('.schedule-row')];
  const invalid = rows.find(row => row.querySelector('[data-day]').checked && row.querySelector('[data-time-from]').value >= row.querySelector('[data-time-to]').value);
  if (invalid) {
    alert(`Проверьте время: ${invalid.querySelector('[data-day]').dataset.day}. Время окончания должно быть позже начала.`);
    return;
  }
  const parts = rows.map(row => {
    const day = row.querySelector('[data-day]');
    if (!day.checked) return `${day.dataset.day} — выходной`;
    return `${day.dataset.day} ${row.querySelector('[data-time-from]').value}–${row.querySelector('[data-time-to]').value}`;
  });
  form.elements.schedule.value = parts.join('; ');
  document.querySelector('[data-schedule-value]').textContent = parts.join(' · ');
  saveDraft();
  scheduleDialog.close();
}

const aiFields = new Set(['headline', 'about', 'advantages', 'profession', 'sourceNotes', 'requestComment', 'workplace', 'audience', 'masterServices', 'courses', 'reviews']);
function attachAiHelpers() {
  aiFields.forEach(name => {
    const field = form.elements[name];
    if (!field || field instanceof RadioNodeList) return;
    const label = field.closest('label');
    if (!label) return;
    label.classList.add('has-ai');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'ai-assist';
    button.dataset.aiFor = name;
    button.innerHTML = '<span>✦</span> Заполнить с ИИ';
    label.insertBefore(button, field);
  });
}

nextButton.addEventListener('click', () => { if (validateStep()) setStep(currentStep + 1); });
prevButton.addEventListener('click', () => setStep(currentStep - 1));
roleInputs.forEach(input => input.addEventListener('change', updateRoleFields));
launchInputs.forEach(input => input.addEventListener('change', updateDetailsMode));
paymentInputs.forEach(input => input.addEventListener('change', updateRoleFields));
form.addEventListener('input', saveDraft);
form.addEventListener('change', saveDraft);
form.elements.portfolioPhotos?.addEventListener('change', event => {
  const count = event.currentTarget.files.length;
  const note = document.querySelector('[data-gallery-count]');
  if (count > 10) {
    event.currentTarget.value = '';
    note.textContent = 'Можно выбрать не более 10 фотографий.';
    return;
  }
  note.textContent = count ? `Выбрано фотографий: ${count} из 10` : 'До 10 фотографий. Они автоматически оптимизируются перед предпросмотром.';
});

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!validateStep()) return;
  const manager = checked('launchMode') === 'manager';
  try {
    if (manager) {
      const request = collectRequestData();
      localStorage.setItem('seeuManagerRequest', JSON.stringify(request));
      showResult(true, request);
    } else {
      await readPhotos();
      const data = collectExtendedData();
      try { localStorage.setItem('seeuGeneratedSite', JSON.stringify(data)); }
      catch (_) { throw new Error('Фотографии получились слишком большими для предпросмотра. Выберите меньше изображений.'); }
      showResult(false, data);
    }
  } catch (error) {
    alert(error.message || 'Не удалось подготовить результат.');
  }
});

document.addEventListener('click', event => {
  if (event.target.closest('[data-close-result]')) resultDialog.close();
  if (event.target.closest('[data-schedule-open]')) scheduleDialog.showModal();
  if (event.target.closest('[data-schedule-close]')) scheduleDialog.close();
  if (event.target.closest('[data-schedule-save]')) saveSchedule();
  if (event.target.closest('[data-ai-close]')) aiDialog.close();
  const aiButton = event.target.closest('[data-ai-for]');
  if (aiButton) {
    const field = form.elements[aiButton.dataset.aiFor];
    const label = field.closest('label')?.querySelector(':scope > span')?.textContent || 'Текст';
    document.querySelector('[data-ai-label]').textContent = label.replace('*', '').trim();
    document.querySelector('[data-ai-prompt]').value = field.value ? `Улучши этот текст: ${field.value}` : '';
    aiDialog.showModal();
  }
});
resultDialog.addEventListener('click', event => { if (event.target === resultDialog) resultDialog.close(); });

restoreDraft();
initSchedule();
attachAiHelpers();
if (text('schedule')) document.querySelector('[data-schedule-value]').textContent = text('schedule');
const params = new URLSearchParams(location.search);
const requestedRole = params.get('role');
const requestedPayment = params.get('payment');
if (requestedRole && form.querySelector(`[name="role"][value="${requestedRole}"]`)) {
  form.querySelector(`[name="role"][value="${requestedRole}"]`).checked = true;
}
if (requestedPayment && form.querySelector(`[name="paymentMode"][value="${requestedPayment}"]`)) {
  form.querySelector(`[name="paymentMode"][value="${requestedPayment}"]`).checked = true;
}
if (params.get('mode') === 'manager') {
  form.querySelector('[name="launchMode"][value="manager"]').checked = true;
}
if (params.get('manager') === '1') {
  form.querySelector('[name="launchMode"][value="self"]').checked = true;
  const role = params.get('role');
  const payment = params.get('payment');
  if (role && form.querySelector(`[name="role"][value="${role}"]`)) form.querySelector(`[name="role"][value="${role}"]`).checked = true;
  if (payment && form.querySelector(`[name="paymentMode"][value="${payment}"]`)) form.querySelector(`[name="paymentMode"][value="${payment}"]`).checked = true;
}
updateDetailsMode();
updateRoleFields();
setStep(1, false);
