let canvas;
let world;
let keyboard = new Keyboard();
let intervalIds = [];


/**
 * Wrapper um setInterval, der die Interval-ID für spätere Bereinigung merkt.
 * @param {Function} fn - Funktion, die wiederholt ausgeführt wird.
 * @param {number} time - Intervall in Millisekunden.
 * @returns {number} Die Interval-ID.
 */
function setStoppableInterval(fn, time) {
    let id = setInterval(fn, time);
    intervalIds.push(id);
    return id;
}


/**
 * Stoppt alle über setStoppableInterval gestarteten Intervalle, z.B. bei
 * Neustart oder Spielende, damit keine doppelten Loops entstehen.
 */
function stopAllIntervals() {
    intervalIds.forEach(id => clearInterval(id));
    intervalIds = [];
}


/**
 * Initialisiert das Spiel beim Laden der Seite: holt das Canvas, zeigt den
 * Startscreen, bindet die Touch-Steuerung und prüft die Geräteausrichtung.
 */
function init(){
    canvas = document.getElementById('canvas');
    showStartScreen();
    bindMobileControls();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    document.addEventListener('fullscreenchange', updateFullscreenButtons);
    checkOrientation();
}


/**
 * Zeigt den Startscreen an und blendet alle anderen Screens/Overlays aus.
 */
function showStartScreen() {
    closeOptions();
    closeImpressum();
    document.getElementById('start_screen').classList.remove('d_none');
    document.getElementById('game_over_screen').classList.add('d_none');
    document.getElementById('win_screen').classList.add('d_none');
    document.getElementById('ingame_controls').classList.add('d_none');
    document.getElementById('mobile_controls').classList.add('d_none');
}


/**
 * Startet eine neue Spielrunde: blendet den Startscreen aus, baut Level
 * und Welt neu auf und startet die Hintergrundmusik.
 */
function startGame() {
    closeOptions();
    closeImpressum();
    document.getElementById('start_screen').classList.add('d_none');
    document.getElementById('game_over_screen').classList.add('d_none');
    document.getElementById('win_screen').classList.add('d_none');
    document.getElementById('ingame_controls').classList.remove('d_none');
    if (isMobile()) {
        document.getElementById('mobile_controls').classList.remove('d_none');
    }

    stopAllIntervals();
    initLevel1();
    world = new World(canvas, keyboard);
    playMusic();
}


/**
 * Beendet die Spielrunde nach dem Tod des Charakters: stoppt alles und
 * zeigt den Game-Over-Screen.
 */
function gameOver() {
    if (world.gameEnded) {
        return;
    }
    world.gameEnded = true;
    stopAllIntervals();
    stopMusic();
    playSound('gameOver');
    closeOptions();
    closeImpressum();
    document.getElementById('ingame_controls').classList.add('d_none');
    document.getElementById('mobile_controls').classList.add('d_none');
    document.getElementById('game_over_screen').classList.remove('d_none');
}


/**
 * Beendet die Spielrunde nach dem Sieg über den Endboss: stoppt alles,
 * trägt die gesammelten Münzen ein und zeigt den Gewinn-Screen.
 */
function gameWon() {
    if (world.gameEnded) {
        return;
    }
    world.gameEnded = true;
    stopAllIntervals();
    stopMusic();
    playSound('win');
    document.getElementById('won_coins').innerText = world.coinsCollected + ' / ' + world.level.totalCoins;
    closeOptions();
    closeImpressum();
    document.getElementById('ingame_controls').classList.add('d_none');
    document.getElementById('mobile_controls').classList.add('d_none');
    document.getElementById('win_screen').classList.remove('d_none');
}


/**
 * Erkennt anhand des User-Agents, ob das Spiel auf einem Mobilgerät läuft.
 * @returns {boolean} true bei einem erkannten Mobilgerät.
 */
function isMobile() {
    const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regex.test(navigator.userAgent);
}


/**
 * Zeigt auf Mobilgeräten im Hochformat den Drehhinweis an, auf Desktop
 * und im Querformat bleibt er ausgeblendet.
 */
function checkOrientation() {
    if (!isMobile()) {
        document.getElementById('rotate_device').classList.add('d_none');
        return;
    }
    let isPortrait = window.innerHeight > window.innerWidth;
    document.getElementById('rotate_device').classList.toggle('d_none', !isPortrait);
}


/**
 * Verknüpft alle vier mobilen Steuerungs-Buttons mit den entsprechenden
 * Tastatur-Feldern.
 */
function bindMobileControls() {
    bindTouchButton('mobile_left', 'LEFT');
    bindTouchButton('mobile_right', 'RIGHT');
    bindTouchButton('mobile_jump', 'SPACE');
    bindTouchButton('mobile_throw', 'D');
}


/**
 * Setzt bei Touch-Start/-Ende das passende Tastatur-Feld, damit der
 * Button wie die entsprechende Taste wirkt.
 * @param {string} buttonId - ID des Buttons im DOM.
 * @param {string} keyboardField - Feldname im Keyboard-Objekt (z.B. 'LEFT').
 */
