import create from '../utils/create';
import * as storage from '../utils/storage';

export default class Board {
  constructor(width, height, fieldSize, image) {
    this.width = width;
    this.height = height;
    this.fieldSize = fieldSize;

    this.img = image;
    this.board = create('canvas', 'game__board', "Your browser doesn't support canvas");
    this.state = [];

    this.hole = {
      x: fieldSize - 1,
      y: fieldSize - 1,
    };

    this.output = {
      right: () => {},
      left: () => {},
      up: () => {},
      down: () => {},
    };
  }

  createState = () => {
    for (let i = 0; i < this.fieldSize; i += 1) {
      const row = [];
      for (let j = 0; j < this.fieldSize; j += 1) {
        let value = i * this.fieldSize + j + 1;
        if (value === this.fieldSize * this.fieldSize) {
          value = 0;
        }
        row.push(value);
      }
      this.state.push(row);
    }
  };

  saveMove = (tern) => {
    storage.set('state', [this.state, this.hole.x, this.hole.y]);
    const savedMoves = storage.get('slove');
    if (savedMoves) {
      storage.set('slove', [...savedMoves, tern]);
    } else {
      storage.set('slove', [tern]);
    }
  }

  right = () => {
    if (this.hole.x > 0) {
      this.state[this.hole.y][this.hole.x] = this.state[this.hole.y][this.hole.x - 1];
      this.state[this.hole.y][this.hole.x - 1] = 0;
      this.output.right(this.state[this.hole.y][this.hole.x]);
      this.hole.x -= 1;
      this.saveMove('r');
    }
  }

  left = () => {
    if (this.hole.x < this.fieldSize - 1) {
      this.state[this.hole.y][this.hole.x] = this.state[this.hole.y][this.hole.x + 1];
      this.state[this.hole.y][this.hole.x + 1] = 0;
      this.output.left(this.state[this.hole.y][this.hole.x]);
      this.hole.x += 1;
      this.saveMove('l');
    }
  }

  down = () => {
    if (this.hole.y > 0) {
      this.state[this.hole.y][this.hole.x] = this.state[this.hole.y - 1][this.hole.x];
      this.state[this.hole.y - 1][this.hole.x] = 0;
      this.output.down(this.state[this.hole.y][this.hole.x]);
      this.hole.y -= 1;
      this.saveMove('d');
    }
  }

  up = () => {
    if (this.hole.y < this.fieldSize - 1) {
      this.state[this.hole.y][this.hole.x] = this.state[this.hole.y + 1][this.hole.x];
      this.state[this.hole.y + 1][this.hole.x] = 0;
      this.output.up(this.state[this.hole.y][this.hole.x]);
      this.hole.y += 1;
      this.saveMove('u');
    }
  }

  click = (x, y) => {
    if (this.hole.y === y) {
      if (this.hole.x === x - 1) {
        this.left();
      } else if (this.hole.x === x + 1) {
        this.right();
      }
    } else if (this.hole.x === x) {
      if (this.hole.y === y - 1) {
        this.up();
      } else if (this.hole.y === y + 1) {
        this.down();
      }
    }
  }

  getBoard = () => this.board;

  init() {
    this.createState();
    this.ctx = this.board.getContext('2d');
    this.board.setAttribute('id', 'canvas');
    this.board.width = this.width;
    this.board.height = this.height;
    return this.board;
  }
}
