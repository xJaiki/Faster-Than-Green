// check if device is touch 
let input 
if ("ontouchstart" in document.documentElement) {
    input = "touchstart"
} else {
    input = "mousedown"
}


// ANCHOR: VARIOUS VARIABLES
let col = document.createElement("div")
col.classList.add("gameCol")
let cells = col.getElementsByClassName("gameCell")
let gameOver = false
let score = document.getElementById("score")
let highScore = document.getElementById("highScore")
highScore.innerHTML = localStorage.getItem("highScore")
localStorage.setItem("highScore", 0)

console.log(localStorage)



game()


// ANCHOR: GAME SEQUENCE
function game() {
    createGrid(5)
    document.getElementById("gameContainer").appendChild(col)
}


// ANCHOR: TAP LOGIC
let scoreCount = 0;
col.addEventListener(input, function (event) {
    if (!gameOver) {
        if (event.target.classList.contains("active")) {
            scoreCount++
            // reproduce the sound of a tap
            let audio = new Audio("assets/sounds/correct.mp3")
            audio.play()
            navigator.vibrate(30)
        } else if (event.target.classList.contains("inactive")) {
            scoreCount-=2
            let audio = new Audio("assets/sounds/wrong.mp3")
            audio.play()
            navigator.vibrate(250)
        }
        // scoreCount always positive 
        if (scoreCount < 0) {
            scoreCount = 0
        }
        document.getElementById("score").innerHTML = scoreCount
        changeCellStatus(event)
    }
})

// ANCHOR: GRID CREATION
function createGrid(size) {
    for (let i = 0; i < size; i++) {
        let row = document.createElement("div")
        row.classList.add("gameRow")
        for (let j = 0; j < size; j++) {
            let cell = document.createElement("div")
            cell.classList.add("gameCell")
            cell.classList.add("active")
            row.appendChild(cell)
        }
        col.appendChild(row)
    }
}

// ANCHOR: STATUS RANDOMIZATION 
function randomizeCells(cells, num) {
    let activeCells = 0
    for (let i = 0; i < cells.length; i++) {
        let random = Math.floor(Math.random() * 2)
        if (random == 1) {
            cells[i].classList.add("active")
            cells[i].classList.remove("inactive")
            activeCells++
        } else {
            cells[i].classList.remove("active")
            cells[i].classList.add("inactive")
        }
        if (activeCells > num) {
            cells[i].classList.remove("active")
            cells[i].classList.add("inactive")
            activeCells--
        }
    }
}

// ANCHOR: CELL STATUS CHANGE
function changeCellStatus(event) {
    if (event.target.classList.contains("active")) {
        event.target.classList.remove("active")
        event.target.classList.add("inactive")
        let cells = document.getElementsByClassName("gameCell")
        let random = Math.floor(Math.random() * cells.length)
        while (cells[random].classList.contains("active")) {
            random = Math.floor(Math.random() * cells.length)
        }
        cells[random].classList.remove("inactive")
        cells[random].classList.add("active")
    }
}

// count the number of active cells clicked 

// ANCHOR: TIMER LOGIC AND CONDITION
let firstClick = true
col.addEventListener(input, function (event) {
    if (firstClick) {
        firstClick = false
        randomizeCells(cells, 10)
        startTimer()
    }
})
function startTimer() {
    let time = 2
    let timer = setInterval(function () {
        time--
        document.getElementById("timer").innerHTML = time
        if (time == 0) {
            clearInterval(timer)
            gameReset()
        }
    }, 1000)
}

// ANCHOR: GAME RESET
function gameReset() {
    let audio = new Audio("assets/sounds/gameOver.mp3")
    audio.play()
    gameOver = true
    // make all cells inactive
    for (let i = 0; i < cells.length; i++) {
        cells[i].classList.remove("active")
        cells[i].classList.add("inactive")
    }
    showRestartButton()
    // save high score
    if (score.innerHTML > localStorage.getItem("highScore")) {
        localStorage.setItem("highScore", score.innerHTML)
        highScore.innerHTML = localStorage.getItem("highScore")
    } else {
        highScore.innerHTML = localStorage.getItem("highScore")
    }
}

function showRestartButton() {
    let restartButton = document.getElementById("restart")
    restartButton.style.display = "flex"
    restartButton.addEventListener("click", function () {
        reload()
    })
    function reload() {
        location.reload()
    }
}

// ANCHOR: SECRET GREEN DEBUG BUTTON 
let debugButton = document.getElementById("debug")
let debugCount = 0;
debugButton.addEventListener("click", function () {
    debugCount++
    if(debugCount == 5) {
        showDebugMessage()
        showDebugMenu()
    }
})

function showDebugMessage() {
    
}

function showDebugMessage() {
    let audio = new Audio("assets/sounds/debug.mp3")
    audio.play()
    let debug = document.getElementById("debugContainer")
    debug.style.display = "flex"
    debug.addEventListener("click", function () {
        debug.style.display = "none"
    })
}