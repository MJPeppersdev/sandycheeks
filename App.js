{

    "use strict";

    //

    const NBR_PARTICULE = 8000;
    const GRAVITY = 0.1;
  
    class Particule {
      constructor () {
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.mass = 0;
        this.actif = false;
        this.color = null;
      }
      init (px, py, color) {
        this.x = px;
        this.y = py;
        this.vy = 0;
        this.mass = 2 + Math.random () * 4;
        this.actif = true;
        this.color = color;
      }
      update () {
        if (this.x < 1 || this.x > width - 1) {
          this.actif = false;
          return;
        }
        const pb = ground [this.x];
        if (this.y >= pb) {
          this.vy = 0;
          this.y = pb;
          const l = pb < ground [this.x - 1];
          const r = pb < ground [this.x + 1];
          if (l && r) {
            this.x += Math.random () > 0.5 ? -1 : 1;
          }
          else if (this.x === 1) {
            if (r) {
              this.x ++;
            }
            else this.layer ();
          }
          else if (this.x === width - 2) {
            if (l) {
              this.x --;
            }
            else this.layer ();
          }
          else if (r) {
            this.x ++;
          }
          else if (l) {
            this.x --;
          }
          else {
            this.layer ();
          }
        }
        else {
          ctx.fillStyle = this.color;
          ctx.fillRect (this.x, this.y, 1, 1);
          this.vy += (this.mass * GRAVITY);
          this.y += this.vy;
        }
      }
      layer () {
        backCtx.fillStyle = this.color;
        backCtx.fillRect (this.x, this.y, 1, 1);
        ground [this.x] --;
        this.actif = false;
      }
    }
  
    const gen = (px, py) => {
      if (enable && py < ground [px]) {
        const d = radius * 2;
        let n = d;
        let i = 0;
        while (n >= 0 && i < NBR_PARTICULE) {
          const p = particules [i];
          if (!p.actif) {
            const x = (px - radius + Math.random () * d) | 0;
            const y = (py - radius + Math.random () * d) | 0;
            p.init (x, y, color);
            n--;  
          }
          i++;
        }
      }
    }
  
    const pointer = {
      isDown: false,
      x: 0,
      y: 0,
      init (canvas) {
        window.addEventListener ("mousedown", e => this.down (e), false);
        window.addEventListener ("touchstart", e => this.down (e), false);
        window.addEventListener ("mouseup", _ => this.up (), false);
        window.addEventListener ("touchend", _ => this.up (), false);
        window.addEventListener ('mousemove', e => this.move (e), false);
        canvas.addEventListener ("touchmove", e => this.move (e), false);
      },
      move (e) {
        let p;
        const mode = e.targetTouches;
        if (mode) {
          e.preventDefault ();
          p = mode [0];
        }
        else p = e;
        this.x = p.clientX - canvas.offsetLeft;
        this.y = p.clientY;
      },
      down (e) {
        this.move (e);
        this.isDown = true;
      },
      up () {
        this.isDown = false;
      }
    }
    
    ///////////////////// init /////////////////////////
    const canvas = document.querySelector("canvas");
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext ("2d");
    const background = document.createElement ("canvas");
    background.width = width;
    background.height = height;
    const backCtx = background.getContext ("2d");
    backCtx.fillStyle = "#000";
    backCtx.fillRect (0, 0, width, height);
    ctx.fillStyle = backCtx.fillStyle = "#FFF";
    ctx.strokeStyle = "#0F0";
    pointer.init (canvas);
    const ground = new Uint16Array (width);
    const particules = [];
    let radius = 6,
        enable = true,
        color = "#FFF";
    for (let i = 0; i < width; i++) {
      ground [i] = height - 1;
    }
    for (let i = 0; i < NBR_PARTICULE; i++) {
      particules.push (new Particule ());
    }
    
    ///////////////// control palette //////////////////
    document.getElementById ("palette").addEventListener ("input", e => {
      if (e.target.value !== "#000000") {
        color = e.target.value;
        enable = true;
      }
      else enable = false;
    }, false);
    document.getElementById ("radius").addEventListener ("input", e => {
      radius = e.target.value;
    }, false);
    
    /////////////////// running ////////////////////////
    const run = _ => {
      requestAnimationFrame (run);
      ctx.drawImage (background, 0, 0);
      if (pointer.isDown) {
        ctx.beginPath ();
        ctx.arc (pointer.x, pointer.y, radius * 1.3, 0, Math.PI * 2, false);
        ctx.stroke ();
        gen (pointer.x, pointer.y);
      }
      for (let p of particules) {
        if (p.actif) p.update ();
      }
    }
    requestAnimationFrame (run);
    
  }
