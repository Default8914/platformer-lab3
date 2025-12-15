import { Game } from "./Game.js";

const canvas = document.getElementById("game");

const ui = {
  scoreEl: document.getElementById("score"),
  levelEl: document.getElementById("level"),
  bestEl: document.getElementById("best"),
  hintEl: document.getElementById("hint"),
  btnStart: document.getElementById("btnStart"),
  btnPause: document.getElementById("btnPause"),
  btnRestart: document.getElementById("btnRestart"),
};

const game = new Game(canvas, ui);

ui.btnStart.addEventListener("click", () => game.start());
ui.btnPause.addEventListener("click", () => game.pauseToggle());
ui.btnRestart.addEventListener("click", () => game.restart());

// быстрая подсказка при загрузке
ui.hintEl.textContent = "Нажми «Старт». Собери все монеты и дойди до зелёного портала.";
ui.bestEl.textContent = localStorage.getItem("platformer_best") || "0";
