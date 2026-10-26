/**
 * Collectible coin, animated by alternating between two images.
 */
class Coin extends MovableObject {
    IMAGES = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    width = 100;
    height = 100;
    offset = { top: 34, right: 34, bottom: 34, left: 34 };


    /**
     * Creates a coin at the given position.
     * @param {number} x - x position of the coin.
     * @param {number} y - y position of the coin.
     */
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.loadImage(this.IMAGES[0]);
        this.loadImages(this.IMAGES);
        this.animate();
    }


    /**
     * Plays the coin's animation continuously.
     */
    animate() {
        setStoppableInterval(() => {
            this.playAnimation(this.IMAGES);
        }, 300);
    }
}
