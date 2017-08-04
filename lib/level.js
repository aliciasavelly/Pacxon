const Ghost = require("./ghost.js");

class Level {
  constructor(level, game) {
    this.level = level;
    this.game = game;
    this.stage = this.game.stage;
    this.ghosts = this.game.ghosts;

    if (level % 5 == 1) {
      this.setupLevel1();
    } else if (level % 5 == 2) {
      this.setupLevel2();
    } else if (level % 5 == 3) {
      this.setupLevel3();
    } else if (level % 5 == 4) {
      this.setupLevel4();
    } else {
      this.setupLevel5();
    }
  }

  setupLevel1() {
    this.game.pinky_ghost1 = new Ghost("./lib/assets/pinky_ghost.png", this.stage, this.ghosts, 4, false, .05);
    this.game.pinky_ghost2 = new Ghost("./lib/assets/pinky_ghost.png", this.stage, this.ghosts, 4, false, .05);
  }

  setupLevel2() {
    this.game.pinky_ghost1 = new Ghost("./lib/assets/pinky_ghost.png", this.stage, this.ghosts, 4, false, .05);
    this.game.pinky_ghost2 = new Ghost("./lib/assets/pinky_ghost.png", this.stage, this.ghosts, 4, false, .05);
    this.game.red_ghost = new Ghost("./lib/assets/red_ghost.png", this.stage, this.ghosts, 4, true, .05);
  }

  setupLevel3() {
    this.game.pinky_ghost = new Ghost("./lib/assets/pinky_ghost.png", this.stage, this.ghosts, 5.5, false, .05);
    this.game.orange_ghost = new Ghost("./lib/assets/orange_ghost.png", this.stage, this.ghosts, 4, false, .08);
    this.game.red_ghost = new Ghost("./lib/assets/red_ghost.png", this.stage, this.ghosts, 4, true, .05);
  }

  setupLevel4() {
    this.game.orange_ghost1 = new Ghost("./lib/assets/orange_ghost.png", this.stage, this.ghosts, 4, false, .08);
    this.game.orange_ghost2 = new Ghost("./lib/assets/orange_ghost.png", this.stage, this.ghosts, 4, false, .08);
    this.game.red_ghost = new Ghost("./lib/assets/red_ghost.png", this.stage, this.ghosts, 4, true, .05);
  }

  setupLevel5() {
    this.game.pinky_ghost = new Ghost("./lib/assets/pinky_ghost.png", this.stage, this.ghosts, 6, false, .05);
    this.game.orange_ghost = new Ghost("./lib/assets/orange_ghost.png", this.stage, this.ghosts, 4, false, .08);
    this.game.red_ghost1 = new Ghost("./lib/assets/red_ghost.png", this.stage, this.ghosts, 4, true, .05);
    this.game.red_ghost2 = new Ghost("./lib/assets/red_ghost.png", this.stage, this.ghosts, 4, true, .05);
  }
}

module.exports = Level;
