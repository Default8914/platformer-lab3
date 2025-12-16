import { Game } from "./Game.js";
import { InputHandler } from "./InputHandler.js";

const canvas = document.getElementById("game");
const hud = {
  level: document.getElementById("hudLevel"),
  score: document.getElementById("hudScore"),
  coins: document.getElementById("hudCoins")
};

const input = new InputHandler();
const game = new Game(canvas, hud);

const btnStart = document.getElementById("btnStart");
const btnPause = document.getElementById("btnPause");
const btnRestart = document.getElementById("btnRestart");

btnStart.addEventListener("click", () => {
  if (game.state === "idle") {
    game.start(input);
    requestAnimationFrame(game.step);
  } else if (game.state === "lose" || game.state === "finished") {
    game.restartLevel();
  }
});

btnPause.addEventListener("click", () => {
  game.togglePause();
});

btnRestart.addEventListener("click", () => {
  if (game.state === "idle") {
    game.start(input);
    requestAnimationFrame(game.step);
  } else {
    game.restartLevel();
  }
});
