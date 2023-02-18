import Game from "./Game.js";

function runGame(nPlayers) {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 1500;
  canvas.height = 800;

  const game = new Game(canvas.width, canvas.height, nPlayers);
  let lastTime = 0;
  function gameLoop(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    //?Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.draw(ctx);
    game.update(deltaTime);
    //*Perform an animation, and call gameLoop again
    requestAnimationFrame(gameLoop);
  }
  gameLoop(0);
}
let nOfPlayers = 0;
const twoPlayersGame = document.getElementById("play2");
twoPlayersGame.addEventListener("click", () => {
  nOfPlayers = 2;
  runGame(nOfPlayers);
});
const fourPlayersGame = document.getElementById("play4");
fourPlayersGame.addEventListener("click", () => {
  nOfPlayers = 4;
  runGame(nOfPlayers);
});
