const fallback = {
  role: 'master', paymentMode: 'services', displayName: 'Анна Волкова', profession: 'Мастер маникюра', city: 'Самара', slug: 'anna-volkova',
  headline: 'Маникюр, к которому хочется возвращаться', about: 'Я создаю аккуратный и ноский маникюр, внимательно отношусь к пожеланиям и всегда заранее объясняю стоимость и этапы работы.',
  phone: '+7 999 000-00-00', messenger: '', social: '', bookingLink: '', appBookingLink: '', requestTelegram: '', requestWhatsApp: '', requestEmail: '', address: 'Центр Самары', schedule: 'Пн–Сб, 10:00–20:00', theme: 'coral', customColor: '#A779DC', photo: '', experience: '6 лет', workplace: 'Студия в центре города', bookingMode: 'app',
  ownerLegalStatus: '', ownerLegalName: '', ownerInn: '', ownerOgrn: '', ownerAddress: '', ownerEmail: '', ownerPhone: '', ownerServiceDescription: 'Информационно-консультационные услуги и предоставление доступа к информационным материалам', ownerSettlementAccount: '', ownerBankName: '', ownerBik: '', ownerCorrespondentAccount: '', acquiring: '', onlineDataMode: 'ecosystem',
  advantages: ['Бережная работа', 'Цена известна заранее', 'Удобная запись'], gallery: [], reviews: [], reviewImages: [],
  customBlocks: [],
  items: [{name:'Маникюр с покрытием',price:'2 300 ₽',meta:'2 часа'},{name:'Снятие и маникюр',price:'1 400 ₽',meta:'1,5 часа'},{name:'Укрепление ногтей',price:'700 ₽',meta:'30 минут'}]
};

let data = fallback;
try { data = { ...fallback, ...JSON.parse(localStorage.getItem('seeuGeneratedSite') || '{}') }; } catch (_) {}
const instructor = data.role === 'instructor';
const onlinePending = instructor && data.paymentMode === 'online';
const seeUEcosystem = data.useSeeUEcosystem === true || (!instructor && data.bookingMode === 'app') || (onlinePending && data.onlineDataMode !== 'own');
const setText = (selector, content) => document.querySelectorAll(selector).forEach(node => node.textContent = content);

function customPalette(hex) {
  const value = /^#[0-9a-f]{6}$/i.test(hex || '') ? hex : '#A779DC';
  const number = parseInt(value.slice(1), 16);
  const rgb = [number >> 16, (number >> 8) & 255, number & 255];
  const second = rgb.map((channel, index) => Math.round(channel * .62 + [255, 176, 104][index] * .38));
  const soft = rgb.map(channel => Math.round(channel * .12 + 255 * .88));
  const toHex = channels => `#${channels.map(channel => channel.toString(16).padStart(2, '0')).join('')}`;
  return { accent: value, second: toHex(second), soft: toHex(soft) };
}

document.body.dataset.theme = data.theme || 'coral';
if (data.theme === 'custom') {
  const palette = customPalette(data.customColor);
  document.body.style.setProperty('--accent', palette.accent);
  document.body.style.setProperty('--accent-2', palette.second);
  document.body.style.setProperty('--accent-soft', palette.soft);
}
document.title = `${data.displayName} — ${data.profession}`;
setText('[data-name], [data-footer-name]', data.displayName);
setText('[data-footer-profession]', data.profession);
setText('[data-city]', data.city);
setText('[data-headline]', data.headline);
setText('[data-about]', data.about || (instructor ? 'Расскажите о своём опыте, методике и результатах учеников.' : 'Расскажите о своём опыте, подходе и о том, почему клиенты выбирают именно вас.'));
setText('[data-about-title]', instructor ? 'Передаю практический опыт и помогаю расти в профессии' : 'Работаю внимательно и с заботой о результате');
setText('[data-role-label]', `${data.profession} · ${data.city}`.toUpperCase());

