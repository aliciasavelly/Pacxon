class Pacman {
  constructor(src, stage, game) {
    this.img = new Image();
    this.img.src = src;
    this.stage = stage;
    this.game = game;

    this.handleImageLoad = this.handleImageLoad.bind(this);
    this.img.onload = this.handleImageLoad;
    this.handleKeyup = this.handleKeyup.bind(this);
    this.testCollision = this.testCollision.bind(this);
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
      //   this.game.pacman.x += 15;
      // }
      // this.lastMove = "down";
      this.game.arrowUp = false;
      this.game.arrowDown = true;
      this.game.arrowLeft = false;
      this.game.arrowRight = false;
    } else if (event.key === "ArrowRight" && this.game.pacman.x <= 561) {
      // this.game.pacman.rotation = 0;
      // if (this.lastMove !== "right" && this.lastMove !== null) {
      //   this.game.pacman.x -= 13;
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

  testCollision(pacman) {
    for (let key in this.squares) {
      let pt = this.game.squares[key].globalToLocal(pacman.x, pacman.y);

      if ( this.game.path.size > 0 && this.game.path.has(key) === false && this.squares[key].hitTest(pt.x, pt.y) && this.squares[key].blocked === true && this.blocked.has(key) ) {
        let path_block = this.path.values().next().value;

        this.path.forEach( function(square) {
          this.game.floodFill(square, true);
        }.bind(this))

        this.game.invalidSpots.forEach( function(spot)  {
          let block_arr = spot.split("_");
          let top = this.game.top(block_arr);
          let bottom = this.game.bottom(block_arr);
          let left = this.game.left(block_arr);
          let right = this.game.right(block_arr);

          if ((!this.game.invalidSpots.has(top) && !this.game.invalidSpots.has(bottom)) ||
              (!this.game.invalidSpots.has(left) && ! this.game.invalidSpots.has(right))) {
            this.game.invalidSpots.delete(spot);
          }

          if (this.game.path.has(spot)) {
            this.game.invalidSpots.delete(spot);
          }
        }.bind(this));

        this.game.invalidSpots.forEach( function(spot)  {
          this.game.findInvalidSpots(spot);
        }.bind(this));

        this.game.invalidSpots.forEach( function(spot) {
          this.game.floodZone.delete(spot);
        }.bind(this));

        this.game.floodZone.forEach( function(square) {
          // TODO add next line with fill
          this.game.squares[square].checked = false;
          this.game.handleFilling(square);
        }.bind(this));
        this.game.floodZone = new Set();
        this.game.invalidSpots = new Set();

        for (let key in this.game.squares) {
          this.game.squares[key].checked = false;
        }

        this.game.path.forEach(this.game.blocked.add, this.game.blocked);
        this.game.path = new Set();
        document.getElementById("percent").innerHTML = `Progress: ${Math.floor(this.game.percent)}/75%`

        // TODO have user press key before game continues
        this.game.handleLevelWin();
      } else if ( this.game.squares[key].blocked === false && this.game.squares[key].hitTest(pt.x, pt.y) ) {
        this.game.path.add(key);
        this.game.handleFilling(key);
        document.getElementById("percent").innerHTML = `Progress: ${Math.floor(this.game.percent)}/75%`;

        // TODO have user press key before game continues
        this.game.handleLevelWin();
      }
    }
  }
}

module.exports = Pacman;
