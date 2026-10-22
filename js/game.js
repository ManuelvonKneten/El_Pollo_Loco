let canvas;
let world;
let keyboard = new Keyboard();
let intervalIds = [];

function setStoppableInterval(fn, time) {
    let id = setInterval(fn, time);
    intervalIds.push(id);
    return id;
}

function stopAllIntervals() {
    intervalIds.forEach(id => clearInterval(id));
    intervalIds = [];
}

function init(){
    canvas = document.getElementById('canvas');
    showStartScreen();
    bindMobileControls();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    checkOrientation();
}

function showStartScreen() {
    closeOptions();
    closeImpressum();
    document.getElementById('start_screen').classList.remove('d_none');
    document.getElementById('game_over_screen').classList.add('d_none');
    document.getElementById('win_screen').classList.add('d_none');
    document.getElementById('ingame_controls').classList.add('d_none');
    document.getElementById('mobile_controls').classList.add('d_none');
}

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

function isMobile() {
    const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regex.test(navigator.userAgent);
}

function checkOrientation() {
    if (!isMobile()) {
        document.getElementById('rotate_device').classList.add('d_none');
        return;
    }
    let isPortrait = window.innerHeight > window.innerWidth;
    document.getElementById('rotate_device').classList.toggle('d_none', !isPortrait);
}

function bindMobileControls() {
    bindTouchButton('mobile_left', 'LEFT');
    bindTouchButton('mobile_right', 'RIGHT');
    bindTouchButton('mobile_jump', 'SPACE');
    bindTouchButton('mobile_throw', 'D');
}

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

function restartGame() {
    startGame();
}

function backToMenu() {
    stopAllIntervals();
    stopMusic();
    showStartScreen();
}

function openOptions() {
    document.getElementById('options_screen').classList.remove('d_none');
}

function closeOptions() {
    document.getElementById('options_screen').classList.add('d_none');
}

function openImpressum() {
    document.getElementById('impressum_screen').classList.remove('d_none');
}

function closeImpressum() {
    document.getElementById('impressum_screen').classList.add('d_none');
}


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
