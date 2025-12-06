// Theme
function toggleTheme() {
    document.body.classList.toggle("light");
    localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
}

if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light");
}

function openExternalLink() {
        window.open('https://militares.estrategia.com/mesa-de-estudo', '_blank');
}

// Checkboxes
const checkboxes = document.querySelectorAll("input[type='checkbox']");
const dayCards = document.querySelectorAll(".day");

checkboxes.forEach((cb, index) => {
    const saved = localStorage.getItem("cb_" + index);
    if (saved === "true") cb.checked = true;

    cb.addEventListener("change", () => {
        saveCheckbox(index, cb.checked);
    });
});

function saveCheckbox(index, checked) {
    localStorage.setItem("cb_" + index, checked);
    updateChart();
    updateCounter();
}

// Click
dayCards.forEach((card, index) => {
    const checkbox = card.querySelector("input[type='checkbox']");
    card.addEventListener("click", (e) => {
        if (e.target !== checkbox) {
            checkbox.checked = !checkbox.checked;
            saveCheckbox(index, checkbox.checked);
        }
    });
});

function clearAll() {
    checkboxes.forEach((cb, index) => {
        cb.checked = false;
        localStorage.setItem("cb_" + index, false);
    });
    updateChart();
    updateCounter();
}

// Task
function updateCounter() {
    const total = checkboxes.length;
    const done = [...checkboxes].filter(cb => cb.checked).length;
    const counter = document.getElementById("taskCounter");

    counter.textContent = `${done}/${total} concluídos`;
    counter.style.color = done === total ? "#00e676" : "var(--text)";

    updateProgressBar(done, total);
}

// Progress bar
function updateProgressBar(done, total) {
    const bar = document.getElementById("progressBarFill");
    const percent = (done / total) * 100;
    bar.style.width = percent + "%";
}

// Chart
let ctx = document.getElementById("progressChart");
let progressChart = new Chart(ctx, {
    type: "doughnut",
    data: {
        labels: ["Concluído", "Restante"],
        datasets: [{
            data: [0, 1],
            backgroundColor: ["#e63946", "#555"],
            borderWidth: 0
        }]
    },
    options: { cutout: "60%", animation: { duration: 800 } }
});

function updateChart() {
    const total = checkboxes.length;
    const done = [...checkboxes].filter(cb => cb.checked).length;

    progressChart.data.datasets[0].data = [done, total - done];
    progressChart.update();
}

// Music Player
const songs = [
    "musicas/Music1.mp3",
    "musicas/Music2.mp3",
    "musicas/Music3.mp3"
];

const songNames = ["Praise", "King David", "Daydream"];

const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const title = document.getElementById("song-title");
const toggle = document.getElementById("toggle-player");

let currentSong = 0;
let isPlaying = false;

const audio = new Audio(songs[currentSong]);
title.textContent = songNames[currentSong];
audio.volume = 1;

playBtn.onclick = () => {
    if (!isPlaying) {
        audio.play();
        playBtn.textContent = "⏸";
    } else {
        audio.pause();
        playBtn.textContent = "▶";
    }
    isPlaying = !isPlaying;
};

nextBtn.onclick = () => changeSong(1);
prevBtn.onclick = () => changeSong(-1);

function changeSong(direction) {
    currentSong = (currentSong + direction + songs.length) % songs.length;

    audio.src = songs[currentSong];
    title.textContent = songNames[currentSong];

    audio.play();
    isPlaying = true;
    playBtn.textContent = "⏸";
}

audio.onended = () => changeSong(1);

audio.ontimeupdate = () => {
    if (audio.duration) {
        progress.value = (audio.currentTime / audio.duration) * 100;
    }
};

progress.oninput = () => {
    audio.currentTime = (progress.value / 100) * audio.duration;
};

volume.oninput = () => {
    audio.volume = volume.value;
};

// Minimize Player
toggle.onclick = () => {
    const player = document.getElementById("music-player");
    player.classList.toggle("minimized");
    toggle.textContent = player.classList.contains("minimized") ? "▣" : "—";
};

// Initialization
updateChart();
updateCounter();
