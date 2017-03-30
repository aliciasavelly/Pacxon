import GameView from './lib/game_view.js';
// require('./style.css');
// document.write(require('./lib/game.js'));
// const GameView = require('./lib/game_view.js');

document.addEventListener("DOMContentLoaded", function(e) {
  let stage = new createjs.Stage("game-canvas");
  new GameView(stage);
  // square = new createjs.Shape();
  // square.graphics.beginFill("green").drawRect(0, 0, 40, 40);
  // square.y = 50;
  // stage.addChild(square);
  //
  // let pacman = new Image();
  // pacman.src = "/lib/assets/Pacman.png";
  // pacman.onload = handleImageLoad;
  // createjs.Ticker.on("tick", tick);
  // createjs.Ticker.setFPS(30);
  // generateGrid();
});

// function handleImageLoad(event) {
//   let image = event.target;
//   // debugger;
//   let bitmap = new createjs.Bitmap(image);
//   bitmap.scaleX = 0.0071;
//   bitmap.scaleY = 0.0071;
//   bitmap.x = 1;
//   bitmap.y = 1;
//   stage.addChild(bitmap);
//   stage.update();
// }
//
// let squares = [];
//
// function generateGrid() {
//   let gridSquare;
//   for (let x = 0; x < 34; x ++) {
//     for (let y = 0; y < 23; y++) {
//       gridSquare = new createjs.Shape();
//       gridSquare.graphics.beginStroke("#000");
//       gridSquare.graphics.setStrokeStyle(1);
//       // gridSquare.shadow = new createjs.Shadow("#000000", 3, 3, 3);
//       // gridSquare.shadow = new createjs.Shadow("#000000", 10, 10, 10);
//       gridSquare.snapToPixel = true;
//       gridSquare.graphics.beginFill("#1D9C73").drawRect(0, 0, 17, 17);
//       gridSquare.x = x * 17;
//       gridSquare.y = y * 17;
//       gridSquare.blocked = false;
//       gridSquare.addEventListener("click", squareClick);
//       stage.addChild(gridSquare);
//
//       let id = gridSquare.x + "_" + gridSquare.y
//       squares[id] = gridSquare;
//     }
//   }
//   stage.update();
// }
//
// function squareClick(e) {
//   let current = squares[e.target.x + "_" + e.target.y];
//   if (current.blocked === true) {
//     current.graphics.beginFill("#1D9C73").drawRect(0, 0, 17, 17);
//     current.blocked = false;
//   } else {
//     current.graphics.beginFill("blue").drawRect(0, 0, 17, 17);
//     current.blocked = true;
//   }
//   stage.update();
// }
//
// function tick(event) {
//   square.x = square.x + 1;
//   if(square.x > stage.canvas.width) { square.x = 0; }
//   stage.update(event);
// }
