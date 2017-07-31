const Ghost = require("./ghost.js");
const Pacman = require("./pacman.js");

const BLOCK_COLOR = "#0800a3";
const EMPTY_COLOR = "#282828";

class Game {
  constructor(stage, gameView) {
    this.stage = stage;
    this.gameView = gameView;
    this.ghosts = [];
    this.lives = 2;
    this.percent = 0;
    this.level = 1;
    this.path = new Set;
    this.arrowUp = false;
    this.arrowDown = false;
    this.arrowLeft = false;
    this.arrowRight = false;
    this.move = false;
    this.floodZone = new Set;
    this.invalidSpots = new Set;

    this.setup = this.setup.bind(this);
    this.tick = this.tick.bind(this);
    this.testCollision = this.testCollision.bind(this);
    this.testPacmanCollision = this.testPacmanCollision.bind(this);
    this.floodFill = this.floodFill.bind(this);
    this.findInvalidSpots = this.findInvalidSpots.bind(this);
    this.handleLevelWin = this.handleLevelWin.bind(this);
    this.handleLevelLose = this.handleLevelLose.bind(this);
    this.handleSetup = this.handleSetup.bind(this);

    this.setup();
  }

  tick(event) {
    if (this.ghosts.length > 0) {
      this.ghosts.forEach( ghost => {
        ghost.x += ghost.xVel;
        ghost.y += ghost.yVel;
        this.testCollision(ghost);
      });
    }

    this.move ? this.move = false : this.move = true
    if (this.move) {
      if (this.arrowUp && this.pacman.y >= 17) {
        this.pacman.y -= 17;
      } else if (this.arrowDown && this.pacman.y <= 374) {
        this.pacman.y += 17;
      } else if (this.arrowLeft && this.pacman.x >= 17) {
        this.pacman.x -= 17;
      } else if (this.arrowRight && this.pacman.x <= 561) {
        this.pacman.x += 17;
      }
    }

    this.testPacmanCollision(this.pacman);
    this.stage.update();
  }

