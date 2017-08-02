/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const Game = __webpack_require__(1);

const BLOCK_COLOR = "#0800a3";
const EMPTY_COLOR = "#282828";

class GameView {
  constructor(stage) {
    this.stage = stage;
    this.squares = new Set;
    this.blocked = new Set;

    this.generateGrid();
    this.game = new Game(this.stage, this);
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

        let id = gridSquare.x + "_" + gridSquare.y;
        if (gridSquare.x === 0 || gridSquare.x === 561 || gridSquare.y === 0 || gridSquare.y === 374) {
          gridSquare.graphics.beginFill(BLOCK_COLOR).drawRect(0, 0, 17, 17);
          gridSquare.blocked = true;
          this.blocked.add(id);
        } else {
          gridSquare.graphics.beginFill(EMPTY_COLOR).drawRect(0, 0, 17, 17);
          gridSquare.blocked = false;
          this.blocked.delete(gridSquare);
        }

        gridSquare.checked = false;
        this.stage.addChild(gridSquare);
        this.squares[id] = gridSquare;
      }
    }
    this.stage.update();
  }

  reset() {
    this.squares = new Set;
    this.blocked = new Set;
  }

  handleFilling(key) {
    this.squares[key].graphics.beginFill(BLOCK_COLOR).drawRect(0, 0, 17, 17);
    // TODO
    this.squares[key].blocked = true;
    this.blocked.add(key);
    // debugger;
  }
};

/* harmony default export */ __webpack_exports__["a"] = (GameView);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const Ghost = __webpack_require__(2);
const Pacman = __webpack_require__(3);

const BLOCK_COLOR = "#0800a3";
const EMPTY_COLOR = "#282828";

