<div align="center">

# 🐔 El Pollo Loco

**Ein 2D-Jump-and-Run im Browser** — Pepe läuft durch die Wüste, sammelt Münzen und Flaschen, besiegt Hühner und stellt sich am Ende einem Endgegner.

![Screenshot](screenshot.png)

</div>

Das Spiel läuft komplett im Browser auf einem HTML `<canvas>`-Element und ist in reinem, objektorientiertem Vanilla JavaScript geschrieben – ohne Frameworks oder Build-Tools.

---

## ✨ Features

- 🏃 Lauf-, Sprung- und Wurf-Steuerung für die Spielfigur (Tastatur und Touch)
- 🐓 Normale Gegner (Hühner), die durch Sprung von oben oder Flaschenwurf besiegt werden können
- 👹 Endgegner mit eigener Lebensanzeige, Alert-/Angriffs-Animationen und Patrouillenverhalten
- 🪙 Sammelbare Münzen und Flaschen mit eigenen Statusbars im HUD
- 🏁 Start-, Game-Over- und Gewinn-Screen mit Neustart-Funktion
- 🔊 Musik und Soundeffekte mit Mute-Funktion (Taste `M` oder Button)
- 📱 Mobile Touch-Steuerung inkl. Hinweis zum Drehen des Geräts ins Querformat

## 🎮 Steuerung

| Taste            | Aktion                            |
|-------------------|------------------------------------|
| `←` / `→`         | Laufen                            |
| `↑` / Leertaste   | Springen                          |
| `D`               | Flasche werfen                    |
| `M`               | Musik/Sound ein- und ausschalten  |

Auf Mobilgeräten stehen stattdessen Touch-Buttons am unteren Bildschirmrand zur Verfügung.

## 🚀 Projekt lokal starten

Da das Spiel Bilder und Sounds über relative Pfade lädt, sollte es über einen lokalen Server geöffnet werden (nicht per Doppelklick auf `index.html`):

```bash
# im Projektordner
python -m http.server 8000
```

Anschließend im Browser `http://localhost:8000` öffnen.

## 📁 Projektstruktur

```
El_Pollo_Loco/
├── index.html                       Einstiegspunkt, Canvas und UI-Overlays
├── style.css                        Layout, Overlays, Theme
├── audio/                           Musik & Soundeffekte (.mp3)
├── fonts/                           Zabars.ttf
├── img/                             Sprites, Hintergründe, Icons, Statusbars
├── js/
│   ├── game.js                      Spielzustand (Start/Game Over/Gewinn/Neustart), Tastatur & Touch
│   ├── sounds.js                    Sound- und Musikwiedergabe
│   └── levels/
│       └── level1.js                Aufbau des ersten Levels
└── models/
    ├── drawable-objects.class.js    Basisklasse: Zeichnen & Animation
    ├── movable-object.class.js      Basisklasse: Bewegung, Schwerkraft, Kollision
    ├── character.class.js           Spielfigur (Pepe)
    ├── chicken.class.js             Normale Gegner
    ├── endboss.class.js             Endgegner
    ├── throwable-objects.class.js   Geworfene Flaschen
    ├── coin.class.js                Sammelobjekt: Münze
    ├── bottle.class.js              Sammelobjekt: Flasche
    ├── status-bar.class.js          HUD-Statusbars (Leben/Coins/Flaschen/Endgegner)
    ├── cloud.class.js               Wolken
    ├── background-object.class.js   Hintergrund-Layer
    ├── level.class.js               Level-Daten
    ├── keyboard.class.js            Tastatur-Zustand
    └── world.class.js               Zentrale Spiellogik (Kollisionen, Zeichnen, Loop)
```

## 🛠️ Technik

- Reines Vanilla JavaScript (ES6-Klassen), kein Framework
- Rendering über die HTML5-Canvas-API
- Keine Build-Schritte oder Abhängigkeiten nötig

---

<div align="center">

Dieses Projekt entstand im Rahmen eines Kursprojekts und dient Lernzwecken.

</div>
