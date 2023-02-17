import Game from "./Game.js";

window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 1500;
  canvas.height = 700;

  const game = new Game(canvas.width, canvas.height);
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
});
