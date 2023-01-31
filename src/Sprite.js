import Rect from './Rect.js';

export default class Sprite{
    constructor(x,y,fwd,speed){
        this.x = x;
        this.y = y;
        this.fwd = fwd;
        this.speed = speed;
    }

    move(dt=1/60,speedMultiplier){
        this.x += this.fwd.x * this.speed * dt *speedMultiplier;
        this.y += this.fwd.y * this.speed * dt *speedMultiplier;
    }

    getRect(){
        return new Rect(this.x,this.y,this.width,this.height)
    }

    //check if this sprite has collided with the most recent drawn path
    checkCollision(ctx){
        if(ctx.isPointInPath(this.x + 25,this.y + 25)){
            this.speed = 0;
            return true;
        }
        return false;
    }
}