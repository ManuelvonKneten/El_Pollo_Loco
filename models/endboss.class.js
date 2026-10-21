class Endboss extends MovableObject {
    height = 400;
    width = 250;
    y = 55;
    speed = 2;
    energy = 100;
    hadFirstContact = false;
    deadAnimationPlaying = false;
    world;

    patrolLeftX = 2350;
    patrolRightX = 2650;
    patrolDirection = -1;
    alertUntil = 0;

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];


    constructor(){
        super();
        this.loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);

        this.x = 2500;
        this.animate();
    }

    animate(){
        setStoppableInterval(() => {
            if (this.isDead()) {
                this.playDeadAnimation();
                return;
            }
            if (!this.hadFirstContact) {
                this.patrol();
                return;
            }
            if (Date.now() < this.alertUntil) {
                this.playAnimation(this.IMAGES_ALERT);
                return;
            }
            if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
                return;
            }
            if (this.isAttacking()) {
                this.playAnimation(this.IMAGES_ATTACK);
            } else {
                this.moveLeft();
                this.otherDirection = false;
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }

    patrol() {
        if (this.x <= this.patrolLeftX) {
            this.patrolDirection = 1;
        } else if (this.x >= this.patrolRightX) {
            this.patrolDirection = -1;
        }
        if (this.patrolDirection === 1) {
            this.moveRight();
            this.otherDirection = true;
        } else {
            this.moveLeft();
            this.otherDirection = false;
        }
        this.playAnimation(this.IMAGES_WALKING);
    }

    isAttacking() {
        return this.world && Math.abs(this.x - this.world.character.x) < 150;
    }

    playDeadAnimation() {
        this.playAnimation(this.IMAGES_DEAD);
        if (!this.deadAnimationPlaying) {
            this.deadAnimationPlaying = true;
            playSound('bossDead');
            setTimeout(() => gameWon(), 1200);
        }
    }
}
