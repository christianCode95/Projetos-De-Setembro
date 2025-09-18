document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("audio-element");
  const songTitle = document.getElementById("song-title");
  const songArtist = document.getElementById("song-artist");
  const prevButton = document.getElementById("prev-button");
  const playPauseButton = document.getElementById("play-pause-button");
  const nextButton = document.getElementById("next-button");
  const progressBar = document.getElementById("progress-bar");
  const currentTimeSpan = document.getElementById("current-time");
  const durationTimeSpan = document.getElementById("duration-time");
  const volumeBar = document.getElementById("volume-bar");
  const fileInput = document.getElementById("file-input");
  const addSongsButton = document.getElementById("add-songs-button");
  const playlistUl = document.getElementById("playlist");

  let playlist = [];
  let currentSongIndex = -1;
  let isPlaying = false;
  /**
   * @param {number} seconds
   * @return {string}
   */
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  }
  /**
   * @param {number} index
   */
  function loadSong(index) {
    if (playlist.length === 0) {
      songTitle.textContent = "Nenhuma música carregada";
      songArtist.textContent = "Carregue suas músicas para começar!";
      audio.src = "";
      progressBar.value = 0;
      currentTimeSpan.textContent = "00:00";
      durationTimeSpan.textContent = "00:00";
      playPauseButton.innerHTML = "<i class='fas fa-play'></i>";
      isPlaying = false;
      return;
    }
    if (index < 0) {
      currentSongIndex = playlist.length - 1;
    } else if (index >= playlist.length) {
      currentSongIndex = 0;
    } else {
      currentSongIndex = index;
    }
    const song = playlist[currentSongIndex];
    audio.src = song.url;
    songTitle.textContent = song.name;
    songArtist.textContent = song.file.name.includes("-")
      ? song.file.name.split("-")[0].trim()
      : "Artista Desconhecido";
    updatePlaylistActiveClass();
    if (isPlaying) {
      audio.play();
    } else {
      playPauseButton.innerHTML = "<i class='fas fa-play'></i>";
    }
  }
  function playSong() {
    if (playlist.length === 0) {
      alert("Por favor, adicione músicas à lista de reprodução primeiro.");
      return;
    }
    if (audio.src === "" && currentIndex === -1) {
      loadSong(0);
    }
    audio.play();
    isPlaying = true;
    playPauseButton.innerHTML = "<i class='fas fa-pause'></i>";
  }
  function pauseSong() {
    audio.pause();
    isPlaying = false;
    playPauseButton.innerHTML = "<i class='fas fa-play'></i>";
  }
  function togglePlayPause() {
    if (isPlaying) {
      pauseSong();
    } else {
      playSong();
    }
  }
  function nextSong() {
    if (playlist.length === 0) return;
    loadSong(currentSongIndex + 1);
    playSong();
  }
  function prevSong() {
    if (playlist.length === 0) return;
    loadSong(currentSongIndex - 1);
    playSong();
  }
  function renderPlaylist() {
    playlistUl.innerHTML = "";
    if(playlist.length === 0){
        const emptyMessage = document.createElement("li");
        emptyMessage.classList.add("empty-playlist-message");
        emptyMessage.textContent = "Nenhuma música na lista de reprodução. Clique em 'Adicionar Músicas' para começar.";
        playlistUl.appendChild(emptyMessage);
        return;
    }
    playlist.forEach((song, index) => {
      const li = document.createElement("li");
      li.textContent = song.name;
      li.dataset.index = index;
      if(index === currentSongIndex){
        li.classList.add("active");
      }
      li.addEventListener("click", () => {
        loadSong(index);
        playSong();
      });
      playlistUl.appendChild(li);
    });
  }
  function updatePlaylistActiveClass() {
    document.querySelectorAll("#playlist li").forEach((li) => {
      li.classList.remove("active");
    });
    if(currentSongIndex !== -1 && playlist[currentSongIndex]){
      const activeLi = playlistUl.querySelector(`li[data-index='${currentSongIndex}']`);
      if(activeLi){
        activeLi.classList.add("active");
        activeLi.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    } 
  }
  playPauseButton.addEventListener("click", togglePlayPause);
  nextButton.addEventListener("click", nextSong);
  prevButton.addEventListener("click", prevSong);
  audio.addEventListener("timeupdate", () => {
    const currentTime = audio.currentTime;
    const duration = audio.duration;
    if(!isNaN(duration)){
      durationTimeSpan.textContent = formatTime(duration);
      progressBar.value = (currentTime / duration) * 100;
    } else{
      durationTimeSpan.textContent = "00:00";
      progressBar.value = 0;
    }
  });
  audio.addEventListener('loadedmetadata', () => {
    const duration = audio.duration;
    if(!isNaN(duration)){
      durationTimeSpan.textContent = formatTime(duration);
      progressBar.max = 100;
    }
  });
  audio.addEventListener("ended", () =>{
    nextSong();
  });
  progressBar.addEventListener("input", () => {
    const seekTime = (progressBar.value / 100) * audio.duration;
    audio.currentTime = seekTime;
  });
  volumeBar.addEventListener("input", () => {
    audio.volume = volumeBar.value / 100;
  });
  audio.volume = 1;
  addSongsButton.addEventListener("click", () => {
    fileInput.click();
  });
  fileInput.addEventListener("change", (e) => {
    const files = e.target.files;
    if(files.length === 0) return;
    playlist = [];
    currentIndex = -1;
    Array.from(files).forEach((file) => {
      if(file.type.startsWith("audio/")){
        const url = URL.createObjectURL(file);
        playlist.push({ name: file.name.replace(/\.(mp3|wav|ogg)$/i, "").trim(), file: file, url: url });
      } else{
        alert(`O arquivo "${file.name}" não é um arquivo de áudio válido e será ignorado.`);
      }
    });
    renderPlaylist();
    if(playlist.length > 0 && !isPlaying){
      loadSong(0);
    }
  });
  renderPlaylist();
  loadSong(-1);
});
