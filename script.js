// ====== AUDIO SETUP ======
const audio = document.getElementById("audio");
const playButton = document.getElementById("playButton");
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");
const lyricsText = document.getElementById("lyricsText");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const source = audioCtx.createMediaElementSource(audio);
const analyser = audioCtx.createAnalyser();
source.connect(analyser);
analyser.connect(audioCtx.destination);

analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

// ====== VISUALIZER ======
function draw() {
  requestAnimationFrame(draw);
  analyser.getByteFrequencyData(dataArray);

  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const barWidth = (canvas.width / bufferLength) * 2.5;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i] * 2;
    const r = barHeight + (25 * (i / bufferLength));
    const g = 250 * (i / bufferLength);
    const b = 50;

    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    x += barWidth + 1;
  }
}

// ====== BATAS WAKTU 25 DETIK ======
playButton.addEventListener("click", () => {
  audioCtx.resume();
  audio.currentTime = 0; // mulai dari awal
  audio.play();
  draw();

  // Stop otomatis setelah 25 detik
  setTimeout(() => {
    audio.pause();
    audio.currentTime = 0;
  }, 25000);
});

// ====== LIRIK OTOMATIS ======
const lyrics = [
  { time: 0, text: "🎵 Gamers idaman, main game bukan alasan" },
  { time: 5, text: "🎮 Fokus, chill, tak perlu drama" },
  { time: 10, text: "🔥 Reza Arap in the zone" },
  { time: 15, text: "💻 Stream nyala, vibe on!" },
  { time: 20, text: "✨ Semua happy, no toxic zone" },
  { time: 25, text: "🎧 Beat turun... dan stop!" }
];

function showLyrics() {
  const currentTime = audio.currentTime;
  const currentLine = lyrics.findLast(l => currentTime >= l.time);
  if (currentLine) lyricsText.textContent = currentLine.text;
}

audio.addEventListener("timeupdate", showLyrics);

    