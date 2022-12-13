
// check if device is touch 
let input
if ("ontouchstart" in document.documentElement) {
    input = "touchstart"
} else {
    input = "mousedown"
}

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-analytics.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDGZSaU4lin4a6NvAGtvjVj2oo93tHYHVk",
    authDomain: "faster-than-green.firebaseapp.com",
    databaseURL: "https://faster-than-green-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "faster-than-green",
    storageBucket: "faster-than-green.appspot.com",
    messagingSenderId: "1097054825356",
    appId: "1:1097054825356:web:3e0a9abc93d28e761044a9",
    measurementId: "G-JFYXT2D36Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase();
const reference = ref(db, 'scoreboard');

function writeUserData(name, score, input) {
    // add a new post to the database with a generated id
    console.log("writing")
    if (name != "" && score != "") {
        setScore(name, score, input);
    }

    let scores = []
    onValue(reference, (snapshot) => {
        const data = snapshot.val()
        for (const key in data) {
            scores.push(data[key])
        }
    });
    for (let i = 0; i < scores.length; i++) {
        if (scores[i].name == name) {
            if (scores[i].score < score) {
                setScore(name, score, input);
            }
        }
    }
    console.log("data written")
}

function setScore(name, score, input) {
    set(ref(db, 'scoreboard/' + name), {
        name: name,
        score: score,
        input: input
    });
}

// ANCHOR: VARIOUS VARIABLES
let col = document.createElement("div")
col.classList.add("gameCol")
let cells = col.getElementsByClassName("gameCell")
let gameOver = false
let score = document.getElementById("score")
let highScore = document.getElementById("highScore")
highScore.innerHTML = localStorage.getItem("highScore")
if (localStorage.getItem("highScore") == null) {
    localStorage.setItem("highScore", 0)
    highScore.innerHTML = 0
} else {
    highScore.innerHTML = localStorage.getItem("highScore")
}
/*
let speedMode = document.getElementById("speedMode")
let speedDesc = document.getElementById("speedDesc")
let survivalMode = document.getElementById("survivalMode")
let surivavlDesc = document.getElementById("survivalDesc")

// ANCHOR: GAME MODE SELECTION 
let speed = document.getElementById("speed")
let survival = document.getElementById("survival")
let battleRoyale = document.getElementById("battleRoyale")
let selectedMode = ""
let menu = document.getElementById("menuContainer")
document.addEventListener(input, function (event) {
    if (event.target == speed) {
        menu.style.display = "none"
        speedMode.style.display = "flex"
        speedDesc.style.display = "flex"
    } else if (event.target == survival) {
        menu.style.display = "none"
        survivalMode.style.display = "flex"
        surivavlDesc.style.display = "flex"

    } else if (event.target == battleRoyale) {
        selectedMode = "battleRoyale"
    }
})
*/


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
            scoreCount -= 2
            let audio = new Audio("assets/sounds/wrong.mp3")
            audio.play()
            navigator.vibrate(250)
            screenShake()
        }
        // scoreCount always positive 
        if (scoreCount < 0) {
            scoreCount = 0
        }
        document.getElementById("score").innerHTML = scoreCount
        changeCellStatus(event)
    }
})

function screenShake() {
    let gameContainer = document.getElementById("gameContainer")
    gameContainer.classList.add("shake")
    setTimeout(function () {
        gameContainer.classList.remove("shake")
    }, 100)
}


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
        hideScoreboardButton()

        setInterval(function () {
            goldSpawner()
        }, 1000)


        setInterval(function () {
            graySpawner();
        }, 1000)
    }
})

/**
 * If the score is greater than or equal to 100, a random cell is selected and if it is active, it is
 * changed to gray. If the gray cell is clicked, the score is decreased by 5 and the cell is changed
 * back to inactive.
 */
function graySpawner() {
    let random = Math.floor(Math.random() * cells.length);
    if (scoreCount >= 100) {
        if (cells[random].classList.contains("active")) {
            cells[random].classList.add("gray");
        }
        // if the cell is clicked, the score is decreased by 5 and the cell is changed back to inactive
        cells[random].addEventListener(input, function (event) {
            if (event.target.classList.contains("gray")) {
                scoreCount -= 5;
                event.target.classList.remove("gray");
                event.target.classList.add("inactive");
                // play sound
                let audio = new Audio("assets/sounds/gray.mp3");
                audio.play();
            }
        });
    }
    // if the game is over stop the function
    if (gameOver) {
        return;
    }
}


/**
 * If the cell is clicked, the score is increased by 5 and the cell is changed back to inactive.
 */
