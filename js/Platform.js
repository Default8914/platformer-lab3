export class Platform {
  constructor(x, y, w, h, type = "solid") {
    this.x = x; this.y = y; this.w = w; this.h = h;
    this.type = type; // можно расширять (опасные и т.п.)
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.strokeStyle = "rgba(255,255,255,0.22)";
    ctx.strokeRect(this.x, this.y, this.w, this.h);
    ctx.restore();
  }
}
