const BLOCK_COLOR = "#0800a3";
const EMPTY_COLOR = "#282828";

class GameView {
  constructor(stage) {
    this.stage = stage;
    this.squares = {};
    this.ghosts = [];
    this.lives = 2;
    this.percent = 0;
    this.count = 0;
    // this.lastMove = null;
    this.level = 1;
    this.path = new Set();
    this.blocked = new Set();
    this.arrowUp = false;
    this.arrowDown = false;
    this.arrowLeft = false;
    this.arrowRight = false;
    this.move = false;
    this.topFloodZone = new Set();
    this.bottomFloodZone = new Set();
    this.leftFloodZone = new Set();
    this.rightFloodZone = new Set();
    this.invalidSpots = new Set;

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
    this.floodFill1 = this.floodFill1.bind(this);
    // this.floodFill2 = this.floodFill2.bind(this);
    this.findInvalidSpots = this.findInvalidSpots.bind(this);

    this.setup();
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

  testCollision(inputGhost) {
    if (
      inputGhost.x < this.pacman.x + this.pacman.size &&
      inputGhost.x + inputGhost.size > this.pacman.x &&
      inputGhost.y < this.pacman.y + this.pacman.size &&
      inputGhost.y + inputGhost.size > this.pacman.y
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
    })

    for (let key in this.squares) {
      if (
        this.squares[key].blocked === true &&
        inputGhost.x < this.squares[key].x + this.squares[key].size &&
        inputGhost.x + inputGhost.size > this.squares[key].x &&
        inputGhost.y < this.squares[key].y + this.squares[key].size &&
        inputGhost.y + inputGhost.size > this.squares[key].y
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
        let xVel = inputGhost.xVel;
        let yVel = inputGhost.yVel;
        let squareX = this.squares[key].x;
        let squareY = this.squares[key].y;
        let xDiff = squareX - inputGhost.x;
        let yDiff = squareY - inputGhost.y;
        // debugger

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

  // floodFill(key, zone = false) {
  //   // console.log(zone);
  //   // console.log(zone === "top");
  //   // if (zone != false &&
  //   //     (this.squares[key] === undefined ||
  //   //     this.squares[key].blocked === true ||
  //   //     this.squares[key].checked === true)) {
  //   //       // debugger;
  //   //   return;
  //   // }
  //
  //   // debugger;
  //   let block_arr = key.split("_");
  //   let top = [block_arr[0], block_arr[1] - '17'];
  //   let bottom = [block_arr[0], Number(block_arr[1]) + 17];
  //   let left = [block_arr[0] - '17', block_arr[1]];
  //   let right = [Number(block_arr[0]) + 17, block_arr[1]];
  //   // debugger;
  //   top = top.join("_");
  //   bottom = bottom.join("_");
  //   left = left.join("_");
  //   right = right.join("_");
  //   // debugger
  //   if (zone === false) {
  //     console.log(key);
  //     if (this.squares[top] && this.squares[top].blocked === false && this.squares[top].checked === false) {
  //       // debugger;
  //       this.topFloodZone.add(top);
  //       this.squares[top].checked = true;
  //       let floodTop = this.floodFill(top, "top");
  //     } else if (this.squares[bottom] && this.squares[bottom].blocked === false && this.squares[bottom].checked === false) {
  //       // debugger;
  //       this.bottomFloodZone.add(bottom);
  //       this.squares[bottom].checked = true;
  //       let floodBottom = this.floodFill(bottom, "bottom");
  //     } else if (this.squares[left] && this.squares[left].blocked === false && this.squares[left].checked === false) {
  //       // debugger;
  //       this.leftFloodZone.add(left);
  //       this.squares[left].checked = true;
  //       let floodLeft = this.floodFill(left, "left");
  //     } else if (this.squares[right] && this.squares[right].blocked === false && this.squares[right].checked === false) {
  //       // debugger;
  //       this.rightFloodZone.add(right);
  //       this.squares[right].checked = true;
  //       let floodRight = this.floodFill(right, "right");
  //     }
  //   } else if (zone === "top") {
  //     // debugger
  //     if (!this.topFloodZone.has(top) && this.squares[top] != undefined && this.squares[top].blocked != true && this.squares[top].checked != true) {
  //       this.topFloodZone.add(top);
  //       this.squares[top].checked = true;
  //       let floodTop = this.floodFill(top, "top");
  //     } else if (!this.topFloodZone.has(bottom) && this.squares[bottom] != undefined && this.squares[bottom].blocked != true && this.squares[bottom].checked != true) {
  //       this.topFloodZone.add(bottom);
  //       this.squares[bottom].checked = true;
  //       let floodBottom = this.floodFill(bottom, "top");
  //     } else if (!this.topFloodZone.has(left) && this.squares[left] != undefined && this.squares[left].blocked != true && this.squares[left].checked != true) {
  //       this.topFloodZone.add(left);
  //       this.squares[left].checked = true;
  //       let floodLeft = this.floodFill(left, "top");
  //     } else if (!this.topFloodZone.has(right) && this.squares[right] != undefined && this.squares[right].blocked != true && this.squares[right].checked != true) {
  //       this.topFloodZone.add(right);
  //       this.squares[right].checked = true;
  //       let floodRight = this.floodFill(right, "top");
  //     }
  //   } else if (zone === "bottom") {
  //     // debugger
  //     if (!this.bottomFloodZone.has(top) && this.squares[top] != undefined && this.squares[top].blocked != true && this.squares[top].checked != true) {
  //       this.bottomFloodZone.add(top);
  //       this.squares[top].checked = true;
  //       let floodTop = this.floodFill(top, "bottom");
  //     } else if (!this.bottomFloodZone.has(bottom) && this.squares[bottom] != undefined && this.squares[bottom].blocked != true && this.squares[bottom].checked != true) {
  //       this.bottomFloodZone.add(bottom);
  //       this.squares[bottom].checked = true;
  //       let floodBottom = this.floodFill(bottom, "bottom");
  //     } else if (!this.bottomFloodZone.has(left) && this.squares[left] != undefined && this.squares[left].blocked != true && this.squares[left].checked != true) {
  //       this.bottomFloodZone.add(left);
  //       this.squares[left].checked = true;
  //       let floodLeft = this.floodFill(left, "bottom");
  //     } else if (!this.bottomFloodZone.has(right) && this.squares[right] != undefined && this.squares[right].blocked != true && this.squares[right].checked != true) {
  //       this.bottomFloodZone.add(right);
  //       this.squares[right].checked = true;
  //       let floodRight = this.floodFill(right, "bottom");
  //     }
  //   } else if (zone === "left") {
  //     // debugger;
  //     if (!this.leftFloodZone.has(top) && this.squares[top] != undefined && this.squares[top].blocked != true && this.squares[top].checked != true) {
  //       this.leftFloodZone.add(top);
  //       this.squares[top].checked = true;
  //       let floodTop = this.floodFill(top, "left");
  //     } else if (!this.leftFloodZone.has(bottom) && this.squares[bottom] != undefined && this.squares[bottom].blocked != true && this.squares[bottom].checked != true) {
  //       this.leftFloodZone.add(bottom);
  //       this.squares[bottom].checked = true;
  //       let floodBottom = this.floodFill(bottom, "left");
  //     } else if (!this.leftFloodZone.has(left) && this.squares[left] != undefined && this.squares[left].blocked != true && this.squares[left].checked != true) {
  //       this.leftFloodZone.add(left);
  //       this.squares[left].checked = true;
  //       let floodLeft = this.floodFill(left, "left");
  //     } else if (!this.leftFloodZone.has(right) && this.squares[right] != undefined && this.squares[right].blocked != true && this.squares[right].checked != true) {
  //       this.leftFloodZone.add(right);
  //       this.squares[right].checked = true;
  //       let floodRight = this.floodFill(right, "left");
  //     }
  //   } else if (zone === "right") {
  //     // debugger
  //     if (!this.rightFloodZone.has(top) && this.squares[top] != undefined && this.squares[top].blocked != true) {
  //       this.rightFloodZone.add(top);
  //       this.squares[top].checked = true;
  //       let floodTop = this.floodFill(top, "right");
  //     } else if (!this.rightFloodZone.has(bottom) && this.squares[bottom] != undefined && this.squares[bottom].blocked != true) {
  //       this.rightFloodZone.add(bottom);
  //       this.squares[bottom].checked = true;
  //       let floodBottom = this.floodFill(bottom, "right");
  //     } else if (!this.rightFloodZone.has(left) && this.squares[left] != undefined && this.squares[left].blocked != true) {
  //       this.rightFloodZone.add(left);
  //       this.squares[left].checked = true;
  //       let floodLeft = this.floodFill(left, "right");
  //     } else if (!this.rightFloodZone.has(right) && this.squares[right] != undefined && this.squares[right].blocked != true) {
  //       this.rightFloodZone.add(right);
  //       this.squares[right].checked = true;
  //       let floodRight = this.floodFill(right, "right");
  //     }
  //   }
  //
  //   if (typeof floodTop != "undefined" && floodTop === false) {
  //     // debugger;
  //     this.topFloodZone = new Set();
  //     return false;
  //   } else if (typeof floodBottom != "undefined" && floodBottom === false) {
  //     this.bottomFloodZone = new Set();
  //     return false;
  //   } else if (typeof floodLeft != "undefined" && floodLeft === false) {
  //     this.leftFloodZone = new Set();
  //     return false;
  //   } else if (typeof floodRight != "undefined" && floodRight === false) {
  //     this.rightFloodZone = new Set();
  //     return false;
  //   }
  //
  //   // debugger
  //   this.ghosts.forEach( function(ghost) {
  //     // debugger;
  //     if ((ghost.x < this.squares[key].x + this.squares[key].size &&
  //         ghost.x + ghost.size > this.squares[key].x &&
  //         ghost.y < this.squares[key].y + this.squares[key].size &&
  //         ghost.y + ghost.size > this.squares[key].y)
  //         ||
  //         (this.squares[top] &&
  //             ghost.x < this.squares[top].x + this.squares[top].size &&
  //             ghost.x + ghost.size > this.squares[top].x &&
  //             ghost.y < this.squares[top].y + this.squares[top].size &&
  //             ghost.y + ghost.size > this.squares[top].y)
  //         ||
  //         (this.squares[bottom] &&
  //             ghost.x < this.squares[bottom].x + this.squares[bottom].size &&
  //             ghost.x + ghost.size > this.squares[bottom].x &&
  //             ghost.y < this.squares[bottom].y + this.squares[bottom].size &&
  //             ghost.y + ghost.size > this.squares[bottom].y)
  //         ||
  //         (this.squares[left] &&
  //             ghost.x < this.squares[left].x + this.squares[left].size &&
  //             ghost.x + ghost.size > this.squares[left].x &&
  //             ghost.y < this.squares[left].y + this.squares[left].size &&
  //             ghost.y + ghost.size > this.squares[left].y)
  //         ||
  //         (this.squares[right] &&
  //             ghost.x < this.squares[right].x + this.squares[right].size &&
  //             ghost.x + ghost.size > this.squares[right].x &&
  //             ghost.y < this.squares[right].y + this.squares[right].size &&
  //             ghost.y + ghost.size > this.squares[right].y)
  //       ) {
  //       // debugger;
  //       // let greatest_x = this.findGreatestX(this.topFloodZone);
  //       if (zone === "top") {
  //         // debugger
  //         console.log("ghost top");
  //         console.log(zone);
  //         this.topFloodZone.forEach( function(square) {
  //           this.squares[square].checked = false;
  //         }.bind(this));
  //         this.topFloodZone = new Set();
  //         return false;
  //       } else if (zone === "bottom") {
  //         // debugger
  //         console.log("ghost bottom");
  //         console.log(zone);
  //         this.bottomFloodZone.forEach( function(square) {
  //           this.squares[square].checked = false;
  //         }.bind(this));
  //         this.bottomFloodZone = new Set();
  //         return false;
  //       } else if (zone === "left") {
  //         // debugger
  //         console.log("ghost left");
  //         console.log(zone);
  //         this.leftFloodZone.forEach( function(square) {
  //           this.squares[square].checked = false;
  //         }.bind(this));
  //         this.leftFloodZone = new Set();
  //         return false;
  //       } else if (zone === "right") {
  //         // debugger
  //         console.log("ghost right");
  //         console.log(zone);
  //         this.rightFloodZone.forEach( function(square) {
  //           this.squares[square].checked = false;
  //         }.bind(this));
  //         this.rightFloodZone = new Set();
  //         return false;
  //       }
  //       // return false;
  //     }
  //   }.bind(this));
  // }

  floodFill1(key, start = true) {
    let block_arr = key.split("_");
    let top = [block_arr[0], block_arr[1] - '17'];
    let bottom = [block_arr[0], Number(block_arr[1]) + 17];
    let left = [block_arr[0] - '17', block_arr[1]];
    let right = [Number(block_arr[0]) + 17, block_arr[1]];
    // debuggerg;
    top = top.join("_");
    bottom = bottom.join("_");
    left = left.join("_");
    right = right.join("_");

    let floodTop;
    let floodBottom;
    let floodLeft;
    let floodRight;
    // debugger
    // console.log(key);
    this.ghosts.forEach( function(ghost) {
      // debugger;
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
        // debugger
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
      // debugger;
      this.squares[top].checked = true;
      floodTop = this.floodFill1(top, false);
      // if (floodTop != false) {
      //   this.topFloodZone.add(top);
      // }
    } else {
      floodTop = true;
    }
    if (this.squares[bottom] && this.squares[bottom].blocked != true && this.squares[bottom].checked != true) {
      // debugger;
      this.squares[bottom].checked = true;
      floodBottom = this.floodFill1(bottom, false);
      // if (floodBottom != false) {
      //   this.topFloodZone.add(bottom);
      // }
    } else {
      floodBottom = true;
    }
    if (this.squares[left] && this.squares[left].blocked != true && this.squares[left].checked != true) {
      // debugger;
      this.squares[left].checked = true;
      floodLeft = this.floodFill1(left, false);
      // if (floodLeft != false) {
      //   this.topFloodZone.add(left);
      // }
    } else {
      floodLeft = true;
    }
    if (this.squares[right] && this.squares[right].blocked === false && this.squares[right].checked === false) {
      // debugger;
      this.squares[right].checked = true;
      floodRight = this.floodFill1(right, false);
      // if (floodRight != false) {
      //   this.topFloodZone.add(right);
      // }
    } else {
      floodRight = true;
    }

    // debugger;
    // console.log(floodTop);
    // console.log(floodBottom);
    // console.log(floodLeft);
    // console.log(floodRight);

    // console.log(floodTop === false);
    // console.log(floodBottom === false);
    // console.log(floodLeft === false);
    // console.log(floodRight() === false);
    // floodLeft = 2;
    // debugger;
    // if (start != true &&
    //   ((typeof floodTop === "function" && floodTop != true && floodTop() === false) ||
    //   (typeof floodBottom === "function" && floodBottom() === false) ||
    //   (typeof floodLeft === "function" && floodLeft != true && floodLeft() === false) ||
    //   (typeof floodRight === "function" && floodRight != true && floodRight() === false))) {
    //     // debugger;
    //   return false;
    // }

    if (start != true) {
      // debugger
      // debugger
      if (floodTop === false || floodBottom === false || floodLeft === false || floodRight === false) {
        console.log("boolean");
        // debugger
      }
      if ((floodTop != false) &&
      (floodBottom != false) &&
      (floodLeft != false) &&
      (floodRight != false)) {
        // console.log("here");
        if (floodTop != true) {
          // debugger
          // if (this.count % 120 <= 20) {
          //   this.squares[top].graphics.beginFill("red").drawRect(0, 0, 17, 17);
          //   this.count += 1;
          // } else if (this.count % 120 <= 40) {
          //   this.squares[top].graphics.beginFill("orange").drawRect(0, 0, 17, 17);
          //   this.count += 1;
          // } else if (this.count % 120 <= 60) {
          //   this.squares[top].graphics.beginFill("yellow").drawRect(0, 0, 17, 17);
          //   this.count += 1;
          // } else if (this.count % 120 <= 80) {
          //   this.squares[top].graphics.beginFill("green").drawRect(0, 0, 17, 17);
          //   this.count += 1;
          // } else if (this.count % 120 <= 100) {
          //   this.squares[top].graphics.beginFill("blue").drawRect(0, 0, 17, 17);
          //   this.count += 1;
          // } else if (this.count % 120 <= 120) {
          //   this.squares[top].graphics.beginFill("indigo").drawRect(0, 0, 17, 17);
          //   this.count += 1;
          // } else if (this.count % 120 > 120) {
          //   this.squares[top].graphics.beginFill("purple").drawRect(0, 0, 17, 17);
          //   this.count += 1;
          // }

          this.topFloodZone.add(top);
        }
        if (floodBottom != true) {
          // debugger
          // if (this.count % 120 <= 20) {
          //   this.squares[bottom].graphics.beginFill("red").drawRect(0, 0, 17, 17);
          //   this.count += 1;
          // } else if (this.count % 120 <= 40) {
          //   this.squares[bottom].graphics.beginFill("orange").drawRect(0, 0, 17, 17);
          //   this.count += 1;
          // } else if (this.count % 120 <= 60) {
          //   this.squares[bottom].graphics.beginFill("yellow").drawRect(0, 0, 17, 17);
          //   this.count += 1;
          // } else if (this.count % 120 <= 80) {
          //   this.squares[bottom].graphics.beginFill("green").drawRect(0, 0, 17, 17);
          //   this.count += 1;
          // } else if (this.count % 120 <= 100) {
          //   this.squares[bottom].graphics.beginFill("blue").drawRect(0, 0, 17, 17);
          //   this.count += 1;
          // } else if (this.count % 120 <= 120) {
          //   this.squares[bottom].graphics.beginFill("indigo").drawRect(0, 0, 17, 17);
          //   this.count += 1;
          // } else if (this.count % 120 > 120) {
          //   this.squares[bottom].graphics.beginFill("purple").drawRect(0, 0, 17, 17);
          //   this.count += 1;
          // }

          this.topFloodZone.add(bottom);
        }
        if (floodLeft != true) {
          // debugger
          // if (this.count % 120 <= 20) {
          //   this.squares[left].graphics.beginFill("red").drawRect(0, 0, 17, 17);
          //   this.count += 1;
          // } else if (this.count % 120 <= 40) {
          //   this.squares[left].graphics.beginFill("orange").drawRect(0, 0, 17, 17);
          //   this.count += 1;
          // } else if (this.count % 120 <= 60) {
          //   this.squares[left].graphics.beginFill("yellow").drawRect(0, 0, 17, 17);
          //   this.count += 1;
          // } else if (this.count % 120 <= 80) {
          //   this.squares[left].graphics.beginFill("green").drawRect(0, 0, 17, 17);
          //   this.count += 1;
          // } else if (this.count % 120 <= 100) {
          //   this.squares[left].graphics.beginFill("blue").drawRect(0, 0, 17, 17);
          //   this.count += 1;
          // } else if (this.count % 120 <= 120) {
          //   this.squares[left].graphics.beginFill("indigo").drawRect(0, 0, 17, 17);
          //   this.count += 1;
          // } else if (this.count % 120 > 120) {
          //   this.squares[left].graphics.beginFill("purple").drawRect(0, 0, 17, 17);
          //   this.count += 1;
          // }

          this.topFloodZone.add(left);
        }
        if (floodRight != true) {
          // debugger
          // if (this.count % 120 <= 20) {
          //   this.squares[right].graphics.beginFill("red").drawRect(0, 0, 17, 17);
          //   this.count += 1;
          // } else if (this.count % 120 <= 40) {
          //   this.squares[right].graphics.beginFill("orange").drawRect(0, 0, 17, 17);
          //   this.count += 1;
          // } else if (this.count % 120 <= 60) {
          //   this.squares[right].graphics.beginFill("yellow").drawRect(0, 0, 17, 17);
          //   this.count += 1;
          // } else if (this.count % 120 <= 80) {
          //   this.squares[right].graphics.beginFill("green").drawRect(0, 0, 17, 17);
          //   this.count += 1;
          // } else if (this.count % 120 <= 100) {
          //   this.squares[right].graphics.beginFill("blue").drawRect(0, 0, 17, 17);
          //   this.count += 1;
          // } else if (this.count % 120 <= 120) {
          //   this.squares[right].graphics.beginFill("indigo").drawRect(0, 0, 17, 17);
          //   this.count += 1;
          // } else if (this.count % 120 > 120) {
          //   this.squares[right].graphics.beginFill("purple").drawRect(0, 0, 17, 17);
          //   this.count += 1;
          // }

          this.topFloodZone.add(right);
        }
      } else {
        // debugger;
        return false;
      }
    } else {
      // debugger
      if (floodTop != true && floodTop != false) {
        // debugger
        this.topFloodZone.add(top);
      }
      if (floodBottom != true && floodBottom != false) {
        // debugger
        this.topFloodZone.add(bottom);
      }
      if (floodLeft != true && floodLeft != false) {
        // debugger
        this.topFloodZone.add(left);
      }
      if (floodRight != true && floodRight != false) {
        // debugger
        this.topFloodZone.add(right);
      }
    }

    // debugger
    // if ((floodTop === false) || (floodBottom === false) || (floodLeft === false) || (floodRight === false)) {
    //   // debugger;
    //   return false;
    // }
  }

  // floodFill2(key, start = true) {
  //   let block_arr = key.split("_");
  //   let top = [block_arr[0], block_arr[1] - '17'];
  //   let bottom = [block_arr[0], Number(block_arr[1]) + 17];
  //   let left = [block_arr[0] - '17', block_arr[1]];
  //   let right = [Number(block_arr[0]) + 17, block_arr[1]];
  //   // debugger;
  //   top = top.join("_");
  //   bottom = bottom.join("_");
  //   left = left.join("_");
  //   right = right.join("_");
  //   // debugger
  //   console.log(key);
  //   if (this.squares[bottom] && this.squares[bottom].blocked != true && this.squares[bottom].checked != true) {
  //     // debugger;
  //     this.squares[bottom].checked = true;
  //     let floodBottom = this.floodFill2(bottom, false);
  //     if (floodBottom != false) {
  //       this.topFloodZone.add(bottom);
  //     }
  //   }
  //   if (this.squares[top] && this.squares[top].blocked != true && this.squares[top].checked != true) {
  //     // debugger;
  //     this.squares[top].checked = true;
  //     let floodTop = this.floodFill2(top, false);
  //     if (floodTop != false) {
  //       this.topFloodZone.add(top);
  //     }
  //   }
  //   if (this.squares[right] && this.squares[right].blocked != true && this.squares[right].checked != true) {
  //     // debugger;
  //     this.squares[right].checked = true;
  //     let floodRight = this.floodFill2(right, false);
  //     if (floodRight != false) {
  //       this.topFloodZone.add(right);
  //     }
  //   }
  //   if (this.squares[left] && this.squares[left].blocked === false && this.squares[left].checked === false) {
  //     // debugger;
  //     this.squares[left].checked = true;
  //     let floodLeft = this.floodFill2(left, false);
  //     if (floodLeft != false) {
  //       this.topFloodZone.add(left);
  //     }
  //   }
  //
  //   if ((typeof floodTop != "undefined" && floodTop === false) || (typeof floodBottom != "undefined" && floodBottom === false) || (typeof floodLeft != "undefined" && floodLeft === false) || (typeof floodRight != "undefined" && floodRight === false)) {
  //     // debugger;
  //     return false;
  //   }
  //
  //   // debugger
  //   this.ghosts.forEach( function(ghost) {
  //     // debugger;
  //     if ((ghost.x < this.squares[key].x + this.squares[key].size &&
  //         ghost.x + ghost.size > this.squares[key].x &&
  //         ghost.y < this.squares[key].y + this.squares[key].size &&
  //         ghost.y + ghost.size > this.squares[key].y)
  //         ||
  //         (this.squares[top] &&
  //             ghost.x < this.squares[top].x + this.squares[top].size &&
  //             ghost.x + ghost.size > this.squares[top].x &&
  //             ghost.y < this.squares[top].y + this.squares[top].size &&
  //             ghost.y + ghost.size > this.squares[top].y)
  //         ||
  //         (this.squares[bottom] &&
  //             ghost.x < this.squares[bottom].x + this.squares[bottom].size &&
  //             ghost.x + ghost.size > this.squares[bottom].x &&
  //             ghost.y < this.squares[bottom].y + this.squares[bottom].size &&
  //             ghost.y + ghost.size > this.squares[bottom].y)
  //         ||
  //         (this.squares[left] &&
  //             ghost.x < this.squares[left].x + this.squares[left].size &&
  //             ghost.x + ghost.size > this.squares[left].x &&
  //             ghost.y < this.squares[left].y + this.squares[left].size &&
  //             ghost.y + ghost.size > this.squares[left].y)
  //         ||
  //         (this.squares[right] &&
  //             ghost.x < this.squares[right].x + this.squares[right].size &&
  //             ghost.x + ghost.size > this.squares[right].x &&
  //             ghost.y < this.squares[right].y + this.squares[right].size &&
  //             ghost.y + ghost.size > this.squares[right].y)
  //       ) {
  //       // debugger
  //       return false;
  //     }
  //   }.bind(this));
  // }

  // findGreatestX(set) {
  //   let greatest_x = -Infinity;
  //   set.forEach( function(square) {
  //     let x = Number(square.split("_")[0]);
  //     if (greatest_x < x) {
  //       greatest_x = x;
  //     }
  //   })
  // }
  //
  // findGreatestY(set) {
  //   let greatest_y = -Infinity;
  //   set.forEach( function(square) {
  //     let y = Number(square.split("_")[1]);
  //     if (greatest_y < y) {
  //       greatest_y = y;
  //     }
  //   })
  // }
  //
  // findLeastX(set) {
  //   let least_x = Infinity;
  //   set.forEach( function(square) {
  //     let x = Number(square.split("_")[0]);
  //     if (least_x > x) {
  //       least_x = x;
  //     }
  //   })
  // }
  //
  // findLeastY(set) {
  //   let least_y = Infinity;
  //   set.forEach( function(square) {
  //     let y = Number(square.split("_")[1]);
  //     if (least_y > y) {
  //       least_y = y;
  //     }
  //   })
  // }

  findInvalidSpots(spot) {
    let block_arr = spot.split("_");
    let top = [block_arr[0], block_arr[1] - '17'];
    let bottom = [block_arr[0], Number(block_arr[1]) + 17];
    let left = [block_arr[0] - '17', block_arr[1]];
    let right = [Number(block_arr[0]) + 17, block_arr[1]];
    // debuggerg;
    top = top.join("_");
    bottom = bottom.join("_");
    left = left.join("_");
    right = right.join("_");

    // debugger
    if (this.squares[top]) {
      if (this.squares[top].blocked === false) {
        if (!this.invalidSpots.has(top)) {
          this.invalidSpots.add(top);
          this.findInvalidSpots(top);
        }
      }
    }
    if (this.squares[bottom]) {
      if (this.squares[bottom].blocked === false) {
        if (!this.invalidSpots.has(bottom)) {
          this.invalidSpots.add(bottom);
          this.findInvalidSpots(bottom);
        }
      }
    }
    if (this.squares[left]) {
      if (this.squares[left].blocked === false) {
        if (!this.invalidSpots.has(left)) {
          this.invalidSpots.add(left);
          this.findInvalidSpots(left);
        }
      }
    }
    if (this.squares[right]) {
      if (this.squares[right].blocked === false) {
        if (!this.invalidSpots.has(right)) {
          this.invalidSpots.add(right);
          this.findInvalidSpots(right);
        }
      }
    }
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
        let path_block = this.path.values().next().value;
        // let first_block = Array.from(this.path).shift();
        // let last_block = Array.from(this.path).pop();
        // let first_block_x = Number(first_block.split("_")[0]);
        // let first_block_y = Number(first_block.split("_")[1])
        // let last_block_x = Number(last_block.split("_")[0]);
        // let last_block_y = Number(last_block.split("_")[1])
        // // debugger
        // if (first_block_x > last_block_x || first_block_y > last_block_y) {
        //   this.floodFill1(first_block, true);
        // } else {
        //   this.floodFill1(first_block, true);
        // }
        this.floodFill1(path_block, true);
        console.log("FINISH FLOOD FILL");
        // this.path.forEach( function(block) {
        //   this.floodFill(block);
        // }.bind(this));
        // debugger;
        this.invalidSpots.forEach( function(spot)  {
          // this.topFloodZone.delete(spot);

          this.findInvalidSpots(spot);
          // debugger;
        }.bind(this));

        this.invalidSpots.forEach( function(spot) {
          this.topFloodZone.delete(spot);
        }.bind(this));

        this.topFloodZone.forEach( function(square) {
          // TODO add next line with fill
          this.squares[square].graphics.beginFill("red").drawRect(0, 0, 17, 17);
          // this.squares[square].checked = false;
          this.squares[square].blocked = true;
          this.percent += .18;
        }.bind(this));
        this.topFloodZone = new Set();
        this.invalidSpots = new Set();

        for (let key in this.squares) {
          this.squares[key].checked = false;
        }

        // this.bottomFloodZone.forEach( function(square) {
        //   this.squares[square].graphics.beginFill("green").drawRect(0, 0, 17, 17);
        //   this.squares[square].checked = false;
        //   this.squares[square].blocked = true;
        //   this.percent += .18;
        // }.bind(this));
        // this.bottomFloodZone = new Set();
        // this.leftFloodZone.forEach( function(square) {
        //   this.squares[square].graphics.beginFill("yellow").drawRect(0, 0, 17, 17);
        //   this.squares[square].checked = false;
        //   this.squares[square].blocked = true;
        //   this.percent += .18;
        // }.bind(this));
        // this.leftFloodZone = new Set();
        // this.rightFloodZone.forEach( function(square) {
        //   this.squares[square].graphics.beginFill("purple").drawRect(0, 0, 17, 17);
        //   this.squares[square].checked = false;
        //   this.squares[square].blocked = true;
        //   this.percent += .18;
        // }.bind(this));
        // this.rightFloodZone = new Set();

        // // add in once done testing
        // document.getElementById("percent").innerHTML = `Progress: ${Math.floor(this.percent)}/75%`
        // if (Math.floor(this.percent) >= 75 ) {
        //   document.getElementById("lives").innerHTML = "You won the level!"
        //   this.setup();
        //   this.percent = 0;
        //   document.getElementById("percent").innerHTML = `Progress: ${Math.floor(this.percent)}/75%`
        // }

        // for (let square in this.squares) {
        //   // debugger;
        //   if (this.squares[square].checked === true) {
        //     this.squares[square].graphics.beginFill("red").drawRect(0, 0, 17, 17);
        //     // debugger;
        //   }
        //
        //   // if (this.squares[square].checked === false) {
        //   //   this.squares[square].graphics.beginFill("blue").drawRect(0, 0, 17, 17);
        //   // }
        //   this.squares[square].checked = false;
        // }

        // debugger;

        this.path.forEach(this.blocked.add, this.blocked);
        this.path = new Set();
        // debugger
      } else if ( this.squares[key].blocked === false && this.squares[key].hitTest(pt.x, pt.y) ) {
        // debugger
        // console.log(key);
        this.path.add(key);
        this.squares[key].blocked = true;
        // debugger;
        if (this.path.size === 1) {
          this.squares[key].graphics.beginFill("black").drawRect(0, 0, 17, 17);
        } else {
          this.squares[key].graphics.beginFill(BLOCK_COLOR).drawRect(0, 0, 17, 17);
        }
        this.percent += .18;
        document.getElementById("percent").innerHTML = `Progress: ${Math.floor(this.percent)}/75%`
        // TODO add this back
        // if (Math.floor(this.percent) >= 75 ) {
        //   document.getElementById("lives").innerHTML = "You won the level!"
        //   this.setup();
        //   this.percent = 0;
        //   document.getElementById("percent").innerHTML = `Progress: ${Math.floor(this.percent)}/75%`
        // }
      }
    }
  }

  setup() {
    createjs.Ticker.addEventListener("tick", this.tick);
    createjs.Ticker.setFPS(30);

    this.squares = {};
    this.ghosts = [];
    this.lives = 2;
    this.percent = 0;
    // this.lastMove = null;
    this.blocked = new Set();
    this.path = new Set();

    this.pacmanImage = new Image();
    this.pacmanImage.src = "./lib/assets/Pacman.png";
    this.pacmanImage.onload = this.handleImageLoadPacman;

    // this.red_ghost = new Image();
    // this.red_ghost.src = "./lib/assets/red_ghost.png";
    // this.red_ghost.onload = this.handleImageLoadGhost;
    //
    // this.orange_ghost = new Image();
    // this.orange_ghost.src = "./lib/assets/orange_ghost.png";
    // this.orange_ghost.onload = this.handleImageLoadGhost;

    this.pinky_ghost = new Image();
    this.pinky_ghost.src = "./lib/assets/pinky_ghost.png";
    this.pinky_ghost.onload = this.handleImageLoadGhost;

    // debugger
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
    this.stage.removeAllChildren();
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
        gridSquare.checked = false;
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
