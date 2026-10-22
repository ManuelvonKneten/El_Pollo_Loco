/**
 * Kleinere, schnellere Variante des normalen Huhns.
 */
class ChickenSmall extends MovableObject {
        y = 390;
        height = 50;
        width = 45;
        IMAGE_DEAD = 'img/3_enemies_chicken/chicken_small/2_dead/dead.png';
        IMAGES_WALKING = [
            'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
            'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
            'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'

        ];
        currentImage = 0;


    /**
     * Erstellt ein kleines Huhn an einer zufälligen Position mit höherer
     * Geschwindigkeit als das normale Huhn.
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
     * Bewegt das Huhn kontinuierlich nach links und spielt die
     * Laufanimation ab, solange es nicht besiegt wurde.
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
     * Markiert das Huhn als besiegt, stoppt die Bewegung und zeigt das
     * Tod-Bild an.
     */
    die() {
        this.dead = true;
        this.speed = 0;
        this.img = this.imageCache[this.IMAGE_DEAD];
    }
}
