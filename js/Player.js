import { aabb } from "./Collision.js";

export class Player {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.w = 34; this.h = 42;

    this.vx = 0; this.vy = 0;
    this.speed = 260;         // px/sec
    this.jumpPower = 520;     // px/sec
    this.gravity = 1400;      // px/sec^2
    this.maxFall = 900;

    this.onGround = false;
    this.facing = 1; // 1 вправо, -1 влево
    this.color = "rgba(124,92,255,0.95)";
  }

  get rect(){ return { x:this.x, y:this.y, w:this.w, h:this.h }; }

  reset(x, y){
    this.x = x; this.y = y;
    this.vx = 0; this.vy = 0;
    this.onGround = false;
  }

  update(dt, input, platforms) {
    // движение
    let dir = 0;
    if (input.isDown("a") || input.isDown("arrowleft")) dir -= 1;
    if (input.isDown("d") || input.isDown("arrowright")) dir += 1;

    this.vx = dir * this.speed;
    if (dir !== 0) this.facing = dir;

    // прыжок
    const jumpPressed = input.isDown("w") || input.isDown("arrowup") || input.isDown("space");
    if (jumpPressed && this.onGround) {
      this.vy = -this.jumpPower;
      this.onGround = false;
    }

    // гравитация
    this.vy += this.gravity * dt;
    if (this.vy > this.maxFall) this.vy = this.maxFall;

    // сначала X
    this.x += this.vx * dt;
    this._collideX(platforms);

    // затем Y
    this.y += this.vy * dt;
    this.onGround = false;
    this._collideY(platforms);
  }

  _collideX(platforms) {
    for (const p of platforms) {
      if (!aabb(this.rect, p)) continue;

      if (this.vx > 0) this.x = p.x - this.w;
      else if (this.vx < 0) this.x = p.x + p.w;
    }
  }

  _collideY(platforms) {
    for (const p of platforms) {
      if (!aabb(this.rect, p)) continue;

      if (this.vy > 0) { // падаем на платформу
        this.y = p.y - this.h;
        this.vy = 0;
        this.onGround = true;
      } else if (this.vy < 0) { // удар головой
        this.y = p.y + p.h;
        this.vy = 0;
      }
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);

    // “лицо”
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    const eyeX = this.facing === 1 ? this.x + this.w - 10 : this.x + 6;
    ctx.fillRect(eyeX, this.y + 12, 4, 4);
    ctx.restore();
  }
}
