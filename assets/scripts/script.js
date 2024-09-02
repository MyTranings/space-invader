class Player {
  constructor(game) {
    this.game = game;
    this.width = 100;
    this.height = 100;
    this.x = this.game.width * 0.5 - this.width * 0.5;
    this.y = this.game.height - this.height;
    this.speed = 5;
  }
  draw(context) {
    context.fillRect(this.x, this.y, this.width, this.height)
  }
  update() {
    if (this.game.keys.indexOf('ArrowLeft') > -1) {
      this.x -= this.speed;
    }
    if (this.game.keys.indexOf('ArrowRight') > -1) {
      this.x += this.speed;
    }
    if (this.x < -this.width * 0.5) {
      this.x = -this.width * 0.5;
    } else if (this.x > this.game.width - this.width * 0.5) {
      this.x = this.game.width - this.width * 0.5;
    }
  }
  shoot() {
    const projectile = this.game.getProjectile();
    if (projectile) {
      projectile.start(this.width * 0.5 + this.x, this.y)
    }
  }
}

class Projectile {
  constructor() {
    this.width = 4;
    this.height = 20;
    this.x = 0;
    this.y = 0;
    this.speed = 20;
    this.free = true;
  }
  draw(context) {
    if (!this.free) {
      context.fillRect(this.x, this.y, this.width, this.height)
    }
  }
  update(context) {
    if (!this.free) {
      this.y -= this.speed;
      if (this.y < -this.height) {
        this.reset()
      }
    }
  }
  start(x, y) {
    this.x = x - this.width * 0.5;
    this.y = y;
    this.free = false;
  }
  reset() {
    this.free = true;
  }
}

class Enemy {

}
class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.keys = [];
    this.player = new Player(this);

    this.projectilePool = [];
    this.numberOfProjectiles = 10;
    this.createProjectiles();
    console.log(this.projectilePool)

    // event lisnteners
    window.addEventListener('keydown', (e) => {
      const index = this.keys.indexOf(e.key);
      if (index === -1) {
        this.keys.push(e.key)
      }
      if (e.key === '1') {
        this.player.shoot()
      }
    })
    window.addEventListener('keyup', (e) => {
      const index = this.keys.indexOf(e.key);
      if (index > -1) {
        this.keys.splice(index, 1)
      }
    })
  }
  render(context) {
    this.player.draw(context)
    this.player.update();
    this.projectilePool.forEach(projectile => {
      projectile.update()
      projectile.draw(context)
    })
  }
  // Create projectiles object pool at ones
  createProjectiles() {
    for (let i = 0; i < this.numberOfProjectiles; i += 1) {
      this.projectilePool.push(new Projectile())
    }
  }
  getProjectile() {
    return this.projectilePool.find(projectile => projectile.free)
  }
}

window.addEventListener('load', function () {
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width = 600;
  canvas.height = 800;

  const game = new Game(canvas);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    game.render(ctx);
    window.requestAnimationFrame(animate)
  }
  animate();
})