function goldSpawner() {
    let random = Math.floor(Math.random() * cells.length);
    if (cells[random].classList.contains("active")) {
        cells[random].classList.add("gold");
    }
    cells[random].addEventListener(input, function (event) {
        if (event.target.classList.contains("gold")) {
            scoreCount += 5;
            event.target.classList.remove("gold");
            event.target.classList.add("inactive");
            // play sound
            let audio = new Audio("assets/sounds/gold.mp3");
            audio.play();
        }

    });
    if (gameOver) {
        return;
    }

    setTimeout(function () {
        if (cells[random].classList.contains("gold")) {
            cells[random].classList.remove("gold");
            cells[random].classList.add("active");
        }
    }, 500);

}

function startTimer() {
    let time = 20
    let timer = setInterval(function () {
        time--
        document.getElementById("timer").innerHTML = time
        if (time == 0) {
            clearInterval(timer)
            gameReset()
        }
        console.log(time)
    }, 1000)
}
function hideScoreboardButton() {
    let scoreboardButton = document.querySelector(".scoreboardButton")
    scoreboardButton.style.display = "none"
}

// ANCHOR: SCOREBOARD
let scoreboardButton = document.querySelector(".scoreboardButton")
let scoreboardContainer = document.querySelector(".scoreboardContainer")
let scoreboardBack = document.querySelector(".backButton")
let scoreboardRow = document.querySelector(".scoreboardRow")
scoreboardButton.addEventListener(input, function (event) {

    var scores = []
    // create an array with all the scores in the firebase database
    onValue(reference, (snapshot) => {
        const data = snapshot.val()
        for (const key in data) {
            scores.push(data[key])
        }
        // sort the array in descending order by scores
        scores.sort(function (a, b) {
            return b.score - a.score
        })

        let scoreboard = document.querySelector(".scoreboard")
        for (let i = 0; i < scores.length; i++) {
            // print only the top 10 scores
            if (i < 10) {
                let scoreboardRow = document.createElement("div")
                let scoreboardList = document.querySelector(".scoreboardList")
                let username = scores[i].name
                let score = scores[i].score
                if (scores[i].input == "mousedown") {
                    username = "💻" + username
                } else if (scores[i].input == "touchstart") {
                    username = "📱" + username
                }
                scoreboardRow.classList.add("scoreboardRow")
                // name and score as two separate divs
                let nameDiv = document.createElement("div")
                let scoreDiv = document.createElement("div")
                nameDiv.classList.add("nameDiv")
                scoreDiv.classList.add("scoreDiv")
                nameDiv.innerHTML = username
                scoreDiv.innerHTML = score
                scoreboardRow.appendChild(nameDiv)
                scoreboardRow.appendChild(scoreDiv)
                scoreboardList.appendChild(scoreboardRow)
            }
        }
        scoreboardContainer.style.display = "flex"
    });
})
scoreboardBack.addEventListener(input, function () {
    scoreboardContainer.style.display = "none"
    scoreboardButton.style.display = "flex"
    cleanScoreboard();
})
scoreboardContainer.addEventListener(input, function (event) {
    if (event.target == scoreboardContainer) {
        scoreboardContainer.style.display = "none"
        scoreboardButton.style.display = "flex"
        cleanScoreboard()
    }
})


// ANCHOR: SCOREBOARD SUBMIT 
let scoreboardInputField = document.querySelector(".scoreboardInputField")
// submit if return on mobile keyboard is pressed
scoreboardInputField.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        submitButton.click();
    }
});


function cleanScoreboard() {
    let scoreboardList = document.querySelector(".scoreboardList")
    scoreboardList.innerHTML = ""
}

// ANCHOR: GAME RESET
function gameReset() {
    let audio = new Audio("assets/sounds/gameOver.mp3")
    audio.play()
    gameOver = true
    // make all cells inactive
    for (let i = 0; i < cells.length; i++) {
        cells[i].classList.remove("active")
        cells[i].classList.remove("gold")
        cells[i].classList.remove("gray")
        cells[i].classList.add("inactive")
    }
    showRestartButton()
    showScoreboardButton()
    showScoreboardSubmit()
}
function showScoreboardSubmit() {
    let submit = document.querySelector(".scoreboardInputContainer")
    let scoreboardInput = document.querySelector(".scoreboardInput")
    let share = document.querySelector(".scoreboardShare")
    let input = document.querySelector(".scoreboardInputField")
    let submitButton = document.querySelector(".scoreboardSubmit")
    let scoreboardLabel = document.querySelector("#scoreboardLabel")
    submit.style.display = "flex"
    // make the input field and submit button display flex after 1 second
    setTimeout(function () {
        scoreboardLabel.innerHTML = scoreCount
        input.style.display = "flex"
        submitButton.style.display = "flex"
        share.style.display = "flex"
        input.classList.add("fadeIn")
        submitButton.classList.add("fadeIn")
        share.classList.add("fadeIn")
    }, 250)
}

