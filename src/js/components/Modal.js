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
    const title = create('h2', 'title', 'Gem pazzle');
    const rulesTitle = create('h3', 'subtitle', 'Rules of the game:');
    const rulesText = [
      'The game is a set of identical square dice with applied numbers, enclosed in a square box. The length of the side of the box is four times the length of the side of the knuckles for a set of 15 elements, respectively, one square field remains empty in the box. The goal of the game is to move the knuckles around the box to arrange them by numbers, preferably by making as few movements as possible.',
      'The sound is turned on and off by clicking on the "Sound" item; when the page is reloaded, it is disabled by default.',
      'Changing the size of the field, as well as the mode of replacing the field with a picture is in the item "Settings" By clicking on "Reset All" you can reset the entire game, including the save and all settings.',
      'The table of the 10 best places in the "Best score" tab, the top results are calculated based on the number of moves made (according to the rules of the game).',
      'If you used the auto-solution (the "Solve" button between the timer and clicks), the result will not be recorded in the "Best score", but you will enjoy the animation of the solution :)',
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
