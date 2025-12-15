export class InputHandler {
  constructor() {
    this.keys = new Set();

    this._down = (e) => {
      const k = e.key.toLowerCase();
      if (["arrowleft","arrowright","arrowup","a","d","w"," "].includes(k)) e.preventDefault();
      this.keys.add(k === " " ? "space" : k);
    };

    this._up = (e) => {
      const k = e.key.toLowerCase();
      this.keys.delete(k === " " ? "space" : k);
    };

    window.addEventListener("keydown", this._down, { passive:false });
    window.addEventListener("keyup", this._up);
  }

  isDown(key) {
    return this.keys.has(key);
  }

  destroy() {
    window.removeEventListener("keydown", this._down);
    window.removeEventListener("keyup", this._up);
  }
}
