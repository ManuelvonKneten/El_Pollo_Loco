class Cloud extends MovableObject {

          y = 30;
          width = 500;
          height = 350;

    constructor(x){
        super().loadImage('img/5_background/layers/4_clouds/1.png');

        this.x = x + Math.random() * 300;
        this.animate();


    }

    animate() {

        this.moveLeft();
        
    }
    moveLeft(){
        setInterval ( ()  => {
        this.x -= 0.15;

        }, 1000 / 60);
    }
}

