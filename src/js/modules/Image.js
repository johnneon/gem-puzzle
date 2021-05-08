export default class SpriteImage {
  constructor(imgUrl, fieldSize, blockSize) {
    this.fieldSize = fieldSize;

    this.image = () => {
      const image = new Image();
      image.src = imgUrl;
      return image;
    };

    this.getBlockSize = () => blockSize;
  }

  getSpritePositionByValue(value) {
    return {
      x: ((value - 1) % this.fieldSize) * this.getBlockSize(),
      y: Math.floor((value - 1) / this.fieldSize) * this.getBlockSize(),
    };
  }

  getImg = () => this.image();
}