const values = data.advantages?.length ? data.advantages : fallback.advantages;
const valuesContainer = document.querySelector('[data-values]');
valuesContainer.innerHTML = '';
values.forEach(value => {
  const item = document.createElement('span');
  item.textContent = `✓ ${value}`;
  valuesContainer.append(item);
});

if (data.photo) document.querySelectorAll('[data-photo], [data-about-photo]').forEach(img => img.src = data.photo);
else if (instructor) document.querySelectorAll('[data-photo], [data-about-photo]').forEach(img => img.src = 'assets/lifestyle-instructor.webp');

const experienceWrap = document.querySelector('[data-experience-wrap]');
if (data.experience) setText('[data-experience]', data.experience); else if (instructor) experienceWrap.hidden = true;

if (instructor) {
  setText('[data-items-link]', 'Курсы');
  setText('[data-items-label]', 'КУРСЫ И ПРОГРАММЫ');
  setText('[data-items-title]', 'Выберите направление обучения');
  setText('[data-items-lead]', data.audience ? `Программы для: ${data.audience}. Можно задать вопросы перед подачей заявки.` : 'Изучите программу, формат и условия обучения перед подачей заявки.');
  setText('[data-primary-cta]', onlinePending ? 'Оставить заявку' : 'Подать заявку');
  setText('[data-secondary-cta]', 'Посмотреть курсы');
  setText('[data-format-label]', 'Формат');
  setText('[data-format]', data.courseFormat || 'Онлайн');
  setText('[data-hero-text]', 'Программы с понятной структурой, поддержкой и практикой для роста в профессии.');
  setText('[data-photo-title]', 'Набор на обучение открыт');
  setText('[data-photo-note]', onlinePending ? 'Оплата подключается — заявки уже принимаются' : 'Оставьте заявку и получите подробности');
  setText('[data-process-title]', 'От выбора программы до первого урока');
  setText('[data-step-one]', 'Выберите программу');
  setText('[data-step-one-note]', 'Посмотрите содержание, формат и продолжительность.');
  setText('[data-step-two]', onlinePending ? 'Оставьте заявку' : 'Отправьте заявку');
  setText('[data-step-two-note]', onlinePending ? 'Пока подключается эквайринг, мы свяжемся для оформления.' : 'Укажите контакты и задайте оставшиеся вопросы.');
  setText('[data-step-three]', 'Начните обучение');
  setText('[data-step-three-note]', 'После оформления получите информацию и доступ.');
  setText('[data-final-title]', 'Выберите программу обучения');
  setText('[data-final-text]', 'Оставьте заявку — отвечу на вопросы о программе, формате и ближайшем наборе.');
} else {
  setText('[data-format]', data.bookingMode === 'app' ? 'Через SeeU' : 'По заявке');
  setText('[data-hero-text]', data.workplace ? `${data.workplace}. Понятные цены и удобная запись без долгой переписки.` : 'Понятные цены и удобная запись без долгой переписки.');
  if (seeUEcosystem) {
    setText('[data-step-two]', 'Перейдите в SeeU');
    setText('[data-step-two-note]', 'Запись и общение с мастером доступны только внутри приложения.');
    setText('[data-step-three]', 'Получите подтверждение');
    setText('[data-step-three-note]', 'Все детали записи сохранятся в вашем профиле SeeU.');
    setText('[data-final-text]', 'Запись, вопросы и общение с мастером проходят только внутри экосистемы SeeU.');
  }
}

const defaults = instructor
  ? [{name:'Базовый курс',price:'25 000 ₽',meta:'6 недель'},{name:'Повышение квалификации',price:'12 000 ₽',meta:'2 дня'}]
  : fallback.items;
