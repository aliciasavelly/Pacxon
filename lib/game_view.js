class GameView {
  constructor(stage) {
    this.stage = stage;
    this.squares = {};
    this.ghosts = [];
    this.lives = 2;
    this.percent = 0;
    this.lastMove = null;

    let body = document.getElementById("body");

    // this.squareClick = this.squareClick.bind(this);
    this.setup = this.setup.bind(this);
    this.handleImageLoadPacman = this.handleImageLoadPacman.bind(this);
    this.handleImageLoadGhost = this.handleImageLoadGhost.bind(this);
    this.tick = this.tick.bind(this);
    this.testCollision = this.testCollision.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.testPacmanCollision = this.testPacmanCollision.bind(this);

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
        this.setup();
      }
      this.pacman.x = 1;
      this.pacman.y = 1;
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

          ghost.xVel = yVel;
          ghost.yVel = xVel * -1;

          // if (Math.abs(xDiff) > Math.abs(yDiff)) {
          //   // hit right or left
          //   if (ghostyX > ghost.x) {
          //     // hit left side of square
          //     ghost.x -= 4;
          //     ghost.xVel = xVel * -1;
          //     ghost.yVel = yVel;
          //   } else {
          //     // hit right
          //     ghost.x += 4;
          //     ghost.xVel = xVel * -1;
          //     ghost.yVel = yVel;
          //   }
          // } else {
          //   // hit top or bottom
          //   if (ghostyY > ghost.y) {
          //     // hit top of square
          //     ghost.y -= 4;
          //     ghost.xVel = xVel;
          //     ghost.yVel = yVel * -1;
          //   } else {
          //     // hit bottom
          //     ghost.y += 4;
          //     ghost.xVel = xVel;
          //     ghost.yVel = yVel * -1;
          //   }
          // }

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
        let xVel = ghost.xVel;
        let yVel = ghost.yVel;
        let squareX = this.squares[key].x;
        let squareY = this.squares[key].y;
        let xDiff = squareX - ghost.x;
        let yDiff = squareY - ghost.y;

        ghost.xVel = yVel;
        ghost.yVel = xVel * -1;

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

  testPacmanCollision(pacman) {
    for (let key in this.squares) {
      let pt = this.squares[key].globalToLocal(pacman.x, pacman.y);
      if ( this.squares[key].blocked === false && this.squares[key].hitTest(pt.x, pt.y) ) {
        this.squares[key].blocked = true;
        this.squares[key].graphics.beginFill("blue").drawRect(0, 0, 17, 17);
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
      // this.pacman.rotation = -90;
      // if (this.lastMove !== "up") {
      //   this.pacman.y += 15;
      // }
      this.pacman.y -= 17;
      this.lastMove = "up";
    } else if (event.key === "ArrowDown" && this.pacman.y <= 374) {
      // this.pacman.rotation = 90;
      // if (this.lastMove !== "down") {
      //   this.pacman.x += 15;
      // }
      this.pacman.y += 17;
      this.lastMove = "down";
    } else if (event.key === "ArrowRight" && this.pacman.x <= 561) {
      // this.pacman.rotation = 0;
      // if (this.lastMove !== "right" && this.lastMove !== null) {
      //   this.pacman.x -= 13;
      // }
      this.pacman.x += 17;
      this.lastMove = "right";
    } else if (event.key === "ArrowLeft" && this.pacman.x >= 17) {
      // this.pacman.rotation = 180;
      // if (this.lastMove !== "left") {
      //   this.pacman.x += 15;
      // }
      this.pacman.x -= 17;
      this.lastMove = "left";
    }
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
    $(document).keydown(function(e) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
      }
      this.handleKeydown(e);
    }.bind(this));
    $(document).keyup(this.handleSpace.bind(this));
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
          gridSquare.graphics.beginFill("blue").drawRect(0, 0, 17, 17);
          gridSquare.blocked = true;
          gridSquare.border = true;
        } else {
          gridSquare.graphics.beginFill("#1D9C73").drawRect(0, 0, 17, 17);
          gridSquare.blocked = false;
          gridSquare.border = false;
        }
        // gridSquare.addEventListener("click", this.squareClick);
        this.stage.addChild(gridSquare);

        let id = gridSquare.x + "_" + gridSquare.y
        this.squares[id] = gridSquare;
      }
    }
    this.stage.update();
  }

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
};

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

export default GameView;
