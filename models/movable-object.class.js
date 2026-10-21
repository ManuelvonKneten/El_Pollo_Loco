class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;
    dead = false;


    applyGravity() {
        setStoppableInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
            }

        }, 1000 /25);
    }

    isAboveGround(){
       return this.y < 110;
    }

        //isCollading(chicken);
        isColling(mo) {
        return this.x + this.width > mo.x &&
               this.y + this.height > mo.y &&
               this.x < mo.x + mo.width &&
               this.y < mo.y + mo.height;
    }

    hit(damage = 5) {
        this.energy -= damage;
        if (this.energy < 0) {
            this.energy = 0;
        }
        this.lastHit = new Date().getTime();
    }

    isDead() {
        return this.energy <= 0;
    }

    isHurt() {
        let timePassed = (new Date().getTime() - this.lastHit) / 1000;
        return timePassed < 2;
    }

    moveRight() {
        this.x += this.speed;
    }

    moveLeft() {
        this.x -= this.speed;
    }
    jump(){
        this.speedY = 30;
    }

}
