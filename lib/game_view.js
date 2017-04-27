const BLOCK_COLOR = "#0800a3";
const EMPTY_COLOR = "#282828";

class GameView {
  constructor(stage) {
    this.stage = stage;
    this.squares = {};
    this.ghosts = [];
    this.lives = 2;
    this.percent = 0;
    this.lastMove = null;
    this.level = 1;
    this.path = new Set();
    this.blocked = new Set();
    this.arrowUp = false;
    this.arrowDown = false;
    this.arrowLeft = false;
    this.ArrowRight = false;
    this.move = false;

    let body = document.getElementById("body");

    // this.squareClick = this.squareClick.bind(this);
    this.setup = this.setup.bind(this);
    this.handleImageLoadPacman = this.handleImageLoadPacman.bind(this);
    this.handleImageLoadGhost = this.handleImageLoadGhost.bind(this);
    this.tick = this.tick.bind(this);
    this.testCollision = this.testCollision.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleKeyup = this.handleKeyup.bind(this);
    this.testPacmanCollision = this.testPacmanCollision.bind(this);
    this.floodFill = this.floodFill.bind(this);

    this.setup();
    createjs.Ticker.addEventListener("tick", this.tick);
    createjs.Ticker.setFPS(30);
  }

  tick(event) {
    if (this.ghosts[0]) {
      this.ghosts.forEach( ghost => {
        ghost.x += ghost.xVel;
        ghost.y += ghost.yVel;
        this.testCollision(ghost);
      })
    }
    // if (this.move) {
    //   this.move = false;
    // } else {
    //   this.move = true;
    // }
    this.move ? this.move = false : this.move = true;
    if (this.arrowUp && this.move && this.pacman.y >= 17) {
      this.pacman.y -= 17;
    } else if (this.arrowDown && this.move && this.pacman.y <= 374) {
      this.pacman.y += 17;
    } else if (this.arrowLeft && this.move && this.pacman.x >= 17) {
      this.pacman.x -= 17;
    } else if (this.arrowRight && this.move && this.pacman.x <= 561) {
      this.pacman.x += 17;
    }
    this.testPacmanCollision(this.pacman);
    this.stage.update();
  }

