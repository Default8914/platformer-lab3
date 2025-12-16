export class Coin {
  constructor({ x, y, r }) {
    this.x = x; this.y = y; this.r = r;
    this.collected = false;
  }

  draw(ctx) {
    if (this.collected) return;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 215, 0, 0.95)";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r - 3, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.10)";
    ctx.fill();
  }
}
