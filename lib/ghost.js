class Ghost {
  constructor(src, stage, ghosts, vel, kill, size) {
    this.img = new Image();
    this.img.src = src;
    this.stage = stage;
    this.ghosts = ghosts;
    this.vel = vel;
    this.kill = kill;
    this.size = size;

    this.handleImageLoad = this.handleImageLoad.bind(this);
    this.img.onload = this.handleImageLoad;
  }

  handleImageLoad(event) {
    let image = event.target;
    let bitmap = new createjs.Bitmap(image);
    // bitmap.scaleX = 0.05;
    // bitmap.scaleY = 0.05;
    bitmap.scaleX = this.size;
    bitmap.scaleY = this.size;

    while (bitmap.y > 355 || bitmap.y < 20) {
      bitmap.y = 400 * Math.random();
    }
    while (bitmap.x > 540 || bitmap.x < 20) {
      bitmap.x = 600 * Math.random();
    }

    bitmap.kill = this.kill;
    this.ghosts.push(bitmap);
    // this.ghosts.forEach( ghost => {
    bitmap.xVel = this.vel;
    bitmap.yVel = this.vel;
    bitmap.size = 340 * this.size;
    // });

    this.stage.addChild(bitmap);
    this.stage.update();
  }
}

module.exports = Ghost;
