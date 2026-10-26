/**
 * Base class for all movable objects (character, enemies, bottles, etc.).
 * Handles gravity, movement, collision detection, and hit logic.
 */
class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;
    dead = false;
    offset = { top: 0, right: 0, bottom: 0, left: 0 };


    /**
     * Makes the object continuously fall as long as it's above the
     * ground or still rising (e.g. after a jump).
     */
    applyGravity() {
        setStoppableInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                this.speedY = 0;
            }
        }, 1000 /25);
    }


    /**
     * Checks whether the object is above the ground (e.g. during a jump).
     * @returns {boolean} true if the object is in the air.
     */
    isAboveGround(){
       return this.y < 110;
    }


        /**
         * Checks whether this object collides with another object. The
         * hitboxes are shrunk by their respective offsets so that
         * transparent sprite margins don't count as a hit.
         * @param {DrawableObject} mo - The other object.
         * @returns {boolean} true if the shrunk hitboxes overlap.
         */
        isColling(mo) {
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
               this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
               this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
               this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
    }


    /**
     * Deducts energy from the object and remembers the time of the hit.
     * @param {number} [damage=5] - Amount of damage.
     */
    hit(damage = 5) {
        this.energy -= damage;
        if (this.energy < 0) {
            this.energy = 0;
        }
        this.lastHit = new Date().getTime();
    }


    /**
     * Checks whether the object has no energy left.
     * @returns {boolean} true if energy is 0.
     */
    isDead() {
        return this.energy <= 0;
    }


    /**
     * Checks whether the object is currently in the brief invulnerability
     * window after being hit.
     * @returns {boolean} true if the last hit was less than 2 seconds ago.
     */
    isHurt() {
        let timePassed = (new Date().getTime() - this.lastHit) / 1000;
        return timePassed < 2;
    }


    /**
     * Moves the object to the right by its speed.
     */
    moveRight() {
        this.x += this.speed;
    }


    /**
     * Moves the object to the left by its speed.
     */
    moveLeft() {
        this.x -= this.speed;
    }


    /**
     * Starts a jump by setting the vertical speed.
     */
    jump(){
        this.speedY = 25;
    }

}
