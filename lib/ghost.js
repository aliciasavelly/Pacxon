class Ghost {
  constructor(src, stage, ghosts, vel, kill, scale) {
    this.img = new Image();
    this.img.src = src;
    this.stage = stage;
    this.ghosts = ghosts;
    this.vel = vel;
    this.kill = kill;
    this.scale = scale;

    this.handleImageLoad = this.handleImageLoad.bind(this);
    this.img.onload = this.handleImageLoad;
  }

  handleImageLoad(event) {
    let bitmap = new createjs.Bitmap(event.target);
    bitmap.scaleX = this.scale;
    bitmap.scaleY = this.scale;

    while (bitmap.y > 355 || bitmap.y < 20) {
      bitmap.y = 400 * Math.random();
    }
    while (bitmap.x > 540 || bitmap.x < 20) {
      bitmap.x = 600 * Math.random();
    }

    bitmap.kill = this.kill;
    bitmap.xVel = this.vel;
    bitmap.yVel = this.vel;
    bitmap.size = 340 * this.scale;

    this.ghosts.push(bitmap);
    this.stage.addChild(bitmap);
    this.stage.update();
  }
}

module.exports = Ghost;
