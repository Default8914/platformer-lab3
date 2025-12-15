import { aabb } from "./Collision.js";

export class Coin {
  constructor(x, y, r = 10) {
    this.x = x; this.y = y; this.r = r;
    this.collected = false;
  }

  get rect() {
    return { x: this.x - this.r, y: this.y - this.r, w: this.r * 2, h: this.r * 2 };
  }

  checkCollect(playerRect) {
    if (this.collected) return false;
    if (aabb(this.rect, playerRect)) {
      this.collected = true;
      return true;
    }
    return false;
  }

  draw(ctx) {
    if (this.collected) return;
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,215,0,0.9)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.stroke();
    ctx.restore();
  }
}
