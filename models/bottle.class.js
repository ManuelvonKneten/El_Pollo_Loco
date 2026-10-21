class Bottle extends MovableObject {
    IMAGES_GROUND = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    width = 60;
    height = 70;
    y = 390;

    constructor(x) {
        super();
        this.x = x;
        let image = this.IMAGES_GROUND[Math.floor(Math.random() * this.IMAGES_GROUND.length)];
        this.loadImage(image);
    }
}