  testCollision(ghost) {
    if (
      ghost.x < this.pacman.x + this.pacman.size &&
      ghost.x + ghost.size > this.pacman.x &&
      ghost.y < this.pacman.y + this.pacman.size &&
      ghost.y + ghost.size > this.pacman.y
    ) {
      this.lives -= 1;
      document.getElementById("lives").innerHTML = `Lives: ${this.lives}`;
      if (this.lives < 0) {
        document.getElementById("lives").innerHTML = "You lost the level. Try again!";
        this.level += 1;
        this.setup();
      }
      this.pacman.x = 1;
      this.pacman.y = 1;
      // if (this.path.has(key)) {
      for (let item of this.path) {
        this.squares[item].blocked = false;
        this.squares[item].graphics.beginFill(EMPTY_COLOR).drawRect(0, 0, 17, 17);
        this.percent -= .18;
        document.getElementById("percent").innerHTML = `Progress: ${Math.floor(this.percent)}/75%`
      }
      this.path.clear();
      // }
    }
    this.ghosts.forEach( ghosty => {
      if (ghosty !== ghost) {
        if (
          ghost.x < ghosty.x + ghosty.size &&
          ghost.x + ghost.size > ghosty.x &&
          ghost.y < ghosty.y + ghosty.size &&
          ghost.y + ghost.size > ghosty.y
        ) {
          let xVel = ghost.xVel;
          let yVel = ghost.yVel;
          let ghostyX = ghosty.x;
          let ghostyY = ghosty.y;
          let xDiff = ghostyX - ghost.x;
          let yDiff = ghostyY - ghost.y;


          if (Math.abs(xDiff) > Math.abs(yDiff)) {
            // hit right or left
            if (ghostyX > ghost.x) {
              // hit left side of square
              ghost.x -= 4;
              ghost.xVel = xVel * -1;
              ghost.yVel = yVel;
            } else {
              // hit right
              ghost.x += 4;
              ghost.xVel = xVel * -1;
              ghost.yVel = yVel;
            }
          } else {
            // hit top or bottom
            if (ghostyY > ghost.y) {
              // hit top of square
              ghost.y -= 4;
              ghost.xVel = xVel;
              ghost.yVel = yVel * -1;
            } else {
              // hit bottom
              ghost.y += 4;
              ghost.xVel = xVel;
              ghost.yVel = yVel * -1;
            }
          }
        }
      }
    })

    for (let key in this.squares) {
      if (
        this.squares[key].blocked === true &&
        ghost.x < this.squares[key].x + this.squares[key].size &&
        ghost.x + ghost.size > this.squares[key].x &&
        ghost.y < this.squares[key].y + this.squares[key].size &&
        ghost.y + ghost.size > this.squares[key].y
      ) {
        if (this.path.has(key)) {
          // debugger
          for (let item of this.path) {
            this.squares[item].blocked = false;
            this.squares[item].graphics.beginFill(EMPTY_COLOR).drawRect(0, 0, 17, 17);
            this.percent -= .18;
          }
          this.pacman.x = 1;
          this.pacman.y = 1;
          this.lives -= 1;
          document.getElementById("percent").innerHTML = `Progress: ${Math.floor(this.percent)}/75%`
          document.getElementById("lives").innerHTML = `Lives: ${this.lives}`;
          if (this.lives < 0) {
            // debugger
            document.getElementById("lives").innerHTML = "You lost the level. Try again!";
            this.level += 1;
            this.lives = 2;
            this.percent = 0;
            this.setup();
          }
          this.path.clear();
        }
        let xVel = ghost.xVel;
        let yVel = ghost.yVel;
        let squareX = this.squares[key].x;
        let squareY = this.squares[key].y;
        let xDiff = squareX - ghost.x;
        let yDiff = squareY - ghost.y;
        // debugger

        if (Math.abs(xDiff) > Math.abs(yDiff)) {
          // hit right or left
          if (squareX > ghost.x) {
            // hit left side of square
            ghost.x -= 4;
            ghost.xVel = xVel * -1;
            ghost.yVel = yVel;
          } else {
            // hit right
            ghost.x += 4;
            ghost.xVel = xVel * -1;
            ghost.yVel = yVel;
          }
        } else {
          // hit top or bottom
          if (squareY > ghost.y) {
            // hit top of square
            ghost.y -= 4;
            ghost.xVel = xVel;
            ghost.yVel = yVel * -1;
          } else {
            // hit bottom
            ghost.y += 4;
            ghost.xVel = xVel;
            ghost.yVel = yVel * -1;
          }
        }
      }
    }
  }

  floodFill(key) {
    // debugger;
    if (this.squares[key].blocked === true || this.squares[key].checked === true) {
      return;
    }
    // debugger;
    this.ghosts.forEach( function(ghost) {
      // debugger;
      if (ghost.x < this.squares[key].x + this.squares[key].size &&
        ghost.x + ghost.size > this.squares[key].x &&
        ghost.y < this.squares[key].y + this.squares[key].size &&
        ghost.y + ghost.size > this.squares[key].y) {
      }
    }.bind(this))
  }

  testPacmanCollision(pacman) {
    // debugger
    for (let key in this.squares) {
      let pt = this.squares[key].globalToLocal(pacman.x, pacman.y);
      // debugger
      // if (this.path.size > 0) {
      //   debugger
      //   if ( this.path.has(key) === false) {
      //     debugger
      //   }
      //   if ( this.squares[key].blocked === true ) {
      //     debugger
      //   }
      //   if ( this.blocked.has(key)) {
      //     debugger
      //   }

      // }
      if ( this.path.size > 0 && this.path.has(key) === false && this.squares[key].hitTest(pt.x, pt.y) && this.squares[key].blocked === true && this.blocked.has(key) ) {
        // debugger
        this.floodFill(key);
        this.path.forEach( function(block) {
          let block_arr = block.split("_");
          let top = [block_arr[0], block_arr[1] - '17'];
          let bottom = [block_arr[0], Number(block_arr[1]) + 17];
          let left = [block_arr[0] - '17', block_arr[1]];
          let right = [Number(block_arr[0]) + 17, block_arr[1]];
          top = top.join("_");
          bottom = bottom.join("_");
          left = left.join("_");
          right = right.join("_");
          // debugger
        }.bind(this));
        this.path.forEach(this.blocked.add, this.blocked);
        this.path = new Set();
        // debugger
      } else if ( this.squares[key].blocked === false && this.squares[key].hitTest(pt.x, pt.y) ) {
        // debugger
        this.path.add(key);
        this.squares[key].blocked = true;
        this.squares[key].graphics.beginFill(BLOCK_COLOR).drawRect(0, 0, 17, 17);
        this.percent += .18;
        document.getElementById("percent").innerHTML = `Progress: ${Math.floor(this.percent)}/75%`
        if (Math.floor(this.percent) >= 75 ) {
          document.getElementById("lives").innerHTML = "You won the level!"
          this.setup();
          this.percent = 0;
          document.getElementById("percent").innerHTML = `Progress: ${Math.floor(this.percent)}/75%`
        }
      }
    }
  }

