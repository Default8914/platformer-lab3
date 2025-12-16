export class InputHandler {
  constructor() {
    this.left = false;
    this.right = false;

    this.jump = false;        // удержание
    this.jumpPressed = false; // однократное нажатие

    this._down = (e) => this.onKeyDown(e);
    this._up = (e) => this.onKeyUp(e);

    window.addEventListener("keydown", this._down);
    window.addEventListener("keyup", this._up);
  }

  onKeyDown(e) {
    const key = e.key;

    if (key === "a" || key === "ArrowLeft") this.left = true;
    if (key === "d" || key === "ArrowRight") this.right = true;

    if (key === "w" || key === " " || key === "ArrowUp") {
      if (!this.jump) this.jumpPressed = true;
      this.jump = true;
      e.preventDefault();
    }
  }

  onKeyUp(e) {
    const key = e.key;

    if (key === "a" || key === "ArrowLeft") this.left = false;
    if (key === "d" || key === "ArrowRight") this.right = false;

    if (key === "w" || key === " " || key === "ArrowUp") {
      this.jump = false;
      e.preventDefault();
    }
  }

  endFrame() {
    this.jumpPressed = false;
  }

  destroy() {
    window.removeEventListener("keydown", this._down);
    window.removeEventListener("keyup", this._up);
  }
}

