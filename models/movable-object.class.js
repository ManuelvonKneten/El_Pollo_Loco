/**
 * Basisklasse für alle beweglichen Objekte (Charakter, Gegner, Flaschen etc.).
 * Enthält Schwerkraft, Bewegung, Kollisionserkennung und Treffer-Logik.
 */
class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;
    dead = false;


    /**
     * Lässt das Objekt kontinuierlich fallen, solange es sich über dem Boden befindet
     * oder noch nach oben fliegt (z.B. nach einem Sprung).
     */
    applyGravity() {
        setStoppableInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
            }

        }, 1000 /25);
    }


    /**
     * Prüft, ob sich das Objekt über dem Boden befindet (z.B. während eines Sprungs).
     * @returns {boolean} true, wenn das Objekt in der Luft ist.
     */
    isAboveGround(){
       return this.y < 110;
    }


        /**
         * Prüft, ob dieses Objekt mit einem anderen Objekt (rechteckige Hitbox) kollidiert.
         * @param {DrawableObject} mo - Das andere Objekt.
         * @returns {boolean} true, wenn sich die Hitboxen überschneiden.
         */
        isColling(mo) {
        return this.x + this.width > mo.x &&
               this.y + this.height > mo.y &&
               this.x < mo.x + mo.width &&
               this.y < mo.y + mo.height;
    }


    /**
     * Zieht dem Objekt Energie ab und merkt sich den Zeitpunkt des Treffers.
     * @param {number} [damage=5] - Höhe des Schadens.
     */
    hit(damage = 5) {
        this.energy -= damage;
        if (this.energy < 0) {
            this.energy = 0;
        }
        this.lastHit = new Date().getTime();
    }


    /**
     * Prüft, ob das Objekt keine Energie mehr hat.
     * @returns {boolean} true, wenn die Energie 0 ist.
     */
    isDead() {
        return this.energy <= 0;
    }


    /**
     * Prüft, ob das Objekt gerade in der kurzen Unverwundbarkeitsphase nach einem Treffer ist.
     * @returns {boolean} true, wenn der letzte Treffer weniger als 2 Sekunden her ist.
     */
    isHurt() {
        let timePassed = (new Date().getTime() - this.lastHit) / 1000;
        return timePassed < 2;
    }


    /**
     * Bewegt das Objekt um seine Geschwindigkeit nach rechts.
     */
    moveRight() {
        this.x += this.speed;
    }


    /**
     * Bewegt das Objekt um seine Geschwindigkeit nach links.
     */
    moveLeft() {
        this.x -= this.speed;
    }


    /**
     * Startet einen Sprung, indem die vertikale Geschwindigkeit gesetzt wird.
     */
    jump(){
        this.speedY = 30;
    }

}
