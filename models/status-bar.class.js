/** Image set for the health status bar (0-100% in steps of 20, green). */
const STATUSBAR_IMAGES_HEALTH = [
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png'
];

/** Image set for the coin status bar (0-100% in steps of 20, orange). */
const STATUSBAR_IMAGES_COIN = [
    'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png'
];

/** Image set for the bottle status bar (0-100% in steps of 20, blue). */
const STATUSBAR_IMAGES_BOTTLE = [
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png'
];

/** Image set for the endboss status bar (0-100% in steps of 20, orange). */
const STATUSBAR_IMAGES_ENDBOSS = [
    'img/7_statusbars/2_statusbar_endboss/orange/orange0.png',
    'img/7_statusbars/2_statusbar_endboss/orange/orange20.png',
    'img/7_statusbars/2_statusbar_endboss/orange/orange40.png',
    'img/7_statusbars/2_statusbar_endboss/orange/orange60.png',
    'img/7_statusbars/2_statusbar_endboss/orange/orange80.png',
    'img/7_statusbars/2_statusbar_endboss/orange/orange100.png'
];

/**
 * Generic status bar for HUD displays (health, coins, bottles, endboss).
 * Shows the matching image from a given image set based on the percentage.
 */
class StatusBar extends DrawableObject {
    percentage = 100;


    /**
     * Creates a status bar at a fixed position.
     * @param {string[]} images - Image set with 6 fill levels (0-100%).
     * @param {number} x - x position on the canvas.
     * @param {number} y - y position on the canvas.
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
     * Sets the status bar's fill level and updates the displayed image.
     * @param {number} percentage - New percentage (clamped to 0-100).
     */
    setPercentage(percentage) {
        this.percentage = Math.max(0, Math.min(100, percentage));
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }


    /**
     * Determines the matching image index in the IMAGES list based on
     * the current percentage.
     * @returns {number} Index between 0 (0-19%) and 5 (100%).
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
