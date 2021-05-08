import * as storage from '../utils/storage';
import ternSound from '../../audio/chip.mp3';

export default class View {
  constructor(state, Block, blockSize) {
    this.viewState = [];
    this.commandQueue = [];
    this.blockSize = blockSize;

    this.countClicks = (storage.get('clicks')) ? storage.get('clicks') : 0;

    for (let i = 0; i < state.length; i += 1) {
      for (let j = 0; j < state[i].length; j += 1) {
        if (state[i][j] !== 0) {
          const x = j * blockSize;
          const y = i * blockSize;
          this.viewState.push(new Block(x, y, blockSize, state[i][j]));
        }
      }
    }

    this.getState = () => this.viewState;

    this.setState = (gameState) => {
      for (let i = 0; i < gameState.length; i += 1) {
        for (let j = 0; j < gameState[i].length; j += 1) {
          const value = gameState[i][j];
          if (value !== 0) {
            const x = j * blockSize;
            const y = i * blockSize;
            this.viewState[value - 1].setX(x);
            this.viewState[value - 1].setY(y);
          }
        }
      }
    };

    this.makeSound = (() => {
      const sound = document.createElement('audio');
      sound.src = ternSound;
      return sound;
    })();
    this.sound = this.makeSound;
  }

  soundOn = () => {
    if (storage.get('soundMode')) {
      this.sound.currentTime = 0;
      this.sound.play();
    }
  }

  toGameCoords = (x, y) => ({
    x: Math.floor(x / this.blockSize),
    y: Math.floor(y / this.blockSize),
  });

  tick = () => {
    this.isAnimationActive = false;

    for (let i = 0; i < this.viewState.length; i += 1) {
      this.isAnimationActive = this.isAnimationActive || this.viewState[i].tick();
    }

    if (!this.isAnimationActive && this.commandQueue.length > 0) {
      const command = this.commandQueue.shift();
      this.viewState[command[1]][command[0]]();
    }
  }

  right = (value) => {
    this.countClicks += 1;
    storage.set('clicks', this.countClicks);
    this.soundOn();
    this.commandQueue.push(['incTargetX', value - 1]);
  };

  left = (value) => {
    this.countClicks += 1;
    storage.set('clicks', this.countClicks);
    this.soundOn();
    this.commandQueue.push(['decTargetX', value - 1]);
  };

  down = (value) => {
    this.countClicks += 1;
    storage.set('clicks', this.countClicks);
    this.soundOn();
    this.commandQueue.push(['incTargetY', value - 1]);
  };

  up = (value) => {
    this.countClicks += 1;
    storage.set('clicks', this.countClicks);
    this.soundOn();
    this.commandQueue.push(['decTargetY', value - 1]);
  };
}
