/**
 * A single background layer image (e.g. sky, mountains, ground),
 * aligned to the bottom edge of the canvas.
 */
class BackgroundObject extends MovableObject {

    width = 720;
    height = 480;


    /**
     * Creates a background image at the given x position.
     * @param {string} imagePath - Path to the background image.
     * @param {number} x - x position of the layer.
     * @param {number} [y] - Unused parameter (kept for call-site compatibility).
     */
    constructor(imagePath, x, y){
        super().loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;

    }
}
