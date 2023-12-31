const songName = document.getElementById("song-name");
const bandName = document.getElementById("band-name");
const cover = document.getElementById("cover");
const song = document.getElementById("audio");
const play = document.getElementById("play");
const next = document.getElementById("next");
const previous = document.getElementById("previous");
const likeButton = document.getElementById("like");
const currentPorgress = document.getElementById("current-progress");
const progressContainer = document.getElementById("progress-container");
const shuffleButton = document.getElementById("shuffle");
const repeatButton = document.getElementById("repeat");
const songTime = document.getElementById("song-time");
const totalTime = document.getElementById("total-time");

const fe = {
    songName: "Fé",
    artist: "3030 feat. Rael",
    file: "3030_feat_Rael_Fe",
    cover: "infinitointerno-capa",
    liked: false,
};
const almaDeCigana = {
    songName: "Alma de Cigana",
    artist: "3030",
    file: "3030_Alma_De_Cigana",
    cover: "infinitointerno-capa",
    liked: false,
};
const oxala = {
    songName: "Oxalá",
    artist: "3030",
    file: "3030_Oxala",
    cover: "infinitointerno-capa",
    liked: false,
};

let isPlaying = false;
let isShuffled = false;
let repeatOn = false;
const originalPlaylist = JSON.parse(localStorage.getItem("playlist")) ?? [
    fe,
    almaDeCigana,
    oxala,
];
let sortedPlaylist = [...originalPlaylist];
let index = 0;

function playSong() {
    play.querySelector(".bi").classList.remove("bi-play-circle-fill");
    play.querySelector(".bi").classList.add("bi-pause-circle-fill");

    song.play();
    isPlaying = true;
}

function pauseSong() {
    play.querySelector(".bi").classList.add("bi-play-circle-fill");
    play.querySelector(".bi").classList.remove("bi-pause-circle-fill");

    song.pause();
    isPlaying = false;
}

function playPauseDecider() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

function likeButtonRender() {
    if (sortedPlaylist[index].liked === true) {
        likeButton.querySelector(".bi").classList.remove("bi-heart");
        likeButton.querySelector(".bi").classList.add("bi-heart-fill");
        likeButton.classList.add("button-active");
    } else {
        likeButton.querySelector(".bi").classList.remove("bi-heart-fill");
        likeButton.querySelector(".bi").classList.add("bi-heart");
        likeButton.classList.remove("button-active");
    }
}

function loadSong() {
    cover.src = `images/${sortedPlaylist[index].cover}.webp`;
    song.src = `songs/${sortedPlaylist[index].file}.mp3`;
    songName.innerText = sortedPlaylist[index].songName;
    bandName.innerText = sortedPlaylist[index].artist;
    likeButtonRender();
}

function previousSong() {
    index--;
    if (index < 0) {
        index = sortedPlaylist.length - 1;
    }
    loadSong();
    playSong();
}

function nextSong() {
    index++;
    if (index >= sortedPlaylist.length) {
        index = 0;
    }
    loadSong();
    playSong();
}

function updateProgress() {
    const barWith = (song.currentTime / song.duration) * 100;
    currentPorgress.style.setProperty("--progress", `${barWith}%`);
    songTime.innerText = toHHMMSS(song.currentTime);
}

function jumpToProgress(event) {
    const width = progressContainer.clientWidth;
    const clickPosition = event.offsetX;
    song.currentTime = (clickPosition / width) * song.duration;
}

function shuffleArray(preShuffleArray) {
    const size = preShuffleArray.length;
    let currentIndex = size - 1;
    while (currentIndex > 0) {
        let randomIndex = Math.floor(Math.random() * size);
        let aux = preShuffleArray[currentIndex];
        preShuffleArray[currentIndex] = preShuffleArray[randomIndex];
        preShuffleArray[randomIndex] = aux;
        currentIndex--;
    }
}

function shuffleButtonClicked() {
    if (isShuffled === false) {
        isShuffled = true;
        shuffleArray(sortedPlaylist);
        shuffleButton.classList.add("button-active");
    } else {
        isShuffled = false;
        sortedPlaylist = [...originalPlaylist];
        shuffleButton.classList.remove("button-active");
    }
}

function repeatButtonClicked() {
    if (repeatOn === false) {
        repeatOn = true;
        repeatButton.classList.add("button-active");
    } else {
        repeatOn = false;
        repeatButton.classList.remove("button-active");
    }
}

function nextOrRepeat() {
    if (repeatOn) {
        playSong();
    } else {
        nextSong();
    }
}

function toHHMMSS(originalNumber) {
    const hours = Math.floor(originalNumber / 3600);
    const minutes = Math.floor((originalNumber - hours * 3600) / 60);
    const seconds = Math.floor(originalNumber - hours * 3600 - minutes * 60);

    return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function updateTotalTime() {
    totalTime.innerText = toHHMMSS(song.duration);
}

function likeButtonClicked() {
    sortedPlaylist[index].liked = !sortedPlaylist[index].liked;
    likeButtonRender();
    localStorage.setItem("playlist", JSON.stringify(originalPlaylist));
}

loadSong();

play.addEventListener("click", playPauseDecider);
next.addEventListener("click", nextSong);
previous.addEventListener("click", previousSong);
song.addEventListener("timeupdate", updateProgress);
song.addEventListener("ended", nextOrRepeat);
song.addEventListener("loadedmetadata", updateTotalTime);
progressContainer.addEventListener("click", jumpToProgress);
shuffleButton.addEventListener("click", shuffleButtonClicked);
repeatButton.addEventListener("click", repeatButtonClicked);
likeButton.addEventListener("click", likeButtonClicked);
