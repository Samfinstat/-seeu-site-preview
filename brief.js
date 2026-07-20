const form = document.querySelector('#site-brief');
const steps = [...document.querySelectorAll('.brief-step')];
const nextButton = document.querySelector('[data-next]');
const prevButton = document.querySelector('[data-prev]');
const submitButton = document.querySelector('[data-submit]');
const roleInputs = [...form.querySelectorAll('[name="role"]')];
const launchInputs = [...form.querySelectorAll('[name="launchMode"]')];
const paymentInputs = [...form.querySelectorAll('[name="paymentMode"]')];
const resultDialog = document.querySelector('#brief-result');
let currentStep = 1;
let uploadedPhoto = '';

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
    gallery: parseLines(text('portfolioLinks')).slice(0, 8),
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

async function readPhoto() {
  const file = form.elements.photo?.files?.[0];
  if (!file) return uploadedPhoto;
  if (file.size > 1.5 * 1024 * 1024) throw new Error('Выберите фотографию размером до 1,5 МБ.');
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

nextButton.addEventListener('click', () => { if (validateStep()) setStep(currentStep + 1); });
prevButton.addEventListener('click', () => setStep(currentStep - 1));
roleInputs.forEach(input => input.addEventListener('change', updateRoleFields));
launchInputs.forEach(input => input.addEventListener('change', updateDetailsMode));
paymentInputs.forEach(input => input.addEventListener('change', updateRoleFields));
form.addEventListener('input', saveDraft);
form.addEventListener('change', saveDraft);

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
      uploadedPhoto = await readPhoto();
      const data = collectExtendedData();
      localStorage.setItem('seeuGeneratedSite', JSON.stringify(data));
      showResult(false, data);
    }
  } catch (error) {
    alert(error.message || 'Не удалось подготовить результат.');
  }
});

document.addEventListener('click', event => {
  if (event.target.closest('[data-close-result]')) resultDialog.close();
});
resultDialog.addEventListener('click', event => { if (event.target === resultDialog) resultDialog.close(); });

restoreDraft();
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
