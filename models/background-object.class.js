class BackgroundObject extends MovableObject {

    constructor(imagePath, x, y){
        super().loadImage(imagePath);
        this.x = x;
        this.y = y;

    }


}