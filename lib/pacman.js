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

  handleImageLoad() {
    let pacman = new createjs.Bitmap(this.img);
    let pacmanContainer = new createjs.Container();

    pacmanContainer.addChild(pacman);
    pacmanContainer.x = 1;
    pacmanContainer.y = 1;
    pacman.regX = 7;
    pacman.regY = 7.5;
    pacman.x = 7;
    pacman.y = 7.5;
    this.stage.addChild(pacmanContainer);
    this.stage.update();
    this.game.pacman = pacman;
    this.pacman = this.game.pacman;
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
      this.game.pacman.rotation = -90;
      this.game.arrowUp = true;
      this.game.arrowDown = false;
      this.game.arrowLeft = false;
      this.game.arrowRight = false;
    } else if (event.key === "ArrowDown" && this.game.pacman.y <= 374) {
      this.game.pacman.rotation = 90;
      this.game.arrowUp = false;
      this.game.arrowDown = true;
      this.game.arrowLeft = false;
      this.game.arrowRight = false;
    } else if (event.key === "ArrowRight" && this.game.pacman.x <= 561) {
      this.game.pacman.rotation = 0;
      this.game.arrowUp = false;
      this.game.arrowDown = false;
      this.game.arrowLeft = false;
      this.game.arrowRight = true;
    } else if (event.key === "ArrowLeft" && this.game.pacman.x >= 17) {
      this.game.pacman.rotation = 180;
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
