class Ghost {
  constructor(src, stage, ghosts) {
    this.img = new Image();
    this.img.src = src;
    this.stage = stage;
    this.ghosts = ghosts;

    this.handleImageLoad = this.handleImageLoad.bind(this);
    this.img.onload = this.handleImageLoad;
  }

  handleImageLoad(event) {
    let image = event.target;
    let bitmap = new createjs.Bitmap(image);
    bitmap.scaleX = 0.05;
    bitmap.scaleY = 0.05;

    while (bitmap.y > 355 || bitmap.y < 20) {
      bitmap.y = 400 * Math.random();
    }
    while (bitmap.x > 540 || bitmap.x < 20) {
      bitmap.x = 600 * Math.random();
    }

    this.ghosts.push(bitmap);
    this.ghosts.forEach( ghost => {
      ghost.xVel = 4;
      ghost.yVel = 4;
      ghost.size = 17;
    });

    this.stage.addChild(bitmap);
    this.stage.update();
  }
}

module.exports = Ghost;
