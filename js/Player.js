export class Player {
  constructor(x, y) {
    this.w = 34;
    this.h = 44;
    this.reset(x, y);
  }

  reset(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.onGround = false;
  }

  get rect() {
    return { x: this.x, y: this.y, w: this.w, h: this.h };
  }

  update(dt, input) {
    const speed = 260;
    const jump = 520;

    // горизонталь
    let dir = 0;
    if (input.left) dir -= 1;
    if (input.right) dir += 1;

    this.vx = dir * speed;

    // прыжок (только если стоим на земле)
    if (input.jumpPressed && this.onGround) {
      this.vy = -jump;
      this.onGround = false;
    }

    // гравитация
    const g = 1400;
    this.vy += g * dt;

    // движение
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  draw(ctx) {
    // тело
    ctx.fillStyle = "rgba(124,92,255,0.95)";
    ctx.fillRect(this.x, this.y, this.w, this.h);

    // "глаза"
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fillRect(this.x + 8, this.y + 12, 6, 6);
    ctx.fillRect(this.x + 20, this.y + 12, 6, 6);
  }
}
