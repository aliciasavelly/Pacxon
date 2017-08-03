const Ghost = require("./ghost.js");

class Level {
  constructor(level, game) {
    this.level = level;
    this.game = game;
    this.stage = this.game.stage;
    this.ghosts = this.game.ghosts;

    if (level % 4 == 1) {
      this.setupLevel1();
    } else if (level % 4 == 2) {
      this.setupLevel2();
    } else if (level % 4 == 3) {
      this.setupLevel3();
    } else {
      this.setupLevel4();
    }
  }

  setupLevel1() {
    this.game.red_ghost = new Ghost("./lib/assets/red_ghost.png", this.stage, this.ghosts);
    this.game.orange_ghost = new Ghost("./lib/assets/orange_ghost.png", this.stage, this.ghosts);
    // this.game.pinky_ghost = new Ghost("./lib/assets/pinky_ghost.png", this.stage, this.ghosts);
  }

  setupLevel2() {
    this.game.red_ghost = new Ghost("./lib/assets/red_ghost.png", this.stage, this.ghosts);
    this.game.orange_ghost = new Ghost("./lib/assets/orange_ghost.png", this.stage, this.ghosts);
    this.game.pinky_ghost = new Ghost("./lib/assets/pinky_ghost.png", this.stage, this.ghosts);
  }

  setupLevel3() {

  }

  setupLevel4() {

  }
}

module.exports = Level;