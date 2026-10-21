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

    statusBar;
    coinBar;
    bottleBar;
    endbossBar;


    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;

        this.statusBar = new StatusBar(STATUSBAR_IMAGES_HEALTH, 20, 0);
        this.coinBar = new StatusBar(STATUSBAR_IMAGES_COIN, 20, 50);
        this.bottleBar = new StatusBar(STATUSBAR_IMAGES_BOTTLE, 20, 100);
        this.endbossBar = new StatusBar(STATUSBAR_IMAGES_ENDBOSS, 500, 0);
        this.bottleBar.setPercentage(0);

        this.draw();
        this.setWorld();
        this.run();
    }

    setWorld(){
        this.character.world = this;
        this.level.endboss.world = this;
    }

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

    checkEndbossContact() {
        if (!this.level.endboss.hadFirstContact && this.character.x > this.level.level_end_x) {
            this.level.endboss.hadFirstContact = true;
            this.level.endboss.alertUntil = Date.now() + 1000;
            playSound('bossAlert');
        }
    }

    checkCollisions() {
        this.level.coins.forEach((coin) => {
            if (this.character.isColling(coin)) {
                this.collectCoin(coin);
            }
        });

        this.level.bottles.forEach((bottle) => {
            if (this.character.isColling(bottle)) {
                this.collectBottle(bottle);
            }
        });

        this.level.enemies.forEach((enemy) => {
            if (enemy.dead || !this.character.isColling(enemy)) {
                return;
            }
            let jumpedOnTop = !(enemy instanceof Endboss) &&
                this.character.speedY < 0 &&
                this.character.y + this.character.height < enemy.y + enemy.height / 2;

            if (jumpedOnTop) {
                this.defeatEnemyByJump(enemy);
            } else if (!this.character.isHurt()) {
                this.character.hit();
                playSound('playerHurt');
            }
        });

        this.throwableObjects.forEach((bottle) => {
            if (bottle.hasHit) {
                return;
            }
            this.level.enemies.forEach((enemy) => {
                if (!enemy.dead && bottle.isColling(enemy)) {
                    this.hitEnemyWithBottle(bottle, enemy);
                }
            });
        });

        this.throwableObjects = this.throwableObjects.filter(b => !b.hasHit || (Date.now() - b.splashStartTime < 400));
    }

    collectCoin(coin) {
        this.level.coins = this.level.coins.filter(c => c !== coin);
        this.coinsCollected++;
        this.coinBar.setPercentage(this.coinsCollected / this.level.totalCoins * 100);
        playSound('coin');
    }

    collectBottle(bottle) {
        this.level.bottles = this.level.bottles.filter(b => b !== bottle);
        this.bottlesAvailable++;
        this.bottleBar.setPercentage(Math.min(100, this.bottlesAvailable / this.level.totalBottles * 100));
        playSound('bottleCollect');
    }

    defeatEnemyByJump(enemy) {
        enemy.die();
        this.character.speedY = 15;
        playSound('enemyDead');
        setTimeout(() => {
            this.level.enemies = this.level.enemies.filter(e => e !== enemy);
        }, 800);
    }

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

    checkThrowObjects() {
        if (this.keyboard.D && this.bottlesAvailable > 0) {
            let spawnX = this.character.otherDirection ? this.character.x - 20 : this.character.x + 100;
            let bottle = new ThrowableObject(spawnX, this.character.y + 100, this.character.otherDirection);
            this.throwableObjects.push(bottle);
            this.bottlesAvailable--;
            this.bottleBar.setPercentage(Math.min(100, this.bottlesAvailable / this.level.totalBottles * 100));
        }
        this.keyboard.D = false;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);

        this.ctx.translate(-this.camera_x, 0);

        this.statusBar.setPercentage(this.character.energy);
        this.addToMap(this.statusBar);
        this.addToMap(this.coinBar);
        this.addToMap(this.bottleBar);
        if (this.level.endboss.hadFirstContact) {
            this.addToMap(this.endbossBar);
        }
        this.drawHudText();

        if (this.gameEnded) {
            return;
        }

        // Draw() wird immer wieder aufgerufen
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    drawHudText() {
        this.ctx.font = 'bold 16px Arial';
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = 'black';
        this.ctx.fillStyle = 'white';

        this.drawOutlinedText('COINS: ' + this.coinsCollected + ' / ' + this.level.totalCoins, 210, 78);

        this.ctx.textAlign = 'center';
        this.drawOutlinedText(String(this.bottlesAvailable), this.bottleBar.x + this.bottleBar.width / 2, this.bottleBar.y + this.bottleBar.height / 2 + 6);
        this.ctx.textAlign = 'left';

        if (this.level.endboss.hadFirstContact) {
            this.drawOutlinedText('ENDBOSS ' + Math.round(this.level.endboss.energy) + '%', 500, 60);
        }
    }

    drawOutlinedText(text, x, y) {
        this.ctx.strokeText(text, x, y);
        this.ctx.fillText(text, x, y);
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        })
    }

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
    flipImage(mo){
            this.ctx.save();
            this.ctx.translate(mo.width, 0);
            this.ctx.scale(-1, 1);
            mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
            mo.x = mo.x * -1;
            this.ctx.restore();
    }
}