const items = data.items?.length ? data.items : defaults;
const itemsContainer = document.querySelector('[data-items]');
itemsContainer.innerHTML = '';
items.forEach((item, index) => {
  const article = document.createElement('article');
  article.className = 'profile-item';
  const number = document.createElement('small'); number.textContent = `${instructor ? 'ПРОГРАММА' : 'УСЛУГА'} ${String(index + 1).padStart(2,'0')}`;
  const title = document.createElement('h3'); title.textContent = item.name;
  const description = document.createElement('p'); description.textContent = instructor ? 'Подробная программа и результаты обучения будут размещены в этой карточке.' : 'Описание услуги и важные детали перед записью будут размещены здесь.';
  const footer = document.createElement('footer');
  const price = document.createElement('strong'); price.textContent = item.price || 'По запросу';
  const meta = document.createElement('span'); meta.textContent = item.meta || '';
  footer.append(price, meta); article.append(number, title, description, footer); itemsContainer.append(article);
});

const gallery = Array.isArray(data.gallery) ? data.gallery.filter(Boolean) : [];
if (gallery.length) {
  document.querySelector('[data-gallery-section]').hidden = false;
  document.querySelector('[data-gallery-link]').hidden = false;
  setText('[data-gallery-title]', instructor ? 'Обучение и результаты учеников' : 'Примеры работ');
  const galleryContainer = document.querySelector('[data-gallery]');
  gallery.forEach((src, index) => {
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = src;
    img.alt = instructor ? `Фото с обучения ${index + 1}` : `Пример работы ${index + 1}`;
    img.loading = 'lazy';
    figure.append(img);
    galleryContainer.append(figure);
  });
}

