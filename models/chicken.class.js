class Chicken extends MovableObject {
        y = 355;
        height = 70;
        width = 60;
        IMAGES_WALKING = [
            'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
            'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
            'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
            
        ];
        currentImage = 0;

    constructor(){
        super();
        this.loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);

        this.x = 200 + Math.random() * 2000;
        this.speed = 0.15 + Math.random() * 0.25;
        this.animate();
    }


    animate(){

        this.moveLeft();

        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
    }, 200);
    }

}
