const Ghost = require("./ghost.js");

class Level {
  constructor(level, game) {
    this.level = level;
    this.game = game;
    this.stage = this.game.stage;
    this.ghosts = this.game.ghosts;
  }

  setupLevel1() {
    new Ghost("./lib/assets/pinky_ghost.png", this.stage, this.ghosts, -4, false, .05);
    new Ghost("./lib/assets/pinky_ghost.png", this.stage, this.ghosts, 4, false, .05);
  }

  setupLevel2() {
    new Ghost("./lib/assets/pinky_ghost.png", this.stage, this.ghosts, 4, false, .05);
    new Ghost("./lib/assets/pinky_ghost.png", this.stage, this.ghosts, -4, false, .05);
    new Ghost("./lib/assets/red_ghost.png", this.stage, this.ghosts, 4, true, .05);
  }

  setupLevel3() {
    new Ghost("./lib/assets/pinky_ghost.png", this.stage, this.ghosts, 5.5, false, .05);
    new Ghost("./lib/assets/orange_ghost.png", this.stage, this.ghosts, -4, false, .08);
    new Ghost("./lib/assets/red_ghost.png", this.stage, this.ghosts, 4, true, .05);
  }

  setupLevel4() {
    new Ghost("./lib/assets/orange_ghost.png", this.stage, this.ghosts, 4, false, .08);
    new Ghost("./lib/assets/orange_ghost.png", this.stage, this.ghosts, -4, false, .08);
    new Ghost("./lib/assets/red_ghost.png", this.stage, this.ghosts, -4, true, .05);
  }

  setupLevel5() {
    new Ghost("./lib/assets/pinky_ghost.png", this.stage, this.ghosts, 6, false, .05);
    new Ghost("./lib/assets/orange_ghost.png", this.stage, this.ghosts, -4, false, .08);
    new Ghost("./lib/assets/red_ghost.png", this.stage, this.ghosts, 4, true, .05);
    new Ghost("./lib/assets/red_ghost.png", this.stage, this.ghosts, 4, true, .05);
  }

  setupLevel6() {
    new Ghost("./lib/assets/pinky_ghost.png", this.stage, this.ghosts, 5, false, .05);
    new Ghost("./lib/assets/orange_ghost.png", this.stage, this.ghosts, -4, false, .08);
    new Ghost("./lib/assets/orange_ghost.png", this.stage, this.ghosts, -4, false, .08);
    new Ghost("./lib/assets/orange_ghost.png", this.stage, this.ghosts, 4, false, .08);
  }
}

module.exports = Level;
