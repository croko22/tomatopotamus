export default class Projectile {
  constructor(game, x, y, playerSide) {
    this.game = game;
    this.playerSide = playerSide;
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 30;
    this.speed = 10;
    this.markedForDeletion = false;
    this.image = document.getElementById("projectile");
  }
  update() {
    if (this.playerSide === "right") this.x -= this.speed;
    else this.x += this.speed;
    if (this.x > this.game.width * 0.9 || this.x < this.game.width * 0.1)
      this.markedForDeletion = true;
  }
  draw(context) {
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}
