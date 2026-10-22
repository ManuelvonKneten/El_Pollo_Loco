/**
 * Sammelbare Münze, die durch zwei abwechselnde Bilder animiert wird.
 */
class Coin extends MovableObject {
    IMAGES = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    width = 100;
    height = 100;


    /**
     * Erstellt eine Münze an der angegebenen Position.
     * @param {number} x - x-Position der Münze.
     * @param {number} y - y-Position der Münze.
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
     * Spielt die Münz-Animation dauerhaft ab.
     */
    animate() {
        setStoppableInterval(() => {
            this.playAnimation(this.IMAGES);
        }, 300);
    }
}
