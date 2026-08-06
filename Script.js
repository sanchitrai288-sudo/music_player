// --- MANIFEST LOCAL PLAYLIST DATABASE REPOSITORY ---
let trackRegistry = [
    {
        title: "Corporate Ukulele Groove",
        artist: "Excellence Stock Audio",
        url: "anthem.mp3"
    },
    {
        title: "Ambient Horizon Textures",
        artist: "Synth Waves Laboratory",
        url: "har.mp3"
    },
    {
        title: "Techno Synthesis Sequence",
        artist: "Digital Automation Group",
        url: "mozart.mp3"
    }
];

// --- MAIN ENGINE DOM CONNECTIONS ---
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

// State Tracking Register Context
let currentTrackIdx = 0;
let isPlaying = false;

// --- CONSTRUCT EDITABLE PLAYLIST INTERFACES ---
function initializePlaylistView() {
    uiQueue.innerHTML = '';
    
    trackRegistry.forEach((track, idx) => {
        const item = document.createElement('li');
        item.className = `queue-item ${idx === currentTrackIdx ? 'active-track' : ''}`;
        
        // Main block triggers track jump; inline button handles deletion natively
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

// --- RE-MAP ACTIVE PIPELINE METADATA ATTRIBUTES ---
function populateTrackFrame() {
    if (trackRegistry.length === 0) return;

    const activeTrack = trackRegistry[currentTrackIdx];
    audio.src = activeTrack.url;
    uiTitle.innerText = activeTrack.title;
    uiArtist.innerText = activeTrack.artist;
    
    // Reset slider timeline metrics concurrently
    progressSlider.value = 0;
    timeCurrent.innerText = "0:00";
    timeTotal.innerText = "0:00";

    // Update target index alignment values within queue elements visually
    document.querySelectorAll('.queue-item').forEach((item, idx) => {
        item.classList.toggle('active-track', idx === currentTrackIdx);
    });
}

// --- QUEUE MODIFICATION ENGINE (EDIT FUNCTIONS) ---

// 1. Add Track Function
function addTrackToQueue(title, artist, url) {
    if (!title || !artist || !url) {
        alert("Please provide a valid Title, Artist, and MP3 link.");
        return;
    }
    
    trackRegistry.push({ title, artist, url });
    initializePlaylistView();
    
    // If the queue was sitting empty (not applicable under a 1-item minimum restriction rule)
    if (trackRegistry.length === 1) {
        currentTrackIdx = 0;
        populateTrackFrame();
    }
}

// 2. Delete Track Function (With a Minimum constraint of 1)
function removeTrackFromQueue(event, idx) {
    // CRITICAL: Stop click from trickling down and accidentally launching the song while deleting it
    event.stopPropagation();

    // LEAST ELEMENT RULE: Validate length constraints before processing structural changes
    if (trackRegistry.length <= 1) {
        alert("Queue Protection Error: The playlist queue must contain at least 1 track.");
        return;
    }

    const trackBeingRemovedIsCurrent = (idx === currentTrackIdx);

    // Remove the target track from our data array
    trackRegistry.splice(idx, 1);

    // Adjust indices to prevent playback tracking offsets
    if (trackBeingRemovedIsCurrent) {
        // Wrap around gracefully if we deleted the final item in the array list indexing positions
        currentTrackIdx = currentTrackIdx % trackRegistry.length;
        populateTrackFrame();
        if (isPlaying) playAudio();
    } else if (idx < currentTrackIdx) {
        // Shift indexing target pointer back one step if an item above it dropped out
        currentTrackIdx--;
    }

    // Refresh UI playlist grid layout variables
    initializePlaylistView();
}

// --- CONTEXT MEDIA DISPATCH SYSTEM RULES ---
function togglePlayState() {
    if (isPlaying) pauseAudio();
    else playAudio();
}

function playAudio() {
    isPlaying = true;
    btnPlayPause.innerHTML = '&#10074;&#10074;'; // Set UI symbol to Pause
    btnPlayPause.title = "Pause";
    artDisc.classList.add('playing-disc');
    audio.play().catch(err => console.log("Audio pipeline interaction deferred safely.", err));
}

function pauseAudio() {
    isPlaying = false;
    btnPlayPause.innerHTML = '&#9658;'; // Set UI symbol to Play
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

// --- TIME CONVERTOR TRANSLATION TRANSFORMER ---
function formatTimeMetric(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// --- GLOBAL AUDIO CAPTURE INTERACTIVE LISTENERS ---

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

// Bind physical controls
btnPlayPause.addEventListener('click', togglePlayState);
btnNext.addEventListener('click', nextTrack);
btnPrev.addEventListener('click', prevTrack);

// --- RUNTIME BOOTSTRAP ENVIRONMENT INITIALIZATION ---
window.addEventListener('load', () => {
    initializePlaylistView();
    populateTrackFrame();
    audio.volume = volumeSlider.value;
});
