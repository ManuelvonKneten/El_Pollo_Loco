/**
 * Bottle lying on the ground that can be collected to increase the
 * throwable bottle supply.
 */
class Bottle extends MovableObject {
    IMAGES_GROUND = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    width = 60;
    height = 70;
    y = 390;
    offset = { top: 14, right: 11, bottom: 8, left: 27 };


    /**
     * Creates a bottle lying on the ground with a random graphic at the
     * given x position.
     * @param {number} x - x position of the bottle.
     */
    constructor(x) {
        super();
        this.x = x;
        let image = this.IMAGES_GROUND[Math.floor(Math.random() * this.IMAGES_GROUND.length)];
        this.loadImage(image);
    }
}
