import create from '../utils/create';

export default class Modal {
  constructor(win, rules) {
    this.isWin = win;
    this.isRules = rules;

    this.modal = create('div', 'modal hidden', null, document.body);
    this.back = create('button', 'return', 'Okey!', this.modal);
  }

  open = () => {
    this.modal.classList.remove('hidden');
  }

  hide = () => {
    this.modal.classList.add('hidden');
    this.modal.innerHTML = '';
  }

  winModalOpen = (mins, secs, clicks) => {
    const title = 'You win!';
    const results = `You did it in ${mins} minutes, ${secs} seconds and ${clicks} clicks!`;

    create('h2', 'winner__title', title, this.modal);
    create('h3', 'winner__subtitle', results, this.modal);
    this.modal.append(this.back);

    this.open();

    this.back.addEventListener('click', () => {
      this.hide();
    });

    return this.modal;
  }

  rulesModal = () => {
    const title = create('h2', 'title', 'Игра пятнашки');
    const rulesTitle = create('h3', 'subtitle', 'Правила игры:');
    const rulesText = [
      'Игра представляет собой набор одинаковых квадратных костяшек с нанесёнными числами, заключённых в квадратную коробку. Длина стороны коробки в четыре раза больше длины стороны костяшек для набора из 15 элементов, соответственно в коробке остаётся незаполненным одно квадратное поле. Цель игры — перемещая костяшки по коробке, добиться упорядочивания их по номерам, желательно сделав как можно меньше перемещений.',
      'Звук включается и выключается по нажатию на пункт «Sound», при перезагрузке страницы он по умолчанию выкючен.',
      'Смена размера поля, а также режим замены поля на картинку находится в пункте «Settings». По нажатию на «Reset All» вы можете сбросить всю игру, включая сохранения и все настройки.',
      'Таблица 10 лучших мест во вкладке «Best score», топ результатов расчитывается исходя из кол-ва сделаных ходов (по правилам игры).',
      'В случае если вы воспользовались авторешением (кнопка «Solve» между таймером и кликами), результат не будет записан в «Best score», но вы насладитесь анимацией решения :)',
    ];

    const rules = create('div', 'rules', [title, rulesTitle]);
    rulesText.forEach((el) => {
      const text = create('p', 'text', el);
      rules.append(text);
    });
    this.modal.append(rules, this.back);

    this.back.addEventListener('click', () => {
      this.hide();
    });
  }
}
