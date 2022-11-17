let col = document.createElement("div")
col.classList.add("gameCol")

for (let i = 0; i < 5; i++) {
    let row = document.createElement("div")
    row.classList.add("gameRow")
    for (let j = 0; j < 5; j++) {
        // randomize cell status, 1 = active, 0 = inactive, the number of active cells is 10
        while

        
        /*
        let random = Math.floor(Math.random() * 2)
        let cell = document.createElement("div")
        cell.classList.add("gameCell")
        if (random == 1) {
            cell.classList.add("active")
            cell.classList.remove("inactive")
        } else {
            cell.classList.add("inactive")
            cell.classList.remove("active")
        }
        row.appendChild(cell)
        */
    }
    col.appendChild(row)
}
document.getElementById("gameContainer").appendChild(col)

document.getElementById("lmao").innerHTML = "0"


// change from click to first touch
// addvenetlistener type click and touchstart
addEventListener("mousedown", function (event) {
    changeCellStatus(event)
    // if all cells are inactive or active, you win
    let cells = document.getElementsByClassName("gameCell")
    let active = 0
    let inactive = 0
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].classList.contains("active")) {
            active++
        } else {
            inactive++
        }
    }

    let random = Math.floor(Math.random() * cells.length)

    /*
    if (active == cells.length || inactive == cells.length) {
        resetGame(cells)
    }
    */

    // write in the div with the id "lmao" the number of active cells
    document.getElementById("lmao").innerHTML = active

})

function changeCellStatus(event) {
    // when i click on an active cell, activate another random inactive cell
    if(event.target.classList.contains("active")) {
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

function resetGame(cells) {
    for (let i = 0; i < cells.length; i++) {
        let random = Math.floor(Math.random() * 2)
        if (random == 1) {
            cells[i].classList.add("active")
            cells[i].classList.remove("inactive")
        } else {
            cells[i].classList.add("inactive")
            cells[i].classList.remove("active")
        }
    }
}

