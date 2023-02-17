import UI from "./UI.js";
import Particle from "./Particle.js";
import {
  Angler1,
  Angler2,
  Drone,
  HiveWhale,
  LuckyFish,
} from "./enemies/Enemies.js";
import { SmokeExplosion, FireExplosion } from "./Explosion.js";
import Player from "./Player.js";
import Background from "./Background.js";

export default class Game {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.background = new Background(this);
    this.players = [
      new Player(this, {
        x: 100,
        y: 200,
        playerSide: "left",
        playerKeys: {
          down: "s",
          left: "a",
          right: "d",
          up: "w",
          shoot: " ",
          debug: "f",
        },
        image: "player1",
      }),
      new Player(this, {
        x: 1000,
        y: 200,
        playerSide: "right",
        playerKeys: {
          up: "ArrowUp",
          down: "ArrowDown",
          left: "ArrowLeft",
          right: "ArrowRight",
          shoot: "Enter",
          debug: "Shift",
        },
        image: "player2",
      }),
    ];
    this.ui = new UI(this);
    this.enemies = []; //*Array of enemies
    this.particles = []; //*Currently pressed particles
    this.explosions = []; //*Array of explosions
    this.enemyTimer = 0;
    this.enemyInterval = 2000; //*2 seconds between enemies spawn
    this.ammo = 20;
    this.maxAmmo = 50;
    this.ammoTimer = 0;
    this.ammoInterval = 350;
    this.gameOver = false;
    this.winningScore = 100;
    this.gameTime = 0;
    this.timeLimit = 30000; //*5 seconds
    this.speed = 1;
    this.debug = false;
  }
  update(deltaTime) {
    //*Game time
    if (!this.gameOver) this.gameTime += deltaTime;
    //if (this.gameTime > this.timeLimit) this.gameOver = true;
    //?Handle background
    this.background.update();
    this.background.layer4.update();
    //?Handle ammo
    if (this.ammoTimer > this.ammoInterval) {
      if (this.ammo < this.maxAmmo) this.ammo++;
      this.ammoTimer = 0;
    } else this.ammoTimer += deltaTime;
    //?Handle particles
    this.particles.forEach((particle) => particle.update());
    this.particles = this.particles.filter(
      (particle) => !particle.markedForDeletion
    );
    //?Handle explosions
    this.explosions.forEach((explosion) => explosion.update(deltaTime));
    this.explosions = this.explosions.filter(
      (explosion) => !explosion.markedForDeletion
    );
    //*Handle collision between player projectiles
    this.players.forEach((player) => {
      player.projectiles.forEach((projectile) => {
        this.players
          .filter((p) => p !== player)
          .forEach((playerCol) => {
            if (this.checkCollision(projectile, playerCol)) {
              projectile.markedForDeletion = true;
              playerCol.lives--;
              player.score += Math.round(this.gameTime);
              this.particles.push(
                new Particle(
                  this,
                  playerCol.x + playerCol.width * 0.5,
                  playerCol.y + playerCol.height * 0.5
                )
              );
              if (playerCol.lives <= 0) {
                playerCol.markedForDeletion = true;
                this.addExplosion(playerCol);
                this.gameOver = true;
              }
            }
          });
      });
    });
    //?Handle player
    this.players.forEach((player) => player.update(deltaTime));
    // this.players = this.players.filter((player) => !player.markedForDeletion);
    //*Handle enemies
    // this.enemies.forEach((enemy) => {
    //   enemy.update();
    //   if (this.checkCollision(this.player, enemy)) {
    //     enemy.markedForDeletion = true;
    //     this.addExplosion(enemy);
    //     //?Particle when collision
    //     for (let i = 0; i < enemy.score; i++) {
    //       this.particles.push(
    //         new Particle(
    //           this,
    //           enemy.x + enemy.width * 0.5,
    //           enemy.y + enemy.height * 0.5
    //         )
    //       );
    //     }
    //     if (enemy.type === "lucky") this.player.enterPowerUp();
    //     else if (!this.gameOver) this.score--;
    //   }
    //   this.player.projectiles.forEach((projectile) => {
    //     if (this.checkCollision(projectile, enemy)) {
    //       projectile.markedForDeletion = true;
    //       enemy.lives--;
    //       this.particles.push(
    //         new Particle(
    //           this,
    //           enemy.x + enemy.width * 0.5,
    //           enemy.y + enemy.height * 0.5
    //         )
    //       );
    //       if (enemy.lives <= 0) {
    //         for (let i = 0; i < enemy.score; i++) {
    //           this.particles.push(
    //             new Particle(
    //               this,
    //               enemy.x + enemy.width * 0.5,
    //               enemy.y + enemy.height * 0.5
    //             )
    //           );
    //         }
    //         enemy.markedForDeletion = true;
    //         this.addExplosion(enemy);
    //         if (enemy.type === "hive") {
    //           for (let i = 0; i < 5; i++)
    //             this.enemies.push(
    //               new Drone(
    //                 this,
    //                 enemy.x + Math.random() * enemy.width,
    //                 enemy.y + Math.random() * enemy.height * 0.5
    //               )
    //             );
    //         }
    //         if (!this.gameOver) this.score += enemy.score;
    //       }
    //     }
    //   });
    // });
    // this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);
    // if (this.enemyTimer > this.enemyInterval && !this.gameOver) {
    //   this.addEnemy();
    //   this.enemyTimer = 0;
    // } else this.enemyTimer += deltaTime;
  }
  draw(context) {
    this.background.draw(context); //*Draw background behind everything
    this.ui.draw(context);
    //?Draw players
    this.players.forEach((player) => player.draw(context));
    //*Draw particles in front of everything
    this.particles.forEach((particle) => particle.draw(context));
    //*Draw enemies
    this.enemies.forEach((enemy) => enemy.draw(context));
    //*Draw explosions
    this.explosions.forEach((explosion) => explosion.draw(context));
    //*Draw foreground in front of everything
    this.background.layer4.draw(context);
  }
  addEnemy() {
    const randomize = Math.random();
    if (randomize < 0.3) this.enemies.push(new Angler1(this));
    if (randomize < 0.6) this.enemies.push(new Angler2(this));
    if (randomize < 0.7) this.enemies.push(new HiveWhale(this));
    else this.enemies.push(new LuckyFish(this));
  }
  addExplosion(enemy) {
    const randomize = Math.random();
    if (randomize < 0.5)
      this.explosions.push(
        new SmokeExplosion(
          this,
          enemy.x + enemy.width * 0.5,
          enemy.y + enemy.height * 0.5
        )
      );
    else
      this.explosions.push(
        new FireExplosion(
          this,
          enemy.x + enemy.width * 0.5,
          enemy.y + enemy.height * 0.5
        )
      );
  }
  checkCollision(rect1, rect2) {
    //*Check if two rectangles are colliding with corners
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }
}
