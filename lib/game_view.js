class GameView {
  constructor(stage) {
    this.stage = stage;
    this.squares = [];
    this.squareClick = this.squareClick.bind(this);
    this.setup = this.setup.bind(this);
    this.handleImageLoadPacman = this.handleImageLoadPacman.bind(this);
    this.handleImageLoadGhost = this.handleImageLoadGhost.bind(this);

    this.setup();
  }

  setup() {
    // let square = new createjs.Shape();
    // square.graphics.beginFill("green").drawRect(0, 0, 40, 40);
    // square.y = 50;
    // this.stage.addChild(square);

    let pacman = new Image();
    pacman.src = "/lib/assets/Pacman.png";
    pacman.onload = this.handleImageLoadPacman;

    let red_ghost = new Image();
    red_ghost.src = "/lib/assets/red_ghost.png";
    red_ghost.onload = this.handleImageLoadGhost;

    let orange_ghost = new Image();
    orange_ghost.src = "/lib/assets/orange_ghost.png";
    orange_ghost.onload = this.handleImageLoadGhost;

    let pinky_ghost = new Image();
    pinky_ghost.src = "/lib/assets/pinky_ghost.png";
    pinky_ghost.onload = this.handleImageLoadGhost;

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
        gridSquare.blocked = false;
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
      current.graphics.beginFill("#1D9C73").drawRect(0, 0, 17, 17);
      current.blocked = false;
    } else {
      current.graphics.beginFill("blue").drawRect(0, 0, 17, 17);
      current.blocked = true;
    }
    this.stage.update();
  }
};

export default GameView;
