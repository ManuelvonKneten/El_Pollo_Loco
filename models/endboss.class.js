/**
 * Endgegner des Levels. Patrouilliert zunächst, greift nach dem ersten
 * Spielerkontakt an und wird über Flaschentreffer besiegt.
 */
class Endboss extends MovableObject {
    height = 400;
    width = 250;
    y = 55;
    baseY = 55;
    speed = 2;
    energy = 100;
    hadFirstContact = false;
    deadAnimationPlaying = false;
    world;
    offset = { top: 75, right: 9, bottom: 32, left: 24 };

    patrolLeftX = 2350;
    patrolRightX = 2650;
    patrolDirection = -1;
    alertUntil = 0;

    flightPhase = 0;
    flightAmplitude = 25;
    attackRange = 300;
    attackSpeed = 8;

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


    /**
     * Erstellt den Endboss am Ende des Levels und lädt alle Animationsbilder.
     */
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
        this.fly();
    }


    /**
     * Lässt den Endboss sanft auf und ab schweben, solange er nicht tot ist.
     */
    fly() {
        setStoppableInterval(() => {
            if (this.isDead()) {
                return;
            }
            this.flightPhase += 0.05;
            this.y = this.baseY + Math.sin(this.flightPhase) * this.flightAmplitude;
        }, 30);
    }


    /**
     * Steuert den Animationszustand des Endbosses: Tod, Patrouille, Alarm,
     * Verletzung, Angriff oder Laufen – je nach aktuellem Zustand.
     */
    animate(){
        setStoppableInterval(() => {
            this.updateAnimationState();
        }, 200);
    }


    /**
     * Wählt je nach Zustand die passende Animation: zuerst Tod/Patrouille/
     * Alarm, danach Verletzung, zuletzt Angriff oder Laufen.
     */
    updateAnimationState() {
        if (this.handleSpecialStates()) {
            return;
        }
        if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
            return;
        }
        this.walkOrAttack();
    }


    /**
     * Behandelt Tod, Patrouille und Alarm-Phase.
     * @returns {boolean} true, wenn einer dieser Zustände aktiv war.
     */
    handleSpecialStates() {
        if (this.isDead()) {
            this.playDeadAnimation();
            return true;
        }
        if (!this.hadFirstContact) {
            this.patrol();
            return true;
        }
        if (Date.now() < this.alertUntil) {
            this.playAnimation(this.IMAGES_ALERT);
            return true;
        }
        return false;
    }


    /**
     * Greift an, wenn der Charakter nah genug ist (schneller Angriffssprint
     * auf den Spieler zu), sonst läuft der Endboss normal Richtung Spieler.
     * Dreht sich dabei immer zur tatsächlichen Position des Spielers.
     */
    walkOrAttack() {
        this.faceCharacter();
        if (this.isAttacking()) {
            this.lungeTowardCharacter();
            this.playAnimation(this.IMAGES_ATTACK);
        } else {
            this.moveLeft();
            this.playAnimation(this.IMAGES_WALKING);
        }
    }


    /**
     * Dreht den Endboss so, dass er zur aktuellen Position des Spielers blickt.
     */
    faceCharacter() {
        if (this.world) {
            this.otherDirection = this.x < this.world.character.x;
        }
    }


    /**
     * Stürmt im Angriffsmodus deutlich schneller auf den Spieler zu, bleibt
     * dabei aber immer auf seiner Seite stehen.
     */
    lungeTowardCharacter() {
        let character = this.world.character;
        let minX = character.x + 5;
        this.x = Math.max(minX, this.x - this.attackSpeed);
    }


    /**
     * Lässt den Endboss zwischen zwei festen x-Positionen hin- und
     * herlaufen, solange noch kein Kontakt zum Spieler stattgefunden hat.
     */
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


    /**
     * Prüft, ob der Charakter nah genug ist, damit der Endboss angreift.
     * @returns {boolean} true, wenn der Abstand zum Charakter unter attackRange liegt.
     */
    isAttacking() {
        return this.world && Math.abs(this.x - this.world.character.x) < this.attackRange;
    }


    /**
     * Spielt die Todesanimation ab und löst beim ersten Aufruf Sound und
     * den verzögerten Gewinn-Screen aus.
     */
    playDeadAnimation() {
        this.playAnimation(this.IMAGES_DEAD);
        if (!this.deadAnimationPlaying) {
            this.deadAnimationPlaying = true;
            playSound('bossDead');
            setTimeout(() => gameWon(), 1200);
        }
    }
}