  setup() {
    this.squares = {};
    this.ghosts = [];
    this.lives = 2;
    this.percent = 0;
    this.lastMove = null;

    this.pacmanImage = new Image();
    this.pacmanImage.src = "./lib/assets/Pacman.png";
    this.pacmanImage.onload = this.handleImageLoadPacman;

    this.red_ghost = new Image();
    this.red_ghost.src = "./lib/assets/red_ghost.png";
    this.red_ghost.onload = this.handleImageLoadGhost;

    this.orange_ghost = new Image();
    this.orange_ghost.src = "./lib/assets/orange_ghost.png";
    this.orange_ghost.onload = this.handleImageLoadGhost;

    this.pinky_ghost = new Image();
    this.pinky_ghost.src = "./lib/assets/pinky_ghost.png";
    this.pinky_ghost.onload = this.handleImageLoadGhost;

    this.generateGrid();
  }

  handleSpace(event) {
    if (event.keyCode === 32) {
      console.log("space bar pressed");
    }
  }

  handleKeydown(event) {
    if (event.key === "ArrowUp" && this.pacman.y >= 17) {
      // debugger
      // this.pacman.rotation = -90;
      // if (this.lastMove !== "up") {
      //   this.pacman.y += 15;
      // }
      // this.lastMove = "up";
      this.arrowUp = true;
      this.arrowDown = false;
      this.arrowLeft = false;
      this.arrowRight = false;
    } else if (event.key === "ArrowDown" && this.pacman.y <= 374) {
      // debugger
      // this.pacman.rotation = 90;
      // if (this.lastMove !== "down") {
      //   this.pacman.x += 15;
      // }
      // this.lastMove = "down";
      // console.log(this.pacman.y);
      this.arrowUp = false;
      this.arrowDown = true;
      this.arrowLeft = false;
      this.arrowRight = false;
    } else if (event.key === "ArrowRight" && this.pacman.x <= 561) {
      // debugger
      // this.pacman.rotation = 0;
      // if (this.lastMove !== "right" && this.lastMove !== null) {
      //   this.pacman.x -= 13;
      // }
      // this.lastMove = "right";
      this.arrowUp = false;
      this.arrowDown = false;
      this.arrowLeft = false;
      this.arrowRight = true;
    } else if (event.key === "ArrowLeft" && this.pacman.x >= 17) {
      // debugger
      // this.pacman.rotation = 180;
      // if (this.lastMove !== "left") {
      //   this.pacman.x += 15;
      // }
      // this.lastMove = "left";
      this.arrowUp = false;
      this.arrowDown = false;
      this.arrowLeft = true;
      this.arrowRight = false;
    }
  }

  handleKeyup() {
    this.arrowUp = false;
    this.arrowDown = false;
    this.arrowLeft = false;
    this.arrowRight = false;
  }

