// list of songs
var songs = [
  { name: "Wandering Light", artist: "SoundHelix", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { name: "Night Drive", artist: "SoundHelix", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { name: "Open Road", artist: "SoundHelix", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { name: "Slow Burn", artist: "SoundHelix", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" }
];

var currentSong = 0;
var isPlaying = false;

var audio = document.getElementById("myAudio");
var playBtn = document.getElementById("playBtn");
var songName = document.getElementById("songName");
var artistName = document.getElementById("artistName");
var currentTime = document.getElementById("currentTime");
var totalTime = document.getElementById("totalTime");
var playlist = document.getElementById("playlist");
var progressBar = document.getElementById("progressBar");

// show the playlist on the page
function showPlaylist() {
  playlist.innerHTML = "";

  for (var i = 0; i < songs.length; i++) {
    var li = document.createElement("li");
    li.textContent = songs[i].name + " - " + songs[i].artist;

    if (i === currentSong) {
      li.className = "playing";
    }

    // use a closure so the right index is used when clicked
    li.onclick = (function(index) {
      return function() {
        loadSong(index);
        audio.play();
        isPlaying = true;
        playBtn.textContent = "⏸";
      };
    })(i);

    playlist.appendChild(li);
  }
}

// load a song by index
function loadSong(index) {
  currentSong = index;
  audio.src = songs[index].url;
  songName.textContent = songs[index].name;
  artistName.textContent = songs[index].artist;
  showPlaylist();
}

// play or pause the song
function playPause() {
  if (isPlaying) {
    audio.pause();
    playBtn.textContent = "▶";
  } else {
    audio.play();
    playBtn.textContent = "⏸";
  }
  isPlaying = !isPlaying;
}

// go to next song
function nextSong() {
  currentSong = currentSong + 1;
  if (currentSong >= songs.length) {
    currentSong = 0;
  }
  loadSong(currentSong);
  audio.play();
  isPlaying = true;
  playBtn.textContent = "⏸";
}

// go to previous song
function prevSong() {
  currentSong = currentSong - 1;
  if (currentSong < 0) {
    currentSong = songs.length - 1;
  }
  loadSong(currentSong);
  audio.play();
  isPlaying = true;
  playBtn.textContent = "⏸";
}

// change volume
function changeVolume() {
  var vol = document.getElementById("volumeControl").value;
  audio.volume = vol / 100;
}

// click on progress bar to jump to a part of the song
function seek(e) {
  var barWidth = e.currentTarget.offsetWidth;
  var clickX = e.offsetX;
  var newTime = (clickX / barWidth) * audio.duration;
  audio.currentTime = newTime;
}

// format seconds into minutes:seconds
function formatTime(seconds) {
  var min = Math.floor(seconds / 60);
  var sec = Math.floor(seconds % 60);
  if (sec < 10) {
    sec = "0" + sec;
  }
  return min + ":" + sec;
}

// update progress bar and time while song is playing
audio.ontimeupdate = function() {
  currentTime.textContent = formatTime(audio.currentTime);

  var percent = (audio.currentTime / audio.duration) * 100;
  progressBar.style.width = percent + "%";
};

// update total time once song info is loaded
audio.onloadedmetadata = function() {
  totalTime.textContent = formatTime(audio.duration);
};

// when song ends, play the next one
audio.onended = function() {
  nextSong();
};

// start with the first song loaded (but not playing)
loadSong(currentSong);
audio.volume = 0.8;
