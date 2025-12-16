> Иван:
export class Platform {
  constructor({ x, y, w, h }) {
    this.x = x; this.y = y; this.w = w; this.h = h;
  }

  draw(ctx) {
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fillRect(this.x, this.y, this.w, this.h);

    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.fillRect(this.x, this.y, this.w, 3);
  }
}

> Иван:
export class Platform {
  constructor({ x, y, w, h }) {
    this.x = x; this.y = y; this.w = w; this.h = h;
  }

  draw(ctx) {
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fillRect(this.x, this.y, this.w, this.h);

    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.fillRect(this.x, this.y, this.w, 3);
  }
}
