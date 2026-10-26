let canvas;
let world;
let keyboard = new Keyboard();
let intervalIds = [];


/**
 * Wrapper around setInterval that remembers the interval ID for later
 * cleanup.
 * @param {Function} fn - Function to run repeatedly.
 * @param {number} time - Interval in milliseconds.
 * @returns {number} The interval ID.
 */
function setStoppableInterval(fn, time) {
    let id = setInterval(fn, time);
    intervalIds.push(id);
    return id;
}


/**
 * Stops all intervals started via setStoppableInterval, e.g. on restart
 * or game end, so no duplicate loops are left running.
 */
function stopAllIntervals() {
    intervalIds.forEach(id => clearInterval(id));
    intervalIds = [];
}


/**
 * Initializes the game when the page loads: grabs the canvas, shows the
 * start screen, binds touch controls, and checks device orientation.
 */
function init(){
    canvas = document.getElementById('canvas');
    showStartScreen();
    bindMobileControls();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    document.addEventListener('fullscreenchange', updateFullscreenButtons);
    setupFullscreenButtons();
    checkOrientation();
}


/**
 * Shows the start screen and hides all other screens/overlays.
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
 * Starts a new round: hides the start screen, rebuilds the level and
 * world, and starts the background music.
 */
function startGame() {
    stopEndSound();
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
 * Ends the round after the character's death: stops everything and
 * shows the game-over screen.
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
 * Ends the round after defeating the endboss: stops everything, fills
 * in the collected coins, and shows the win screen.
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
 * Detects from the user agent whether the game is running on a mobile
 * device.
 * @returns {boolean} true if a mobile device is detected.
 */
function isMobile() {
    const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regex.test(navigator.userAgent);
}


/**
 * Shows the rotate-device prompt on mobile devices in portrait mode;
 * stays hidden on desktop and in landscape mode.
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
 * Binds all four mobile control buttons to the corresponding keyboard
 * fields.
 */
function bindMobileControls() {
    bindTouchButton('mobile_left', 'LEFT');
    bindTouchButton('mobile_right', 'RIGHT');
    bindTouchButton('mobile_jump', 'SPACE');
    bindTouchButton('mobile_throw', 'D');
}


/**
 * Sets the matching keyboard field on touch start/end, so the button
 * behaves like the corresponding key.
 * @param {string} buttonId - ID of the button in the DOM.
 * @param {string} keyboardField - Field name on the Keyboard object (e.g. 'LEFT').
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
 * Starts a completely new round (alias for startGame).
 */
function restartGame() {
    startGame();
}


/**
 * Ends the running game and returns to the start screen.
 */
function backToMenu() {
    stopAllIntervals();
    stopMusic();
    stopEndSound();
    showStartScreen();
}


/**
 * Closes an overlay when clicking outside its content (on the backdrop).
 * @param {MouseEvent} event - The click event on the overlay backdrop.
 * @param {Function} closeFn - Function that closes the overlay.
 */
function closeOverlayOnBackdropClick(event, closeFn) {
    if (event.target === event.currentTarget) {
        closeFn();
    }
}


/**
 * Shows the options menu.
 */
function openOptions() {
    document.getElementById('options_screen').classList.remove('d_none');
}


/**
 * Hides the options menu.
 */
function closeOptions() {
    document.getElementById('options_screen').classList.add('d_none');
}


/**
 * Hides the options menu and shows the legal notice (Impressum).
 */
function openImpressum() {
    closeOptions();
    document.getElementById('impressum_screen').classList.remove('d_none');
}


/**
 * Hides the legal notice (Impressum).
 */
function closeImpressum() {
    document.getElementById('impressum_screen').classList.add('d_none');
}


/**
 * Closes the legal notice and returns to the options menu.
 */
function closeImpressumToOptions() {
    closeImpressum();
    openOptions();
}


/**
 * Toggles the game container between fullscreen and normal mode.
 * If the Fullscreen API is unavailable (iOS Safari/Chrome), the button
 * shows a hint instead - real fullscreen there only works via
 * "Add to Home Screen" (see the PWA manifest).
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
        alert('Echtes Vollbild geht auf diesem Gerät nur über "Zum Home-Bildschirm hinzufügen" (Teilen-Symbol in der Browser-Leiste).');
    }
}


/**
 * Updates the icon of all fullscreen buttons to match the current state.
 */
function updateFullscreenButtons() {
    document.querySelectorAll('.fullscreen_button').forEach(btn => {
        btn.querySelector('img').src = document.fullscreenElement
            ? 'img/icons/fullscreen-exit.png'
            : 'img/icons/fullscreen.png';
    });
}


/**
 * Adjusts the fullscreen buttons when the Fullscreen API is unavailable:
 * if the game is already running as an installed PWA (real fullscreen
 * active), the buttons disappear. In a regular browser tab they show an
 * "Add to Home Screen" icon instead, which explains the hint on tap.
 */
function setupFullscreenButtons() {
    if (document.fullscreenEnabled) {
        return;
    }
    let runningAsInstalledApp = window.navigator.standalone === true ||
        window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: fullscreen)').matches;
    document.querySelectorAll('.fullscreen_button').forEach(btn => {
        if (runningAsInstalledApp) {
            btn.classList.add('d_none');
        } else {
            let icon = btn.querySelector('img');
            icon.src = 'img/icons/addtohome.png';
            icon.alt = 'Vollbild-Hinweis';
        }
    });
}


/**
 * Sets the matching keyboard field on key press. M additionally toggles
 * sound mute directly (only on the first press, not on key repeat).
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
 * Resets the matching keyboard field when a key is released.
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
