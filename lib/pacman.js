class Pacman {
  constructor(src, stage, game) {
    this.img = new Image();
    this.img.src = src;
    this.stage = stage;
    this.game = game;
    this.gameView = this.game.gameView;
    this.keysDown = new Set;

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
        this.handleKeyup(e);
      }.bind(this));
    }
  }

  handleKeydown(event) {
    if (event.key === "ArrowUp" && this.game.pacman.y >= 17) {
      this.keysDown.add("ArrowUp");
      this.game.currentArrow = "up";
      if (this.pacman.rotation != -90) {
        this.pacman.rotation = -90;
      }
    } else if (event.key === "ArrowDown" && this.game.pacman.y <= 374) {
      this.keysDown.add("ArrowDown");
      this.game.currentArrow = "down";
      if (this.pacman.rotation != 90) {
        this.pacman.rotation = 90;
      }
    } else if (event.key === "ArrowRight" && this.game.pacman.x <= 561) {
      this.keysDown.add("ArrowRight");
      this.game.currentArrow = "right";
      if (this.pacman.rotation != 0) {
        this.pacman.rotation = 0;
      }
    } else if (event.key === "ArrowLeft" && this.game.pacman.x >= 17) {
      this.keysDown.add("ArrowLeft");
      this.game.currentArrow = "left";
      if (this.pacman.rotation != 180) {
        this.pacman.rotation = 180;
      }
    }
  }

  handleKeyup(event) {
    this.keysDown.delete(event.key);
    if (this.keysDown.size == 0) {
      this.game.currentArrow = null;
    }
  }
}

module.exports = Pacman;
