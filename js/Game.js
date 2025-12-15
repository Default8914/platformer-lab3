import { InputHandler } from "./InputHandler.js";
import { Player } from "./Player.js";
import { Platform } from "./Platform.js";
import { Coin } from "./Coin.js";

export class Game {
  constructor(canvas, ui) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.ui = ui; // { scoreEl, levelEl, bestEl, hintEl, ... }

    this.input = new InputHandler();
    this.player = new Player(60, 60);

    this.levelIndex = 0;
    this.levels = this._createLevels();

    this.platforms = [];
    this.coins = [];
    this.spawn = { x: 60, y: 60 };
    this.goal = { x: 900, y: 120, w: 40, h: 80 };

    this.score = 0;
    this.best = Number(localStorage.getItem("platformer_best") || 0);

    this.state = "menu"; // menu | running | paused | win | lose
    this.lastTime = 0;

    this._loadLevel(0);
    this._syncUI();
  }

  start() {
    if (this.state === "running") return;
    this.state = "running";
    this.ui.hintEl.textContent = "Собери все монеты и дойди до портала!";
    requestAnimationFrame((t) => this._loop(t));
  }

  pauseToggle() {
    if (this.state === "running") this.state = "paused";
    else if (this.state === "paused") {
      this.state = "running";
      requestAnimationFrame((t) => this._loop(t));
    }
    this._syncUI();
  }

  restart() {
    this.score = 0;
    this.levelIndex = 0;
    this._loadLevel(0);
    this.state = "running";
    this.ui.hintEl.textContent = "Рестарт! Удачи 🙂";
    this._syncUI();
    requestAnimationFrame((t) => this._loop(t));
  }

  destroy() {
    this.input.destroy();
  }

  _createLevels() {
    // координаты под canvas 960x540
    return [
      {
        spawn: { x: 60, y: 60 },
        goal:  { x: 900, y: 120, w: 40, h: 80 },
        platforms: [
          new Platform(0, 500, 960, 40),
          new Platform(120, 410, 180, 18),
          new Platform(360, 350, 160, 18),
          new Platform(580, 290, 160, 18),
          new Platform(780, 220, 140, 18),
        ],
        coins: [
          new Coin(200, 380),
          new Coin(430, 320),
          new Coin(650, 260),
          new Coin(840, 190),
        ],
      },
      {
        spawn: { x: 60, y: 60 },
        goal:  { x: 900, y: 90, w: 40, h: 80 },
        platforms: [
          new Platform(0, 500, 960, 40),
          new Platform(100, 440, 130, 18),
          new Platform(270, 390, 130, 18),
          new Platform(440, 340, 130, 18),
          new Platform(610, 290, 130, 18),
          new Platform(780, 240, 130, 18),
          new Platform(520, 460, 140, 18),
        ],
        coins: [
          new Coin(160, 410),
          new Coin(330, 360),
          new Coin(500, 310),
          new Coin(570, 430),
          new Coin(830, 210),
        ],
      },
    ];
  }

  _loadLevel(idx) {
    const lvl = this.levels[idx];
    this.platforms = lvl.platforms;
    this.coins = lvl.coins;
    this.spawn = lvl.spawn;
    this.goal = lvl.goal;

    this.player.reset(this.spawn.x, this.spawn.y);

    this.ui.levelEl.textContent = String(idx + 1);
    this._syncUI();
  }

  _loop(timestamp) {
    if (this.state !== "running") return;

    const dt = Math.min(0.033, (timestamp - this.lastTime) / 1000 || 0);
    this.lastTime = timestamp;

    this.update(dt);
    this.render();

    requestAnimationFrame((t) => this._loop(t));
  }

  update(dt) {
    this.player.update(dt, this.input, this.platforms);

    // границы экрана
    if (this.player.x < 0) this.player.x = 0;
    if (this.player.x + this.player.w > this.canvas.width) this.player.x = this.canvas.width - this.player.w;

    // падение = поражение (опционально)
    if (this.player.y > this.canvas.height + 200) {
      this.state = "lose";
      this.ui.hintEl.textContent = "Ты упал(а) 😅 Нажми Рестарт.";
      this._syncUI();
      return;
    }

    // сбор монет
    for (const c of this.coins) {
      if (c.checkCollect(this.player.rect)) {
        this.score += 10;
        this._syncUI();
      }
    }

    // победа на уровне: все монеты + касание портала
    const allCollected = this.coins.every(c => c.collected);
    if (allCollected && this._touchGoal()) {
      if (this.levelIndex < this.levels.length - 1) {
        this.levelIndex += 1;
        this._loadLevel(this.levelIndex);
        this.ui.hintEl.textContent = "Уровень пройден! Следующий 🙂";
      } else {
        this.state = "win";
        this.ui.hintEl.textContent = "Победа! Все уровни пройдены 🎉 Рестарт для новой игры.";
      }
      this._syncUI();
    }
  }

  _touchGoal() {
    const p = this.player.rect;
    const g = this.goal;
    return (
      p.x < g.x + g.w &&
      p.x + p.w > g.x &&
      p.y < g.y + g.h &&
      p.y + p.h > g.y
    );
  }

  _syncUI() {
    this.ui.scoreEl.textContent = String(this.score);
    this.ui.bestEl.textContent = String(this.best);

    if (this.score > this.best) {
      this.best = this.score;
      localStorage.setItem("platformer_best", String(this.best));
      this.ui.bestEl.textContent = String(this.best);
    }

    // управление кнопками (удобно для проверки)
    const runningOrPaused = this.state === "running" || this.state === "paused";
    this.ui.btnPause.disabled = !runningOrPaused;
    this.ui.btnRestart.disabled = !runningOrPaused && this.state !== "win" && this.state !== "lose";
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // фон
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.restore();

    // портал (цель)
    ctx.save();
    ctx.fillStyle = "rgba(34,197,94,0.35)";
    ctx.fillRect(this.goal.x, this.goal.y, this.goal.w, this.goal.h);
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.strokeRect(this.goal.x, this.goal.y, this.goal.w, this.goal.h);
    ctx.restore();

    // платформы
    for (const p of this.platforms) p.draw(ctx);

    // монеты
    for (const c of this.coins) c.draw(ctx);

    // игрок
    this.player.draw(ctx);

    // подсказка “собери монеты”
    const left = this.coins.filter(c => !c.collected).length;
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = "14px system-ui";
    ctx.fillText(`Монет осталось: ${left}`, 16, 24);
    ctx.restore();

    if (this.state === "paused") {
      ctx.save();
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
      ctx.fillStyle = "white";
      ctx.font = "28px system-ui";
      ctx.fillText("Пауза", this.canvas.width/2 - 45, this.canvas.height/2);
      ctx.restore();
    }
  }
}
