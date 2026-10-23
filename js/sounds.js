/** Mute-Zustand, wird aus localStorage wiederhergestellt, damit er Reloads übersteht. */
let soundsMuted = localStorage.getItem('soundsMuted') === 'true';

/** Zuordnung von Sound-Namen zu den jeweiligen Audiodateien. */
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


/**
 * Spielt einen einmaligen Soundeffekt ab, sofern der Sound nicht stummgeschaltet ist.
 * @param {string} name - Schlüssel aus SOUND_FILES.
 */
function playSound(name) {
    if (soundsMuted) {
        return;
    }
    let sound = new Audio(SOUND_FILES[name]);
    sound.volume = 0.5;
    sound.play().catch(() => {});
}


/**
 * Startet die Hintergrundmusik (Endlosschleife), sofern nicht stummgeschaltet.
 */
function playMusic() {
    if (soundsMuted) {
        return;
    }
    backgroundMusic.play().catch(() => {});
}


/**
 * Stoppt die Hintergrundmusik und setzt sie auf den Anfang zurück.
 */
function stopMusic() {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
}


/**
 * Schaltet Musik/Sound stumm bzw. wieder an, speichert den Zustand in
 * localStorage und aktualisiert alle Mute-Buttons.
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
 * Aktualisiert Icon bzw. Text aller Mute-Buttons passend zum aktuellen
 * Mute-Zustand.
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
