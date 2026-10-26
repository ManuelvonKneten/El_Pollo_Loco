/**
 * Die Spielfigur Pepe. Steuert Bewegung, Sprung, Animationen und die
 * Kollisionsbox fürs Einsammeln von Coins und Flaschen.
 */
class Character extends MovableObject {

    height = 320;
    y = 120;
    speed = 5;
    energy = 100;
    offset = { top: 124, right: 35, bottom: 10, left: 35 };
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


    /**
     * Erstellt den Charakter, lädt alle Animationsbilder und startet
     * Schwerkraft sowie die laufende Animation/Steuerung.
     */
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


    /**
     * Startet zwei Intervalle: eines für Bewegung/Tastatursteuerung (60fps)
     * und eines für den Wechsel der Sprites je nach Zustand (Tod, Sprung,
     * Laufen, Idle, Schlafen).
     */
    animate(){
        this.animateMovement();
        this.animateSprite();
    }


    /**
     * Prüft bei jedem Tick Tod/Verletzung, verarbeitet die Tastatureingabe
     * und aktualisiert die Kameraposition.
     */
    animateMovement() {
        setStoppableInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
                return;
            }
            if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            }
            this.handleMovementInput();
            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);
    }


    /**
     * Verarbeitet Lauf-, Sprung- und Wurftasten.
     */
    handleMovementInput() {
        this.handleHorizontalMovement();
        this.handleJumpInput();
    }


    /**
     * Bewegt den Charakter nach links/rechts, sofern innerhalb der Levelgrenzen.
     */
    handleHorizontalMovement() {
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x && this.x < this.world.level.endboss.x) {
            this.moveRight();
            this.otherDirection = false;
            this.lastActionTime = new Date().getTime();
        }
        if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.otherDirection = true;
            this.lastActionTime = new Date().getTime();
        }
    }


    /**
     * Startet einen Sprung und merkt sich Flaschenwürfe als Aktivität
     * (für die Idle-/Sleep-Erkennung).
     */
    handleJumpInput() {
        if ((this.world.keyboard.UP || this.world.keyboard.SPACE) && !this.isAboveGround()) {
            this.jump();
            playSound('jump');
            this.lastActionTime = new Date().getTime();
        }
        if (this.world.keyboard.D) {
            this.lastActionTime = new Date().getTime();
        }
    }


    /**
     * Wechselt die Sprites je nach Zustand: Sprung, Laufen, Idle oder Schlafen.
     */
    animateSprite() {
        setStoppableInterval(() => {
            if (this.isDead()) {
                return;
            }
            if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);
            } else {
                this.playIdleOrWalkAnimation();
            }
        }, 50);
    }


    /**
     * Zeigt Lauf-, Idle- oder Sleep-Animation, je nachdem ob der Charakter
     * sich bewegt und wie lange die letzte Eingabe her ist.
     */
    playIdleOrWalkAnimation() {
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.playAnimation(this.IMAGES_WALKING);
        } else if (new Date().getTime() - this.lastActionTime >= 15000) {
            this.playAnimation(this.IMAGES_SLEEP);
        } else {
            this.playAnimation(this.IMAGES_IDLE);
        }
    }

}
