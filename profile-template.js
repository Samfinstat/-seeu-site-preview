const fallback = {
  role: 'master', paymentMode: 'services', displayName: 'Анна Волкова', profession: 'Мастер маникюра', city: 'Самара', slug: 'anna-volkova',
  headline: 'Маникюр, к которому хочется возвращаться', about: 'Я создаю аккуратный и ноский маникюр, внимательно отношусь к пожеланиям и всегда заранее объясняю стоимость и этапы работы.',
  phone: '+7 999 000-00-00', messenger: '', social: '', bookingLink: '', address: 'Центр Самары', schedule: 'Пн–Сб, 10:00–20:00', theme: 'coral', photo: '', experience: '6 лет', workplace: 'Студия в центре города', bookingMode: 'app',
  advantages: ['Бережная работа', 'Цена известна заранее', 'Удобная запись'], gallery: [], reviews: [],
  items: [{name:'Маникюр с покрытием',price:'2 300 ₽',meta:'2 часа'},{name:'Снятие и маникюр',price:'1 400 ₽',meta:'1,5 часа'},{name:'Укрепление ногтей',price:'700 ₽',meta:'30 минут'}]
};

let data = fallback;
try { data = { ...fallback, ...JSON.parse(localStorage.getItem('seeuGeneratedSite') || '{}') }; } catch (_) {}
const instructor = data.role === 'instructor';
const onlinePending = instructor && data.paymentMode === 'online';
const setText = (selector, content) => document.querySelectorAll(selector).forEach(node => node.textContent = content);

document.body.dataset.theme = data.theme || 'coral';
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
  setText('[data-format]', data.bookingMode === 'app' ? 'Онлайн' : 'По заявке');
  setText('[data-hero-text]', data.workplace ? `${data.workplace}. Понятные цены и удобная запись без долгой переписки.` : 'Понятные цены и удобная запись без долгой переписки.');
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
if (reviews.length) {
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
}

const phoneHref = (data.phone || '').replace(/[^+\d]/g,'');
const contact = data.bookingLink || data.messenger || (phoneHref ? `tel:${phoneHref}` : '#');
document.querySelector('[data-contact-button]').href = contact;
document.querySelector('[data-contact-button]').textContent = instructor ? 'Оставить заявку' : 'Записаться';
document.querySelector('[data-phone]').href = phoneHref ? `tel:${phoneHref}` : '#';
setText('[data-phone]', data.phone || 'Связаться');
document.querySelector('[data-payment-note]').hidden = !onlinePending;

if (data.address) {
  document.querySelector('[data-address-wrap]').hidden = false;
  setText('[data-address]', data.address);
}
if (data.schedule) {
  document.querySelector('[data-schedule-wrap]').hidden = false;
  setText('[data-schedule]', data.schedule);
}
if (data.social) {
  const socialButton = document.querySelector('[data-social-button]');
  socialButton.hidden = false;
  socialButton.href = data.social;
}

document.querySelector('[data-copy-link]').addEventListener('click', async event => {
  const futureUrl = `https://see-u.app/${data.slug || 'your-name'}`;
  try { await navigator.clipboard.writeText(futureUrl); event.currentTarget.textContent = 'Ссылка скопирована'; }
  catch (_) { prompt('Будущая ссылка страницы', futureUrl); }
});
