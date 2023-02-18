import Projectile from "./Projectile.js";
import InputHandler from "./InputHandler.js";

export default class Player {
  constructor(game, playerData) {
    this.game = game;
    this.playerData = playerData;
    this.playerKeys = this.playerData.playerKeys;
    this.input = new InputHandler(this.game, this, this.playerData.playerKeys);
    this.playerSide = this.playerData.playerSide;
    this.lives = 3;
    this.markedForDeletion = false;
    this.score = 0;
    this.width = 170;
    this.height = 120;
    this.x = this.playerData.x;
    this.y = this.playerData.y;
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame = 36;
    this.speedY = 0;
    this.maxSpeed = 5;
    this.angle = 0;
    this.projectiles = [];
    this.keys = []; //*Currently pressed keys
    this.image = document.getElementById(playerData.image);
    this.powerUp = false;
    this.powerUpTimer = 0;
    this.powerUpLimit = 5000;
  }
  update(deltaTime) {
    //*Handle input Y edge
    if (this.keys.includes(this.playerKeys.up)) this.speedY = -this.maxSpeed;
    else if (this.keys.includes(this.playerKeys.down))
      this.speedY = this.maxSpeed;
    else this.speedY = 0;
    this.y += this.speedY;
    //*Handle input X edge
    if (this.keys.includes(this.playerKeys.left)) {
      this.x -= this.maxSpeed;
      this.angle = -0.3;
    } else if (this.keys.includes(this.playerKeys.right)) {
      this.x += this.maxSpeed;
      this.angle = 0.3;
    } else this.angle = 0;
    //*Handle boundaries Y edge
    if (this.y > this.game.height - this.height * 0.5)
      this.y = this.game.height - this.height * 0.5;
    else if (this.y < -this.height * 0.5) this.y = -this.height * 0.5;
    //*Handle boundaries X edge
    if (this.playerSide === "left") {
      if (this.x > this.game.width * 0.5 - this.width)
        this.x = this.game.width * 0.5 - this.width;
      else if (this.x < -this.width * 0.5) this.x = -this.width * 0.5;
    } else {
      if (this.x < this.game.width * 0.5 + this.width)
        this.x = this.game.width * 0.5 + this.width;
      else if (this.x > this.game.width - this.width * 0.5)
        this.x = this.game.width - this.width * 0.5;
    }
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
    //*Handle deletion
    if (this.markedForDeletion) {
      this.x = -1000;
      this.y = -1000;
    }
  }
  draw(context) {
    if (this.game.debug) {
      context.font = "20px Helvetica";
      context.fillText(this.lives, this.x, this.y);
      context.strokeRect(this.x, this.y, this.width, this.height);
    }
    //!Draw projectiles
    this.projectiles.forEach((projectile) => projectile.draw(context));
    // //?Hippo rotation
    context.save();
    context.translate(this.x + this.width / 2, this.y + this.height / 2);
    context.rotate(this.angle);
    context.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
    //*Draw player
    context.drawImage(
      this.image,
      this.frameX * 347,
      this.frameY * 246,
      347,
      246,
      this.x,
      this.y,
      this.width,
      this.height
    );
    context.restore();
  }
  shootTop() {
    if (this.game.ammo > 0) {
      this.projectiles.push(
        new Projectile(this.game, this.x + 80, this.y + 30, this.playerSide)
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
