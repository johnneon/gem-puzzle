import create from '../utils/create';
import * as storage from '../utils/storage';
import Game from './Game';
import Menu from './Menu';
import menuSound from '../../audio/main.mp3';
import selectSound from '../../audio/select.mp3';
import backSound from '../../audio/back.mp3';
import Modal from './Modal';

export default class Wrapper {
  constructor(title) {
    this.pictureMode = (storage.get('pictureMode')) ? storage.get('pictureMode') : false;
    this.game = new Game(4, this.pictureMode);
    this.title = title;

    this.seconds = (storage.get('time')) ? storage.get('time') : 0;
    this.timerElement = create('div', 'timer', `Time: ${this.prependNull(Math.trunc(this.seconds / 60))}:${this.prependNull(this.seconds % 60)}`);
    this.timer = () => {
      this.seconds += 1;
      storage.set('time', this.seconds);
      this.timerElement.innerHTML = `Time: ${this.prependNull(Math.trunc(this.seconds / 60))}:${this.prependNull(this.seconds % 60)}`;
    };

    this.clicks = create('div', 'clicks', `Clicks: ${this.game.countClicks}`);

    this.makeSoundsArray = () => {
      const soundsUrlArr = [menuSound, selectSound, backSound];
      const soundsArr = [];
      soundsUrlArr.forEach((element) => {
        const sound = document.createElement('audio');
        sound.src = element;
        soundsArr.push(sound);
      });
      return soundsArr;
    };
    this.sounds = this.makeSoundsArray();
    this.isSoundOn = false;

    this.burger = create('div', 'burger', [
      create('span'),
      create('span'),
      create('span'),
    ]);

    this.gameContainer = create('div', 'game__container', this.game.pasteBoard());

    this.elements = [
      this.createHeader(),
      this.gameContainer,
      this.statsBlock(),
    ];
  }

  prependNull = (value) => (value < 10 ? `0${value}` : value);

  statsBlock = () => {
    this.btnSolve = create('button', 'solve', 'Solve');
    const statsWrap = create('div', 'stats', [this.timerElement, this.btnSolve, this.clicks]);

    return statsWrap;
  }

  createHeader = () => {
    const title = create('h1', null, this.title);
    const header = create('header', 'game__header', [title, this.burger]);

    return header;
  }

  changeGameBoard = (fieldSize) => {
    this.gameContainer.innerHTML = '';
    storage.set('numberOfCells', fieldSize);
    storage.del('state');
    storage.del('time');
    storage.del('clicks');
    storage.del('slove');
    this.game = new Game(fieldSize, this.pictureMode);
    this.gameContainer.append(this.game.pasteBoard());
    this.seconds = 0;
    this.timerElement.innerHTML = 'Time: 00:00';
    this.clicks.innerHTML = 'Clicks: 0';
  }

  makeNoise = (num) => {
    if (storage.get('soundMode')) {
      this.sounds[num].currentTime = 0;
      this.sounds[num].play();
    }
  }

