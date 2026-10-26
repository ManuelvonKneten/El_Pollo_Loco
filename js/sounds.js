/** Mute state, restored from localStorage so it survives reloads. */
let soundsMuted = localStorage.getItem('soundsMuted') === 'true';

/** Maps sound names to their respective audio files. */
const SOUND_FILES = {
    jump: 'audio/jump.mp3',
    coin: 'audio/pick_coin.mp3',
    bottleCollect: 'audio/pick_bottle.mp3',
    bottleHit: 'audio/bottle_hit.mp3',
    enemyDead: 'audio/enemy_dead.mp3',
    playerHurt: 'audio/pepe_hurt.mp3',
    bossAlert: 'audio/endboss_alert.mp3',
    bossHurt: 'audio/endboss_hurt.mp3',
    bossDead: 'audio/endboss_dead.mp3',
    gameOver: 'audio/pepe_dead.mp3',
    win: 'audio/winning.mp3'
};

let backgroundMusic = new Audio('audio/background_music.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.3;

/** Game-over/win sounds run longer and must be stoppable on a restart. */
const END_SOUND_NAMES = ['gameOver', 'win'];
let currentEndSound = null;


/**
 * Plays a one-shot sound effect, unless sound is muted.
 * @param {string} name - Key from SOUND_FILES.
 */
function playSound(name) {
    if (soundsMuted) {
        return;
    }
    let sound = new Audio(SOUND_FILES[name]);
    sound.volume = 0.5;
    if (END_SOUND_NAMES.includes(name)) {
        currentEndSound = sound;
    }
    sound.play().catch(() => {});
}


/**
 * Stops a still-playing game-over/win sound so it doesn't bleed into
 * a newly started round.
 */
function stopEndSound() {
    if (currentEndSound) {
        currentEndSound.pause();
        currentEndSound.currentTime = 0;
        currentEndSound = null;
    }
}


/**
 * Starts the background music (looping), unless sound is muted.
 */
function playMusic() {
    if (soundsMuted) {
        return;
    }
    backgroundMusic.play().catch(() => {});
}


/**
 * Stops the background music and resets it to the beginning.
 */
function stopMusic() {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
}


/**
 * Toggles sound/music mute on or off, saves the state in localStorage,
 * and updates all mute buttons.
 */
function toggleMute() {
    soundsMuted = !soundsMuted;
    localStorage.setItem('soundsMuted', soundsMuted);
    if (soundsMuted) {
        backgroundMusic.pause();
    } else if (world && !world.gameEnded) {
        backgroundMusic.play().catch(() => {});
    }
    updateMuteButtons();
}


/**
 * Updates the icon/text of all mute buttons to match the current mute
 * state.
 */
function updateMuteButtons() {
    document.querySelectorAll('.mute_button').forEach(btn => {
        let icon = btn.querySelector('img');
        if (icon) {
            icon.src = soundsMuted ? 'img/icons/mute.png' : 'img/icons/audio.png';
        } else {
            btn.innerText = soundsMuted ? '🔇 Musik an' : '🔊 Musik aus';
        }
    });
}

updateMuteButtons();
