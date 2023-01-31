import Projectile from "./Projectile.js";

export default class Player {
  constructor(game) {
    this.game = game;
    this.width = 120;
    this.height = 190;
    this.x = 20;
    this.y = 100;
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame = 37;
    this.speedY = 0;
    this.maxSpeed = 3;
    this.projectiles = [];
    this.image = document.getElementById("player");
    this.powerUp = false;
    this.powerUpTimer = 0;
    this.powerUpLimit = 5000;
  }
  update(deltaTime) {
    //*Handle input Y edge
    if (this.game.keys.includes("ArrowUp")) this.speedY = -this.maxSpeed;
    else if (this.game.keys.includes("ArrowDown")) this.speedY = this.maxSpeed;
    else this.speedY = 0;
    this.y += this.speedY;
    //*Handle input X edge
    if (this.game.keys.includes("ArrowLeft")) this.x -= this.maxSpeed;
    else if (this.game.keys.includes("ArrowRight")) this.x += this.maxSpeed;
    //*Handle boundaries Y edge
    if (this.y > this.game.height - this.height * 0.5)
      this.y = this.game.height - this.height * 0.5;
    else if (this.y < -this.height * 0.5) this.y = -this.height * 0.5;
    //*Handle boundaries X edge
    if (this.x > this.game.width - this.width * 0.5)
      this.x = this.game.width - this.width * 0.5;
    else if (this.x < -this.width * 0.5) this.x = -this.width * 0.5;
    //*Handle projectiles
    this.projectiles.forEach((projectile) => projectile.update());
    this.projectiles = this.projectiles.filter(
      (projectile) => !projectile.markedForDeletion
    );
    //*Handle animation (LA HOSTIA)
    if (this.frameX < this.maxFrame) this.frameX++;
    else this.frameX = 0;
    //?Handle powerUp
    if (this.powerUp) {
      if (this.powerUpTimer > this.powerUpLimit) {
        this.powerUpTimer = 0;
        this.powerUp = false;
        this.frameY = 0;
      } else {
        this.powerUpTimer += deltaTime;
        this.frameY = 1;
        this.game.ammo += 0.1;
      }
    }
  }
  draw(context) {
    if (this.game.debug)
      context.strokeRect(this.x, this.y, this.width, this.height);
    //!Draw projectiles
    this.projectiles.forEach((projectile) => projectile.draw(context));
    context.drawImage(
      this.image,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
  shootTop() {
    if (this.game.ammo > 0) {
      this.projectiles.push(
        new Projectile(this.game, this.x + 80, this.y + 30)
      );
      this.game.ammo--;
    }
    if (this.powerUp) this.shootBottom();
  }
  shootBottom() {
    if (this.game.ammo > 0) {
      this.projectiles.push(
        new Projectile(this.game, this.x + 80, this.y + 175)
      );
      this.game.ammo--;
    }
  }
  enterPowerUp() {
    this.powerUpTimer = 0;
    this.powerUp = true;
    if (this.game.ammo < this.game.maxAmmo) this.game.ammo = this.game.maxAmmo;
  }
}