const reviews = Array.isArray(data.reviews) ? data.reviews.filter(review => review?.text) : [];
const reviewImages = Array.isArray(data.reviewImages) ? data.reviewImages.filter(Boolean) : [];
if (reviews.length || reviewImages.length) {
  document.querySelector('[data-reviews-section]').hidden = false;
  const reviewsContainer = document.querySelector('[data-reviews]');
  reviews.forEach(review => {
    const article = document.createElement('article');
    const quote = document.createElement('p');
    quote.textContent = `«${review.text}»`;
    const author = document.createElement('strong');
    author.textContent = review.author || (instructor ? 'Ученик' : 'Клиент');
    article.append(quote, author);
    reviewsContainer.append(article);
  });
  reviewImages.forEach((src, index) => {
    const figure = document.createElement('figure');
    figure.className = 'profile-review-shot';
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Скриншот отзыва ${index + 1}`;
    img.loading = 'lazy';
    figure.append(img);
    reviewsContainer.append(figure);
  });
}

const phoneHref = (data.phone || '').replace(/[^+\d]/g,'');
const telegramHref = data.requestTelegram ? (data.requestTelegram.startsWith('http') ? data.requestTelegram : `https://t.me/${data.requestTelegram.replace(/^@/, '')}`) : '';
const whatsappDigits = (data.requestWhatsApp || '').replace(/\D/g, '');
const whatsappHref = data.requestWhatsApp ? (data.requestWhatsApp.startsWith('http') ? data.requestWhatsApp : `https://wa.me/${whatsappDigits}`) : '';
const emailHref = data.requestEmail ? `mailto:${data.requestEmail}` : '';
let contact = data.bookingLink || data.messenger || (phoneHref ? `tel:${phoneHref}` : '#');
let contactLabel = instructor ? 'Оставить заявку' : 'Записаться';
if (seeUEcosystem) {
  contact = data.appBookingLink || '#contact';
  contactLabel = instructor ? 'Перейти в SeeU' : 'Записаться в SeeU';
} else if (!instructor && data.bookingMode === 'request') {
  contact = telegramHref || whatsappHref || emailHref || contact;
  contactLabel = telegramHref ? 'Написать в Telegram' : whatsappHref ? 'Написать в WhatsApp' : emailHref ? 'Написать на почту' : 'Оставить заявку';
}
document.querySelectorAll('[data-contact-button], .profile-contact-link, [data-primary-cta]').forEach(link => {
  link.href = contact;
  if (!link.matches('[data-primary-cta]') || seeUEcosystem) link.textContent = contactLabel;
});
const phoneLink = document.querySelector('[data-phone]');
phoneLink.hidden = seeUEcosystem;
if (seeUEcosystem) {
  phoneLink.removeAttribute('href');
  setText('[data-final-text]', instructor
    ? 'Заявка, вопросы и доступ к обучению оформляются только внутри экосистемы SeeU.'
    : 'Запись, вопросы и общение с мастером проходят только внутри экосистемы SeeU.');
} else {
  phoneLink.href = phoneHref ? `tel:${phoneHref}` : '#';
  phoneLink.textContent = data.phone || 'Связаться';
}
document.querySelector('[data-payment-note]').hidden = !onlinePending;

if (data.address) {
  document.querySelector('[data-address-wrap]').hidden = false;
  setText('[data-address]', data.address);
}
if (data.schedule) {
  document.querySelector('[data-schedule-wrap]').hidden = false;
  setText('[data-schedule]', data.schedule);
}
if (!seeUEcosystem && data.social) {
  const socialButton = document.querySelector('[data-social-button]');
  socialButton.hidden = false;
  socialButton.href = data.social;
}

if (!seeUEcosystem && !instructor && data.bookingMode === 'request') {
  const channels = [
    ['Telegram', telegramHref], ['WhatsApp', whatsappHref], ['Электронная почта', emailHref]
  ].filter(([, href]) => href && href !== contact);
  channels.forEach(([label, href]) => {
    const link = document.createElement('a');
    link.className = 'profile-button profile-button--outline';
    link.href = href;
    link.textContent = label;
    phoneLink.before(link);
  });
}

const independentOperator = instructor || (!instructor && data.bookingMode === 'request');
const ecosystemPayment = onlinePending && data.onlineDataMode !== 'own';
const baseLegalDocs = onlinePending ? [
  ['Публичная оферта платформы', 'SeeU', 'обязательно'],
  ['Политика конфиденциальности', 'SeeU', 'обязательно'],
  ['Согласие на обработку и передачу данных', 'SeeU → специалист', 'отдельное обязательное согласие'],
  ['Политика cookies', 'SeeU', 'обязательно на сайте'],
  ['Публичная оферта на информационно-консультационные услуги', 'Специалист', 'обязательно перед оплатой'],
  ['Политика оплаты, отказа и возврата', 'Специалист', 'обязательно перед оплатой'],
  ['Согласие на рекламу SeeU', 'SeeU', 'отдельно · добровольно'],
  ['Согласие на рекламу специалиста', 'Специалист', 'отдельно · добровольно']
] : [
  ['Пользовательское соглашение', 'SeeU', 'обязательно'],
  ['Политика обработки персональных данных', independentOperator ? 'SeeU + специалист' : 'SeeU', 'обязательно'],
  ['Согласие на обработку и передачу данных', independentOperator ? 'SeeU → специалист' : 'SeeU', 'отдельное обязательное согласие'],
  ['Политика cookies', 'SeeU', 'обязательно на сайте'],
  ['Публичная оферта и условия сервиса', 'SeeU', 'обязательно'],
  ['Согласие на рекламу SeeU', 'SeeU', 'отдельно · добровольно'],
  ['Согласие на рекламу специалиста', 'Специалист', 'отдельно · добровольно']
];
const legalDocs = document.querySelector('[data-legal-docs]');
baseLegalDocs.forEach(([title, party, status], index) => {
  const item = document.createElement('button');
  item.type = 'button';
  item.disabled = true;
  item.innerHTML = `<span>${String(index + 1).padStart(2, '0')}</span><strong>${title}</strong><small>${status} · сторона: ${party}</small>`;
  legalDocs.append(item);
});

if (independentOperator) {
  const operator = document.querySelector('[data-legal-operator]');
  operator.hidden = false;
  setText('[data-legal-operator-label]', onlinePending ? 'Две стороны — отдельные зоны ответственности' : 'Самостоятельный оператор после передачи заявки');
  setText('[data-legal-name]', onlinePending ? `SeeU + ${data.ownerLegalName || data.displayName}` : data.ownerLegalName || data.displayName);
  const details = [data.ownerLegalStatus, data.ownerServiceDescription, data.ownerInn && `ИНН ${data.ownerInn}`, data.ownerOgrn && `ОГРН/ОГРНИП ${data.ownerOgrn}`, data.ownerAddress, data.ownerEmail, data.ownerSettlementAccount && `р/с ${data.ownerSettlementAccount}`, data.ownerBankName, data.ownerBik && `БИК ${data.ownerBik}`, data.ownerCorrespondentAccount && `к/с ${data.ownerCorrespondentAccount}`].filter(Boolean);
  const scopes = onlinePending
    ? ecosystemPayment
      ? 'SeeU — платформа, хранение базы, доступы и техническая обработка. Специалист — продавец, эквайринг, обучение, возвраты и исполнение обязательств.'
      : 'SeeU — первичный сбор и передача заявки. Специалист — собственная база, продажа, эквайринг, обучение и возвраты.'
    : '';
  setText('[data-legal-details]', [scopes, ...details].filter(Boolean).join(' · ') || 'Реквизиты будут добавлены после заполнения брифа');
  setText('[data-legal-scope]', onlinePending
    ? ecosystemPayment
      ? 'База учеников остаётся внутри SeeU, а оплата поступает специалисту. Документы обеих сторон размещаются вместе и отдельно определяют права, обязанности и ответственность каждой стороны.'
      : 'SeeU передаёт заявку специалисту, который ведёт собственную базу и принимает оплату. Документы обеих сторон разграничивают обработку данных и продажу услуги.'
    : 'SeeU обеспечивает форму и передачу заявки. После её передачи в выбранный мессенджер или почту дальнейшую обработку клиентской базы самостоятельно осуществляет указанный специалист.');
} else {
  setText('[data-legal-scope]', 'Запись и обработка данных выполняются внутри экосистемы SeeU по единому комплекту документов платформы.');
}
document.querySelector('[data-refund-rule]').hidden = !onlinePending;

const allowedCustomSlots = new Set(['after-hero', 'after-catalog', 'before-about', 'after-about', 'before-contact', 'before-legal']);
const allowedCustomLayouts = new Set(['container', 'wide', 'full']);

function safeBlockFragment(html) {
  const template = document.createElement('template');
  template.innerHTML = String(html || '');
  template.content.querySelectorAll('script,iframe,object,embed,base,meta,link').forEach(node => node.remove());
  template.content.querySelectorAll('*').forEach(node => {
    [...node.attributes].forEach(attribute => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim().toLowerCase();
      if (name.startsWith('on') || name === 'action' || name === 'formaction' || ((name === 'href' || name === 'src') && value.startsWith('javascript:'))) node.removeAttribute(attribute.name);
    });
  });
  return template.content;
}

function renderCustomBlocks() {
  const blocks = Array.isArray(data.customBlocks) ? data.customBlocks : [];
  blocks.filter(block => block && block.enabled !== false && allowedCustomSlots.has(block.slot)).sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0)).forEach((block, index) => {
    const slot = document.querySelector(`[data-custom-slot="${block.slot}"]`);
    if (!slot) return;
    const wrapper = document.createElement('section');
    const id = String(block.id || `block-${index + 1}`).replace(/[^a-zA-Z0-9_-]/g, '-');
    const layout = allowedCustomLayouts.has(block.layout) ? block.layout : 'container';
    wrapper.id = `custom-${id}`;
    wrapper.className = `profile-custom-block profile-custom-block--${layout}`;
    wrapper.dataset.customBlockId = id;
    const body = document.createElement('div');
    body.className = layout === 'container' ? 'profile-container profile-custom-block__inner' : 'profile-custom-block__inner';
    body.append(safeBlockFragment(block.html));
    wrapper.append(body);
    slot.append(wrapper);
  });
}

renderCustomBlocks();

document.querySelector('[data-copy-link]').addEventListener('click', async event => {
  const futureUrl = `https://see-u.app/${data.slug || 'your-name'}`;
  try { await navigator.clipboard.writeText(futureUrl); event.currentTarget.textContent = 'Ссылка скопирована'; }
  catch (_) { prompt('Будущая ссылка страницы', futureUrl); }
});
