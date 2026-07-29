class Cloud extends MovableObject {

          y = 30;
          width = 500;
          height = 350;

    constructor(){
        super().loadImage('img/5_background/layers/4_clouds/1.png');

        this.x = 120 + Math.random() * 500;
        this.animate();


    }

    animate() {
        setInterval ( ()  => {
        this.x -= 0.15;

        }, 1000 / 60);
    }

}

