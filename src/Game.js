import UI from "./UI.js";
import Particle from "./Particle.js";
import TrailParticle from "./TrailParticle.js";
import AudioManager from "./AudioManager.js";
import PowerUp from "./PowerUp.js";
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
  constructor(width, height, nPlayers, gameMode = "pvp", maxRounds = 3) {
    this.width = width;
    this.height = height;
    this.gameMode = gameMode; // "pvp" or "coop"
    this.maxRounds = maxRounds;
    this.currentRound = 1;
    this.roundOver = false;
    this.roundTimer = 0;
    this.roundDelay = 3000; // 3 seconds between rounds
    this.background = new Background(this);
    this.playerConfigs = [
      {
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
      },
      {
        x: gameMode === "coop" ? 100 : 1000,
        y: gameMode === "coop" ? 500 : 200,
        playerSide: gameMode === "coop" ? "left" : "right",
        playerKeys: {
          up: "ArrowUp",
          down: "ArrowDown",
          left: "ArrowLeft",
          right: "ArrowRight",
          shoot: "Enter",
          debug: "Shift",
        },
        image: "player2",
      },
      {
        x: 100,
        y: 500,
        playerSide: "left",
        playerKeys: {
          up: "u",
          down: "j",
          left: "h",
          right: "k",
          shoot: "i",
          debug: "y",
        },
        image: "player3",
      },
      {
        x: 1000,
        y: 500,
        playerSide: "right",
        playerKeys: {
          up: "Numpad8",
          down: "Numpad5",
          left: "Numpad4",
          right: "Numpad6",
          shoot: "Numpad0",
          debug: "Numpad7",
        },
        image: "player4",
      },
    ].slice(0, nPlayers);
    this.players = this.playerConfigs.map(config => new Player(this, config));
    this.players.forEach(player => player.roundWins = 0);
    this.ui = new UI(this);
    this.audio = new AudioManager();
    this.enemies = []; //*Array of enemies
    this.particles = []; //*Currently pressed particles
    this.trailParticles = []; //*Trail particles
    this.explosions = []; //*Array of explosions
    this.powerUps = []; //*Array of power-ups
    this.enemyTimer = 0;
    this.enemyInterval = 2000; //*2 seconds between enemies spawn
    this.powerUpTimer = 0;
    this.powerUpInterval = 8000; //*8 seconds between power-up spawns
    this.gameOver = false;
    this.winningScore = 100;
    this.gameTime = 0;
    this.timeLimit = 30000; //*5 seconds
    this.speed = 1;
    this.debug = false;
    //*Screen shake
    this.shakeX = 0;
    this.shakeY = 0;
    this.shakeIntensity = 0;
    this.shakeDuration = 0;
  }
  update(deltaTime) {
    //*Game time
    if (!this.gameOver) this.gameTime += deltaTime;
    //if (this.gameTime > this.timeLimit) this.gameOver = true;
    //?Handle background
    this.background.update();
    // this.background.layer4.update();
    //?Handle particles
    this.particles.forEach((particle) => particle.update());
    this.particles = this.particles.filter(
      (particle) => !particle.markedForDeletion
    );
    //?Handle trail particles
    this.trailParticles.forEach((particle) => particle.update(deltaTime));
    this.trailParticles = this.trailParticles.filter(
      (particle) => !particle.markedForDeletion
    );
    //?Handle explosions
    this.explosions.forEach((explosion) => explosion.update(deltaTime));
    this.explosions = this.explosions.filter(
      (explosion) => !explosion.markedForDeletion
    );
    //?Handle power-ups
    this.powerUps.forEach((powerUp) => powerUp.update(deltaTime));
    this.powerUps = this.powerUps.filter(
      (powerUp) => !powerUp.markedForDeletion
    );
    //*Handle collision between player projectiles
    this.players.forEach((player) => {
      player.projectiles.forEach((projectile) => {
        this.players
          .filter((p) => p !== player)
          .forEach((playerCol) => {
            if (this.checkCollision(projectile, playerCol)) {
              projectile.markedForDeletion = true;
              if (playerCol.takeDamage()) {
                this.audio.playHit();
                this.screenShake(5, 200);
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
                  this.audio.playExplosion();
                  this.screenShake(15, 500);
                  if(this.players.filter(player => player.lives > 0).length === 1 && !this.roundOver) {
                    this.endRound();
                  }
                }
              }
            }
          });
      });
    });
    
    //*Handle round timer and reset
    if (this.roundOver) {
      this.roundTimer += deltaTime;
      if (this.roundTimer >= this.roundDelay) {
        this.nextRound();
      }
    }
    
    //*Handle screen shake
    if (this.shakeDuration > 0) {
      this.shakeDuration -= deltaTime;
      this.shakeX = (Math.random() - 0.5) * this.shakeIntensity;
      this.shakeY = (Math.random() - 0.5) * this.shakeIntensity;
      
      // Reduce intensity over time
      this.shakeIntensity *= 0.95;
      
      if (this.shakeDuration <= 0) {
        this.shakeX = 0;
        this.shakeY = 0;
        this.shakeIntensity = 0;
      }
    }
    
    //?Handle player
    this.players.forEach((player) => player.update(deltaTime));
    
    //*Handle power-up collection
    this.powerUps.forEach((powerUp) => {
      this.players.forEach((player) => {
        if (this.checkCollision(player, powerUp) && !player.markedForDeletion) {
          powerUp.activate(player);
        }
      });
    });
    
    //*Spawn power-ups randomly
    if (this.powerUpTimer > this.powerUpInterval && !this.gameOver && !this.roundOver) {
      this.addPowerUp();
      this.powerUpTimer = 0;
    } else this.powerUpTimer += deltaTime;
    
    // this.players = this.players.filter((player) => !player.markedForDeletion);
    
    //*Handle enemies (only in coop mode)
    if (this.gameMode === "coop") {
      this.enemies.forEach((enemy) => {
        enemy.update();
        //*Check collision with all players
        this.players.forEach((player) => {
          if (this.checkCollision(player, enemy)) {
            enemy.markedForDeletion = true;
            this.addExplosion(enemy);
            this.audio.playExplosion();
            this.screenShake(8, 250);
            //?Particle when collision
            for (let i = 0; i < enemy.score; i++) {
              this.particles.push(
                new Particle(
                  this,
                  enemy.x + enemy.width * 0.5,
                  enemy.y + enemy.height * 0.5
                )
              );
            }
            if (enemy.type === "lucky") player.enterPowerUp();
            else {
              if (player.takeDamage()) {
                this.audio.playHit();
                this.screenShake(5, 200);
                if (player.lives <= 0) {
                  player.markedForDeletion = true;
                  this.addExplosion(player);
                  if (this.players.filter(p => p.lives > 0).length === 0) {
                    this.gameOver = true;
                  }
                }
              }
            }
          }
          //*Check projectile collision
          player.projectiles.forEach((projectile) => {
            if (this.checkCollision(projectile, enemy)) {
              projectile.markedForDeletion = true;
              enemy.lives--;
              this.audio.playHit();
              this.particles.push(
                new Particle(
                  this,
                  enemy.x + enemy.width * 0.5,
                  enemy.y + enemy.height * 0.5
                )
              );
              if (enemy.lives <= 0) {
                for (let i = 0; i < enemy.score; i++) {
                  this.particles.push(
                    new Particle(
                      this,
                      enemy.x + enemy.width * 0.5,
                      enemy.y + enemy.height * 0.5
                    )
                  );
                }
                enemy.markedForDeletion = true;
                this.addExplosion(enemy);
                this.audio.playExplosion();
                this.screenShake(10, 300);
                if (enemy.type === "hive") {
                  for (let i = 0; i < 5; i++)
                    this.enemies.push(
                      new Drone(
                        this,
                        enemy.x + Math.random() * enemy.width,
                        enemy.y + Math.random() * enemy.height * 0.5
                      )
                    );
                }
                if (!this.gameOver) player.score += enemy.score;
              }
            }
          });
        });
      });
      this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);
      if (this.enemyTimer > this.enemyInterval && !this.gameOver) {
        this.addEnemy();
        this.enemyTimer = 0;
      } else this.enemyTimer += deltaTime;
    }
  }
  draw(context) {
    context.save();
    // Apply screen shake
    context.translate(this.shakeX, this.shakeY);
    
    this.background.draw(context); //*Draw background behind everything
    this.ui.draw(context);
    //?Draw players
    this.players.forEach((player) => player.draw(context));
    //*Draw trail particles
    this.trailParticles.forEach((particle) => particle.draw(context));
    //*Draw particles in front of everything
    this.particles.forEach((particle) => particle.draw(context));
    //*Draw power-ups
    this.powerUps.forEach((powerUp) => powerUp.draw(context));
    //*Draw enemies
    this.enemies.forEach((enemy) => enemy.draw(context));
    //*Draw explosions
    this.explosions.forEach((explosion) => explosion.draw(context));
    //*Draw foreground in front of everything
    // this.background.layer4.draw(context);
    
    context.restore();
  }
  addEnemy() {
    const randomize = Math.random();
    if (randomize < 0.3) this.enemies.push(new Angler1(this));
    if (randomize < 0.6) this.enemies.push(new Angler2(this));
    if (randomize < 0.7) this.enemies.push(new HiveWhale(this));
    else this.enemies.push(new LuckyFish(this));
  }
  addPowerUp() {
    // Limit to 3 power-ups on screen at once
    if (this.powerUps.length < 3) {
      this.powerUps.push(new PowerUp(this));
    }
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
  endRound() {
    if (this.gameMode === "pvp") {
      this.roundOver = true;
      let winner = this.players.find(player => player.lives > 0);
      if (winner) {
        winner.roundWins++;
        this.audio.playRoundWin();
        // Check if someone won the match
        const winsNeeded = Math.ceil(this.maxRounds / 2);
        if (winner.roundWins >= winsNeeded) {
          this.gameOver = true;
          this.audio.playGameOver();
        }
      }
    } else if (this.gameMode === "coop") {
      if (this.players.filter(p => p.lives > 0).length === 0) {
        this.gameOver = true;
        this.audio.playGameOver();
      }
    }
  }
  screenShake(intensity, duration) {
    this.shakeIntensity = intensity;
    this.shakeDuration = duration;
  }
  nextRound() {
    if (!this.gameOver) {
      this.currentRound++;
      this.roundOver = false;
      this.roundTimer = 0;
      
      // Store round wins before recreating players
      const roundWinsCopy = this.players.map(p => p.roundWins || 0);
      
      // Recreate players
      this.players = this.playerConfigs.map(config => new Player(this, config));
      
      // Restore round wins
      this.players.forEach((player, index) => {
        player.roundWins = roundWinsCopy[index];
      });
      
      // Clear game state
      this.particles = [];
      this.trailParticles = [];
      this.explosions = [];
      this.powerUps = [];
      this.enemies = [];
      this.powerUpTimer = 0;
      this.enemyTimer = 0;
    }
  }
}
