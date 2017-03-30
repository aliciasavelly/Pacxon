class GameView {
  constructor(stage) {
    this.stage = stage;
    this.squares = {};
    this.ghosts = [];

    this.squareClick = this.squareClick.bind(this);
    this.setup = this.setup.bind(this);
    this.handleImageLoadPacman = this.handleImageLoadPacman.bind(this);
    this.handleImageLoadGhost = this.handleImageLoadGhost.bind(this);
    this.tick = this.tick.bind(this);
    this.testCollision = this.testCollision.bind(this);

    this.setup();
    createjs.Ticker.addEventListener("tick", this.tick);
    createjs.Ticker.setFPS(40);
  }

  tick(event) {
    // console.log("hi");
    // console.log(event.delta/1000*100);
    // console.log(this.red_ghost);
    // console.log(this.red_ghost.x);
    // console.log(this.ghosts[0].x);
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
    this.stage.update();
    // this.pacman.x += event.delta/1000*100;
  }

  testCollision(ghost) {
    // console.log("hi");
    // ghost.y += 1;
    // console.log(this.squares);
    // debugger;
    // console.log(this.squares);
    // this.squares.forEach( square => {
      // console.log(square.x);
      // console.log(ghost.x);
      // console.log(ghost.x);
    //   if (square.hitTest(ghost.x, ghost.y)) {
    //     console.log("hi");
    //   }
    // });
    // ghost.y += 3;
    // debugger;
    // let y_velocity = ghost.last_pos;
    // ghost.last_pos = ghost.y;
    for (let key in this.squares) {
      // console.log(key);
      // console.log(this.squares[key]);
      // console.log(this.squares[key].hitTest(ghost.x, ghost.y));
      // console.log(this.squares[key].blocked === true);
      // console.log(this.squares);
      let pt = this.squares[key].globalToLocal(ghost.x, ghost.y);
      if (this.squares[key].blocked === true && (this.squares[key].hitTest(pt.x, pt.y) || (this.squares[key].hitTest(pt.x + 16, pt.y + 16)))) {
        let xVel = ghost.xVel;
        let yVel = ghost.yVel;
        ghost.xVel = yVel;
        ghost.yVel = xVel * -1;
        // ghost.xVel = ghost.yVel;
        // ghost.x =
        // debugger;
        // y_velocity -= ghost.y;
        // ghost.x -= (y_velocity * 2);
        // console.log("y_velocity:");
        // console.log(y_velocity);
        // ghost.y -= 3;
      }
    }
  }

  setup() {
    // let square = new createjs.Shape();
    // square.graphics.beginFill("green").drawRect(0, 0, 40, 40);
    // square.y = 50;
    // this.stage.addChild(square);

    this.pacman = new Image();
    this.pacman.src = "./lib/assets/Pacman.png";
    this.pacman.onload = this.handleImageLoadPacman;

    this.red_ghost = new Image();
    this.red_ghost.src = "./lib/assets/red_ghost.png";
    this.red_ghost.onload = this.handleImageLoadGhost;

    this.orange_ghost = new Image();
    this.orange_ghost.src = "./lib/assets/orange_ghost.png";
    this.orange_ghost.onload = this.handleImageLoadGhost;
    // debugger;
    this.pinky_ghost = new Image();
    this.pinky_ghost.src = "./lib/assets/pinky_ghost.png";
    this.pinky_ghost.onload = this.handleImageLoadGhost;

    // if (this.ghosts[0]) {

    // }

    this.generateGrid();
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
      ghost.xVel = 1;
      ghost.yVel = 1;
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
        gridSquare.graphics.beginFill("#1D9C73").drawRect(0, 0, 17, 17);
        // gridSquare.alpha = 0;
        gridSquare.x = x * 17;
        gridSquare.y = y * 17;
        if (gridSquare.x === 0 || gridSquare.x === 561 || gridSquare.y === 0 || gridSquare.y === 374) {
          gridSquare.blocked = true;
          gridSquare.border = true;
        } else {
          gridSquare.blocked = false;
          gridSquare.border = false;
        }
        gridSquare.addEventListener("click", this.squareClick);
        this.stage.addChild(gridSquare);

        let id = gridSquare.x + "_" + gridSquare.y
        this.squares[id] = gridSquare;
      }
    }
    this.stage.update();
  }

  squareClick(e) {
    console.log("clicked");
    let current = this.squares[e.target.x + "_" + e.target.y];

    if (current.blocked === true) {
      if (current.border === false) {
        current.graphics.beginFill("#1D9C73").drawRect(0, 0, 17, 17);
        current.blocked = false;
      }
    } else {
      current.graphics.beginFill("blue").drawRect(0, 0, 17, 17);
      current.blocked = true;
    }
    this.stage.update();
  }
};

export default GameView;
// module.exports = GameView;
