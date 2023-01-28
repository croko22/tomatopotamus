class Layer {
    constructor(game, image, speedModifier) {
        this.game = game;
        this.image = image;
        this.speedModifier = speedModifier;
        this.width = 1768;
        this.height = 500;
        this.x = 0;
        this.y = 0;
    }
    update(){
        if(this.x < -this.width) this.x = 0;
        this.x -= this.game.speed * this.speedModifier;
    }
    draw(context){
        context.drawImage(this.image, this.x, this.y);
        context.drawImage(this.image, this.x + this.width, this.y); //?Draws the image again to the right of the first one
    }
}
export default class Background {
    constructor(game){
        this.game = game;
        this.layers = [];
        this.layers.push(new Layer(this.game, document.getElementById('layer1'), 0.2));
        this.layers.push(new Layer(this.game, document.getElementById('layer2'), 0.4));
        this.layers.push(new Layer(this.game, document.getElementById('layer3'), 1));
        this.layer4 = new Layer(this.game, document.getElementById('layer4'), 1.5);
    }
    update(){
        this.layers.forEach(layer => layer.update());
    }
    draw(context){
        this.layers.forEach(layer => layer.draw(context));
    }
}