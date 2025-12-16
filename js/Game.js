import { LEVELS } from "./levels.js";
import { Platform } from "./Platform.js";
import { Hazard } from "./Hazard.js";
import { Coin } from "./Coin.js";
import { Player } from "./Player.js";
import { rectsIntersect, resolvePlayerPlatforms } from "./Collision.js";

const STORE_KEY = "platformer_lab3_progress_v1";

export class Game {
  constructor(canvas, hud) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.w = canvas.width;
    this.h = canvas.height;

    this.hud = hud;

    this.state = "idle"; // idle | running | paused | win | lose | finished
    this.score = 0;
    this.coins = 0;

    this.levelIndex = 0;

    this.player = new Player(60, 360);
    this.platforms = [];
    this.hazards = [];
    this.coinsList = [];
    this.finish = { x: 820, y: 420, w: 40, h: 60 };

    this._last = 0;
  }

  loadProgress() {
    try {
      const data = JSON.parse(localStorage.getItem(STORE_KEY));
      if (data && Number.isInteger(data.levelIndex)) {
        this.levelIndex = Math.max(0, Math.min(LEVELS.length - 1, data.levelIndex));
      }
    } catch {}
  }

  saveProgress() {
    localStorage.setItem(STORE_KEY, JSON.stringify({ levelIndex: this.levelIndex }));
  }

  start(input) {
    this.input = input;
    this.loadProgress();
    this.loadLevel(this.levelIndex);
    this.state = "running";
  }

  togglePause() {
    if (this.state === "running") this.state = "paused";
    else if (this.state === "paused") this.state = "running";
  }

  restartLevel() {
    this.loadLevel(this.levelIndex);
    this.state = "running";
  }

  loadLevel(index) {
    this.levelIndex = index;
    const L = LEVELS[index];

    this.player.reset(L.playerStart.x, L.playerStart.y);

    this.platforms = L.platforms.map(p => new Platform(p));
    this.hazards = L.hazards.map(h => new Hazard(h));
    this.coinsList = L.coins.map(c => new Coin(c));
    this.finish = { ...L.finish };

    // Очки за уровень не сбрасываем, но монеты уровня учитываем отдельно:
    // coins = общее число собранных монет за всю игру
    this.updateHUD();
    this.saveProgress();
  }

  nextLevel() {
    if (this.levelIndex < LEVELS.length - 1) {
      this.loadLevel(this.levelIndex + 1);
      this.state = "running";
    } else {
      this.state = "finished";
      this.updateHUD();
    }
  }

  updateHUD() {
    this.hud.level.textContent = String(this.levelIndex + 1);
    this.hud.score.textContent = String(this.score);
    this.hud.coins.textContent = String(this.coins);
  }

  update(dt) {
    if (this.state !== "running") return;

    this.player.update(dt, this.input);

    // коллизии с платформами
    resolvePlayerPlatforms(this.player, this.platforms, this.w, this.h);

    // падение вниз — проигрыш
    if (this.player.y > this.h + 200) {
      this.state = "lose";
      return;
    }

    // шипы — проигрыш
    for (const hz of this.hazards) {
      if (rectsIntersect(this.player.rect, { x: hz.x, y: hz.y, w: hz.w, h: hz.h })) {
        this.state = "lose";
        return;
      }
    }

    // монеты
    for (const c of this.coinsList) {
      if (c.collected) continue;
      const coinRect = { x: c.x - c.r, y: c.y - c.r, w: c.r * 2, h: c.r * 2 };
      if (rectsIntersect(this.player.rect, coinRect)) {
        c.collected = true;
        this.coins += 1;
        this.score += 10;
        this.updateHUD();
      }
    }

    // финиш
    if (rectsIntersect(this.player.rect, this.finish)) {
      // бонус за уровень
      this.score += 50;
      this.state = "win";
      this.updateHUD();
    }
  }

  drawBackground() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);

    // сетка
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= this.w; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.h);
      ctx.stroke();
    }
    for (let y = 0; y <= this.h; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.w, y);
      ctx.stroke();
    }
  }

  drawFinish() {
    const ctx = this.ctx;
    ctx.
fillStyle = "rgba(34,197,94,0.75)";
    ctx.fillRect(this.finish.x, this.finish.y, this.finish.w, this.finish.h);

    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = "16px system-ui";
    ctx.fillText("🏁", this.finish.x + 7, this.finish.y + 26);
  }

  drawOverlay(text) {
    const ctx = this.ctx;
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(0, 0, this.w, this.h);

    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.font = "28px system-ui";
    ctx.fillText(text, 24, 64);

    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.font = "16px system-ui";
    ctx.fillText("Нажми Рестарт (или Старт), чтобы продолжить", 24, 92);
  }

  render() {
    this.drawBackground();

    // платформы
    for (const p of this.platforms) p.draw(this.ctx);
    // шипы
    for (const h of this.hazards) h.draw(this.ctx);
    // монеты
    for (const c of this.coinsList) c.draw(this.ctx);

    // финиш
    this.drawFinish();

    // игрок
    this.player.draw(this.ctx);

    // состояния
    if (this.state === "paused") this.drawOverlay("⏸ Пауза");
    if (this.state === "lose") this.drawOverlay("☠️ Проигрыш!");
    if (this.state === "win") this.drawOverlay("✅ Уровень пройден!");
    if (this.state === "finished") this.drawOverlay("🎉 Игра пройдена! (5/5)");
  }

  step = (ts) => {
    const t = ts / 1000;
    const dt = Math.min(0.033, t - this._last);
    this._last = t;

    // обновление
    this.update(dt);

    // если уровень пройден — подождём 0.6s и перейдём
    if (this.state === "win") {
      // один раз переключим на следующий
      this.state = "transition";
      setTimeout(() => this.nextLevel(), 600);
    }

    // рендер
    this.render();

    // конец кадра (для one-shot jumpPressed)
    this.input?.endFrame();

    requestAnimationFrame(this.step);
  };
}
