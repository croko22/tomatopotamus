import Enemy from "./Enemy.js";
class Angler1 extends Enemy {
    constructor(game){
        super(game); //?Calls the constructor of the parent class
        this.lives = 5;
        this.score = this.lives;
        this.width = 228;
        this.height = 169;
        this.y = Math.random() * (this.game.height * 0.95 - this.height);
        this.image = document.getElementById('angler1');
        this.frameY = Math.floor(Math.random() * 3); //? 3 Diferent animations
    }
}
class Angler2 extends Enemy {
    constructor(game){
        super(game); //?Calls the constructor of the parent class
        this.lives = 6;
        this.score = this.lives;
        this.width = 213;
        this.height = 165;
        this.y = Math.random() * (this.game.height * 0.95 - this.height);
        this.image = document.getElementById('angler2');
        this.frameY = Math.floor(Math.random() * 2);
    }
}
class LuckyFish extends Enemy {
    constructor(game){
        super(game); //?Calls the constructor of the parent class
        this.lives = 5;
        this.score = 15;
        this.width = 99;
        this.height = 95;
        this.y = Math.random() * (this.game.height * 0.95 - this.height);
        this.image = document.getElementById('lucky');
        this.frameY = Math.floor(Math.random() * 2);
        this.type = 'lucky'
    }
}
class HiveWhale extends Enemy {
    constructor(game){
        super(game); //?Calls the constructor of the parent class
        this.lives = 20;
        this.score = 20;
        this.width = 400;
        this.height = 227;
        this.y = Math.random() * (this.game.height * 0.95 - this.height);
        this.image = document.getElementById('hivewhale');
        this.frameY = 0;
        this.type = 'hive'
        this.speedX = Math.random() * -1.2 - 0.2;
    }
}
class Drone extends Enemy {
    constructor(game, x, y){
        super(game); //?Calls the constructor of the parent class
        this.lives = 3;
        this.score = 3;
        this.width = 115;
        this.height = 95;
        this.y = y;
        this.x = x;
        this.image = document.getElementById('drone');
        this.frameY = Math.floor(Math.random() * 2);
        this.type = 'drone'
        this.speedX = Math.random() * -4.2 - 0.5;
    }
}

export {Angler1, Angler2, LuckyFish, HiveWhale, Drone};