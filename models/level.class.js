/**
 * Holds all objects of a level (enemies, clouds, background,
 * coins, bottles) as well as level-related constants.
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
     * Creates a level from the given object lists and automatically
     * determines the endboss from the enemy list.
     * @param {MovableObject[]} enemies - All enemies including the endboss.
     * @param {Cloud[]} clouds - Clouds in the background.
     * @param {BackgroundObject[]} backgroundObjects - Background layers.
     * @param {Coin[]} coins - Collectible coins.
     * @param {Bottle[]} bottles - Collectible bottles on the ground.
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
