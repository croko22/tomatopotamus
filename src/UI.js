export default class UI {
  constructor(game) {
    this.game = game;
    this.fontSize = 25;
    this.fontFamily = "Bangers";
    this.color = "white";
  }
  draw(context) {
    //?Apply shadow effect just in the UI
    context.save();
    context.fillStyle = this.color;
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;
    context.shadowColor = "black";
    //*Score
    context.font = `${this.fontSize}px ${this.fontFamily}`;
    context.fillText("Score: " + this.game.score, 20, 40);
    //*Timer
    const formattedTime = (this.game.gameTime * 0.001).toFixed(1);
    context.fillText("Time: " + formattedTime, 20, 100);
    //!Game over message
    if (this.game.gameOver) {
      context.textAlign = "center";
      let messaje1, messaje2;
      if (this.game.score >= this.game.winningScore) {
        messaje1 = "You Win!";
        messaje2 = "Score: " + this.game.score;
      } else {
        messaje1 = "You Lose!";
        messaje2 = "Score: " + this.game.score;
      }
      context.font = "70px " + this.fontFamily;
      context.fillText(
        messaje1,
        this.game.width / 2,
        this.game.height / 2 - 20
      );
      context.font = "30px " + this.fontFamily;
      context.fillText(
        messaje2,
        this.game.width / 2,
        this.game.height / 2 + 20
      );
    }
    //*Ammo
    //if(this.game.player.powerUp) context.fillStyle = '#ffffbd';
    for (let i = 0; i < this.game.ammo; i++) {
      context.fillRect(20 + 5 * i, 50, 3, 20);
    }
    context.restore();
  }
}