  testCollision(inputGhost) {
    if (
      inputGhost.x < this.pacman.x + this.pacman.size &&
      inputGhost.x + inputGhost.size > this.pacman.x &&
      inputGhost.y < this.pacman.y + this.pacman.size &&
      inputGhost.y + inputGhost.size > this.pacman.y
    ) {
      this.lives -= 1;

      if (this.lives < 0) {
        this.handleLevelLose(true);
      } else {
        this.pacman.x = 1;
        this.pacman.y = 1;
        document.getElementById("lives").innerHTML = `Lives: ${this.lives}`;
      }

      for (let item of this.path) {
        this.squares[item].blocked = false;
        this.squares[item].graphics.beginFill(EMPTY_COLOR).drawRect(0, 0, 17, 17);
        this.percent -= .18;
        document.getElementById("percent").innerHTML = `Progress: ${Math.floor(this.percent)}/75%`
      }

      this.path.clear();
    }

    this.ghosts.forEach( ghost => {
      if (ghost !== inputGhost) {
        if (
          inputGhost.x < ghost.x + ghost.size &&
          inputGhost.x + inputGhost.size > ghost.x &&
          inputGhost.y < ghost.y + ghost.size &&
          inputGhost.y + inputGhost.size > ghost.y
        ) {
          let xVel = inputGhost.xVel;
          let yVel = inputGhost.yVel;
          let ghostX = ghost.x;
          let ghostY = ghost.y;
          let xDiff = ghostX - inputGhost.x;
          let yDiff = ghostY - inputGhost.y;


          if (Math.abs(xDiff) > Math.abs(yDiff)) {
            // hit right or left
            if (ghostX > inputGhost.x) {
              // hit left side of square
              inputGhost.x -= 4;
              inputGhost.xVel = xVel * -1;
              inputGhost.yVel = yVel;
            } else {
              // hit right
              inputGhost.x += 4;
              inputGhost.xVel = xVel * -1;
              inputGhost.yVel = yVel;
            }
          } else {
            // hit top or bottom
            if (ghostY > inputGhost.y) {
              // hit top of square
              inputGhost.y -= 4;
              inputGhost.xVel = xVel;
              inputGhost.yVel = yVel * -1;
            } else {
              // hit bottom
              inputGhost.y += 4;
              inputGhost.xVel = xVel;
              inputGhost.yVel = yVel * -1;
            }
          }
        }
      }
    });

    for (let key in this.squares) {
      if (
        this.squares[key].blocked === true &&
        inputGhost.x < this.squares[key].x + this.squares[key].size &&
        inputGhost.x + inputGhost.size > this.squares[key].x &&
        inputGhost.y < this.squares[key].y + this.squares[key].size &&
        inputGhost.y + inputGhost.size > this.squares[key].y
      ) {
        if (this.path.has(key)) {
          for (let item of this.path) {
            this.squares[item].blocked = false;
            this.squares[item].graphics.beginFill(EMPTY_COLOR).drawRect(0, 0, 17, 17);
            this.percent -= .18;
          }


          this.lives -= 1;
          document.getElementById("percent").innerHTML = `Progress: ${Math.floor(this.percent)}/75%`

          if (this.lives < 0) {
            this.lives = 2;
            this.handleLevelLose();
          } else {
            this.pacman.x = 1;
            this.pacman.y = 1;
            document.getElementById("lives").innerHTML = `Lives: ${this.lives}`;
          }
          this.path.clear();
        }

        let xVel = inputGhost.xVel;
        let yVel = inputGhost.yVel;
        let squareX = this.squares[key].x;
        let squareY = this.squares[key].y;
        let xDiff = squareX - inputGhost.x;
        let yDiff = squareY - inputGhost.y;

        if (Math.abs(xDiff) > Math.abs(yDiff)) {
          // hit right or left
          if (squareX > inputGhost.x) {
            // hit left side of square
            inputGhost.x -= 4;
            inputGhost.xVel = xVel * -1;
            inputGhost.yVel = yVel;
          } else {
            // hit right
            inputGhost.x += 4;
            inputGhost.xVel = xVel * -1;
            inputGhost.yVel = yVel;
          }
        } else {
          // hit top or bottom
          if (squareY > inputGhost.y) {
            // hit top of square
            inputGhost.y -= 4;
            inputGhost.xVel = xVel;
            inputGhost.yVel = yVel * -1;
          } else {
            // hit bottom
            inputGhost.y += 4;
            inputGhost.xVel = xVel;
            inputGhost.yVel = yVel * -1;
          }
        }
      }
    }
  }

