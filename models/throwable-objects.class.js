class ThrowableObject extends MovableObject {
    IMAGES_ROTATION = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    IMAGES_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    width = 50;
    height = 60;
    groundY = 370;
    hasHit = false;
    splashStartTime = 0;

    constructor(x, y, otherDirection) {
        super();
        this.loadImage(this.IMAGES_ROTATION[0]);
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
        this.otherDirection = otherDirection;
        this.throw();
    }

    throw() {
        this.speedY = 30;
        this.speedX = this.otherDirection ? -20 : 20;

        this.flightInterval = setStoppableInterval(() => {
            if (this.hasHit) {
                return;
            }
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
            this.x += this.speedX;

            if (this.y >= this.groundY) {
                this.y = this.groundY;
                this.splash();
            }
        }, 25);

        this.rotationInterval = setStoppableInterval(() => {
            if (!this.hasHit) {
                this.playAnimation(this.IMAGES_ROTATION);
            }
        }, 100);
    }

    splash() {
        if (this.hasHit) {
            return;
        }
        this.hasHit = true;
        this.splashStartTime = Date.now();
        this.currentImage = 0;
        clearInterval(this.flightInterval);
        clearInterval(this.rotationInterval);

        let splashInterval = setStoppableInterval(() => {
            if (this.currentImage >= this.IMAGES_SPLASH.length) {
                clearInterval(splashInterval);
                return;
            }
            this.playAnimation(this.IMAGES_SPLASH);
        }, 60);
    }
}
