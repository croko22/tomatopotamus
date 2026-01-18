import Game from "./Game.js";

function runGame(nPlayers, gameMode, maxRounds = 3) {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 1500;
  canvas.height = 800;

  const game = new Game(canvas.width, canvas.height, nPlayers, gameMode, maxRounds);
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
let gameMode = "pvp";
let maxRounds = 3;
const btnBox = document.getElementById("btnBox");
const playerBox = document.getElementById("playerBox");
const roundBox = document.getElementById("roundBox");

// Gamemode selection
const pvpModeBtn = document.getElementById("pvpMode");
const coopModeBtn = document.getElementById("coopMode");

pvpModeBtn.addEventListener("click", () => {
  gameMode = "pvp";
  btnBox.style.display = "none";
  playerBox.style.display = "block";
});

coopModeBtn.addEventListener("click", () => {
  gameMode = "coop";
  btnBox.style.display = "none";
  playerBox.style.display = "block";
});

// Player selection
const twoPlayersGame = document.getElementById("play2");
twoPlayersGame.addEventListener("click", () => {
  nOfPlayers = 2;
  playerBox.style.display = "none";
  if (gameMode === "pvp") {
    roundBox.style.display = "block";
  } else {
    runGame(nOfPlayers, gameMode, maxRounds);
  }
});

const fourPlayersGame = document.getElementById("play4");
fourPlayersGame.addEventListener("click", () => {
  nOfPlayers = 4;
  playerBox.style.display = "none";
  if (gameMode === "pvp") {
    roundBox.style.display = "block";
  } else {
    runGame(nOfPlayers, gameMode, maxRounds);
  }
});

// Round selection (only for PvP)
const rounds3Btn = document.getElementById("rounds3");
const rounds5Btn = document.getElementById("rounds5");

rounds3Btn.addEventListener("click", () => {
  maxRounds = 3;
  runGame(nOfPlayers, gameMode, maxRounds);
  roundBox.style.display = "none";
});

rounds5Btn.addEventListener("click", () => {
  maxRounds = 5;
  runGame(nOfPlayers, gameMode, maxRounds);
  roundBox.style.display = "none";
});
