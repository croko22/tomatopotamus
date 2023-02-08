export default class Projectile {
  constructor(game, x, y, playerSide) {
    this.game = game;
    this.playerSide = playerSide;
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 3;
    this.speed = 3;
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
    context.drawImage(this.image, this.x, this.y);
  }
}
