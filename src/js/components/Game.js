import Board from './Board';
import Block from './Block';
import SpriteImage from '../modules/Image';
import Renderer from '../modules/Render';
import View from '../modules/View';
import * as storage from '../utils/storage';
import numThree from '../../images/boards/3x3/3x3.png';
import numFour from '../../images/boards/4x4/4x4.png';
import numFive from '../../images/boards/5x5/5x5.png';
import numSix from '../../images/boards/6x6/6x6.png';
import numSeven from '../../images/boards/7x7/7x7.png';
import numEight from '../../images/boards/8x8/8x8.png';
import picThree from '../../images/boards/3x3/3x3pic.png';
import picFour from '../../images/boards/4x4/4x4pic.png';
import picFive from '../../images/boards/5x5/5x5pic.png';
import picSix from '../../images/boards/6x6/6x6pic.png';
import picSeven from '../../images/boards/7x7/7x7pic.png';
import picEight from '../../images/boards/8x8/8x8pic.png';

export default class Game {
  constructor(numberOfCells, pictureMode) {
    this.numberOfCells = (storage.get('numberOfCells')) ? storage.get('numberOfCells') : numberOfCells;
    this.fieldSize = 320;
    this.solve = (storage.get('slove')) ? storage.get('slove') : [];
    this.countClicks = (storage.get('clicks')) ? storage.get('clicks') : 0;

    this.imageUrlArray = [
      '',
      '',
      '',
      numThree,
      numFour,
      numFive,
      numSix,
      numSeven,
      numEight,
    ];
    this.pictureUrlArray = [
      '',
      '',
      '',
      picThree,
      picFour,
      picFive,
      picSix,
      picSeven,
      picEight,
    ];
    this.boardImage = (pictureMode)
      ? this.pictureUrlArray[this.numberOfCells] : this.imageUrlArray[this.numberOfCells];

    this.isSloving = false;
  }

  pasteBoard = () => {
    this.start();

    return this.board;
  }

  shuffle = () => {
    let num = 0;
    if (this.numberOfCells === 3) num = 20;
    if (this.numberOfCells === 4) num = 50;
    if (this.numberOfCells === 5) num = 60;
    if (this.numberOfCells === 6) num = 150;
    if (this.numberOfCells === 7) num = 250;
    if (this.numberOfCells === 8) num = 1000;
    for (let i = 0; i < num; i += 1) {
      this.solve.push('u', 'r', 'd', 'l');
    }
    for (let j = this.solve.length; j > 0; j -= 1) {
      const randInd = Math.floor(Math.random() * j);
      const randElem = this.solve.splice(randInd, 1)[0];
      this.solve.push(randElem);
    }
    for (let i = 0; i < this.solve.length; i += 1) {
      if (this.solve[i] === 'u' && this.solve[i - 1] === 'd') {
        this.solve.splice(i, 1);
      } else if (this.solve[i] === 'd' && this.solve[i - 1] === 'u') {
        this.solve.splice(i, 1);
      } else if (this.solve[i] === 'l' && this.solve[i - 1] === 'r') {
        this.solve.splice(i, 1);
      } else if (this.solve[i] === 'r' && this.solve[i - 1] === 'l') {
        this.solve.splice(i, 1);
      }
    }
  }

  start = () => {
    const blockSize = this.fieldSize / this.numberOfCells;
    const img = new SpriteImage(this.boardImage, this.numberOfCells, blockSize);
    const mainBoard = new Board(
      this.fieldSize,
      this.fieldSize,
      this.numberOfCells,
      img.getImg(),
    );
    mainBoard.init();
    this.board = mainBoard.getBoard();

    const viewer = new View(mainBoard.state, Block, blockSize);
    const render = new Renderer(mainBoard.ctx, img);
    const animationOutput = {
      right(value) {
        viewer.right(value);
      },
      left(value) {
        viewer.left(value);
      },
      down(value) {
        viewer.down(value);
      },
      up(value) {
        viewer.up(value);
      },
    };
    const silentOutput = {
      right: () => {},
      left: () => {},
      up: () => {},
      down: () => {},
    };

    mainBoard.output = animationOutput;
    // Run all
    const tick = () => {
      viewer.tick();
      render.render(viewer.viewState);
      window.requestAnimationFrame(tick);
    };
    window.requestAnimationFrame(tick);

    const compare = (a1, a2) => a1.length === a2.length && a1.every((v, i) => v === a2[i]);

    this.isVictory = () => {
      const winCombo = [];
      for (let i = 0; i < this.numberOfCells; i += 1) {
        const row = [];
        for (let j = 0; j < this.numberOfCells; j += 1) {
          let value = i * this.numberOfCells + j + 1;
          if (value === this.numberOfCells * this.numberOfCells) {
            value = 0;
          }
          row.push(value);
        }
        winCombo.push(row);
      }
      const check = compare(winCombo.flat(), mainBoard.state.flat());
      if (check) storage.del('slove');
      return check;
    };

    mainBoard.board.addEventListener('click', (e) => {
      this.isAnimationActive = viewer.isAnimationActive;
      if (this.isAnimationActive) return;
      const gamePosition = viewer.toGameCoords(e.offsetX, e.offsetY);
      mainBoard.click(gamePosition.x, gamePosition.y);
      this.countClicks = viewer.countClicks;
    });

    const setShuffledPosition = (ternsArray) => {
      for (let i = 0; i < ternsArray.length; i += 1) {
        if (ternsArray[i] === 'u') {
          mainBoard.up();
        } else if (ternsArray[i] === 'd') {
          mainBoard.down();
        } else if (ternsArray[i] === 'l') {
          mainBoard.left();
        } else if (ternsArray[i] === 'r') {
          mainBoard.right();
        }
      }
    };

    this.solveGame = () => {
      this.isSloving = true;
      const savedMoves = storage.get('slove');
      for (let i = savedMoves.length; i >= 0; i -= 1) {
        const element = savedMoves[i];
        if (element === 'd') {
          mainBoard.up();
        } else if (element === 'u') {
          mainBoard.down();
        } else if (element === 'r') {
          mainBoard.left();
        } else if (element === 'l') {
          mainBoard.right();
        }
      }
    };

    if (storage.get('state')) {
      mainBoard.output = silentOutput;
      const [state, x, y] = storage.get('state');
      mainBoard.state = state;
      mainBoard.hole.x = x;
      mainBoard.hole.y = y;
      viewer.setState(mainBoard.state);
      mainBoard.output = animationOutput;
    } else {
      viewer.countClicks = 0;
      this.countClicks = 0;
      mainBoard.output = silentOutput;
      this.shuffle();
      setShuffledPosition(this.solve);
      viewer.setState(mainBoard.state);
      mainBoard.output = animationOutput;
    }
  }
}
