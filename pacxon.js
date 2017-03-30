import GameView from './lib/game_view.js';
// require('./style.css');
// document.write(require('./lib/game.js'));
// const GameView = require('./lib/game_view.js');

document.addEventListener("DOMContentLoaded", function(e) {
  let stage = new createjs.Stage("game-canvas");
  new GameView(stage);
});
