const Ghost = require("./ghost.js");
const Pacman = require("./pacman.js");
const Level = require("./level.js");

const BLOCK_COLOR = "#0800a3";
const EMPTY_COLOR = "#282828";

class Game {
  constructor(stage, gameView) {
    this.stage = stage;
    this.gameView = gameView;
    this.blocked = this.gameView.blocked;
    this.squares = this.gameView.squares;
    this.lives = 2;
    this.level = 1;
    this.score = 0;
    this.lastGreatestScore = 0;
    this.currentArrow = null;
    this.move = false;
    this.floodZone = new Set;
    this.invalidSpots = new Set;

    this.tick = this.tick.bind(this);

    this.setup();
    this.addPauseListener();
  }

  setup() {
    createjs.Ticker.addEventListener("tick", this.tick);
    createjs.Ticker.setFPS(30);
    this.gameView.reset();

    this.path = new Set;
    this.ghosts = [];
    this.percent = 0;
    this.handlingWin = false;
    this.paused = true;
    this.updateLives();
    document.getElementById("percent").innerHTML = `Progress: ${Math.floor(this.percent)}/75%`;
    document.getElementById("pause-toggle").innerHTML = (this.paused ? '<i class="fa fa-play" aria-hidden="true"></i>' : '<i class="fa fa-pause" aria-hidden="true"></i>' );

    this.pacmanImage = new Pacman("./lib/assets/pacman0.png", this.stage, this);
    new Level(this.level, this)[`setupLevel${this.level}`]();

    this.gameView.generateGrid();
  }

  addPauseListener() {
    document.getElementById("pause-toggle").addEventListener("click", function() {
      this.togglePause();
    }.bind(this));
    $(document).keydown(function(e) {
      if (e.keyCode === 32) {
        this.togglePause();
      }
    }.bind(this));
    $(document).keydown(function(e) {
      if ((e.keyCode >= 37 && e.keyCode <= 40) && this.paused) {
        this.togglePause();
      }
    }.bind(this));
  }

