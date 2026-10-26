/**
 * Level's end boss. Patrols at first, attacks after the first contact
 * with the player, and is defeated by being hit with bottles.
 */
class Endboss extends MovableObject {
    height = 400;
    width = 250;
    y = 55;
    baseY = 55;
    speed = 3.5;
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
    flightAmplitude = 45;
    flightSpeed = 0.09;
    attackRange = 300;
    attackSpeed = 10;

    rageHealthThreshold = 30;
    firstContactAttackTriggered = false;
    rageTriggered = false;
    rageState = null;
    rageJumpHeight = 180;
    rageRiseSpeed = 20;
    rageFallSpeed = 25;
    rageDiveSpeed = 35;
    rageTargetX = 0;

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
     * Creates the endboss at the end of the level and loads all
     * animation images.
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
     * Makes the endboss gently bob up and down, as long as it isn't dead.
     */
    fly() {
        setStoppableInterval(() => {
            if (this.isDead() || this.rageState) {
                return;
            }
            this.flightPhase += this.flightSpeed;
            this.y = this.baseY + Math.sin(this.flightPhase) * this.flightAmplitude;
        }, 30);
    }


    /**
     * Drives the endboss's animation state: dead, patrol, alert, hurt,
     * attack, or walking - depending on the current state.
     */
    animate(){
        setStoppableInterval(() => {
            this.updateAnimationState();
        }, 130);
    }


    /**
     * Picks the matching animation depending on the state: dead/patrol/
     * alert first, then hurt, then attack or walking.
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
     * Handles death, patrol, rage attack, and the alert phase.
     * @returns {boolean} true if one of these states was active.
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
        this.checkFirstContactAttack();
        this.checkRageAttack();
        if (this.rageState) {
            return true;
        }
        return false;
    }


    /**
     * Triggers the same jump-and-dive attack as checkRageAttack once,
     * right after the alert phase on the very first encounter.
     */
    checkFirstContactAttack() {
        if (!this.firstContactAttackTriggered && !this.rageState) {
            this.firstContactAttackTriggered = true;
            this.startRageAttack();
        }
    }


    /**
     * Triggers a particularly hard frontal attack once the endboss's
     * energy drops to rageHealthThreshold% or below: a high jump, then a
     * very fast dive onto the player's position.
     */
    checkRageAttack() {
        if (!this.rageTriggered && !this.rageState && this.energy > 0 && this.energy <= this.rageHealthThreshold) {
            this.rageTriggered = true;
            this.startRageAttack();
        }
    }


    /**
     * Starts the rage attack: its own fast update interval independent
     * of the normal 200ms animation tick, so the jump and dive feel smooth.
     */
    startRageAttack() {
        this.rageState = 'rising';
        let rageInterval = setStoppableInterval(() => {
            this.updateRageAttack(rageInterval);
        }, 30);
    }


    /**
     * Moves the endboss through the two phases of the rage attack: first
     * jump high, target the player's position at the peak, then dive
     * down onto that position very fast.
     * @param {number} rageInterval - ID of the update interval (to stop it on landing).
     */
    updateRageAttack(rageInterval) {
        this.playAnimation(this.IMAGES_ATTACK);
        if (this.rageState === 'rising') {
            this.y -= this.rageRiseSpeed;
            if (this.y <= this.baseY - this.rageJumpHeight) {
                this.rageState = 'diving';
                this.rageTargetX = this.world.character.x + 5;
            }
            return;
        }
        this.faceCharacter();
        this.y = Math.min(this.baseY, this.y + this.rageFallSpeed);
        let dx = this.rageTargetX - this.x;
        this.x += Math.abs(dx) <= this.rageDiveSpeed ? dx : Math.sign(dx) * this.rageDiveSpeed;
        if (this.y >= this.baseY && this.x === this.rageTargetX) {
            this.landRageAttack(rageInterval);
        }
    }


    /**
     * Ends the rage attack and, if close enough to the player, deals a
     * heavy extra hit independent of the normal contact damage.
     * @param {number} rageInterval - ID of the update interval to stop.
     */
    landRageAttack(rageInterval) {
        clearInterval(rageInterval);
        this.rageState = null;
        this.y = this.baseY;
        this.flightPhase = 0;
        let character = this.world.character;
        if (Math.abs(this.x - character.x) < 120 && !character.isHurt()) {
            character.hit(30);
            playSound('playerHurt');
        }
    }


    /**
     * Attacks when the player is close enough (a fast attack sprint
     * towards the player), otherwise the endboss walks normally towards
     * the player. Always turns to face the player's actual position.
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
     * Turns the endboss to face the player's current position.
     */
    faceCharacter() {
        if (this.world) {
            this.otherDirection = this.x < this.world.character.x;
        }
    }


    /**
     * Rushes significantly faster towards the player while attacking,
     * but always stays on its own side of the player.
     */
    lungeTowardCharacter() {
        let character = this.world.character;
        let minX = character.x + 5;
        this.x = Math.max(minX, this.x - this.attackSpeed);
    }


    /**
     * Makes the endboss walk back and forth between two fixed x
     * positions, as long as it hasn't made contact with the player yet.
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
     * Checks whether the player is close enough for the endboss to attack.
     * @returns {boolean} true if the distance to the player is less than attackRange.
     */
    isAttacking() {
        return this.world && Math.abs(this.x - this.world.character.x) < this.attackRange;
    }


    /**
     * Plays the death animation and, on the first call, triggers the
     * sound and the delayed win screen.
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