  handleImageLoadPacman(event) {
    let image = event.target;
    let bitmap = new createjs.Bitmap(image);
    bitmap.scaleX = 0.0071;
    bitmap.scaleY = 0.0071;
    bitmap.x = 1;
    bitmap.y = 1;
    bitmap.size = 17;
    this.stage.addChild(bitmap);
    this.stage.update();
    this.pacman = bitmap;
    if (this.level == 1) {
      $(document).keydown(function(e) {
        // debugger
        // if (e.key === "ArrowDown") {
        //   e.preventDefault();
        // }
        this.handleKeydown(e);
      }.bind(this));
      // $(document).keyup(this.handleSpace.bind(this));
      $(document).keyup(function(e) {
        // debugger
        this.handleKeyup();
      }.bind(this));
    }
  }

  handleImageLoadGhost(event) {
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
    })

    this.stage.addChild(bitmap);
    this.stage.update();
  }

  generateGrid() {
    let gridSquare;

    for (let x = 0; x < 34; x ++) {
      for (let y = 0; y < 23; y++) {
        gridSquare = new createjs.Shape();
        gridSquare.graphics.beginStroke("#000");
        gridSquare.graphics.setStrokeStyle(1);
        gridSquare.snapToPixel = true;
        gridSquare.x = x * 17;
        gridSquare.y = y * 17;
        gridSquare.size = 17;
        if (gridSquare.x === 0 || gridSquare.x === 561 || gridSquare.y === 0 || gridSquare.y === 374) {
          gridSquare.graphics.beginFill(BLOCK_COLOR).drawRect(0, 0, 17, 17);
          gridSquare.blocked = true;
          gridSquare.border = true;
          let id = gridSquare.x + "_" + gridSquare.y
          this.blocked.add(id);
        } else {
          gridSquare.graphics.beginFill(EMPTY_COLOR).drawRect(0, 0, 17, 17);
          gridSquare.blocked = false;
          gridSquare.border = false;
        }
        // gridSquare.addEventListener("click", this.squareClick);
        this.stage.addChild(gridSquare);

        let id = gridSquare.x + "_" + gridSquare.y
        this.squares[id] = gridSquare;
        // debugger
        // debugger
      }
    }
    this.stage.update();
  }
};

export default GameView;














// squareClick(e) {
//   console.log("clicked");
//   let current = this.squares[e.target.x + "_" + e.target.y];
//
//   if (current.blocked === true) {
//     if (current.border === false) {
//       current.graphics.beginFill("#1D9C73").drawRect(0, 0, 17, 17);
//       current.blocked = false;
//     }
//   } else {
//     current.graphics.beginFill("blue").drawRect(0, 0, 17, 17);
//     current.blocked = true;
//   }
//   this.stage.update();
// }

// let intersection = this.collisionMethod(ghost, this.squares[key], 1);
// // debugger;
// if (this.squares[key].blocked === true && intersection) {
//   // debugger;
//   let xVel = ghost.xVel;
//   let yVel = ghost.yVel;
//   ghost.xVel = yVel;
//   ghost.yVel = xVel * -1;
// }
// let pt = this.squares[key].globalToLocal(ghost.x, ghost.y);
// let pt2 = this.squares[key].globalToLocal(ghost.x + 17, ghost.y + 17);
// let pt3 = this.squares[key].globalToLocal(ghost.x + 17, ghost.y);
// let pt4 = this.squares[key].globalToLocal(ghost.x, ghost.y + 17);
// let pt5 = this.squares[key].globalToLocal(ghost.x + 9, ghost.y);
// let pt6 = this.squares[key].globalToLocal(ghost.x + 17, ghost.y + 9);
// let pt7 = this.squares[key].globalToLocal(ghost.x + 9, ghost.y + 17);
// let pt8 = this.squares[key].globalToLocal(ghost.x, ghost.y + 9);
// debugger;
// if ( this.squares[key].blocked === true && (this.squares[key].hitTest(pt.x, pt.y) || this.squares[key].hitTest(pt2.x, pt2.y)  ) ) {
//   if (this.squares[key].hitTest(pt4.x, pt4.y)) {
//     console.log("pt4");
//     let xVel = ghost.xVel;
//     let yVel = ghost.yVel;
//     ghost.xVel = yVel * -1;
//     ghost.yVel = xVel * -1;
//   } else {
//     let xVel = ghost.xVel;
//     let yVel = ghost.yVel;
//     ghost.xVel = yVel;
//     ghost.yVel = xVel * -1;
//   }
// }