  togglePause() {
    this.paused = this.paused == false ? true : false;
    document.getElementById("pause-toggle").innerHTML = (this.paused ? '<i class="fa fa-play" aria-hidden="true"></i>' : '<i class="fa fa-pause" aria-hidden="true"></i>' );
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

  tick(event) {
    if (!this.paused) {
      if (this.ghosts.length > 0) {
        this.ghosts.forEach( ghost => {
          ghost.x += ghost.xVel;
          ghost.y += ghost.yVel;
          this.testGhostPacmanCollision(ghost);
          this.testCollisionBetweenGhosts(ghost);
        });
      }

      this.move = !this.move;
      if (this.move) {
        if (this.currentArrow === "up" && this.pacman.y >= 17) {
          this.pacman.y -= 17;
        } else if (this.currentArrow === "down" && this.pacman.y <= 374) {
          this.pacman.y += 17;
        } else if (this.currentArrow === "left" && this.pacman.x >= 17) {
          this.pacman.x -= 17;
        } else if (this.currentArrow === "right" && this.pacman.x <= 561) {
          this.pacman.x += 17;
        }
      }

      if (this.pacman) {
        this.testPacmanCollision(this.pacman);
      }
      this.stage.update();
    }
  }

  testHitTwoObj(obj1, obj2, cont = true) {
    if (obj1.kill != undefined && obj2.kill != undefined && cont) {
      this.testHitTwoObj(obj2, obj1, false);
    }

    let xVel = obj1.xVel;
    let yVel = obj1.yVel;
    let ghostX = obj2.x;
    let ghostY = obj2.y;

    if (Math.abs(ghostX - obj1.x) > Math.abs(ghostY - obj1.y)) {
      // hit right or left
      if (ghostX > obj1.x) {
        // hit left side of square
        obj1.x -= 4;
        obj1.xVel = xVel * -1;
        obj1.yVel = yVel;
      } else {
        // hit right
        obj1.x += 4;
        obj1.xVel = xVel * -1;
        obj1.yVel = yVel;
      }
    } else {
      // hit top or bottom
      if (ghostY > obj1.y) {
        // hit top of square
        obj1.y -= 4;
        obj1.xVel = xVel;
        obj1.yVel = yVel * -1;
      } else {
        // hit bottom
        obj1.y += 4;
        obj1.xVel = xVel;
        obj1.yVel = yVel * -1;
      }
    }
    if (!obj2.edge && obj1.kill && obj2.kill == undefined) {
      obj2.blocked = false;
      this.percent -= .15;

      let id = obj2.x + "_" + obj2.y;
      this.blocked.delete(id);
      this.squares[id].graphics.beginFill(EMPTY_COLOR).drawRect(0, 0, 17, 17);
    }
  }

  testCollisionBetweenGhosts(inputGhost) {
    for (let i = 0; i < this.ghosts.length; i++) {
      let ghost = this.ghosts[i];
      if (ghost === inputGhost) break;

      if (
        inputGhost.x < ghost.x + ghost.size &&
        inputGhost.x + inputGhost.size > ghost.x &&
        inputGhost.y < ghost.y + ghost.size &&
        inputGhost.y + inputGhost.size > ghost.y
      ) {
        this.testHitTwoObj(inputGhost, ghost);
      }
    }
  }

  testGhostPacmanCollision(inputGhost) {
    for (let key in this.squares) {
      if (this.blocked.has(key) &&
        inputGhost.x < this.squares[key].x + this.squares[key].size &&
        inputGhost.x + inputGhost.size > this.squares[key].x &&
        inputGhost.y < this.squares[key].y + this.squares[key].size &&
        inputGhost.y + inputGhost.size > this.squares[key].y
      ) {
        if (this.path.has(key)) {
          this.lives -= 1;
          this.score -= (this.level * 25);
          if (this.score < 0) this.score = 0;

          if (!this.handlingWin) {
            document.getElementById("percent").innerHTML = `Progress: ${Math.floor(this.percent)}/75%`
          }

          if (this.lives < 0) {
            this.lives = 2;
            this.handleLevelLose();
            break;
          } else {
            this.pacman.x = 7;
            this.pacman.y = 7.5;
            this.pacman.rotation = 0;
            this.updateLives();
          }

          for (let item of this.path) {
            this.blocked.delete(item);
            this.squares[item].graphics.beginFill(EMPTY_COLOR).drawRect(0, 0, 17, 17);
            this.percent -= .15;
          }

          this.path.clear();

        }
        this.testHitTwoObj(inputGhost, this.squares[key]);
      }
    }
  }

  testGhostBlockCollision(block, ghost) {
    return (this.squares[block].checked === false &&
     (ghost.x < this.squares[block].x + this.squares[block].size &&
      ghost.x + ghost.size > this.squares[block].x &&
      ghost.y < this.squares[block].y + this.squares[block].size &&
      ghost.y + ghost.size > this.squares[block].y));
  }

  testCheckedBlocked(block) {
    if (this.squares[block] && !this.blocked.has(block) && !this.squares[block].checked) {
      this.squares[block].checked = true;
      return this.floodFill(block, false);
    }
    return true;
  }

  floodFill(key, start = true) {
    let block_arr = key.split("_");
    let top = this.top(block_arr);
    let bottom = this.bottom(block_arr);
    let left = this.left(block_arr);
    let right = this.right(block_arr);

    this.ghosts.forEach( function(ghost) {

      if (this.testGhostBlockCollision(key, ghost) ||
          this.testGhostBlockCollision(top, ghost) ||
          this.testGhostBlockCollision(bottom, ghost) ||
          this.testGhostBlockCollision(left, ghost) ||
          this.testGhostBlockCollision(right, ghost)
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

    let floodTop = this.testCheckedBlocked(top);
    let floodBottom = this.testCheckedBlocked(bottom);
    let floodLeft = this.testCheckedBlocked(left);
    let floodRight = this.testCheckedBlocked(right);

    if (start != true) {
      if (floodTop != false && floodBottom != false &&
          floodLeft != false && floodRight != false) {
        if (floodTop != true) this.floodZone.add(top);
        if (floodBottom != true) this.floodZone.add(bottom);
        if (floodLeft != true) this.floodZone.add(left);
        if (floodRight != true) this.floodZone.add(right);
      } else {
        return false;
      }
    } else {
      if (typeof floodTop !== 'boolean') this.floodZone.add(top);
      if (typeof floodBottom !== 'boolean') this.floodZone.add(bottom);
      if (typeof floodLeft !== 'boolean') this.floodZone.add(left);
      if (typeof floodRight !== 'boolean') this.floodZone.add(right);
    }
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
    if (this.squares[spot] && !this.blocked.has(spot) && !this.invalidSpots.has(spot)) {
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

      if ( this.path.size > 0 && this.path.has(key) === false && this.squares[key].hitTest(pt.x, pt.y) && this.blocked.has(key) ) {
        let path_block = this.path.values().next().value;

        this.path.forEach( function(square) {
          this.floodFill(square, true);
        }.bind(this));
        // debugger;
        // this.handleLevelWin();

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
          this.gameView.handleFilling(square, false);
          this.percent += .15;
          this.score += Math.min(.5 * this.level, 2.5);
          this.checkBonusLife();
        }.bind(this));
        this.floodZone = new Set;
        this.invalidSpots = new Set;

        for (let key in this.squares) {
          this.squares[key].checked = false;
        }

        this.path.forEach(function(square) {
          this.gameView.handleFilling(square, false);
        }.bind(this));

        this.path = new Set;
        this.handleLevelWin();
      } else if (!this.blocked.has(key) && this.squares[key].hitTest(pt.x, pt.y) ) {
        this.gameView.handleFilling(key, true);
        this.path.add(key);
        this.percent += .15;
      }
      document.getElementById("score").innerHTML = `Score: ${Math.floor(this.score)}`;
      if (!this.handlingWin) {
      // debugger;
        document.getElementById("percent").innerHTML = `Progress: ${Math.floor(this.percent)}/75%`;
      }
    }
  }

  handleLevelWin() {
    if (Math.floor(this.percent) >= 20 ) {
      // debugger;
      this.score += Math.min(75 * this.level, 250);
      this.checkBonusLife();
      this.handlingWin = true;
      this.lives += 1;
      this.level += 1;
      document.getElementById("percent").innerHTML = `Progress: ${Math.floor(this.percent)}/75%`;
      this.percent = 0;
      document.getElementById("congrats").innerHTML = "Congrats! You won the level!";
      document.getElementById("level").innerHTML = `Level: ${this.level}`;
      createjs.Ticker.removeAllEventListeners();

      this.handleSetup(true);
    }
  }

  handleLevelLose() {
    document.getElementById("congrats").innerHTML = "You lost the level. Try again!";
    createjs.Ticker.removeAllEventListeners();

    this.handleSetup(true);
  }

  checkBonusLife() {
    if (this.lastGreatestScore < Math.floor(this.score / 1000)) {
      this.lastGreatestScore += 1;
      document.getElementById("bonus-life").innerHTML = "Extra life!";
      this.lives += 1;
      this.updateLives();

      setTimeout(function() {
        document.getElementById("bonus-life").innerHTML = "";
      }.bind(this), 1300);
    }
  }

  updateLives() {
    document.getElementById("lives").innerHTML = `Lives: ${this.lives}`;
  }
}

module.exports = Game;
