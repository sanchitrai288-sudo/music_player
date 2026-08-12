# 🎵 Simple Audio Player

A simple music player built using **HTML, CSS, and JavaScript**. It lets you play songs, skip between tracks, control volume, and pick songs from a playlist — all in the browser.

## Features

- ▶️ Play / Pause button
- ⏮ ⏭ Next and Previous song buttons
- 🎚️ Volume control slider
- 📊 Progress bar (click to jump to any part of the song)
- ⏱️ Shows current time and total duration
- 📃 Clickable playlist — click any song to play it directly
- 🔁 Automatically plays the next song when one ends

## Tech Used

- **HTML** – page structure
- **CSS** – styling and layout (dark theme design)
- **JavaScript** – player logic (play/pause, switching songs, volume, progress bar)

No frameworks or libraries used — plain HTML, CSS, and JS only.

## File Structure

```
audio-player/
│
├── index.html   → page structure
├── style.css    → styling
└── script.js    → player functionality
```

## How to Use

1. Download or clone this project.
2. Open `index.html` in your browser.
3. Click **Play** to start listening, or pick a song from the playlist.

## How to Add Your Own Songs

Open `script.js` and edit the `songs` list at the top:

```javascript
var songs = [
  { name: "Song Name", artist: "Artist Name", url: "your-song-link.mp3" },
];
```

Add as many songs as you like — just follow the same format.

## Live Demo
https://sanchitrai288-sudo.github.io/music_player/
