export default class PowerUp {
  constructor(game, type = null) {
    this.game = game;
    this.types = ['health', 'speed', 'rapidfire', 'shield'];
    this.type = type || this.types[Math.floor(Math.random() * this.types.length)];
    
    // Spawn position
    this.width = 50;
    this.height = 50;
    this.x = Math.random() * (this.game.width - this.width * 2) + this.width;
    this.y = Math.random() * (this.game.height - this.height * 2) + this.height;
    
    // Animation
    this.frameX = 0;
    this.maxFrame = 20;
    this.animationTimer = 0;
    this.animationInterval = 50;
    this.floatOffset = 0;
    this.floatSpeed = 0.05;
    
    this.markedForDeletion = false;
    this.lifespan = 0;
    this.maxLifespan = 10000; // 10 seconds before despawn
    
    // Visual properties
    this.colors = {
      health: '#00ff00',
      speed: '#ffff00',
      rapidfire: '#ff6600',
      shield: '#00ccff'
    };
    this.color = this.colors[this.type];
    this.glowIntensity = 0;
  }
  
  update(deltaTime) {
    // Floating animation
    this.floatOffset = Math.sin(this.floatSpeed * this.lifespan * 0.01) * 10;
    
    // Glow pulse
    this.glowIntensity = (Math.sin(this.lifespan * 0.01) + 1) * 0.5;
    
    // Frame animation
    this.animationTimer += deltaTime;
    if (this.animationTimer > this.animationInterval) {
      this.frameX = (this.frameX + 1) % this.maxFrame;
      this.animationTimer = 0;
    }
    
    // Lifespan
    this.lifespan += deltaTime;
    if (this.lifespan >= this.maxLifespan) {
      this.markedForDeletion = true;
    }
  }
  
  draw(context) {
    context.save();
    
    const drawY = this.y + this.floatOffset;
    
    // Outer glow
    const glowRadius = this.width * 0.8;
    const gradient = context.createRadialGradient(
      this.x + this.width / 2,
      drawY + this.height / 2,
      0,
      this.x + this.width / 2,
      drawY + this.height / 2,
      glowRadius
    );
    gradient.addColorStop(0, this.color + '88');
    gradient.addColorStop(1, this.color + '00');
    
    context.fillStyle = gradient;
    context.fillRect(
      this.x - glowRadius / 2 + this.width / 2,
      drawY - glowRadius / 2 + this.height / 2,
      glowRadius,
      glowRadius
    );
    
    // Power-up icon background
    context.fillStyle = this.color;
    context.globalAlpha = 0.3;
    context.beginPath();
    context.arc(
      this.x + this.width / 2,
      drawY + this.height / 2,
      this.width / 2,
      0,
      Math.PI * 2
    );
    context.fill();
    
    // Power-up icon
    context.globalAlpha = 1;
    context.fillStyle = this.color;
    context.strokeStyle = '#ffffff';
    context.lineWidth = 3;
    context.font = 'bold 30px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    const centerX = this.x + this.width / 2;
    const centerY = drawY + this.height / 2;
    
    // Draw icon based on type
    switch(this.type) {
      case 'health':
        // Draw a heart or cross
        context.fillText('❤', centerX, centerY);
        break;
      case 'speed':
        // Draw lightning bolt
        context.fillText('⚡', centerX, centerY);
        break;
      case 'rapidfire':
        // Draw bullets
        context.fillText('🔥', centerX, centerY);
        break;
      case 'shield':
        // Draw shield
        context.fillText('🛡', centerX, centerY);
        break;
    }
    
    // Rotating border
    context.strokeStyle = this.color;
    context.lineWidth = 2;
    context.beginPath();
    const rotation = this.lifespan * 0.005;
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 / 8) * i + rotation;
      const x = centerX + Math.cos(angle) * (this.width / 2 + 5);
      const y = centerY + Math.sin(angle) * (this.height / 2 + 5);
      if (i === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.closePath();
    context.stroke();
    
    // Debug hitbox
    if (this.game.debug) {
      context.strokeStyle = 'red';
      context.strokeRect(this.x, drawY, this.width, this.height);
    }
    
    context.restore();
  }
  
  activate(player) {
    switch(this.type) {
      case 'health':
        if (player.lives < player.maxLives) {
          player.lives++;
          this.game.audio.playPowerUp();
        }
        break;
      case 'speed':
        player.activateSpeedBoost();
        this.game.audio.playPowerUp();
        break;
      case 'rapidfire':
        player.activateRapidFire();
        this.game.audio.playPowerUp();
        break;
      case 'shield':
        player.activateShield();
        this.game.audio.playPowerUp();
        break;
    }
    this.markedForDeletion = true;
  }
}
