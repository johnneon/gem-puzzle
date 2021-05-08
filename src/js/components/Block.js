export default class Block {
  constructor(x, y, blockWidth, value) {
    this.targetX = x; // Future position X (after turn)
    this.targetY = y; // Future position Y (after turn)
    this.xPos = x; // Real time position X
    this.yPos = y; // Real time position Y
    this.value = value;

    this.translateSpeed = 18; // Animation speed

    this.blockSize = blockWidth;
  }

  getValue = () => this.value;

  getX = () => this.xPos;

  getY = () => this.yPos;

  setX = (valueX) => {
    this.xPos = valueX;
    this.targetX = this.xPos;
  };

  setY = (valueY) => {
    this.yPos = valueY;
    this.targetY = this.yPos;
  };

  incTargetX = () => {
    this.targetX += this.blockSize;
  };

  decTargetX = () => {
    this.targetX -= this.blockSize;
  };

  incTargetY = () => {
    this.targetY += this.blockSize;
  };

  decTargetY = () => {
    this.targetY -= this.blockSize;
  };

  tick = () => {
    if (this.targetX > this.xPos) {
      this.xPos += this.translateSpeed;

      if (this.xPos > this.targetX) this.xPos = this.targetX;
    } else if (this.targetX < this.xPos) {
      this.xPos -= this.translateSpeed;

      if (this.xPos < this.targetX) this.xPos = this.targetX;
    } else if (this.targetY > this.yPos) {
      this.yPos += this.translateSpeed;

      if (this.yPos > this.targetY) this.yPos = this.targetY;
    } else if (this.targetY < this.yPos) {
      this.yPos -= this.translateSpeed;

      if (this.yPos < this.targetY) this.yPos = this.targetY;
    } else {
      return false;
    }

    return true; // For commandQueue in Viewer
  };
}
