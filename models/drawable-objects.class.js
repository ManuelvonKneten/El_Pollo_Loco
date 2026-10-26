/**
 * Base class for all drawable objects in the game.
 * Handles loading images and drawing them onto the canvas.
 */
class DrawableObject {
    x = 120;
    y = 295;
    img;
    height = 150;
    width = 100;
    imageCache = [];
    currentImage = 0;


    /**
     * Loads a single image and sets it as the current image.
     * @param {string} path - Path to the image file.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }


    /**
     * Draws the current image at position x/y onto the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas's drawing context.
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }


    /**
     * Optionally draws a debug frame around the object (currently disabled).
     */
    drawFrame() {
    }


    /**
     * Preloads multiple images into the image cache for animations.
     * @param {string[]} arr - List of image paths.
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }


    /**
     * Plays an animation by advancing to the next image on each call.
     * @param {string[]} images - List of image paths for the animation.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
}
