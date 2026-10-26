/**
 * Zentrale Spielwelt-Klasse: hält Charakter, Level und HUD, zeichnet jeden
 * Frame und prüft laufend Kollisionen, Flaschenwürfe und Endboss-Kontakt.
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
     * Erstellt die Spielwelt, legt die HUD-Statusbars an und startet
     * Zeichnen sowie die laufende Spiellogik.
     * @param {HTMLCanvasElement} canvas - Das Canvas-Element des Spiels.
     * @param {Keyboard} keyboard - Globales Tastatur-Statusobjekt.
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
     * Verknüpft Charakter und Endboss mit dieser Welt, damit beide auf
     * Keyboard, Level und Kamera zugreifen können.
     */
    setWorld(){
        this.character.world = this;
        this.level.endboss.world = this;
    }


    /**
     * Zentraler Spiel-Loop (60fps): prüft Kollisionen, Flaschenwürfe,
     * Endboss-Kontakt und ob der Charakter gestorben ist.
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
     * Aktiviert beim ersten Erreichen der Boss-Zone die Alarm-Animation
     * und blendet danach die Endboss-Statusbar ein.
     */
    checkEndbossContact() {
        if (!this.level.endboss.hadFirstContact && this.character.x > this.level.bossZoneX) {
            this.level.endboss.hadFirstContact = true;
            this.level.endboss.alertUntil = Date.now() + 1000;
            playSound('bossAlert');
        }
    }


    /**
     * Prüft alle Kollisionen eines Frames: Münzen/Flaschen einsammeln,
     * Gegnerkontakt (Sprung-Kill oder Schaden) und Flaschentreffer.
     */
    checkCollisions() {
        this.checkCoinPickups();
        this.checkBottlePickups();
        this.checkEnemyContact();
        this.checkThrowableHits();
    }


    /**
     * Prüft, ob der Charakter eine Münze erreicht hat, und sammelt sie ein.
     */
    checkCoinPickups() {
        this.level.coins.forEach((coin) => {
            if (this.character.isColling(coin)) {
                this.collectCoin(coin);
            }
        });
    }


    /**
     * Prüft, ob der Charakter eine Flasche am Boden erreicht hat, und
     * sammelt sie ein.
     */
    checkBottlePickups() {
        this.level.bottles.forEach((bottle) => {
            if (this.character.isColling(bottle)) {
                this.collectBottle(bottle);
            }
        });
    }


    /**
     * Prüft den Kontakt zwischen Charakter und Gegnern: Sprung von oben
     * besiegt den Gegner, seitlicher Kontakt verletzt den Charakter.
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
     * Prüft, ob der Charakter fallend von oben auf den Gegner trifft
     * (zählt beim Endboss nie als Sprungangriff). Nutzt für beide Seiten
     * die offset-verkleinerten Hitbox-Kanten, damit die Schwelle bei
     * kleinen, bodennahen Gegnern (z.B. ChickenSmall) nicht fast unmöglich
     * eng wird.
     * @param {MovableObject} enemy - Der mögliche Gegner.
     * @returns {boolean} true bei einem gültigen Sprung-Kill.
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
     * Prüft, ob geworfene Flaschen einen Gegner treffen, und entfernt
     * Flaschen, deren Splash-Animation bereits abgelaufen ist.
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
     * Entfernt eine eingesammelte Münze aus dem Level und aktualisiert
     * Zähler und Coin-Statusbar.
     * @param {Coin} coin - Die eingesammelte Münze.
     */
    collectCoin(coin) {
        this.level.coins = this.level.coins.filter(c => c !== coin);
        this.coinsCollected++;
        this.coinBar.setPercentage(this.coinsCollected / this.level.totalCoins * 100);
        playSound('coin');
    }


    /**
     * Entfernt eine eingesammelte Flasche aus dem Level und erhöht den
     * Flaschenvorrat des Charakters.
     * @param {Bottle} bottle - Die eingesammelte Flasche.
     */
    collectBottle(bottle) {
        this.level.bottles = this.level.bottles.filter(b => b !== bottle);
        this.bottlesAvailable++;
        this.bottleBar.setPercentage(Math.min(100, this.bottlesAvailable / this.level.totalBottles * 100));
        playSound('bottleCollect');
    }


    /**
     * Besiegt einen Gegner durch Sprungangriff: Gegner stirbt, Charakter
     * erhält einen kleinen Rückprall nach oben.
     * @param {MovableObject} enemy - Der besiegte Gegner.
     */
    defeatEnemyByJump(enemy) {
        enemy.die();
        this.character.speedY = 15;
        playSound('enemyDead');
        setTimeout(() => {
            this.level.enemies = this.level.enemies.filter(e => e !== enemy);
        }, 800);
    }


    /**
     * Verarbeitet einen Flaschentreffer: lässt die Flasche platzen und
     * fügt dem Gegner Schaden zu (Endboss verliert Energie, normale
     * Gegner sterben sofort).
     * @param {ThrowableObject} bottle - Die treffende Flasche.
     * @param {MovableObject} enemy - Der getroffene Gegner.
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
     * Erzeugt bei Tastendruck D eine neue Flasche, sofern Vorrat vorhanden
     * ist und die letzte Flasche mindestens throwCooldown ms her ist (damit
     * D nicht gespammt werden kann), und reduziert den Flaschenvorrat um eins.
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
     * Zeichnet einen kompletten Frame: Hintergrund, Spielobjekte, HUD,
     * und plant sich selbst für den nächsten Frame erneut ein.
     */
    draw() {
        this.drawWorldObjects();
        this.drawHud();
        this.scheduleNextFrame();
    }


    /**
     * Zeichnet Hintergrund, Charakter, Gegner und Sammelobjekte innerhalb
     * der Kameraverschiebung.
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
     * Zeichnet die Statusbars und den HUD-Text, scrollfest über dem Spiel.
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
     * Plant den nächsten Zeichen-Frame, sofern das Spiel noch läuft.
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
     * Zeichnet die Zahlenwerte (Coins, Flaschen, Endboss-Prozent) mit
     * Kontur zentriert auf die jeweilige Statusbar.
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
     * Zeichnet Text mit schwarzer Kontur für bessere Lesbarkeit.
     * @param {string} text - Anzuzeigender Text.
     * @param {number} x - x-Position.
     * @param {number} y - y-Position (Textgrundlinie).
     */
    drawOutlinedText(text, x, y) {
        this.ctx.strokeText(text, x, y);
        this.ctx.fillText(text, x, y);
    }


    /**
     * Zeichnet eine Liste von Objekten nacheinander auf den Canvas.
     * @param {DrawableObject[]} objects - Zu zeichnende Objekte.
     */
    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        })
    }


    /**
     * Zeichnet ein einzelnes Objekt, spiegelt es dabei horizontal, wenn
     * es in die andere Richtung blickt (otherDirection).
     * @param {DrawableObject} mo - Das zu zeichnende Objekt.
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
     * Spiegelt den Zeichenkontext horizontal, um ein Objekt seitenverkehrt
     * darzustellen.
     * @param {DrawableObject} mo - Das zu spiegelnde Objekt.
     */
    flipImage(mo){
            this.ctx.save();
            this.ctx.translate(mo.width, 0);
            this.ctx.scale(-1, 1);
            mo.x = mo.x * -1;
    }


    /**
     * Macht die Spiegelung des Zeichenkontexts wieder rückgängig.
     * @param {DrawableObject} mo - Das zuvor gespiegelte Objekt.
     */
    flipImageBack(mo) {
            mo.x = mo.x * -1;
            this.ctx.restore();
    }
}
