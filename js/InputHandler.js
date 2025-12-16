export class InputHandler {
  constructor() {
    this.left = false;
    this.right = false;

    this.jump = false;        // удержание
    this.jumpPressed = false; // один раз на кадр

    this._onKeyDown = (e) => this.onKeyDown(e);
    this._onKeyUp = (e) => this.onKeyUp(e);

    window.addEventListener("keydown", this._onKeyDown);
    window.addEventListener("keyup", this._onKeyUp);
  }

  destroy() {
    window.removeEventListener("keydown", this._onKeyDown);
    window.removeEventListener("keyup", this._onKeyUp);
  }

  onKeyDown(e) {
    const k = e.key.toLowerCase();
    if (k === "a" || e.key === "ArrowLeft") this.left = true;
    if (k === "d" || e.key === "ArrowRight") this.right = true;

    if (k === "w"  e.key === " "  e.key === "ArrowUp") {
      if (!this.jump) this.jumpPressed = true;
      this.jump = true;
      e.preventDefault();
    }
  }

  onKeyUp(e) {
    const k = e.key.toLowerCase();
    if (k === "a" || e.key === "ArrowLeft") this.left = false;
    if (k === "d" || e.key === "ArrowRight") this.right = false;

    if (k === "w"  e.key === " "  e.key === "ArrowUp") {
      this.jump = false;
      e.preventDefault();
    }
  }

  endFrame() {
    // сбрасываем "одноразовое" нажатие
    this.jumpPressed = false;
  }
}
