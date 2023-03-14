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
    //*Lives
    context.textAlign = "left";
    //*Score
    context.font = `${this.fontSize}px ${this.fontFamily}`;
    this.game.players.forEach(function (player, index) {
      context.fillText(
        `P${index + 1} Lives: ` + player.lives,
        120 + 400 * index,
        60
      );
      context.fillText("Score: " + player.score, 120 + 400 * index, 30);
    });
    //*Timer
    // const formattedTime = (this.game.gameTime * 0.001).toFixed(1);
    // context.fillText("Time: " + formattedTime, 20, 100);
    //!Game over message
    if (this.game.gameOver) {
      context.textAlign = "center";
      let messaje1, messaje2;

      //*Draw the winner message
      let winner = this.game.players.filter((player) => player.lives > 0)[0];
      if(this.game.players.filter(player => player.lives > 0).length === 1) {
        messaje1 = winner.playerData.image + " wins!";
        messaje2 = "Score: " + winner.score;
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
    // for (let i = 0; i < this.game.ammo; i++) {
    //   context.fillRect(20 + 5 * i, 50, 3, 20);
    // }
    context.restore();
  }
}