function bindTouchButton(buttonId, keyboardField) {
    let button = document.getElementById(buttonId);
    button.addEventListener('touchstart', (event) => {
        if (event.cancelable) {
            event.preventDefault();
        }
        keyboard[keyboardField] = true;
    });
    button.addEventListener('touchend', (event) => {
        if (event.cancelable) {
            event.preventDefault();
        }
        keyboard[keyboardField] = false;
    });
}


/**
 * Startet eine komplett neue Spielrunde (Alias für startGame).
 */
function restartGame() {
    startGame();
}


/**
 * Beendet das laufende Spiel und kehrt zum Startscreen zurück.
 */
function backToMenu() {
    stopAllIntervals();
    stopMusic();
    showStartScreen();
}


/**
 * Schließt ein Overlay, wenn außerhalb seines Inhalts (auf den Hintergrund)
 * geklickt wurde.
 * @param {MouseEvent} event - Das Klick-Event auf dem Overlay-Hintergrund.
 * @param {Function} closeFn - Funktion, die das Overlay schließt.
 */
function closeOverlayOnBackdropClick(event, closeFn) {
    if (event.target === event.currentTarget) {
        closeFn();
    }
}


/**
 * Zeigt das Einstellungen-Menü an.
 */
function openOptions() {
    document.getElementById('options_screen').classList.remove('d_none');
}


/**
 * Blendet das Einstellungen-Menü aus.
 */
function closeOptions() {
    document.getElementById('options_screen').classList.add('d_none');
}


/**
 * Blendet das Einstellungen-Menü aus und zeigt das Impressum an.
 */
function openImpressum() {
    closeOptions();
    document.getElementById('impressum_screen').classList.remove('d_none');
}


/**
 * Blendet das Impressum aus.
 */
function closeImpressum() {
    document.getElementById('impressum_screen').classList.add('d_none');
}


/**
 * Schließt das Impressum und kehrt zum Einstellungen-Menü zurück.
 */
function closeImpressumToOptions() {
    closeImpressum();
    openOptions();
}


/**
 * Wechselt zwischen Vollbild- und normalem Modus für den Spielcontainer.
 * Browser ohne Fullscreen API (iOS Safari/Chrome) bekommen stattdessen
 * nur die ausgeblendete Adressleiste - echtes Vollbild geht dort nur
 * über "Zum Home-Bildschirm hinzufügen" (siehe PWA-Manifest).
 */
function toggleFullscreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
        return;
    }
    let container = document.getElementById('game_container');
    if (container.requestFullscreen) {
        container.requestFullscreen().catch(() => {});
    } else {
        hideMobileAddressBar();
    }
}


/**
 * Aktualisiert Icon aller Vollbild-Buttons passend zum aktuellen Zustand.
 */
function updateFullscreenButtons() {
    document.querySelectorAll('.fullscreen_button').forEach(btn => {
        btn.querySelector('img').src = document.fullscreenElement
            ? 'img/icons/fullscreen-exit.png'
            : 'img/icons/fullscreen.png';
    });
}


/**
 * Blendet die mobile Adressleiste per Scroll-Trick aus, sofern die
 * Fullscreen API fehlt. Macht die Seite dafür kurz höher als den
 * sichtbaren Bereich, scrollt sie weg und setzt die Höhe zurück.
 */
function hideMobileAddressBar() {
    let original = document.documentElement.style.minHeight;
    document.documentElement.style.minHeight = (window.innerHeight + 100) + 'px';
    window.scrollTo(0, 1);
    setTimeout(() => {
        window.scrollTo(0, 1);
        document.documentElement.style.minHeight = original;
    }, 300);
}


/**
 * Setzt bei Tastendruck das passende Keyboard-Feld. M schaltet zusätzlich
 * direkt den Sound stumm/laut (nur bei erstem Drücken, nicht bei Wiederholung).
 */
window.addEventListener("keydown", (event) => {
    if (event.keyCode == 39) {
        keyboard.RIGHT = true;
    }
    if (event.keyCode == 37) {
        keyboard.LEFT = true;
    }
    if (event.keyCode == 38) {
        keyboard.UP = true;
    }
    if (event.keyCode == 40) {
        keyboard.DOWN = true;
    }
    if (event.keyCode == 32) {
        keyboard.SPACE = true;
    }
    if (event.keyCode == 68) {
        keyboard.D = true;
    }
    if (event.keyCode == 77 && !keyboard.M) {
        keyboard.M = true;
        toggleMute();
    }
});


/**
 * Setzt beim Loslassen einer Taste das passende Keyboard-Feld zurück.
 */
window.addEventListener("keyup", (event) => {
    if (event.keyCode == 39) {
        keyboard.RIGHT = false;
    }
    if (event.keyCode == 37) {
        keyboard.LEFT = false;
    }
    if (event.keyCode == 38) {
        keyboard.UP = false;
    }
    if (event.keyCode == 40) {
        keyboard.DOWN = false;
    }
    if (event.keyCode == 32) {
        keyboard.SPACE = false;
    }
    if (event.keyCode == 68) {
        keyboard.D = false;
    }
    if (event.keyCode == 77) {
        keyboard.M = false;
    }
});
