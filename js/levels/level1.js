/** Aktuell geladenes Level, wird bei jedem Spielstart neu erzeugt. */
let level1;


/**
 * Baut Level 1 komplett neu auf (Gegner, Wolken, Hintergrund, Münzen,
 * Flaschen). Wird bei jedem Spielstart/Neustart aufgerufen, damit keine
 * alten Objekte aus der vorherigen Runde übrig bleiben.
 */
function initLevel1() {

    level1 = new Level(

        [
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new ChickenSmall(),
            new ChickenSmall(),
            new ChickenSmall(),
            new Endboss()
        ],
        [
            new Cloud(0),
            new Cloud(720),
            new Cloud(720 * 2),
            new Cloud(720 * 3)
        ],
        [
            new BackgroundObject('img/5_background/layers/air.png', -720),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -720),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -720),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -720),

            new BackgroundObject('img/5_background/layers/air.png', 0),
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),

            new BackgroundObject('img/5_background/layers/air.png', 720),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 720),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 720),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 720),

            new BackgroundObject('img/5_background/layers/air.png', 720*2),
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 720*2),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 720*2),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 720*2),

            new BackgroundObject('img/5_background/layers/air.png', 720*3),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 720*3),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 720*3),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 720*3),

            new BackgroundObject('img/5_background/layers/air.png', 720*4),
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 720*4),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 720*4),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 720*4),
        ],
        [
            new Coin(300, 80),
            new Coin(450, 80),
            new Coin(600, 80),
            new Coin(900, 150),
            new Coin(1050, 150),
            new Coin(1200, 150),
            new Coin(1500, 80),
            new Coin(1650, 80),
            new Coin(1800, 80),
            new Coin(2000, 150),
            new Coin(350, 300),
            new Coin(500, 300),
            new Coin(650, 300),
            new Coin(950, 300),
            new Coin(1100, 300),
            new Coin(1250, 300),
            new Coin(1550, 300),
            new Coin(1700, 300),
            new Coin(1850, 300),
            new Coin(2050, 300)
        ],
        [
            new Bottle(400),
            new Bottle(700),
            new Bottle(1000),
            new Bottle(1300),
            new Bottle(1600),
            new Bottle(1900),
            new Bottle(2100),
            new Bottle(2150)
        ]
    );
}
