class Ghost {
  constructor(src) {
    this = new Image();
    this.src = src;
    this.onload = this.handleImageLoadGhost;
  }
}

module.exports = Ghost;
