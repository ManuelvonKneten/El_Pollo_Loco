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
}

function showStartScreen() {
    document.getElementById('start_screen').classList.remove('d_none');
    document.getElementById('game_over_screen').classList.add('d_none');
    document.getElementById('win_screen').classList.add('d_none');
}

function startGame() {
    document.getElementById('start_screen').classList.add('d_none');
    document.getElementById('game_over_screen').classList.add('d_none');
    document.getElementById('win_screen').classList.add('d_none');

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
    document.getElementById('win_screen').classList.remove('d_none');
}

function restartGame() {
    startGame();
}

function backToMenu() {
    stopAllIntervals();
    stopMusic();
    showStartScreen();
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