class Game {
  constructor(stage, gameView) {
    this.stage = stage;
    this.gameView = gameView;
    this.lives = 2;
    this.level = 1;
    this.arrowUp = false;
    this.arrowDown = false;
    this.arrowLeft = false;
    this.arrowRight = false;
    this.move = false;
    this.floodZone = new Set;
    this.invalidSpots = new Set;

    this.tick = this.tick.bind(this);

    this.setup();
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
    this.handlingWin = false;

    this.pacmanImage = new Pacman("./lib/assets/pacman.png", this.stage, this);
    this.red_ghost = new Ghost("./lib/assets/red_ghost.png", this.stage, this.ghosts);
    this.orange_ghost = new Ghost("./lib/assets/orange_ghost.png", this.stage, this.ghosts);
    this.pinky_ghost = new Ghost("./lib/assets/pinky_ghost.png", this.stage, this.ghosts);

    this.gameView.generateGrid();
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
    if (this.ghosts.length > 0) {
      this.ghosts.forEach( ghost => {
        ghost.x += ghost.xVel;
        ghost.y += ghost.yVel;
          this.testGhostPacmanCollision(ghost);
          this.testCollisionBetweenGhosts(ghost);
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

    if (this.pacman) {
      this.testPacmanCollision(this.pacman);
    }
    this.stage.update();
  }

  testCollisionBetweenGhosts(inputGhost) {
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
  }

  // testGhostPacmanCollision(inputGhost) {
  //   for (let key in this.squares) {
  //     if (
  //       this.squares[key].blocked === true &&
  //       inputGhost.x < this.squares[key].x + this.squares[key].size &&
  //       inputGhost.x + inputGhost.size > this.squares[key].x &&
  //       inputGhost.y < this.squares[key].y + this.squares[key].size &&
  //       inputGhost.y + inputGhost.size > this.squares[key].y
  //     ) {
  //       // debugger;
  //       if (this.path.has(key)) {
  //         for (let item of this.path) {
  //           this.squares[item].blocked = false;
  //           this.squares[item].graphics.beginFill(EMPTY_COLOR).drawRect(0, 0, 17, 17);
  //           this.percent -= .18;
  //         }
  //
  //         this.lives -= 1;
  //         if (!this.handlingWin) {
  //           document.getElementById("percent").innerHTML = `Progress: ${Math.floor(this.percent)}/75%`
  //         }
  //
  //         if (this.lives < 0) {
  //           this.lives = 2;
  //           this.handleLevelLose();
  //         } else {
  //           this.pacman.x = 7;
  //           this.pacman.y = 7.5;
  //           document.getElementById("lives").innerHTML = `Lives: ${this.lives}`;
  //         }
  //         // TODO why do we not need this?
  //         // this.path.clear();
  //       }
  //
  //       let xVel = inputGhost.xVel;
  //       let yVel = inputGhost.yVel;
  //       let squareX = this.squares[key].x;
  //       let squareY = this.squares[key].y;
  //       let xDiff = squareX - inputGhost.x;
  //       let yDiff = squareY - inputGhost.y;
  //
  //       if (Math.abs(xDiff) > Math.abs(yDiff)) {
  //         // hit right or left
  //         if (squareX > inputGhost.x) {
  //           // hit left side of square
  //           inputGhost.x -= 4;
  //           inputGhost.xVel = xVel * -1;
  //           inputGhost.yVel = yVel;
  //         } else {
  //           // hit right
  //           inputGhost.x += 4;
  //           inputGhost.xVel = xVel * -1;
  //           inputGhost.yVel = yVel;
  //         }
  //       } else {
  //         // hit top or bottom
  //         if (squareY > inputGhost.y) {
  //           // hit top of square
  //           inputGhost.y -= 4;
  //           inputGhost.xVel = xVel;
  //           inputGhost.yVel = yVel * -1;
  //         } else {
  //           // hit bottom
  //           inputGhost.y += 4;
  //           inputGhost.xVel = xVel;
  //           inputGhost.yVel = yVel * -1;
  //         }
  //       }
  //     }
  //   }
  // }

  testGhostPacmanCollision(inputGhost) {
    for (let key in this.squares) {
      if (
        this.squares[key].blocked === true &&
        this.blocked.has(key) &&
        inputGhost.x < this.squares[key].x + this.squares[key].size &&
        inputGhost.x + inputGhost.size > this.squares[key].x &&
        inputGhost.y < this.squares[key].y + this.squares[key].size &&
        inputGhost.y + inputGhost.size > this.squares[key].y
      ) {
        // debugger;
        if (this.path.has(key)) {
          for (let item of this.path) {
            this.squares[item].blocked = false;
            this.blocked.delete(item);
            this.squares[item].graphics.beginFill(EMPTY_COLOR).drawRect(0, 0, 17, 17);
            this.percent -= .18;
          }

          this.lives -= 1;
          if (!this.handlingWin) {
            document.getElementById("percent").innerHTML = `Progress: ${Math.floor(this.percent)}/75%`
          }

          if (this.lives < 0) {
            this.lives = 2;
            this.handleLevelLose();
          } else {
            this.pacman.x = 7;
            this.pacman.y = 7.5;
            document.getElementById("lives").innerHTML = `Lives: ${this.lives}`;
          }
          // TODO why do we not need this?
          // this.path.clear();
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

// // CHANGED
//   floodFill(key, start = true) {
//     let block_arr = key.split("_");
//     let top = this.top(block_arr);
//     let bottom = this.bottom(block_arr);
//     let left = this.left(block_arr);
//     let right = this.right(block_arr);
//
//     let floodTop;
//     let floodBottom;
//     let floodLeft;
//     let floodRight;
//
//     this.ghosts.forEach( function(ghost) {
//       if ((this.squares[key].checked === false && (ghost.x < this.squares[key].x + this.squares[key].size &&
//           ghost.x + ghost.size > this.squares[key].x &&
//           ghost.y < this.squares[key].y + this.squares[key].size &&
//           ghost.y + ghost.size > this.squares[key].y))
//           ||
//           (this.squares[top].checked === false && (this.squares[top] &&
//               ghost.x < this.squares[top].x + this.squares[top].size &&
//               ghost.x + ghost.size > this.squares[top].x &&
//               ghost.y < this.squares[top].y + this.squares[top].size &&
//               ghost.y + ghost.size > this.squares[top].y))
//           ||
//           (this.squares[bottom].checked === false && (this.squares[bottom] &&
//               ghost.x < this.squares[bottom].x + this.squares[bottom].size &&
//               ghost.x + ghost.size > this.squares[bottom].x &&
//               ghost.y < this.squares[bottom].y + this.squares[bottom].size &&
//               ghost.y + ghost.size > this.squares[bottom].y))
//           ||
//           (this.squares[left].checked === false && (this.squares[left] &&
//               ghost.x < this.squares[left].x + this.squares[left].size &&
//               ghost.x + ghost.size > this.squares[left].x &&
//               ghost.y < this.squares[left].y + this.squares[left].size &&
//               ghost.y + ghost.size > this.squares[left].y))
//           ||
//           (this.squares[right].checked === false && (this.squares[right] &&
//               ghost.x < this.squares[right].x + this.squares[right].size &&
//               ghost.x + ghost.size > this.squares[right].x &&
//               ghost.y < this.squares[right].y + this.squares[right].size &&
//               ghost.y + ghost.size > this.squares[right].y))
//         ) {
//         this.squares[key].checked = true;
//         this.squares[top].checked = true;
//         this.squares[bottom].checked = true;
//         this.squares[left].checked = true;
//         this.squares[right].checked = true;
//         this.invalidSpots.add(key);
//         this.invalidSpots.add(top);
//         this.invalidSpots.add(bottom);
//         this.invalidSpots.add(left);
//         this.invalidSpots.add(right);
//         return false;
//       }
//     }.bind(this));
//
//     if (this.squares[top] && !this.blocked.has(top) && this.squares[top].blocked != true && this.squares[top].checked != true) {
//       this.squares[top].checked = true;
//       floodTop = this.floodFill(top, false);
//     } else {
//       floodTop = true;
//     }
//     if (this.squares[bottom] && !this.blocked.has(bottom) && this.squares[bottom].blocked != true && this.squares[bottom].checked != true) {
//       this.squares[bottom].checked = true;
//       floodBottom = this.floodFill(bottom, false);
//     } else {
//       floodBottom = true;
//     }
//     if (this.squares[left] && !this.blocked.has(left) && this.squares[left].blocked != true && this.squares[left].checked != true) {
//       this.squares[left].checked = true;
//       floodLeft = this.floodFill(left, false);
//     } else {
//       floodLeft = true;
//     }
//     if (this.squares[right] && !this.blocked.has(right) && this.squares[right].blocked != true && this.squares[right].checked === false) {
//       this.squares[right].checked = true;
//       floodRight = this.floodFill(right, false);
//     } else {
//       floodRight = true;
//     }
//
//     if (start != true &&
//       ((typeof floodTop === "function" && floodTop != true && floodTop() === false) ||
//       (typeof floodBottom === "function" && floodBottom != true && floodBottom() === false) ||
//       (typeof floodLeft === "function" && floodLeft != true && floodLeft() === false) ||
//       (typeof floodRight === "function" && floodRight != true && floodRight() === false))) {
//       return false;
//     }
//
//     if (start != true) {
//       if ((floodTop != false) &&
//       (floodBottom != false) &&
//       (floodLeft != false) &&
//       (floodRight != false)) {
//         if (floodTop != true) {
//           this.floodZone.add(top);
//         }
//         if (floodBottom != true) {
//           this.floodZone.add(bottom);
//         }
//         if (floodLeft != true) {
//           this.floodZone.add(left);
//         }
//         if (floodRight != true) {
//           this.floodZone.add(right);
//         }
//       } else {
//         return false;
//       }
//     } else {
//       if (floodTop != true && floodTop != false) {
//         this.floodZone.add(top);
//       }
//       if (floodBottom != true && floodBottom != false) {
//         this.floodZone.add(bottom);
//       }
//       if (floodLeft != true && floodLeft != false) {
//         this.floodZone.add(left);
//       }
//       if (floodRight != true && floodRight != false) {
//         this.floodZone.add(right);
//       }
//     }
//
//     // if ((floodTop === false) || (floodBottom === false) || (floodLeft === false) || (floodRight === false)) {
//     //   return false;
//     // }
//   }

  floodFill(key, start = true) {
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
      // debugger;
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

  // testInvalidSpot(spot) {
  //   if (this.squares[spot] && this.squares[spot].blocked === false && !this.invalidSpots.has(spot)) {
  //     this.invalidSpots.add(spot);
  //     this.findInvalidSpots(spot);
  //   }
  // }

// CHANGED
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
          this.gameView.handleFilling(square);
          this.percent += .18;
        }.bind(this));
        this.floodZone = new Set;
        this.invalidSpots = new Set;

        for (let key in this.squares) {
          this.squares[key].checked = false;
        }

        this.path = new Set;
      } else if (!this.blocked.has(key) && this.squares[key].hitTest(pt.x, pt.y) ) {
        this.path.add(key);
        this.gameView.handleFilling(key);
        this.percent += .18;
      }
      if (!this.handlingWin) {
        document.getElementById("percent").innerHTML = `Progress: ${Math.floor(this.percent)}/75%`;
      }
      this.handleLevelWin();
    }
  }

  handleLevelWin() {
    if (Math.floor(this.percent) >= 75 ) {
      this.handlingWin = true;
      this.lives += 1;
      this.level += 1;
      this.percent = 0;
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
}

module.exports = Game;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

class Ghost {
  constructor(src, stage, ghosts) {
    this.img = new Image();
    this.img.src = src;
    this.stage = stage;
    this.ghosts = ghosts;

    this.handleImageLoad = this.handleImageLoad.bind(this);
    this.img.onload = this.handleImageLoad;
  }

  handleImageLoad(event) {
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
    });

    this.stage.addChild(bitmap);
    this.stage.update();
  }
}

module.exports = Ghost;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

class Pacman {
  constructor(src, stage, game) {
    this.img = new Image();
    this.img.src = src;
    this.stage = stage;
    this.game = game;
    this.gameView = this.game.gameView;

    this.handleImageLoad = this.handleImageLoad.bind(this);
    this.img.onload = this.handleImageLoad;
    this.handleKeyup = this.handleKeyup.bind(this);
  }

  handleImageLoad() {
    // let image = event.target;
    // let img = new Image();
    // img.src = event.target.src;
    let pacman = new createjs.Bitmap(this.img);
    // pacman.scaleX = 0.0071;
    // pacman.scaleY = 0.0071;

    let pacmanContainer = new createjs.Container();
    pacmanContainer.addChild(pacman);
    pacmanContainer.x = 1;
    pacmanContainer.y = 1;
    pacman.regX = 7;
    pacman.regY = 7.5;
    pacman.x = 7;
    pacman.y = 7.5;
    // bitmap.size = 17;
    this.stage.addChild(pacmanContainer);
    this.stage.update();
    this.game.pacman = pacman;
    this.pacman = this.game.pacman;
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
      this.game.pacman.rotation = -90;
      // if (this.lastMove !== "up") {
      //   this.game.pacman.y += 15;
      // }
      // this.lastMove = "up";
      this.game.arrowUp = true;
      this.game.arrowDown = false;
      this.game.arrowLeft = false;
      this.game.arrowRight = false;
    } else if (event.key === "ArrowDown" && this.game.pacman.y <= 374) {
      this.game.pacman.rotation = 90;
      // if (this.lastMove !== "down") {
        // this.game.pacman.skewX = 15;
      // }
      // this.lastMove = "down";
      this.game.arrowUp = false;
      this.game.arrowDown = true;
      this.game.arrowLeft = false;
      this.game.arrowRight = false;
      // this.count = 1;
    } else if (event.key === "ArrowRight" && this.game.pacman.x <= 561) {
      this.game.pacman.rotation = 0;
      // if (this.lastMove !== "right" && this.lastMove !== null) {
        // this.game.pacman.skewX = -13;
      // }
      // this.lastMove = "right";
      this.game.arrowUp = false;
      this.game.arrowDown = false;
      this.game.arrowLeft = false;
      this.game.arrowRight = true;
    } else if (event.key === "ArrowLeft" && this.game.pacman.x >= 17) {
      this.game.pacman.rotation = 180;
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
}

module.exports = Pacman;


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib_game_view_js__ = __webpack_require__(0);


document.addEventListener("DOMContentLoaded", function(e) {
  let stage = new createjs.Stage("game-canvas");
  new __WEBPACK_IMPORTED_MODULE_0__lib_game_view_js__["a" /* default */](stage);
});


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map