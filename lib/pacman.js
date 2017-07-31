class Pacman {
  constructor(src, stage, game) {
    this.img = new Image();
    this.img.src = src;
    this.stage = stage;
    this.game = game;
    this.gameView = this.game.gameView;

    this.handleImageLoad = this.handleImageLoad.bind(this);
    this.img.onload = this.handleImageLoad;
    this.handleKeyup = this.handleKeyup.bind(this);
  }

  handleImageLoad(event) {
    let image = event.target;
    let bitmap = new createjs.Bitmap(image);
    bitmap.scaleX = 0.0071;
    bitmap.scaleY = 0.0071;
    bitmap.x = 1;
    bitmap.y = 1;
    bitmap.size = 17;
    this.stage.addChild(bitmap);
    this.stage.update();
    this.game.pacman = bitmap;
    this.pacman = this.game.pacman;
    this.game.pacman.regX = 50;
    this.game.pacman.regy = 50;
    if (this.game.level == 1) {
      $(document).keydown(function(e) {
        this.handleKeydown(e);
      }.bind(this));

      $(document).keyup(function(e) {
        this.handleKeyup();
      }.bind(this));
    }
  }

  handleKeydown(event) {
    if (event.key === "ArrowUp" && this.game.pacman.y >= 17) {
      // this.game.pacman.rotation = -90;
      // if (this.lastMove !== "up") {
      //   this.game.pacman.y += 15;
      // }
      // this.lastMove = "up";
      this.game.arrowUp = true;
      this.game.arrowDown = false;
      this.game.arrowLeft = false;
      this.game.arrowRight = false;
    } else if (event.key === "ArrowDown" && this.game.pacman.y <= 374) {
      // this.game.pacman.rotation = 90;
      // if (this.lastMove !== "down") {
        // this.game.pacman.skewX = 15;
      // }
      // this.lastMove = "down";
      this.game.arrowUp = false;
      this.game.arrowDown = true;
      this.game.arrowLeft = false;
      this.game.arrowRight = false;
      // this.count = 1;
    } else if (event.key === "ArrowRight" && this.game.pacman.x <= 561) {
      // this.game.pacman.rotation = 0;
      // if (this.lastMove !== "right" && this.lastMove !== null) {
        // this.game.pacman.skewX = -13;
      // }
      // this.lastMove = "right";
      this.game.arrowUp = false;
      this.game.arrowDown = false;
      this.game.arrowLeft = false;
      this.game.arrowRight = true;
    } else if (event.key === "ArrowLeft" && this.game.pacman.x >= 17) {
      // this.game.pacman.rotation = 180;
      // if (this.lastMove !== "left") {
      //   this.game.pacman.x += 15;
      // }
      // this.lastMove = "left";
      this.game.arrowUp = false;
      this.game.arrowDown = false;
      this.game.arrowLeft = true;
      this.game.arrowRight = false;
    }
  }

  handleKeyup() {
    this.game.arrowUp = false;
    this.game.arrowDown = false;
    this.game.arrowLeft = false;
    this.game.arrowRight = false;
  }
}

module.exports = Pacman;
