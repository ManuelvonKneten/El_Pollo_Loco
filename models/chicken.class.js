class Chicken extends MovableObject {
        y = 355;
        height = 70;
        width = 60;
        IMAGE_DEAD = 'img/3_enemies_chicken/chicken_normal/2_dead/dead.png';
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
        this.loadImages([this.IMAGE_DEAD]);

        this.x = 200 + Math.random() * 2000;
        this.speed = 0.15 + Math.random() * 0.25;
        this.animate();
    }


    animate(){
        setStoppableInterval(() => {
            if (!this.dead) {
                this.moveLeft();
            }
        }, 1000 / 60);

        setStoppableInterval(() => {
            if (!this.dead) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }

    die() {
        this.dead = true;
        this.speed = 0;
        this.img = this.imageCache[this.IMAGE_DEAD];
    }
}
