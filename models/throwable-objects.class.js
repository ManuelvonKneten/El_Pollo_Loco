/**
 * Thrown bottle. Flies in an arc, rotates in the air, and shows a splash
 * animation on impact (ground or enemy).
 */
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
    offset = { top: 9, right: 20, bottom: 8, left: 20 };


    /**
     * Creates a thrown bottle and immediately starts its flight path.
     * @param {number} x - Start x position (usually the character's position).
     * @param {number} y - Start y position.
     * @param {boolean} otherDirection - true if thrown to the left.
     */
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


    /**
     * Starts the throwing motion (flight arc with gravity) and the
     * bottle's rotation animation.
     */
    throw() {
        this.speedY = 30;
        this.speedX = this.otherDirection ? -20 : 20;
        this.startFlight();
        this.startRotation();
    }


    /**
     * Makes the bottle fly (gravity + horizontal movement) and triggers
     * the splash on ground contact.
     */
    startFlight() {
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
    }


    /**
     * Plays the rotation animation of the flying bottle.
     */
    startRotation() {
        this.rotationInterval = setStoppableInterval(() => {
            if (!this.hasHit) {
                this.playAnimation(this.IMAGES_ROTATION);
            }
        }, 100);
    }


    /**
     * Stops flight and rotation, marks the bottle as hit, and plays the
     * splash animation.
     */
    splash() {
        if (this.hasHit) {
            return;
        }
        this.hasHit = true;
        this.splashStartTime = Date.now();
        this.currentImage = 0;
        clearInterval(this.flightInterval);
        clearInterval(this.rotationInterval);
        this.startSplashAnimation();
    }


    /**
     * Plays the splash image sequence once in full and then stops the
     * interval.
     */
    startSplashAnimation() {
        let splashInterval = setStoppableInterval(() => {
            if (this.currentImage >= this.IMAGES_SPLASH.length) {
                clearInterval(splashInterval);
                return;
            }
            this.playAnimation(this.IMAGES_SPLASH);
        }, 60);
    }
}
