/**
 * Cloud in the background, moves slowly to the left (parallax effect).
 */
class Cloud extends MovableObject {

          y = 30;
          width = 500;
          height = 350;


    /**
     * Creates a cloud near the given x position.
     * @param {number} x - Base x position of the cloud.
     */
    constructor(x){
        super().loadImage('img/5_background/layers/4_clouds/1.png');

        this.x = x + Math.random() * 300;
        this.animate();


    }


    /**
     * Starts the cloud's leftward movement.
     */
    animate() {

        this.moveLeft();

    }


    /**
     * Continuously moves the cloud to the left at a constant speed.
     */
    moveLeft(){
        setStoppableInterval ( ()  => {
        this.x -= 0.15;

        }, 1000 / 60);
    }
}
