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
