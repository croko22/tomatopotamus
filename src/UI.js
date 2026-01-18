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
    
    //*Draw each player's UI section
    this.game.players.forEach(function (player, index) {
      const baseX = 50 + 375 * index;
      
      // Reset styles for each player
      context.fillStyle = this.color;
      context.font = `${this.fontSize}px ${this.fontFamily}`;
      
      // Player label with color indicator
      context.fillText(`PLAYER ${index + 1}`, baseX, 30);
      
      // Lives
      context.fillText(`Lives: ${player.lives}`, baseX, 55);
      
      // Round wins or score
      if (this.game.gameMode === "pvp") {
        context.fillText(`Rounds Won: ${player.roundWins}`, baseX, 80);
      } else {
        context.fillText(`Score: ${player.score}`, baseX, 80);
      }
      
      // Individual ammo bar for each player
      const barWidth = 180;
      const barHeight = 18;
      const barX = baseX;
      const barY = 100;
      
      // Ammo label
      context.fillStyle = this.color;
      context.font = `20px ${this.fontFamily}`;
      context.fillText(`AMMO: ${Math.floor(player.ammo)}`, barX, barY - 8);
      
      // Ammo bar background
      context.fillStyle = "rgba(0, 0, 0, 0.6)";
      context.fillRect(barX, barY, barWidth, barHeight);
      
      // Ammo bar fill
      const fillWidth = (player.ammo / player.maxAmmo) * barWidth;
      const gradient = context.createLinearGradient(barX, barY, barX + barWidth, barY);
      
      // Color based on player
      if (player.playerData.image === 'player1') {
        gradient.addColorStop(0, "#ffd700");
        gradient.addColorStop(1, "#ffaa00");
      } else if (player.playerData.image === 'player2') {
        gradient.addColorStop(0, "#00d9ff");
        gradient.addColorStop(1, "#0088ff");
      } else if (player.playerData.image === 'player3') {
        gradient.addColorStop(0, "#ff3366");
        gradient.addColorStop(1, "#cc0033");
      } else if (player.playerData.image === 'player4') {
        gradient.addColorStop(0, "#ff69b4");
        gradient.addColorStop(1, "#ff1493");
      }
      
      context.fillStyle = gradient;
      context.fillRect(barX, barY, fillWidth, barHeight);
      
      // Reload indicator (white pulse showing reload progress)
      if (player.ammo < player.maxAmmo) {
        const reloadProgress = player.ammoTimer / player.ammoInterval;
        context.fillStyle = "rgba(255, 255, 255, 0.6)";
        context.fillRect(barX + fillWidth, barY, (barWidth - fillWidth) * reloadProgress, barHeight);
      }
      
      // Ammo bar border with glow
      context.strokeStyle = "rgba(255, 255, 255, 0.8)";
      context.lineWidth = 2;
      context.strokeRect(barX, barY, barWidth, barHeight);
      
      // Add colored accent line at bottom of player section
      context.strokeStyle = gradient;
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(barX, barY + barHeight + 5);
      context.lineTo(barX + barWidth, barY + barHeight + 5);
      context.stroke();
      
    }, this);
    
    // Reset to default color
    context.fillStyle = this.color;
    
    //*Round indicator (PvP only)
    if (this.game.gameMode === "pvp" && !this.game.gameOver) {
      context.textAlign = "center";
      context.font = `35px ${this.fontFamily}`;
      context.fillText(
        `Round ${this.game.currentRound} / ${this.game.maxRounds}`,
        this.game.width / 2,
        50
      );
    }
    
    //*Round over message (not game over)
    if (this.game.roundOver && !this.game.gameOver) {
      context.textAlign = "center";
      let winner = this.game.players.find(player => player.lives > 0);
      if (winner) {
        let playerNumber = this.game.players.indexOf(winner) + 1;
        context.font = "50px " + this.fontFamily;
        context.fillText(
          `Player ${playerNumber} wins Round ${this.game.currentRound}!`,
          this.game.width / 2,
          this.game.height / 2 - 40
        );
        context.font = "30px " + this.fontFamily;
        context.fillText(
          `Next round starting...`,
          this.game.width / 2,
          this.game.height / 2 + 20
        );
      }
    }
    
    //!Game over message
    if (this.game.gameOver) {
      context.textAlign = "center";
      let messaje1, messaje2;

      if (this.game.gameMode === "pvp") {
        //*Draw the match winner message for PvP
        let winner = this.game.players.reduce((prev, current) => 
          (current.roundWins > prev.roundWins) ? current : prev
        );
        let playerNumber = this.game.players.indexOf(winner) + 1;
        messaje1 = "Player " + playerNumber + " wins the match!";
        messaje2 = "Rounds Won: " + winner.roundWins + " / " + this.game.maxRounds;
      } else if (this.game.gameMode === "coop") {
        //*Game over message for Co-op
        messaje1 = "Game Over!";
        let totalScore = this.game.players.reduce((sum, p) => sum + p.score, 0);
        messaje2 = "Team Score: " + totalScore;
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
