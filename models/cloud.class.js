/**
 * Wolke im Hintergrund, bewegt sich langsam nach links (Parallax-Effekt).
 */
class Cloud extends MovableObject {

          y = 30;
          width = 500;
          height = 350;


    /**
     * Erstellt eine Wolke nahe der übergebenen x-Position.
     * @param {number} x - Basis-x-Position der Wolke.
     */
    constructor(x){
        super().loadImage('img/5_background/layers/4_clouds/1.png');

        this.x = x + Math.random() * 300;
        this.animate();


    }


    /**
     * Startet die Bewegung der Wolke nach links.
     */
    animate() {

        this.moveLeft();

    }


    /**
     * Bewegt die Wolke dauerhaft mit konstanter Geschwindigkeit nach links.
     */
    moveLeft(){
        setStoppableInterval ( ()  => {
        this.x -= 0.15;

        }, 1000 / 60);
    }
}
