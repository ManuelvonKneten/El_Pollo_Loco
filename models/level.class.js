/**
 * Enthält alle Objekte eines Levels (Gegner, Wolken, Hintergrund,
 * Münzen, Flaschen) sowie levelbezogene Konstanten.
 */
class Level {
    enemies;
    clouds;
    backgroundObjects;
    coins;
    bottles;
    endboss;
    totalCoins;
    totalBottles;
    bossZoneX = 2000;
    level_end_x = 2700;


    /**
     * Erstellt ein Level aus den übergebenen Objektlisten und ermittelt
     * den Endboss automatisch aus der Gegnerliste.
     * @param {MovableObject[]} enemies - Alle Gegner inkl. Endboss.
     * @param {Cloud[]} clouds - Wolken im Hintergrund.
     * @param {BackgroundObject[]} backgroundObjects - Hintergrund-Layer.
     * @param {Coin[]} coins - Sammelbare Münzen.
     * @param {Bottle[]} bottles - Sammelbare Flaschen am Boden.
     */
    constructor(enemies, clouds, backgroundObjects, coins, bottles){

        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
        this.totalCoins = coins.length;
        this.totalBottles = bottles.length;
        this.endboss = enemies.find(enemy => enemy instanceof Endboss);
    }

}
