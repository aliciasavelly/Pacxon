class GameView {
  constructor(stage) {
    this.stage = stage;
    this.squares = {};
    this.ghosts = [];
    // this.collisionMethod = ndgmr.checkPixelCollision;
    // if ( this.collisionMethod == ndgmr.checkPixelCollision ) {
    //   this.collisionMethod = ndgmr.checkRectCollision;
    // } else {
    //   this.collisionMethod = ndgmr.checkRectCollision;
    // }
    // debugger;

    let body = document.getElementById("body");
    // body.addEventListener("keydown", function() {
    //   debugger;
    //   console.log("key pressed");
    // }).bind(this);
    // debugger;

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
    createjs.Ticker.setFPS(40);
  }

  tick(event) {
    if (this.ghosts[0]) {
      this.ghosts.forEach( ghost => {
        // console.log(ghost.xVel);
        // debugger;
        ghost.x += ghost.xVel;
        ghost.y += ghost.yVel;
        // console.log(this.ghosts[0].x);
        this.testCollision(ghost);
      })
    }
    this.testPacmanCollision(this.pacman);
    this.stage.update();
    // this.pacman.x += event.delta/1000*100;
  }

  testCollision(ghost) {
    for (let key in this.squares) {
      // let intersection = this.collisionMethod(ghost, this.squares[key], 1);
      // // debugger;
      // if (this.squares[key].blocked === true && intersection) {
      //   // debugger;
      //   let xVel = ghost.xVel;
      //   let yVel = ghost.yVel;
      //   ghost.xVel = yVel;
      //   ghost.yVel = xVel * -1;
      // }
      let pt = this.squares[key].globalToLocal(ghost.x, ghost.y);
      let pt2 = this.squares[key].globalToLocal(ghost.x + 17, ghost.y + 17);
      let pt3 = this.squares[key].globalToLocal(ghost.x + 17, ghost.y);
      let pt4 = this.squares[key].globalToLocal(ghost.x, ghost.y + 17);
      let pt5 = this.squares[key].globalToLocal(ghost.x + 9, ghost.y);
      let pt6 = this.squares[key].globalToLocal(ghost.x + 17, ghost.y + 9);
      let pt7 = this.squares[key].globalToLocal(ghost.x + 9, ghost.y + 17);
      let pt8 = this.squares[key].globalToLocal(ghost.x, ghost.y + 9);

      if ( this.squares[key].blocked === true && (this.squares[key].hitTest(pt.x, pt.y) || this.squares[key].hitTest(pt2.x, pt2.y) || this.squares[key].hitTest(pt3.x, pt3.y) || this.squares[key].hitTest(pt4.x, pt4.y)    ) ) {
        let xVel = ghost.xVel;
        let yVel = ghost.yVel;
        ghost.xVel = yVel;
        ghost.yVel = xVel * -1;
      }
    }
  }

  testPacmanCollision(pacman) {
    for (let key in this.squares) {
      let pt = this.squares[key].globalToLocal(pacman.x, pacman.y);
      if ( this.squares[key].blocked === false && this.squares[key].hitTest(pt.x, pt.y) ) {
        this.squares[key].blocked = true;
        this.squares[key].graphics.beginFill("blue").drawRect(0, 0, 17, 17);

        console.log(this.squares[key].blocked);
      }
    }
  }

  setup() {
    // let square = new createjs.Shape();
    // square.graphics.beginFill("green").drawRect(0, 0, 40, 40);
    // square.y = 50;
    // this.stage.addChild(square);

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
    // debugger;
    // console.log(event.keyCode);
    if (event.key === "ArrowUp" && this.pacman.y >= 17) {
      this.pacman.y -= 17;
    } else if (event.key === "ArrowDown" && this.pacman.y <= 374) {
      this.pacman.y += 17;
    } else if (event.key === "ArrowRight" && this.pacman.x <= 561) {
      this.pacman.x += 17;
    } else if (event.key === "ArrowLeft" && this.pacman.x >= 17) {
      this.pacman.x -= 17;
    }
  }

  handleImageLoadPacman(event) {
    let image = event.target;
    let bitmap = new createjs.Bitmap(image);
    bitmap.scaleX = 0.0071;
    bitmap.scaleY = 0.0071;
    bitmap.x = 1;
    bitmap.y = 1;
    this.stage.addChild(bitmap);
    this.stage.update();
    this.pacman = bitmap;
    // debugger;
    $(document).keydown(this.handleKeydown.bind(this));
    $(document).keyup(this.handleSpace.bind(this));
  }

  handleImageLoadGhost(event) {
    let image = event.target;
    let bitmap = new createjs.Bitmap(image);
    bitmap.scaleX = 0.05;
    bitmap.scaleY = 0.05;
    // bitmap.x = 600 * Math.random();
    // bitmap.y = 400 * Math.random();
    while (bitmap.y > 355 || bitmap.y < 20) {
      bitmap.y = 400 * Math.random();
    }
    while (bitmap.x > 540 || bitmap.x < 20) {
      bitmap.x = 600 * Math.random();
    }

    this.ghosts.push(bitmap);
    this.ghosts.forEach( ghost => {
      ghost.xVel = 4;
      ghost.yVel = 2;
      // debugger;
      // console.log(this.ghosts[0].x);
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
        // gridSquare.shadow = new createjs.Shadow("#000000", 3, 3, 3);
        // gridSquare.shadow = new createjs.Shadow("#000000", 10, 10, 10);
        gridSquare.snapToPixel = true;
        // gridSquare.alpha = 0;
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

export default GameView;
// module.exports = GameView;
