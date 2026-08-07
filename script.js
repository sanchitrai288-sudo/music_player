 let trackRegistry = [
    { title: "Corporate Ukulele Groove", artist: "Excellence Stock Audio", url: "anthem.mp3" },
    { title: "Ambient Horizon Textures", artist: "Synth Waves Laboratory", url: "har.mp3" },
    { title: "Techno Synthesis Sequence", artist: "Digital Automation Group", url: "mozart.mp3" }
];

const audio = document.getElementById('audioEngine');
const artDisc = document.getElementById('artDisc');
const uiTitle = document.getElementById('uiTitle');
const uiArtist = document.getElementById('uiArtist');
const progressSlider = document.getElementById('progressSlider');
const timeCurrent = document.getElementById('timeCurrent');
const timeTotal = document.getElementById('timeTotal');
const btnPlayPause = document.getElementById('btnPlayPause');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const volumeSlider = document.getElementById('volumeSlider');
const uiQueue = document.getElementById('uiQueue');

let currentTrackIdx = 0;
let isPlaying = false;

function initializePlaylistView() {
    uiQueue.innerHTML = '';

    trackRegistry.forEach((track, idx) => {
        const item = document.createElement('li');
        item.className = `queue-item ${idx === currentTrackIdx ? 'active-track' : ''}`;
        item.innerHTML = `
            <div class="track-info-block" style="flex-grow: 1;" onclick="jumpToTrack(${idx})">
                <div class="track-title" style="font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 240px;">${track.title}</div>
                <div class="track-artist" style="font-size: 0.8rem; color: var(--text-sub);">${track.artist}</div>
            </div>
            <button class="remove-track-btn" onclick="removeTrackFromQueue(event, ${idx})" title="Remove from queue">&times;</button>
        `;
        uiQueue.appendChild(item);
    });
}

function populateTrackFrame() {
    if (trackRegistry.length === 0) return;

    const activeTrack = trackRegistry[currentTrackIdx];
    audio.src = activeTrack.url;
    uiTitle.innerText = activeTrack.title;
    uiArtist.innerText = activeTrack.artist;

    progressSlider.value = 0;
    timeCurrent.innerText = "0:00";
    timeTotal.innerText = "0:00";

    document.querySelectorAll('.queue-item').forEach((item, idx) => {
        item.classList.toggle('active-track', idx === currentTrackIdx);
    });
}

function addTrackToQueue(title, artist, url) {
    if (!title || !artist || !url) {
        alert("Please provide a valid Title, Artist, and MP3 link.");
        return;
    }

    trackRegistry.push({ title, artist, url });
    initializePlaylistView();

    if (trackRegistry.length === 1) {
        currentTrackIdx = 0;
        populateTrackFrame();
    }
}

function removeTrackFromQueue(event, idx) {
    event.stopPropagation();

    if (trackRegistry.length <= 1) {
        alert("Queue Protection Error: The playlist queue must contain at least 1 track.");
        return;
    }

    const trackBeingRemovedIsCurrent = (idx === currentTrackIdx);

    trackRegistry.splice(idx, 1);

    if (trackBeingRemovedIsCurrent) {
        currentTrackIdx = currentTrackIdx % trackRegistry.length;
        populateTrackFrame();
        if (isPlaying) playAudio();
    } else if (idx < currentTrackIdx) {
        currentTrackIdx--;
    }

    initializePlaylistView();
}

function togglePlayState() {
    if (isPlaying) pauseAudio();
    else playAudio();
}

function playAudio() {
    isPlaying = true;
    btnPlayPause.innerHTML = '&#10074;&#10074;';
    btnPlayPause.title = "Pause";
    artDisc.classList.add('playing-disc');
    audio.play().catch(err => console.log("Audio pipeline interaction deferred safely.", err));
}

function pauseAudio() {
    isPlaying = false;
    btnPlayPause.innerHTML = '&#9658;';
    btnPlayPause.title = "Play";
    artDisc.classList.remove('playing-disc');
    audio.pause();
}

function jumpToTrack(idx) {
    currentTrackIdx = idx;
    populateTrackFrame();
    playAudio();
}

function nextTrack() {
    currentTrackIdx = (currentTrackIdx + 1) % trackRegistry.length;
    populateTrackFrame();
    if (isPlaying) playAudio();
    else pauseAudio();
}

function prevTrack() {
    currentTrackIdx = (currentTrackIdx - 1 + trackRegistry.length) % trackRegistry.length;
    populateTrackFrame();
    if (isPlaying) playAudio();
    else pauseAudio();
}

function formatTimeMetric(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const currentPercentage = (audio.currentTime / audio.duration) * 100;
    progressSlider.value = currentPercentage;
    timeCurrent.innerText = formatTimeMetric(audio.currentTime);
});

audio.addEventListener('loadedmetadata', () => {
    timeTotal.innerText = formatTimeMetric(audio.duration);
});

progressSlider.addEventListener('input', () => {
    if (!audio.duration) return;
    const absoluteTargetSecond = (progressSlider.value / 100) * audio.duration;
    audio.currentTime = absoluteTargetSecond;
});

volumeSlider.addEventListener('input', (e) => {
    const targetVol = e.target.value;
    audio.volume = targetVol;

    const volIcon = document.getElementById('volIcon');
    if (parseFloat(targetVol) === 0) volIcon.innerText = "🔇";
    else if (targetVol < 0.4) volIcon.innerText = "🔈";
    else volIcon.innerText = "🔊";
});

audio.addEventListener('ended', () => {
    nextTrack();
    playAudio();
});

btnPlayPause.addEventListener('click', togglePlayState);
btnNext.addEventListener('click', nextTrack);
btnPrev.addEventListener('click', prevTrack);

window.addEventListener('load', () => {
    initializePlaylistView();
    populateTrackFrame();
    audio.volume = volumeSlider.value;
});
