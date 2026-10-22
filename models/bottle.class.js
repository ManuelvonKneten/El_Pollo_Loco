/**
 * Flasche am Boden, die eingesammelt werden kann, um den Flaschenvorrat
 * zum Werfen zu erhöhen.
 */
class Bottle extends MovableObject {
    IMAGES_GROUND = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    width = 60;
    height = 70;
    y = 390;


    /**
     * Erstellt eine liegende Flasche mit zufälliger Grafik an der
     * angegebenen x-Position.
     * @param {number} x - x-Position der Flasche.
     */
    constructor(x) {
        super();
        this.x = x;
        let image = this.IMAGES_GROUND[Math.floor(Math.random() * this.IMAGES_GROUND.length)];
        this.loadImage(image);
    }
}
