const Game = require("./game.js");

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

  handleFilling(key, path) {
    if (path) {
      this.squares[key].graphics.beginFill("#070182").drawRect(0, 0, 17, 17);
    } else {
      this.squares[key].graphics.beginFill(BLOCK_COLOR).drawRect(0, 0, 17, 17);
    }
    // TODO
    // this.squares[key].blocked = true;
    this.blocked.add(key);
    // debugger;
  }
};

export default GameView;
