/**
 * Smaller, faster variant of the normal chicken.
 */
class ChickenSmall extends MovableObject {
        y = 390;
        height = 50;
        width = 45;
        offset = { top: 4, right: 5, bottom: 5, left: 5 };
        IMAGE_DEAD = 'img/3_enemies_chicken/chicken_small/2_dead/dead.png';
        IMAGES_WALKING = [
            'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
            'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
            'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'

        ];
        currentImage = 0;


    /**
     * Creates a small chicken at a random position with a higher speed
     * than the normal chicken.
     */
    constructor(){
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages([this.IMAGE_DEAD]);

        this.x = 400 + Math.random() * 1800;
        this.speed = 0.25 + Math.random() * 0.35;
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
        }, 150);
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
