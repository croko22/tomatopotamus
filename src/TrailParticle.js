export default class TrailParticle {
  constructor(game, x, y, color = '#00d9ff') {
    this.game = game;
    this.x = x;
    this.y = y;
    this.size = Math.random() * 5 + 3;
    this.speedX = (Math.random() - 0.5) * 2;
    this.speedY = (Math.random() - 0.5) * 2;
    this.markedForDeletion = false;
    this.lifeSpan = 0;
    this.maxLife = 300; // milliseconds
    this.color = color;
    this.alpha = 1;
  }
  
  update(deltaTime) {
    this.x += this.speedX;
    this.y += this.speedY;
    this.lifeSpan += deltaTime;
    
    // Fade out over time
    this.alpha = 1 - (this.lifeSpan / this.maxLife);
    this.size *= 0.97; // Shrink over time
    
    if (this.lifeSpan >= this.maxLife || this.size < 0.5) {
      this.markedForDeletion = true;
    }
  }
  
  draw(context) {
    context.save();
    context.globalAlpha = this.alpha;
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }
}
