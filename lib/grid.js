class Grid {
  constructor() {
    this.squares = {};
    this.floodZone = new Set;
    this.invalidSpots = new Set;
  }
}

module.exports = Grid;
