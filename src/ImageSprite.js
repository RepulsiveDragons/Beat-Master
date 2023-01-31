import Sprite from './Sprite.js';

export default class ImageSprite extends Sprite{
    constructor(x,y,fwd,speed,width,height,image,type){
        super(x,y,fwd,speed);
        this.width = width;
        this.height = height;
        this.image = image;
        this.type = type;
    }

    draw(ctx,percent){
        ctx.save();
        ctx.drawImage(this.image,this.x,this.y,this.width*percent,this.height*percent);
        ctx.restore();
    }
}