  menuSettings = (event) => {
    this.isMenuOpen = false;
    const { target } = event;
    this.clicks.innerHTML = `Clicks: ${this.game.countClicks}`;

    if (!this.isMenuOpen) {
      this.isMenuOpen = true;
      clearInterval(this.startInterval);
      this.menu.open();
    } else {
      this.startInterval = setInterval(this.timer, 1000);
      this.menu.hide();
    }

    if (target.closest('.burger')) {
      this.makeNoise(1);
    }
    if (!target.closest('.list__item') && !target.closest('.burger')) {
      this.startInterval = setInterval(this.timer, 1000);
      this.menu.hide();
    }

    if (this.game.isAnimationActive) return;
    if (this.game.isVictory()) this.win();

    // Actions for menu items
    if (target.id.match(/continue/)) {
      this.makeNoise(2);
      this.startInterval = setInterval(this.timer, 1000);
      this.menu.hide();
    } else if (target.id.match(/sound/)) {
      if (!this.isSoundOn) {
        this.isSoundOn = true;
        this.makeNoise(1);
        storage.set('soundMode', this.isSoundOn);
        target.innerHTML = 'Sound On';
      } else {
        this.isSoundOn = false;
        storage.set('soundMode', this.isSoundOn);
        target.innerHTML = 'Sound Off';
      }
    } else if (target.id.match(/newgame/)) {
      this.makeNoise(1);
      storage.del('state');
      storage.del('clicks');
      storage.del('time');
      this.changeGameBoard(storage.get('numberOfCells') || 4);
      this.clicks.innerHTML = `Clicks: ${this.game.countClicks}`;
      this.seconds = 0;
      this.timerElement.innerHTML = 'Time: 00:00';
      this.startInterval = setInterval(this.timer, 1000);
      this.menu.hide();
    } else if (target.id.match(/settings/)) {
      this.makeNoise(1);
      this.menu.showSettings();
    } else if (target.id.match(/back/)) {
      this.makeNoise(2);
      this.menu.showMainOptions();
    } else if (target.id.match(/3x3/)) {
      this.makeNoise(1);
      this.changeGameBoard(3);
    } else if (target.id.match(/4x4/)) {
      this.makeNoise(1);
      this.changeGameBoard(4);
    } else if (target.id.match(/5x5/)) {
      this.makeNoise(1);
      this.changeGameBoard(5);
    } else if (target.id.match(/6x6/)) {
      this.makeNoise(1);
      this.changeGameBoard(6);
    } else if (target.id.match(/7x7/)) {
      this.makeNoise(1);
      this.changeGameBoard(7);
    } else if (target.id.match(/8x8/)) {
      this.makeNoise(1);
      this.changeGameBoard(8);
    } else if (target.id.match(/pictureoff/) || target.id.match(/pictureon/)) {
      this.makeNoise(1);
      if (!this.pictureMode) {
        storage.set('pictureMode', true);
        this.pictureMode = true;
        target.id = 'pictureon';
        target.innerHTML = 'Picture On';
        this.changeGameBoard(storage.get('numberOfCells'));
      } else {
        storage.set('pictureMode', false);
        this.pictureMode = false;
        target.id = 'pictureoff';
        target.innerHTML = 'Picture Off';
        this.changeGameBoard(storage.get('numberOfCells'));
      }
    } else if (target.id.match(/score/)) {
      this.menu.getScore();
    } else if (target.closest('.solve')) {
      this.game.solveGame();
      storage.del('slove');

      clearInterval(this.startInterval);
      if (storage.get('clicks')) storage.del('clicks');
      if (storage.get('time')) storage.del('time');
      this.timerElement.innerHTML = 'Time: 00:00';
      this.clicks.innerHTML = 'Clicks: 0';
    } else if (target.id.match(/rules/)) {
      this.modal.rulesModal();
      this.modal.open();
    } else if (target.id.match(/reset/)) {
      storage.del('numberOfCells');
      storage.del('state');
      storage.del('time');
      storage.del('clicks');
      storage.del('slove');
      storage.del('checkRules');
      storage.del('score');
      storage.del('soundMode');
      const { location } = window;
      location.reload();
    }
  }

  moveSoundHandler = (event) => {
    const { target } = event;
    if (!this.isSoundOn) return;
    if (target.closest('.list__item')) {
      this.makeNoise(0);
    }
  };

  win = () => {
    this.isMenuOpen = true;
    this.menu.open();

    const mins = Math.trunc(this.seconds / 60);
    const secs = this.seconds % 60;
    this.modal.winModalOpen(mins, secs, this.game.countClicks);

    // Save to storage
    const fieldSize = storage.get('numberOfCells');
    const scoreItem = [fieldSize, mins, this.prependNull(secs), this.game.countClicks];
    const storageScore = storage.get('score');
    if (!this.game.isSloving) {
      if (storageScore) {
        storageScore.sort((a, b) => +a[a.length - 1] - b[b.length - 1]);
        if (storageScore.length < 10) {
          storage.set('score', [...storageScore, scoreItem]);
        } else {
          storageScore.length = 9;
          storage.set('score', [...storageScore, scoreItem]);
        }
      } else {
        storage.set('score', [scoreItem]);
      }
    }

    clearInterval(this.startInterval);
    storage.del('state');
    storage.del('time');
    storage.del('clicks');
    this.gameContainer.innerHTML = '';
    this.game = new Game(storage.get('numOfCells'), this.pictureMode);
    this.gameContainer.append(this.game.pasteBoard());
    this.seconds = 0;
    this.timerElement.innerHTML = 'Time: 00:00';
    this.clicks.innerHTML = 'Clicks: 0';
  }

  init = () => {
    this.wrap = create('div', 'game', this.elements, document.body);

    this.menu = new Menu(this.wrap);
    this.menu.init();

    this.modal = new Modal();

    if (!storage.get('checkRules')) {
      storage.set('checkRules', true);
      this.modal.rulesModal();
      this.modal.open();
    }

    if (!storage.get('numberOfCells')) storage.set('numberOfCells', 4);

    storage.set('soundMode', this.isSoundOn);

    // Run
    this.wrap.addEventListener('click', this.menuSettings);
    this.wrap.addEventListener('mouseover', this.moveSoundHandler);
  }
}
