const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const dialog = document.querySelector('#brief-dialog');

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('is-open', !open);
});

document.querySelectorAll('[data-open-brief]').forEach((button) => {
  button.addEventListener('click', () => dialog?.showModal());
});

dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

const referralRange = document.querySelector('#referral-range');

if (referralRange) {
  const countOutput = document.querySelector('#referral-count');
  const tariffOutput = document.querySelector('#referral-tariff');
  const tariffNote = document.querySelector('#referral-tariff-note');
  const monthsOutput = document.querySelector('#referral-months');
  const monthsNote = document.querySelector('#referral-months-note');
  const rewardOutput = document.querySelector('#referral-reward');
  const rewardNote = document.querySelector('#referral-reward-note');
  const savingsOutput = document.querySelector('#referral-savings');
  const summaryOutput = document.querySelector('#referral-summary');
  const money = new Intl.NumberFormat('ru-RU');

  const masterWord = (value) => {
    const lastTwo = value % 100;
    const last = value % 10;
    if (lastTwo >= 11 && lastTwo <= 14) return 'мастеров';
    if (last === 1) return 'мастер';
    if (last >= 2 && last <= 4) return 'мастера';
    return 'мастеров';
  };

  const monthWord = (value) => {
    const lastTwo = value % 100;
    const last = value % 10;
    if (lastTwo >= 11 && lastTwo <= 14) return 'месяцев';
    if (last === 1) return 'месяц';
    if (last >= 2 && last <= 4) return 'месяца';
    return 'месяцев';
  };

  const getTier = (count) => {
    if (count >= 50) return { tariff: 1000, months: 12 };
    if (count >= 20) return { tariff: 1000, months: 6 };
    if (count >= 10) return { tariff: 1000, months: 3 };
    if (count >= 5) return { tariff: 3000, months: 1 };
    if (count >= 1) return { tariff: 4000, months: 1 };
    return { tariff: 5000, months: 0 };
  };

  const updateReferralCalculator = () => {
    const count = Number(referralRange.value);
    const { tariff, months } = getTier(count);
    const reward = count * 250;
    const savings = months ? (5000 - tariff) * months : 0;
    const progress = ((count - Number(referralRange.min)) / (Number(referralRange.max) - Number(referralRange.min))) * 100;
    const thumbRadius = 16;
    const progressOffset = thumbRadius * (1 - (2 * progress / 100));

    referralRange.style.setProperty('--range-progress', `calc(${progress}% + ${progressOffset}px)`);
    countOutput.textContent = String(count);
    tariffOutput.textContent = `${money.format(tariff)} ₽`;
    rewardOutput.textContent = `${money.format(reward)} ₽`;
    rewardNote.textContent = count ? `250 ₽ × ${count} ${masterWord(count)}` : 'пригласите первого мастера';
    savingsOutput.textContent = `${money.format(savings)} ₽`;

    if (months === 0) {
      monthsOutput.textContent = 'Без льготы';
      monthsNote.textContent = 'пригласите первого мастера';
      tariffNote.textContent = 'базовая стоимость в месяц';
      summaryOutput.textContent = 'Пригласите первого мастера — после его оплаты тариф снизится до 4 000 ₽.';
      return;
    }

    const period = `${months} ${monthWord(months)}`;
    monthsOutput.textContent = period;
    monthsNote.textContent = tariff === 1000 ? 'по 1 000 ₽ в месяц' : 'льгота на следующий месяц';
    tariffNote.textContent = months === 1 ? 'стоимость на следующий месяц' : 'льготная стоимость в месяц';
    summaryOutput.textContent = `Тариф ${money.format(tariff)} ₽ на ${period} и ${money.format(reward)} ₽ вознаграждения.`;
  };

  referralRange.addEventListener('input', updateReferralCalculator);
  updateReferralCalculator();
}
