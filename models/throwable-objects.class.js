class ThrowableObject extends MovableObject {
    IMAGES_ROTATION = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    width = 50;
    height = 60;
    groundY = 370;

    constructor(x, y, otherDirection) {
        super();
        this.loadImage(this.IMAGES_ROTATION[0]);
        this.loadImages(this.IMAGES_ROTATION);
        this.x = x;
        this.y = y;
        this.otherDirection = otherDirection;
        this.throw();
    }

    throw() {
        this.speedY = 30;
        this.speedX = this.otherDirection ? -20 : 20;

        let flightInterval = setInterval(() => {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
            this.x += this.speedX;

            if (this.y >= this.groundY) {
                this.y = this.groundY;
                clearInterval(flightInterval);
                clearInterval(rotationInterval);
            }
        }, 25);

        let rotationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_ROTATION);
        }, 100);
    }
}
