import create from '../utils/create';
import * as storage from '../utils/storage';

export default class Menu {
  constructor(elementToAppend, saves) {
    this.elementToAppend = elementToAppend;
    this.saves = saves;
    this.list = create('ul', 'options__list');
    this.wrap = create('div', 'menu', this.list, this.elementToAppend);

    this.mainMenuItems = [
      'Continue',
      'New game',
      'Settings',
      'Sound Off',
      'Best scores',
      'Rules',
    ];
    this.settings = [
      '3x3',
      '4x4',
      '5x5',
      '6x6',
      '7x7',
      '8x8',
      'Picture Off',
      'Reset All',
      'Back',
    ];
    this.score = [
      "You haven't solved this game yet :)",
    ];
  }

  open = () => {
    this.wrap.classList.add('active');
  }

  hide = () => {
    this.wrap.classList.remove('active');
  }

  showMainOptions = () => {
    this.list.innerHTML = '';
    this.mainMenuItems.forEach((el) => {
      const menuItem = create('li', 'list__item', el, null);
      menuItem.id = el.replace(/\s/g, '').toLowerCase();
      this.list.append(menuItem);
    });
  }

  showSettings = () => {
    this.list.innerHTML = '';
    this.settings.forEach((el) => {
      const bool = storage.get('pictureMode');
      let element = el;
      if (element.match(/Picture/) && storage.get('pictureMode')) {
        if (bool) {
          element = 'Picture On';
        } else {
          element = 'Picture Off';
        }
      }

      const menuItem = create('li', 'list__item', element, null);
      menuItem.id = el.replace(/\s/g, '').toLowerCase();

      this.list.append(menuItem);
    });
  }

  getScore = () => {
    this.list.innerHTML = '';

    const scoreList = storage.get('score');

    if (scoreList) {
      scoreList.forEach((element, index) => {
        const item = `${index + 1}. Board: ${element[0]}x${element[0]}; Time: ${element[1]}:${element[2]}; Clicks: ${element[3]}`;
        const el = create('li', 'list__item score__item', item);
        this.list.append(el);
      });
    } else {
      this.score.forEach((element) => {
        const el = create('li', 'list__item', element);
        this.list.append(el);
      });
    }
    const back = create('li', 'list__item', 'Back');
    back.id = 'back';
    this.list.append(back);
  }

  init = () => {
    this.showMainOptions();
    this.open();
  }
}
