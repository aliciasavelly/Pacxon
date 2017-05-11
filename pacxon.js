import GameView from './lib/game_view.js';

document.addEventListener("DOMContentLoaded", function(e) {
  let stage = new createjs.Stage("game-canvas");
  new GameView(stage);
});
