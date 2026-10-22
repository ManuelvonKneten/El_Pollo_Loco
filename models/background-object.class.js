/**
 * Ein einzelnes Hintergrund-Layer-Bild (z.B. Himmel, Berge, Boden),
 * das am unteren Canvas-Rand ausgerichtet wird.
 */
class BackgroundObject extends MovableObject {

    width = 720;
    height = 480;


    /**
     * Erstellt ein Hintergrundbild an der angegebenen x-Position.
     * @param {string} imagePath - Pfad zum Hintergrundbild.
     * @param {number} x - x-Position des Layers.
     * @param {number} [y] - Ungenutzter Parameter (Kompatibilität mit Aufrufstelle).
     */
    constructor(imagePath, x, y){
        super().loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;

    }
}
