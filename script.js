const songName = document.getElementById("song-name");
const bandName = document.getElementById("band-name");
const song = document.getElementById("audio");
const cover = document.getElementById("cover");
const play = document.getElementById("play");
const next = document.getElementById("next");
const previous = document.getElementById("previous");
const currentProgress = document.getElementById("current-progress");
const progressContainer = document.getElementById("progress-bar");
const shuffleButton = document.getElementById("shuffle");
const repeatButton = document.getElementById("repeat");
const songTime = document.getElementById("song-time");
const totalTime = document.getElementById("total-time");

const youMe = {
  songName: "You & Me",
  artist: "James TW",
  file: "James TW-You & Me",
};

const soyLunaEres = {
  songName: "Eres",
  artist: "Michael Ronda e Karol Sevilla",
  file: "SoyLunaEres",
};

let isPlaying = false;
let isShuffled = false;
let repeatOn = false;
const originalPlaylist = [youMe,soyLunaEres];
let sortedPlaylist = [...originalPlaylist];
let index = 0;

function playSong() {
  play.querySelector(".bi").classList.remove("bi-play-circle-fill");
  play.querySelector(".bi").classList.add("bi-pause-circle-fill");
  song.play();
  isPlaying = true;
  document.querySelector(".music-container").classList.add("playing");
  showOverlay();
}

function pauseSong() {
  play.querySelector(".bi").classList.add("bi-play-circle-fill");
  play.querySelector(".bi").classList.remove("bi-pause-circle-fill");
  song.pause();
  isPlaying = false;
  document.querySelector(".music-container").classList.remove("playing");
  hideOverlay();
}

function playPauseDecider() {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
}

function initializeSong() {
  cover.src = `imagens/${sortedPlaylist[index].file}.webp`;
  song.src = `imagens/songs/${sortedPlaylist[index].file}.mp3`;
  songName.innerText = sortedPlaylist[index].songName;
  bandName.innerText = sortedPlaylist[index].artist;
  updateOverlayInfo(); // sync the overlay with current track
}

function previousSong() {
  if (index === 0) {
    index = sortedPlaylist.length - 1;
  } else {
    index -= 1;
  }
  initializeSong();
  playSong();
}

function nextSong() {
  if (index === sortedPlaylist.length - 1) {
    index = 0;
  } else {
    index += 1;
  }
  initializeSong();
  playSong();
}

function updateProgressBar() {
  const barWidth = (song.currentTime / song.duration) * 100;
  currentProgress.style.width = `${barWidth}%`;
  songTime.innerText = toHHMMSS(song.currentTime);
}

function jumpTo(event) {
  const width = progressContainer.clientWidth;
  const clickPosition = event.offsetX;
  const jumpToTime = (clickPosition / width) * song.duration;
  song.currentTime = jumpToTime;
}

function shuffleArray(preShuffleArray) {
  const size = preShuffleArray.length;
  let currentIndex = size - 1;
  while (currentIndex > 0) {
    let randomIndex = Math.floor(Math.random() * size);
    let aux = preShuffleArray[currentIndex];
    preShuffleArray[currentIndex] = preShuffleArray[randomIndex];
    preShuffleArray[randomIndex] = aux;
    currentIndex -= 1;
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
    index = 0;
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
  if (repeatOn === false) {
    nextSong();
  } else {
    playSong();
  }
}

function toHHMMSS(seconds) {
  if (isNaN(seconds)) return "00:00";

  const min = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  const formattedMin = String(min).padStart(2, "0");
  const formattedSecs = String(secs).padStart(2, "0");

  return `${formattedMin}:${formattedSecs}`;
}

function updateTotalTime() {
  totalTime.innerText = toHHMMSS(song.duration);
}

// when a new song is initialized we also update fancy overlay info
function updateOverlayInfo() {
  const current = sortedPlaylist[index];
  const largeCover = document.getElementById("cover-large");
  const overlaySongName = document.getElementById("overlay-song-name");
  const overlayArtistName = document.getElementById("overlay-artist-name");

  if (largeCover) largeCover.src = `imagens/${current.file}.webp`;
  if (overlaySongName) overlaySongName.textContent = current.songName;
  if (overlayArtistName) overlayArtistName.textContent = current.artist;
}

function showOverlay() {
  const ov = document.getElementById("now-playing");
  if (ov) ov.classList.remove("hidden");
}

function hideOverlay() {
  const ov = document.getElementById("now-playing");
  if (ov) ov.classList.add("hidden");
}

// close button on overlay
const closeButton = document.getElementById("close-overlay");
if (closeButton) {
  closeButton.addEventListener("click", () => {
    hideOverlay();
  });
}

// close message box when its own button is pressed
const closeMsg = document.getElementById("close-msg");
if (closeMsg) {
  closeMsg.addEventListener("click", () => {
    const msg = document.getElementById("mensagem");
    if (msg) msg.classList.remove("visible");
  });
}

// attach listener to the message toggle button (styled via .message-btn class)
const msgBtn = document.getElementById("message-btn");
if (msgBtn) {
  msgBtn.addEventListener("click", mostrarMensagem);
}
play.addEventListener("click", playPauseDecider);
previous.addEventListener("click", previousSong);
next.addEventListener("click", nextSong);
song.addEventListener("timeupdate", updateProgressBar);
song.addEventListener("ended", nextOrRepeat);
song.addEventListener("loadedmetadata", updateTotalTime);
progressContainer.addEventListener("click", jumpTo);
shuffleButton.addEventListener("click", shuffleButtonClicked);
repeatButton.addEventListener("click", repeatButtonClicked);

initializeSong();

// anniversary start date (changed to Feb 11 per request)
const dataInicio = new Date("2026-02-11");

function atualizarTempo() {
  // re‑use the module‑level dataInicio instead of redeclaring
  const agora = new Date();

  let anos = agora.getFullYear() - dataInicio.getFullYear();
  // month difference ignoring days
  let meses = agora.getMonth() - dataInicio.getMonth();
  let dias = agora.getDate() - dataInicio.getDate();

  // if current day is before the start day, borrow days from previous month
  // and subtract one so that the count excludes the start day itself.
  // e.g. 11 fev → 10 mar should yield 27 dias, not 28.
  if (dias < 0) {
    const ultimoMes = new Date(agora.getFullYear(), agora.getMonth(), 0);
    dias += ultimoMes.getDate();
    dias -= 1; // correct off-by-one after the borrow
    meses--; // decrement month because we haven't reached the full month yet
  }

  // if month difference went negative, borrow a year
  if (meses < 0) {
    anos--;
    meses += 12;
  }

  // convert to inclusive count (Feb→Mar counts as 2 months, etc.)
  meses += 1;
  // if we rolled exactly into another year
  if (meses === 12) {
    anos++;
    meses = 0;
  }

  const horas = agora.getHours();
  const minutos = agora.getMinutes();
  const segundos = agora.getSeconds();

  document.getElementById("meses").innerHTML = meses;
  document.getElementById("dias").innerHTML = dias;
  document.getElementById("horas").innerHTML = horas;
  document.getElementById("minutos").innerHTML = minutos;
  document.getElementById("segundos").innerHTML = segundos;
}

setInterval(atualizarTempo, 1000);

function mostrarMensagem() {
  const msg = document.getElementById("mensagem");
  if (!msg) return;

  // toggle a class so we can animate the entrance/exit via CSS
  msg.classList.toggle("visible");
}
