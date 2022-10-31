const CONDITIONS = [
    ["DRAW", "LOSE", "WIN"],
    ["WIN", "DRAW", "LOSE"],
    ["LOSE", "WIN", "DRAW"],
];
let menu = document.querySelector(".menu-container");
let game = document.querySelector(".game");
let timerEl = document.querySelector("#timer");
let scoreEl = document.querySelector("#score");
let symbols = document.querySelector(".symbols").children;
let countdown;

let scoreboard = {
    player: 0,
    opponent: 0,
    draw: 0,
};

let history = JSON.parse(localStorage.getItem("history") || "[]");

function resetTimer(delay) {
    clearInterval(countdown)
    timerEl.innerHTML = "10"
    setTimeout(() => {
        countdown = setInterval(() => {
            let i = parseInt(timerEl.innerHTML);
            if (i === 0) {
                endRound("LOSE")
                timerEl.innerHTML = "10"
            } else {
                i -= 1;
                timerEl.innerHTML = i.toString();
            }
        }, 1000);
    }, delay * 1000)
}

function darkMode(event) {
    let rootClasses = document.documentElement.classList;
    if (rootClasses.contains("dark-mode")) {
        rootClasses.remove("dark-mode");
    } else {
        rootClasses.add("dark-mode");
    }
}

function start(event) {
    menu.classList.add("started");
    game.classList.add("started");
    resetTimer(1)
}

function stop(event) {
    menu.classList.remove("started");
    game.classList.remove("started");
    clearInterval(countdown)
    timerEl.innerHTML = 10
    history.push(JSON.stringify(scoreboard));
    localStorage.setItem("history", JSON.stringify(history));
    Object.keys(scoreboard).forEach((key) => {
        scoreboard[key] = 0;
    });
    scoreEl.innerHTML = "0-0";
}

function endRound(cond) {
    let currentScore = scoreEl.innerHTML.split("-");
    if (cond === "WIN") {
        scoreboard.player += 1;
        currentScore[0] = scoreboard.player.toString();
    } else if (cond === "DRAW") {
        scoreboard.draw += 1;
    } else if (cond === "LOSE") {
        scoreboard.opponent += 1;
        currentScore[1] = scoreboard.opponent.toString();
    }
    symbols[cond.toLowerCase()].classList.add("blink");
    game.classList.add("blink");
    setTimeout(() => {
        symbols[cond.toLowerCase()].classList.remove("blink");
        game.classList.remove("blink");
    }, 2000);
    scoreEl.innerHTML = currentScore.join("-");
    resetTimer(2)
}

function play(event) {
    let playerHand = event.target.closest("[data-index]").dataset.index;
    let opponentHand = Math.floor(Math.random() * 3);
    endRound(CONDITIONS[playerHand][opponentHand]);
}

document.querySelector("#dark-mode").addEventListener("click", darkMode);
document.querySelector("#start").addEventListener("click", start);
document.querySelector("#stop").addEventListener("click", stop);
document.querySelector(".cards").childNodes.forEach((child) => {
    child.addEventListener("click", play);
});
