class Game {
  constructor() {
    this.ghosts = [];
    this.lives = 2;
    this.percent = 0;
    this.level = 1;
    this.path = new Set();
    this.blocked = new Set();
  }

  tick(event) {
    if (this.ghosts[0]) {
      this.ghosts.forEach( ghost => {
        ghost.x += ghost.xVel;
        ghost.y += ghost.yVel;
        this.testCollision(ghost);
      })
    }

    this.move ? this.move = false : this.move = true
    if (this.move) {
      if (this.arrowUp && this.pacman.y >= 17) {
        this.pacman.y -= 17;
      } else if (this.arrowDown && this.pacman.y <= 374) {
        this.pacman.y += 17;
      } else if (this.arrowLeft && this.pacman.x >= 17) {
        this.pacman.x -= 17;
      } else if (this.arrowRight && this.pacman.x <= 561) {
        this.pacman.x += 17;
      }
    }

    this.testPacmanCollision(this.pacman);
    this.stage.update();
  }
}

module.exports = Game;