let shareButton = document.querySelector(".scoreboardShare")
shareButton.addEventListener(input, function () {
    if (input == "touchstart") {
        shareMobile(scoreCount)
    } else {
        share(scoreCount)
    }
})

function shareMobile(score) {
    let shareText = "I just scored " + score + " points in the game 'Faster than green'! Can you beat my score? https://tapgame.jaiki.rocks/"
    window.open("whatsapp://send?text=" + shareText)
}

function share(score) {
    let shareText = "I just scored " + score + " points in the game 'Faster than green'! Can you beat my score? https://tapgame.jaiki.rocks/"
    navigator.share({
        title: "Faster than green",
        text: shareText,
        url: "https://tapgame.jaiki.rocks/"
    })
}


let submitButton = document.querySelector(".scoreboardSubmit")
let scoreboardInputContainer = document.querySelector(".scoreboardInputContainer")

submitButton.addEventListener(input, async function (event) {
    let scoreboardInput = document.querySelector(".scoreboardInputField")
    console.log("submit button clicked")
    let name = scoreboardInput.value
    let score = document.querySelector("#score").innerHTML
    let highScoreLocalStorage = localStorage.getItem("highScore")


    /* Checking if the name is not empty. If it is not empty, it will write the user data to the
    database. If the score is greater than the high score, it will set the high score to the score.
    If the score is not greater than the high score, it will set the high score to the high score
    local storage. It will then hide the scoreboard input container. */
    let badWord = false
    // read the file badWords.txt 
    await fetch("assets/words/itBadWords.txt").then(response => response.text()).then(text => {
        let badWords = text.split("\n")
        for (let i = 0; i < badWords.length; i++) {
            badWords[i] = badWords[i].replace("\r", "")
            if (name.toLowerCase().includes(badWords[i])) {
                badWord = true
            }
        }
        if (badWord) {
            scoreboardInput.value = ""
            scoreboardInput.placeholder = "🤨"
        }
    })
    // check if th e
    if (name != "" && badWord == false) {
        writeUserData(name, score, input)
        if (score > highScoreLocalStorage) {
            console.log("score is greater than highscore")
            localStorage.setItem("highScore", score)
            highScore.innerHTML = highScoreLocalStorage
        } else {
            console.log("score is not greater than highscore")
            highScore.innerHTML = highScoreLocalStorage
        }
        scoreboardInputContainer.style.display = "none"
        if (name == "amogus") {
            amogusCells()
        }
    }
})


function amogusCells() {
    // make all cells 
    for (let i = 0; i < cells.length; i++) {
        cells[i].classList.remove("inactive")
        cells[i].classList.add("active")
    }
    cells[0].classList.remove("active")
    cells[0].classList.add("inactive")
    cells[4].classList.remove("active")
    cells[4].classList.add("inactive")
    cells[7].classList.remove("active")
    cells[7].classList.add("inactive")
    cells[8].classList.remove("active")
    cells[8].classList.add("inactive")
    cells[9].classList.remove("active")
    cells[9].classList.add("inactive")
    cells[14].classList.remove("active")
    cells[14].classList.add("inactive")
    cells[15].classList.remove("active")
    cells[15].classList.add("inactive")
    cells[19].classList.remove("active")
    cells[19].classList.add("inactive")
    cells[20].classList.remove("active")
    cells[20].classList.add("inactive")
    cells[22].classList.remove("active")
    cells[22].classList.add("inactive")
    cells[24].classList.remove("active")
    cells[24].classList.add("inactive")
}

function showScoreboardButton() {
    let scoreboardButton = document.querySelector(".scoreboardButton")
    scoreboardButton.style.display = "flex"
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
    if (debugCount == 5) {
        showDebugMessage()
        //showDebugMenu()
        notificattionTest()
    }
})

function showDebugMessage() {
    let audio = new Audio("assets/sounds/debug.mp3")
    audio.play()
    let debug = document.getElementById("debugContainer")
    debug.style.display = "flex"
    debug.addEventListener("click", function () {
        debug.style.display = "none"
    })
}

function showDebugMenu() {
    let debugMenu = document.getElementById("debugMenu")
    debugMenu.style.display = "flex"
    debugMenu.addEventListener("click", function () {
        debugMenu.style.display = "none"
    })
}

function notificattionTest() {
    Notification.requestPermission().then(function (result) {
        if (result === "granted") {
            navigator.serviceWorker.ready.then(function (registration) {
                registration.showNotification("Hello world!")
            })
        }
    })
}