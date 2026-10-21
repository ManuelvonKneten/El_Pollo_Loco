class Coin extends MovableObject {
    IMAGES = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    width = 100;
    height = 100;

    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.loadImage(this.IMAGES[0]);
        this.loadImages(this.IMAGES);
        this.animate();
    }

    animate() {
        setStoppableInterval(() => {
            this.playAnimation(this.IMAGES);
        }, 300);
    }
}