  floodFill(key, start = true) {
    // debugger;
    let block_arr = key.split("_");
    let top = this.top(block_arr);
    let bottom = this.bottom(block_arr);
    let left = this.left(block_arr);
    let right = this.right(block_arr);

    let floodTop;
    let floodBottom;
    let floodLeft;
    let floodRight;

    this.ghosts.forEach( function(ghost) {
      if ((this.squares[key].checked === false && (ghost.x < this.squares[key].x + this.squares[key].size &&
          ghost.x + ghost.size > this.squares[key].x &&
          ghost.y < this.squares[key].y + this.squares[key].size &&
          ghost.y + ghost.size > this.squares[key].y))
          ||
          (this.squares[top].checked === false && (this.squares[top] &&
              ghost.x < this.squares[top].x + this.squares[top].size &&
              ghost.x + ghost.size > this.squares[top].x &&
              ghost.y < this.squares[top].y + this.squares[top].size &&
              ghost.y + ghost.size > this.squares[top].y))
          ||
          (this.squares[bottom].checked === false && (this.squares[bottom] &&
              ghost.x < this.squares[bottom].x + this.squares[bottom].size &&
              ghost.x + ghost.size > this.squares[bottom].x &&
              ghost.y < this.squares[bottom].y + this.squares[bottom].size &&
              ghost.y + ghost.size > this.squares[bottom].y))
          ||
          (this.squares[left].checked === false && (this.squares[left] &&
              ghost.x < this.squares[left].x + this.squares[left].size &&
              ghost.x + ghost.size > this.squares[left].x &&
              ghost.y < this.squares[left].y + this.squares[left].size &&
              ghost.y + ghost.size > this.squares[left].y))
          ||
          (this.squares[right].checked === false && (this.squares[right] &&
              ghost.x < this.squares[right].x + this.squares[right].size &&
              ghost.x + ghost.size > this.squares[right].x &&
              ghost.y < this.squares[right].y + this.squares[right].size &&
              ghost.y + ghost.size > this.squares[right].y))
        ) {
        this.squares[key].checked = true;
        this.squares[top].checked = true;
        this.squares[bottom].checked = true;
        this.squares[left].checked = true;
        this.squares[right].checked = true;
        this.invalidSpots.add(key);
        this.invalidSpots.add(top);
        this.invalidSpots.add(bottom);
        this.invalidSpots.add(left);
        this.invalidSpots.add(right);
        return false;
      }
    }.bind(this));

    if (this.squares[top] && this.squares[top].blocked != true && this.squares[top].checked != true) {
      this.squares[top].checked = true;
      floodTop = this.floodFill(top, false);
    } else {
      floodTop = true;
    }
    if (this.squares[bottom] && this.squares[bottom].blocked != true && this.squares[bottom].checked != true) {
      this.squares[bottom].checked = true;
      floodBottom = this.floodFill(bottom, false);
    } else {
      floodBottom = true;
    }
    if (this.squares[left] && this.squares[left].blocked != true && this.squares[left].checked != true) {
      this.squares[left].checked = true;
      floodLeft = this.floodFill(left, false);
    } else {
      floodLeft = true;
    }
    if (this.squares[right] && this.squares[right].blocked === false && this.squares[right].checked === false) {
      this.squares[right].checked = true;
      floodRight = this.floodFill(right, false);
    } else {
      floodRight = true;
    }

    if (start != true &&
      ((typeof floodTop === "function" && floodTop != true && floodTop() === false) ||
      (typeof floodBottom === "function" && floodBottom() === false) ||
      (typeof floodLeft === "function" && floodLeft != true && floodLeft() === false) ||
      (typeof floodRight === "function" && floodRight != true && floodRight() === false))) {
      return false;
    }

    if (start != true) {
      if ((floodTop != false) &&
      (floodBottom != false) &&
      (floodLeft != false) &&
      (floodRight != false)) {
        if (floodTop != true) {
          this.floodZone.add(top);
        }
        if (floodBottom != true) {
          this.floodZone.add(bottom);
        }
        if (floodLeft != true) {
          this.floodZone.add(left);
        }
        if (floodRight != true) {
          this.floodZone.add(right);
        }
      } else {
        return false;
      }
    } else {
      if (floodTop != true && floodTop != false) {
        this.floodZone.add(top);
      }
      if (floodBottom != true && floodBottom != false) {
        this.floodZone.add(bottom);
      }
      if (floodLeft != true && floodLeft != false) {
        this.floodZone.add(left);
      }
      if (floodRight != true && floodRight != false) {
        this.floodZone.add(right);
      }
    }

    // if ((floodTop === false) || (floodBottom === false) || (floodLeft === false) || (floodRight === false)) {
    //   return false;
    // }
  }

  findInvalidSpots(spot) {
    let block_arr = spot.split("_");
    let top = this.top(block_arr);
    let bottom = this.bottom(block_arr);
    let left = this.left(block_arr);
    let right = this.right(block_arr);

    this.testInvalidSpot(top);
    this.testInvalidSpot(bottom);
    this.testInvalidSpot(left);
    this.testInvalidSpot(right);
  }

  testInvalidSpot(spot) {
    if (this.squares[spot] && this.squares[spot].blocked === false && !this.invalidSpots.has(spot)) {
      this.invalidSpots.add(spot);
      this.findInvalidSpots(spot);
    }
  }

  top(block_arr) {
    let top = [block_arr[0], block_arr[1] - '17'];
    return top.join("_");;
  }

  bottom(block_arr) {
    let bottom = [block_arr[0], Number(block_arr[1]) + 17];
    return bottom.join("_");
  }

  left(block_arr) {
    let left = [block_arr[0] - '17', block_arr[1]];
    return left.join("_");
  }

