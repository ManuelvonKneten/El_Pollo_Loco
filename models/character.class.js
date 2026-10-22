class Character extends MovableObject {

    height = 320;
    y = 120;
    speed = 5;
    energy = 100;
    pickupTopPadding = 140;
    lastActionTime = 0;
    IMAGES_IDLE = [
            'img/2_character_pepe/1_idle/idle/I-1.png',
            'img/2_character_pepe/1_idle/idle/I-2.png',
            'img/2_character_pepe/1_idle/idle/I-3.png',
            'img/2_character_pepe/1_idle/idle/I-4.png',
            'img/2_character_pepe/1_idle/idle/I-5.png',
            'img/2_character_pepe/1_idle/idle/I-6.png',
            'img/2_character_pepe/1_idle/idle/I-7.png',
            'img/2_character_pepe/1_idle/idle/I-8.png',
            'img/2_character_pepe/1_idle/idle/I-9.png',
            'img/2_character_pepe/1_idle/idle/I-10.png'
        ];

    IMAGES_SLEEP = [
            'img/2_character_pepe/1_idle/long_idle/I-11.png',
            'img/2_character_pepe/1_idle/long_idle/I-12.png',
            'img/2_character_pepe/1_idle/long_idle/I-13.png',
            'img/2_character_pepe/1_idle/long_idle/I-14.png',
            'img/2_character_pepe/1_idle/long_idle/I-15.png',
            'img/2_character_pepe/1_idle/long_idle/I-16.png',
            'img/2_character_pepe/1_idle/long_idle/I-17.png',
            'img/2_character_pepe/1_idle/long_idle/I-18.png',
            'img/2_character_pepe/1_idle/long_idle/I-19.png',
            'img/2_character_pepe/1_idle/long_idle/I-20.png'
        ];

    IMAGES_WALKING = [
            'img/2_character_pepe/2_walk/W-21.png',
            'img/2_character_pepe/2_walk/W-22.png',
            'img/2_character_pepe/2_walk/W-23.png',
            'img/2_character_pepe/2_walk/W-24.png',
            'img/2_character_pepe/2_walk/W-25.png',
            'img/2_character_pepe/2_walk/W-26.png'
        ];

    IMAGES_JUMPING = [
            'img/2_character_pepe/3_jump/J-31.png',
            'img/2_character_pepe/3_jump/J-32.png',
            'img/2_character_pepe/3_jump/J-33.png',
            'img/2_character_pepe/3_jump/J-34.png',
            'img/2_character_pepe/3_jump/J-35.png',
            'img/2_character_pepe/3_jump/J-36.png',
            'img/2_character_pepe/3_jump/J-37.png',
            'img/2_character_pepe/3_jump/J-38.png',
            'img/2_character_pepe/3_jump/J-39.png'

        ];
        world;
        // walking_sound = new Audio('audio/running.mp3'); // sound muss noch runtergeladen werden

        IMAGES_DEAD = [
            'img/2_character_pepe/5_dead/D-51.png',
            'img/2_character_pepe/5_dead/D-52.png',
            'img/2_character_pepe/5_dead/D-53.png',
            'img/2_character_pepe/5_dead/D-54.png',
            'img/2_character_pepe/5_dead/D-55.png',
            'img/2_character_pepe/5_dead/D-56.png',
            'img/2_character_pepe/5_dead/D-57.png'
        ];

        IMAGES_HURT = [
            'img/2_character_pepe/4_hurt/H-41.png',
            'img/2_character_pepe/4_hurt/H-42.png',
            'img/2_character_pepe/4_hurt/H-43.png'
        ];


    constructor(){
        super();
        this.loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_SLEEP);

        this.lastActionTime = new Date().getTime();

        this.applyGravity();

        this.animate();
    }

    animate(){

        setStoppableInterval(() => {

            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
                return;
            }
            if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            }
            if(this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.otherDirection = false;
                this.lastActionTime = new Date().getTime();
                // this.waling_sound.play();
            }
            if(this.world.keyboard.LEFT && this.x > 0 ) {
                this.moveLeft();
                this.otherDirection = true;
                this.lastActionTime = new Date().getTime();
            // this.waling_sound.play();
            }

             if((this.world.keyboard.UP || this.world.keyboard.SPACE) && !this.isAboveGround()) {
                 this.jump();
                 playSound('jump');
                 this.lastActionTime = new Date().getTime();
            }

            if (this.world.keyboard.D) {
                this.lastActionTime = new Date().getTime();
            }

            this.world.camera_x = -this.x +100;
        }, 1000 / 60);


        setStoppableInterval(() => {

            if (this.isDead()) {
                return;
            }
            if(this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);
            } else {
                if(this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                    // Walk animation
                    this.playAnimation(this.IMAGES_WALKING);
                } else if (new Date().getTime() - this.lastActionTime >= 15000) {
                    // Sleep animation nach 15 Sekunden ohne Eingabe
                    this.playAnimation(this.IMAGES_SLEEP);
                } else {
                    // Idle animation
                    this.playAnimation(this.IMAGES_IDLE);
                }
            }
        }, 50);
    }

    isCollingPickup(obj) {
        let y = this.y + this.pickupTopPadding;
        let height = this.height - this.pickupTopPadding;
        return this.x + this.width > obj.x &&
               y + height > obj.y &&
               this.x < obj.x + obj.width &&
               y < obj.y + obj.height;
    }

}
