class Pacman {
  constructor(src, stage, game) {
    this.img = new Image();
    this.img.src = src;
    this.stage = stage;
    this.game = game;

    this.handleImageLoad = this.handleImageLoad.bind(this);
    this.img.onload = this.handleImageLoad;
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
    // debugger;
    if (this.game.level == 1) {
      $(document).keydown(function(e) {
        this.game.handleKeydown(e);
      }.bind(this));

      $(document).keyup(function(e) {
        this.game.handleKeyup();
      }.bind(this));
    }
  }
}

module.exports = Pacman;