  right(block_arr) {
    let right = [Number(block_arr[0]) + 17, block_arr[1]];
    return right.join("_");
  }

  testPacmanCollision(pacman) {
    for (let key in this.squares) {
      let pt = this.squares[key].globalToLocal(pacman.x, pacman.y);

      if ( this.path.size > 0 && this.path.has(key) === false && this.squares[key].hitTest(pt.x, pt.y) && this.squares[key].blocked === true && this.blocked.has(key) ) {
        let path_block = this.path.values().next().value;

        this.path.forEach( function(square) {
          this.floodFill(square, true);
          this.blocked.add(square);
        }.bind(this));

        this.invalidSpots.forEach( function(spot)  {
          let block_arr = spot.split("_");
          let top = this.top(block_arr);
          let bottom = this.bottom(block_arr);
          let left = this.left(block_arr);
          let right = this.right(block_arr);

          if ((!this.invalidSpots.has(top) && !this.invalidSpots.has(bottom)) ||
              (!this.invalidSpots.has(left) && ! this.invalidSpots.has(right))) {
            this.invalidSpots.delete(spot);
          }

          if (this.path.has(spot)) {
            this.invalidSpots.delete(spot);
            this.blocked.add(square);
          }
        }.bind(this));

        this.invalidSpots.forEach( function(spot)  {
          this.findInvalidSpots(spot);
        }.bind(this));

        this.invalidSpots.forEach( function(spot) {
          this.floodZone.delete(spot);
        }.bind(this));
        this.floodZone.forEach( function(square) {
          this.squares[square].checked = false;
          this.gameView.handleFilling(square);
          this.squares[square].blocked = true;
          this.blocked.add(square);
          this.percent += .18;
        }.bind(this));
        this.floodZone = new Set;
        this.invalidSpots = new Set;

        for (let key in this.squares) {
          this.squares[key].checked = false;
        }

        this.path = new Set;
      } else if ( this.squares[key].blocked === false && this.squares[key].hitTest(pt.x, pt.y) ) {
        this.path.add(key);
        this.gameView.handleFilling(key);
        this.percent += .18;
      }
      document.getElementById("percent").innerHTML = `Progress: ${Math.floor(this.percent)}/75%`;
      this.handleLevelWin();
    }
  }

  handleLevelWin() {
    if (Math.floor(this.percent) >= 75 ) {
      this.percent = 0;
      this.lives += 1;
      this.level += 1;
      document.getElementById("congrats").innerHTML = "Congrats! You won the level!";
      createjs.Ticker.removeAllEventListeners();

      this.handleSetup(true);
    }
  }

  handleLevelLose() {
    document.getElementById("congrats").innerHTML = "You lost the level. Try again!";
    createjs.Ticker.removeAllEventListeners();

    this.handleSetup(true);
  }

  handleSetup(valid) {
    $(document).keydown(function(e) {
      if (valid) {
        setTimeout(function() {
          this.setup();
          document.getElementById("congrats").innerHTML = "";
        }.bind(this), 400);
      }
      valid = false;
    }.bind(this));
  }

  setup() {
    createjs.Ticker.addEventListener("tick", this.tick);
    createjs.Ticker.setFPS(30);
    this.gameView.reset();

    this.squares = this.gameView.squares;
    this.blocked = this.gameView.blocked;
    this.path = new Set;
    this.ghosts = [];
    document.getElementById("lives").innerHTML = `Lives: ${this.lives}`;
    this.percent = 0;
    document.getElementById("percent").innerHTML = `Progress: 0/75%`;

    this.pacmanImage = new Pacman("./lib/assets/Pacman.png", this.stage, this);
    this.red_ghost = new Ghost("./lib/assets/red_ghost.png", this.stage, this.ghosts);
    this.orange_ghost = new Ghost("./lib/assets/orange_ghost.png", this.stage, this.ghosts);
    this.pinky_ghost = new Ghost("./lib/assets/pinky_ghost.png", this.stage, this.ghosts);

    this.gameView.generateGrid();
  }
}

module.exports = Game;
