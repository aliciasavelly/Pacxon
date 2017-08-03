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

  }

  setupLevel2() {

  }

  setupLevel3() {

  }

  setupLevel4() {

  }
}
