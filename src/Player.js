import Projectile from "./Projectile.js";
import InputHandler from "./InputHandler.js";
import TrailParticle from "./TrailParticle.js";

export default class Player {
  constructor(game, playerData) {
    this.game = game;
    this.playerData = playerData;
    this.playerKeys = this.playerData.playerKeys;
    this.input = new InputHandler(this.game, this, this.playerData.playerKeys);
    this.playerSide = this.playerData.playerSide;
    // Images naturally face LEFT
    // PvP: only right-side player flips to face center
    // Co-op: only player 2 flips to face right
    this.needsFlip = (this.game.gameMode === "pvp" && this.playerSide === "right") || 
                     (this.game.gameMode === "coop" && this.playerData.image === "player2");
    this.lives = 3;
    this.maxLives = 5;
    this.markedForDeletion = false;
    this.score = 0;
    this.roundWins = 0;
    //* Ammo system
    this.ammo = 20;
    this.maxAmmo = 50;
    this.ammoTimer = 0;
    this.ammoInterval = 350;
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
    //* Invincibility and damage flash
    this.invincible = false;
    this.invincibilityTimer = 0;
    this.invincibilityDuration = 1500; // 1.5 seconds
    this.damageFlashTimer = 0;
    this.damageFlashDuration = 200; // 0.2 seconds
    //* Trail particles
    this.trailTimer = 0;
    this.trailInterval = 30; // Create trail every 30ms
    //* Power-ups
    this.speedBoost = false;
    this.speedBoostTimer = 0;
    this.speedBoostDuration = 5000; // 5 seconds
    this.rapidFire = false;
    this.rapidFireTimer = 0;
    this.rapidFireDuration = 5000;
    this.shield = false;
    this.shieldTimer = 0;
    this.shieldDuration = 8000; // 8 seconds
    this.originalMaxSpeed = this.maxSpeed;
  }
  update(deltaTime) {
    //*Handle speed boost
    if (this.speedBoost) {
      this.speedBoostTimer += deltaTime;
      this.maxSpeed = this.originalMaxSpeed * 1.8;
      if (this.speedBoostTimer >= this.speedBoostDuration) {
        this.speedBoost = false;
        this.speedBoostTimer = 0;
        this.maxSpeed = this.originalMaxSpeed;
      }
    }
    //*Handle rapid fire
    if (this.rapidFire) {
      this.rapidFireTimer += deltaTime;
      if (this.rapidFireTimer >= this.rapidFireDuration) {
        this.rapidFire = false;
        this.rapidFireTimer = 0;
      }
    }
    //*Handle shield
    if (this.shield) {
      this.shieldTimer += deltaTime;
      if (this.shieldTimer >= this.shieldDuration) {
        this.shield = false;
        this.shieldTimer = 0;
      }
    }
    //*Handle input Y edge
    if (this.keys.includes(this.playerKeys.up)) this.speedY = -this.maxSpeed;
    else if (this.keys.includes(this.playerKeys.down))
      this.speedY = this.maxSpeed;
    else this.speedY = 0;
    this.y += this.speedY;
    //*Handle ammo recharge
    if (this.ammoTimer > this.ammoInterval) {
      if (this.ammo < this.maxAmmo) this.ammo++;
      this.ammoTimer = 0;
    } else this.ammoTimer += deltaTime;
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
    // In PvP: players are split left/right. In Co-op: all players on left side
    const effectiveSide = (this.game.gameMode === "coop") ? "left" : this.playerSide;
    
    if (effectiveSide === "left") {
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
        this.ammo += 0.1;
      }
    }
    //?Handle invincibility frames
    if (this.invincible) {
      this.invincibilityTimer += deltaTime;
      if (this.invincibilityTimer >= this.invincibilityDuration) {
        this.invincible = false;
        this.invincibilityTimer = 0;
      }
    }
    //?Handle damage flash
    if (this.damageFlashTimer > 0) {
      this.damageFlashTimer -= deltaTime;
      if (this.damageFlashTimer < 0) this.damageFlashTimer = 0;
    }
    //?Handle trail particles
    if (Math.abs(this.speedY) > 0 || this.keys.includes(this.playerKeys.left) || this.keys.includes(this.playerKeys.right)) {
      this.trailTimer += deltaTime;
      if (this.trailTimer >= this.trailInterval) {
        // Get player color from image id
        let color = '#00d9ff'; // default cyan
        if (this.playerData.image === 'player1') color = '#ffd700'; // yellow
        else if (this.playerData.image === 'player2') color = '#00d9ff'; // cyan
        else if (this.playerData.image === 'player3') color = '#ff3366'; // red
        else if (this.playerData.image === 'player4') color = '#ff69b4'; // pink
        
        this.game.trailParticles.push(
          new TrailParticle(
            this.game,
            this.x + this.width * 0.5,
            this.y + this.height * 0.5,
            color
          )
        );
        this.trailTimer = 0;
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
    
    // Draw player sprite
    this.drawSprite(context);
    
    // Draw shield effect on top
    if (this.shield) {
      this.drawShield(context);
    }
  }
  
  drawSprite(context) {
    context.save();
    
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    
    context.translate(centerX, centerY);
    
    // Apply horizontal flip when needed
    if (this.needsFlip) {
      context.scale(-1, 1);
    }
    
    // Apply rotation
    context.rotate(this.angle);
    
    // Apply visual effects
    if (this.damageFlashTimer > 0) {
      context.globalCompositeOperation = 'lighter';
      context.globalAlpha = 0.7;
    }
    
    if (this.invincible) {
      context.globalAlpha = Math.abs(Math.sin(this.invincibilityTimer * 0.01)) * 0.5 + 0.5;
    }
    
    // Draw player centered
    context.drawImage(
      this.image,
      this.frameX * 347,
      this.frameY * 246,
      347,
      246,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    
    // Draw damage flash overlay
    if (this.damageFlashTimer > 0) {
      context.globalCompositeOperation = 'source-atop';
      context.fillStyle = '#ff3366';
      context.fillRect(
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
    }
    
    context.restore();
  }
  
  drawShield(context) {
    context.save();
    context.strokeStyle = '#00ccff';
    context.lineWidth = 3;
    context.globalAlpha = 0.6 + Math.sin(this.shieldTimer * 0.01) * 0.4;
    context.beginPath();
    context.arc(
      this.x + this.width / 2,
      this.y + this.height / 2,
      this.width * 0.7,
      0,
      Math.PI * 2
    );
    context.stroke();
    
    // Inner shield ring
    context.globalAlpha = 0.3;
    context.beginPath();
    context.arc(
      this.x + this.width / 2,
      this.y + this.height / 2,
      this.width * 0.6,
      0,
      Math.PI * 2
    );
    context.stroke();
    context.restore();
  }
  shootTop() {
    if (this.ammo > 0) {
      this.projectiles.push(
        new Projectile(this.game, this.x + 80, this.y + 30, this.playerSide)
      );
      this.ammo--;
      this.game.audio.playShoot();
      
      // Rapid fire shoots 2 extra projectiles
      if (this.rapidFire) {
        this.projectiles.push(
          new Projectile(this.game, this.x + 80, this.y + 10, this.playerSide)
        );
        this.projectiles.push(
          new Projectile(this.game, this.x + 80, this.y + 50, this.playerSide)
        );
      }
    }
    if (this.powerUp) this.shootBottom();
  }
  shootBottom() {
    if (this.ammo > 0) {
      this.projectiles.push(
        new Projectile(this.game, this.x + 80, this.y + 175)
      );
      this.ammo--;
    }
  }
  enterPowerUp() {
    this.powerUpTimer = 0;
    this.powerUp = true;
    this.game.audio.playPowerUp();
    if (this.ammo < this.maxAmmo) this.ammo = this.maxAmmo;
  }
  activateSpeedBoost() {
    this.speedBoost = true;
    this.speedBoostTimer = 0;
  }
  activateRapidFire() {
    this.rapidFire = true;
    this.rapidFireTimer = 0;
  }
  activateShield() {
    this.shield = true;
    this.shieldTimer = 0;
  }
  takeDamage() {
    // Shield blocks damage
    if (this.shield) {
      this.game.audio.playHit();
      return false;
    }
    
    if (!this.invincible) {
      this.lives--;
      this.invincible = true;
      this.invincibilityTimer = 0;
      this.damageFlashTimer = this.damageFlashDuration;
      return true; // Damage was taken
    }
    return false; // No damage (invincible)
  }
}
