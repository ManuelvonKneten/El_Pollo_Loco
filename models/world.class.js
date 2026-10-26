/**
 * Central game world class: holds the character, level, and HUD, draws
 * every frame, and continuously checks collisions, bottle throws, and
 * endboss contact.
 */
class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    throwableObjects = [];
    coinsCollected = 0;
    bottlesAvailable = 0;
    gameEnded = false;
    lastThrowTime = 0;
    throwCooldown = 1000;

    statusBar;
    coinBar;
    bottleBar;
    endbossBar;


    /**
     * Creates the game world, sets up the HUD status bars, and starts
     * drawing as well as the ongoing game logic.
     * @param {HTMLCanvasElement} canvas - The game's canvas element.
     * @param {Keyboard} keyboard - Global keyboard state object.
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;

        this.statusBar = new StatusBar(STATUSBAR_IMAGES_HEALTH, 20, 0);
        this.coinBar = new StatusBar(STATUSBAR_IMAGES_COIN, 20, 32);
        this.bottleBar = new StatusBar(STATUSBAR_IMAGES_BOTTLE, 20, 64);
        this.endbossBar = new StatusBar(STATUSBAR_IMAGES_ENDBOSS, 500, 0);
        this.bottleBar.setPercentage(0);

        this.draw();
        this.setWorld();
        this.run();
    }


    /**
     * Links the character and endboss to this world, so both can access
     * the keyboard, level, and camera.
     */
    setWorld(){
        this.character.world = this;
        this.level.endboss.world = this;
    }


    /**
     * Central game loop (60fps): checks collisions, bottle throws,
     * endboss contact, and whether the character has died.
     */
    run() {
        setStoppableInterval(() => {
            if (this.gameEnded) {
                return;
            }
            this.checkCollisions();
            this.checkThrowObjects();
            this.checkEndbossContact();
            if (this.character.isDead()) {
                gameOver();
            }
        }, 1000 / 60);
    }


    /**
     * Triggers the alert animation the first time the boss zone is
     * reached, and then shows the endboss status bar.
     */
    checkEndbossContact() {
        if (!this.level.endboss.hadFirstContact && this.character.x > this.level.bossZoneX) {
            this.level.endboss.hadFirstContact = true;
            this.level.endboss.alertUntil = Date.now() + 1000;
            playSound('bossAlert');
        }
    }


    /**
     * Checks all collisions for a frame: collecting coins/bottles,
     * enemy contact (jump-kill or damage), and bottle hits.
     */
    checkCollisions() {
        this.checkCoinPickups();
        this.checkBottlePickups();
        this.checkEnemyContact();
        this.checkThrowableHits();
    }


    /**
     * Checks whether the character has reached a coin and collects it.
     */
    checkCoinPickups() {
        this.level.coins.forEach((coin) => {
            if (this.character.isColling(coin)) {
                this.collectCoin(coin);
            }
        });
    }


    /**
     * Checks whether the character has reached a bottle on the ground
     * and collects it.
     */
    checkBottlePickups() {
        this.level.bottles.forEach((bottle) => {
            if (this.character.isColling(bottle)) {
                this.collectBottle(bottle);
            }
        });
    }


    /**
     * Checks contact between the character and enemies: jumping on top
     * defeats the enemy, side contact hurts the character.
     */
    checkEnemyContact() {
        this.level.enemies.forEach((enemy) => {
            if (enemy.dead || enemy.rageState || !this.character.isColling(enemy)) {
                return;
            }
            if (this.isJumpedOnTop(enemy)) {
                this.defeatEnemyByJump(enemy);
            } else if (!this.character.isHurt()) {
                this.character.hit(enemy instanceof Endboss ? 15 : 5);
                playSound('playerHurt');
            }
        });
    }


    /**
     * Checks whether the character is falling onto the enemy from above
     * (never counts as a jump attack on the endboss). Uses the offset-
     * shrunk hitbox edges on both sides so the threshold doesn't become
     * nearly impossible for small, ground-hugging enemies (e.g.
     * ChickenSmall).
     * @param {MovableObject} enemy - The potential enemy.
     * @returns {boolean} true for a valid jump-kill.
     */
    isJumpedOnTop(enemy) {
        let character = this.character;
        let characterBottom = character.y + character.height - character.offset.bottom;
        let enemyTop = enemy.y + enemy.offset.top;
        let enemyBottom = enemy.y + enemy.height - enemy.offset.bottom;
        return !(enemy instanceof Endboss) &&
            character.speedY < 0 &&
            characterBottom < enemyTop + (enemyBottom - enemyTop) * 0.9;
    }


    /**
     * Checks whether thrown bottles hit an enemy, and removes bottles
     * whose splash animation has already finished.
     */
    checkThrowableHits() {
        this.throwableObjects.forEach((bottle) => {
            if (bottle.hasHit) {
                return;
            }
            this.level.enemies.forEach((enemy) => {
                if (!bottle.hasHit && !enemy.dead && bottle.isColling(enemy)) {
                    this.hitEnemyWithBottle(bottle, enemy);
                }
            });
        });

        this.throwableObjects = this.throwableObjects.filter(b => !b.hasHit || (Date.now() - b.splashStartTime < 400));
    }


    /**
     * Removes a collected coin from the level and updates the counter
     * and coin status bar.
     * @param {Coin} coin - The collected coin.
     */
    collectCoin(coin) {
        this.level.coins = this.level.coins.filter(c => c !== coin);
        this.coinsCollected++;
        this.coinBar.setPercentage(this.coinsCollected / this.level.totalCoins * 100);
        playSound('coin');
    }


    /**
     * Removes a collected bottle from the level and increases the
     * character's bottle supply.
     * @param {Bottle} bottle - The collected bottle.
     */
    collectBottle(bottle) {
        this.level.bottles = this.level.bottles.filter(b => b !== bottle);
        this.bottlesAvailable++;
        this.bottleBar.setPercentage(Math.min(100, this.bottlesAvailable / this.level.totalBottles * 100));
        playSound('bottleCollect');
    }


    /**
     * Defeats an enemy via a jump attack: the enemy dies, the character
     * gets a small bounce upward.
     * @param {MovableObject} enemy - The defeated enemy.
     */
    defeatEnemyByJump(enemy) {
        enemy.die();
        this.character.speedY = 20;
        playSound('enemyDead');
        setTimeout(() => {
            this.level.enemies = this.level.enemies.filter(e => e !== enemy);
        }, 800);
    }


    /**
     * Processes a bottle hit: makes the bottle splash and damages the
     * enemy (the endboss loses energy, normal enemies die instantly).
     * @param {ThrowableObject} bottle - The bottle that hit.
     * @param {MovableObject} enemy - The enemy that was hit.
     */
    hitEnemyWithBottle(bottle, enemy) {
        bottle.splash();
        playSound('bottleHit');

        if (enemy instanceof Endboss) {
            enemy.hit(20);
            playSound('bossHurt');
            this.endbossBar.setPercentage(enemy.energy);
        } else {
            enemy.die();
            playSound('enemyDead');
            setTimeout(() => {
                this.level.enemies = this.level.enemies.filter(e => e !== enemy);
            }, 800);
        }
    }


    /**
     * Spawns a new bottle on D key press, provided there's supply left
     * and the last throw was at least throwCooldown ms ago (so D can't
     * be spammed), and reduces the bottle supply by one.
     */
    checkThrowObjects() {
        let canThrow = Date.now() - this.lastThrowTime >= this.throwCooldown;
        if (this.keyboard.D && this.bottlesAvailable > 0 && canThrow) {
            this.lastThrowTime = Date.now();
            let spawnX = this.character.otherDirection ? this.character.x - 20 : this.character.x + 100;
            let bottle = new ThrowableObject(spawnX, this.character.y + 100, this.character.otherDirection);
            this.throwableObjects.push(bottle);
            this.bottlesAvailable--;
            this.bottleBar.setPercentage(Math.min(100, this.bottlesAvailable / this.level.totalBottles * 100));
        }
        this.keyboard.D = false;
    }


    /**
     * Draws a complete frame: background, game objects, HUD, and
     * schedules itself again for the next frame.
     */
    draw() {
        this.drawWorldObjects();
        this.drawHud();
        this.scheduleNextFrame();
    }


    /**
     * Draws the background, character, enemies, and collectibles within
     * the camera offset.
     */
    drawWorldObjects() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let cameraX = Math.round(this.camera_x);
        this.ctx.translate(cameraX, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.coins);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.throwableObjects);

        this.ctx.translate(-cameraX, 0);
    }


    /**
     * Draws the status bars and the HUD text, fixed on top of the game
     * regardless of scrolling.
     */
    drawHud() {
        this.statusBar.setPercentage(this.character.energy);
        this.addToMap(this.statusBar);
        this.addToMap(this.coinBar);
        this.addToMap(this.bottleBar);
        if (this.level.endboss.hadFirstContact) {
            this.addToMap(this.endbossBar);
        }
        this.drawHudText();
    }


    /**
     * Schedules the next draw frame, as long as the game is still running.
     */
    scheduleNextFrame() {
        if (this.gameEnded) {
            return;
        }
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }


    /**
     * Draws the numeric values (coins, bottles, endboss percentage) with
     * an outline, centered on the respective status bar.
     */
    drawHudText() {
        this.ctx.font = 'bold 12px Arial';
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = 'black';
        this.ctx.fillStyle = 'white';

        this.ctx.textAlign = 'center';
        this.drawOutlinedText(this.coinsCollected + ' / ' + this.level.totalCoins, this.coinBar.x + this.coinBar.width / 2, this.coinBar.y + this.coinBar.height / 2 + 10);
        this.drawOutlinedText(String(this.bottlesAvailable), this.bottleBar.x + this.bottleBar.width / 2, this.bottleBar.y + this.bottleBar.height / 2 + 10);

        if (this.level.endboss.hadFirstContact) {
            this.drawOutlinedText(Math.round(this.level.endboss.energy) + '%', this.endbossBar.x + this.endbossBar.width / 2, this.endbossBar.y + this.endbossBar.height / 2 + 6);
        }
        this.ctx.textAlign = 'left';
    }


    /**
     * Draws text with a black outline for better readability.
     * @param {string} text - Text to display.
     * @param {number} x - x position.
     * @param {number} y - y position (text baseline).
     */
    drawOutlinedText(text, x, y) {
        this.ctx.strokeText(text, x, y);
        this.ctx.fillText(text, x, y);
    }


    /**
     * Draws a list of objects onto the canvas one after another.
     * @param {DrawableObject[]} objects - Objects to draw.
     */
    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        })
    }


    /**
     * Draws a single object, mirroring it horizontally if it's facing
     * the other direction (otherDirection).
     * @param {DrawableObject} mo - The object to draw.
     */
    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }


    /**
     * Mirrors the drawing context horizontally to render an object
     * flipped.
     * @param {DrawableObject} mo - The object to mirror.
     */
    flipImage(mo){
            this.ctx.save();
            this.ctx.translate(mo.width, 0);
            this.ctx.scale(-1, 1);
            mo.x = mo.x * -1;
    }


    /**
     * Undoes the mirroring of the drawing context again.
     * @param {DrawableObject} mo - The previously mirrored object.
     */
    flipImageBack(mo) {
            mo.x = mo.x * -1;
            this.ctx.restore();
    }
}
