export class Hazard {
  constructor({ x, y, w, h }) {
    this.x = x; this.y = y; this.w = w; this.h = h;
  }

  draw(ctx) {
    // шипы
    ctx.fillStyle = "rgba(255,80,80,0.95)";
    const spikes = Math.max(2, Math.floor(this.w / 12));
    const step = this.w / spikes;

    for (let i = 0; i < spikes; i++) {
      const sx = this.x + i * step;
      ctx.beginPath();
      ctx.moveTo(sx, this.y + this.h);
      ctx.lineTo(sx + step / 2, this.y);
      ctx.lineTo(sx + step, this.y + this.h);
      ctx.closePath();
      ctx.fill();
    }
  }
}
