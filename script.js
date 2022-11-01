// Definisi konstanta kondisi skor (0: batu, 1: kertas, 2: gunting)
const CONDITIONS = [
    ["DRAW", "LOSE", "WIN"],
    ["WIN", "DRAW", "LOSE"],
    ["LOSE", "WIN", "DRAW"],
];

// Pengambilan Element DOM
let menu = document.querySelector(".menu-container");
let game = document.querySelector(".game");
let credits = document.querySelector(".credits");
let historyBoard = document.querySelector(".history");
let timerEl = document.querySelector("#timer");
let scoreEl = document.querySelector("#score");
let historyEl = document.querySelector("#history-table > tbody");
let symbols = document.querySelector(".symbols").children;

// Setup variabel
let countdown;
let scoreboard = {
    win: 0,
    lose: 0,
    draw: 0,
};

// Ambil riwayat skor yang disimpan pada local storage
let history = JSON.parse(localStorage.getItem("history") || "[]");

// Ulangi timer permainan setelah delay detik
function resetTimer(delay) {
    clearInterval(countdown); // Hapus timer lama (jika ada)
    timerEl.innerHTML = "10";
    setTimeout(() => {
        countdown = setInterval(() => {
            let i = parseInt(timerEl.innerHTML);
            if (i === 0) { // Waktu habis
                endRound("LOSE");
                timerEl.innerHTML = "10";
            } else {
                i -= 1;
                timerEl.innerHTML = i.toString();
            }
        }, 1000);
    }, delay * 1000);
}

// Ubah permainan ke dark mode
function darkMode(event) {
    let rootClasses = document.documentElement.classList;
    if (rootClasses.contains("dark-mode")) {
        rootClasses.remove("dark-mode");
    } else {
        rootClasses.add("dark-mode");
    }
}

// Mulai permainan
function start(event) {
    menu.classList.add("started");
    game.classList.add("started");
    resetTimer(1);
}

// Hentikan permainan
function stop(event) {
    menu.classList.remove("started");
    game.classList.remove("started");
    clearInterval(countdown); // Hapus timer
    timerEl.innerHTML = 10;

    // Update riwayat permainan
    history.push(JSON.stringify(scoreboard));
    localStorage.setItem("history", JSON.stringify(history));
    for (let key of Object.keys(scoreboard)) {
        scoreboard[key] = 0;
    }
    scoreEl.innerHTML = "0-0";
    insertHistory();
}

// Akhiri ronde (menang/kalah/draw)
function endRound(cond) {
    let currentScore = scoreEl.innerHTML.split("-");

    // Periksa hasil ronde
    if (cond === "WIN") {
        scoreboard.win += 1;
        currentScore[0] = scoreboard.win.toString();
    } else if (cond === "DRAW") {
        scoreboard.draw += 1;
    } else if (cond === "LOSE") {
        scoreboard.lose += 1;
        currentScore[1] = scoreboard.lose.toString();
    }

    // Tampilkan hasil ronde
    symbols[cond.toLowerCase()].classList.add("blink");
    game.classList.add("blink");
    setTimeout(() => {
        symbols[cond.toLowerCase()].classList.remove("blink");
        game.classList.remove("blink");
    }, 2000);
    scoreEl.innerHTML = currentScore.join("-");

    resetTimer(2);
}

// Mainkan permainan
function play(event) {
    let playerHand = event.target.closest("[data-index]").dataset.index;
    let opponentHand = Math.floor(Math.random() * 3); // Pilihan lawan
    endRound(CONDITIONS[playerHand][opponentHand]);
}

// Update menu riwayat
function insertHistory() {
    historyEl.replaceChildren();
    for (let i = 0; i < history.length; i++) {
        let data = JSON.parse(history[i]);
        let newRow = document.createElement("tr");
        let rowIndex = document.createElement("td");
        let rowIndexText = document.createTextNode((i + 1).toString());
        rowIndex.appendChild(rowIndexText);
        newRow.appendChild(rowIndex);
        for (let val of Object.values(data)) {
            let newEl = document.createElement("td");
            let newText = document.createTextNode(val);
            newEl.appendChild(newText);
            newRow.appendChild(newEl);
        }
        historyEl.appendChild(newRow);
    }
}

// Event listeners
document.querySelector("#dark-mode").addEventListener("click", darkMode);
document.querySelector("#start-game").addEventListener("click", start);
document.querySelector("#stop").addEventListener("click", stop);
for (let child of document.querySelector(".cards").childNodes) {
    child.addEventListener("click", play);
}
document.querySelector("#open-credits").addEventListener("click", () => {
    credits.classList.add("open");
});
document.querySelector("#close-credits").addEventListener("click", () => {
    credits.classList.remove("open");
});
document.querySelector("#open-history").addEventListener("click", () => {
    historyBoard.classList.add("open");
});
document.querySelector("#close-history").addEventListener("click", () => {
    historyBoard.classList.remove("open");
});
document.body.onload = insertHistory;
