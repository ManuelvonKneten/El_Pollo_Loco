/** Bildserie für die Lebens-Statusbar (0-100% in 20er-Schritten, grün). */
const STATUSBAR_IMAGES_HEALTH = [
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png'
];

/** Bildserie für die Coin-Statusbar (0-100% in 20er-Schritten, orange). */
const STATUSBAR_IMAGES_COIN = [
    'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png'
];

/** Bildserie für die Flaschen-Statusbar (0-100% in 20er-Schritten, blau). */
const STATUSBAR_IMAGES_BOTTLE = [
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png'
];

/** Bildserie für die Endboss-Statusbar (0-100% in 20er-Schritten, orange). */
const STATUSBAR_IMAGES_ENDBOSS = [
    'img/7_statusbars/2_statusbar_endboss/orange/orange0.png',
    'img/7_statusbars/2_statusbar_endboss/orange/orange20.png',
    'img/7_statusbars/2_statusbar_endboss/orange/orange40.png',
    'img/7_statusbars/2_statusbar_endboss/orange/orange60.png',
    'img/7_statusbars/2_statusbar_endboss/orange/orange80.png',
    'img/7_statusbars/2_statusbar_endboss/orange/orange100.png'
];

/**
 * Generische Statusbar für HUD-Anzeigen (Leben, Coins, Flaschen, Endboss).
 * Zeigt je nach Prozentwert das passende Bild aus einer übergebenen Bildserie.
 */
class StatusBar extends DrawableObject {
    percentage = 100;


    /**
     * Erstellt eine Statusbar an einer festen Position.
     * @param {string[]} images - Bildserie mit 6 Füllständen (0-100%).
     * @param {number} x - x-Position auf dem Canvas.
     * @param {number} y - y-Position auf dem Canvas.
     */
    constructor(images, x, y) {
        super();
        this.IMAGES = images;
        this.loadImages(this.IMAGES);
        this.x = x;
        this.y = y;
        this.width = 180;
        this.height = 45;
        this.setPercentage(100);
    }


    /**
     * Setzt den Füllstand der Statusbar und aktualisiert das angezeigte Bild.
     * @param {number} percentage - Neuer Prozentwert (wird auf 0-100 begrenzt).
     */
    setPercentage(percentage) {
        this.percentage = Math.max(0, Math.min(100, percentage));
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }


    /**
     * Ermittelt den passenden Bild-Index in der IMAGES-Liste anhand des
     * aktuellen Prozentwerts.
     * @returns {number} Index zwischen 0 (0-19%) und 5 (100%).
     */
    resolveImageIndex() {
        if (this.percentage >= 100) {
            return 5;
        } else if (this.percentage >= 80) {
            return 4;
        } else if (this.percentage >= 60) {
            return 3;
        } else if (this.percentage >= 40) {
            return 2;
        } else if (this.percentage >= 20) {
            return 1;
        } else {
            return 0;
        }
    }
}
