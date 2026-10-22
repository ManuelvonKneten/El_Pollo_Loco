/**
 * Basisklasse für alle zeichenbaren Objekte im Spiel.
 * Kümmert sich um das Laden von Bildern und das Zeichnen auf dem Canvas.
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
     * Lädt ein einzelnes Bild und setzt es als aktuelles Bild.
     * @param {string} path - Pfad zur Bilddatei.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }


    /**
     * Zeichnet das aktuelle Bild an Position x/y auf den Canvas.
     * @param {CanvasRenderingContext2D} ctx - Der Zeichenkontext des Canvas.
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }


    /**
     * Zeichnet optional einen Debug-Rahmen um das Objekt (aktuell deaktiviert).
     */
    drawFrame() {
    }


    /**
     * Lädt mehrere Bilder vorab in den Image-Cache für Animationen.
     * @param {string[]} arr - Liste der Bildpfade.
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }


    /**
     * Spielt eine Animation ab, indem bei jedem Aufruf das nächste Bild gesetzt wird.
     * @param {string[]} images - Liste der Bildpfade für die Animation.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
}
