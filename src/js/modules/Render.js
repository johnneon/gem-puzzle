export default class Renderer {
  constructor(ctx, spriteGrid) {
    this.ctx = ctx;
    this.spriteGrid = spriteGrid;
  }

  render = (viewState) => {
    const img = this.spriteGrid.getImg();
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      for (let i = 0; i < viewState.length; i += 1) {
        const block = viewState[i];
        const sp = this.spriteGrid.getSpritePositionByValue(block.getValue());
        const bw = this.spriteGrid.getBlockSize();
        const bh = this.spriteGrid.getBlockSize();
        this.ctx.drawImage(
          img,
          sp.x,
          sp.y,
          bw,
          bh,
          block.getX(),
          block.getY(),
          bw,
          bh,
        );
      }
    };
  };
}
