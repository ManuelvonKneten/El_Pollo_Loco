/**
 * Normal enemy that moves left on its own and can be defeated by a
 * jump attack or a thrown bottle.
 */
class Chicken extends MovableObject {
        y = 355;
        height = 70;
        width = 60;
        offset = { top: 4, right: 2, bottom: 7, left: 1 };
        IMAGE_DEAD = 'img/3_enemies_chicken/chicken_normal/2_dead/dead.png';
        IMAGES_WALKING = [
            'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
            'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
            'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'

        ];
        currentImage = 0;


    /**
     * Creates a chicken at a random position with a random speed and
     * starts the walking animation.
     */
    constructor(){
        super();
        this.loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages([this.IMAGE_DEAD]);

        this.x = 400 + Math.random() * 1800;
        this.speed = 0.15 + Math.random() * 0.25;
        this.animate();
    }


    /**
     * Continuously moves the chicken to the left and plays the walking
     * animation as long as it hasn't been defeated.
     */
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


    /**
     * Marks the chicken as defeated, stops its movement and shows the
     * dead image.
     */
    die() {
        this.dead = true;
        this.speed = 0;
        this.img = this.imageCache[this.IMAGE_DEAD];
    }
}
