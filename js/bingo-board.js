/*
 * Split up the list into an array using given delimiter & shuffle the items, then return the array.
 */
function processBoardSpaceInput(input, delim) {
    // Split text into an array, delimited by commas.
    return input.split(delim);
}

/*
 * Helper function to generate random integer for shuffleArray() function.
 */
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

/*
 * Function to shuffle an array using the Fisher-Yates shuffle algorithm.
 * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
 */
function shuffleArray(array) {
    // Start from the end of the array and work towards beginning.
    for(let idx = array.length - 1; idx >= 0; idx--) {
        // Generate a random, positive integer.
        let randIdx = Math.abs(getRandomInt(array.length));

        // Swap current element with element at the randomly generated index.
        let currElem = array[idx];
        array[idx] = array[randIdx];
        array[randIdx] = currElem;
    }

    return array;
}

/*
 * Create table from given array.
 */
function createTable(array, dim) {
    let table = document.createElement("table");
    table.setAttribute("id", "board");
    let colNum = 0;
    for(let idx = 0; idx < array.length; idx++) {
        // Create new row every dim elements.
        if(idx % dim == 0) {
            row = table.insertRow();
            colNum = 0;
        }

        // Insert column element into row.
        row.insertCell(colNum).innerHTML = array[idx];
        row.cells[colNum].setAttribute("class", "board-space");
        colNum++;

        // If there are more items than supported by requested dimension, stop.
        if(idx == (dim * dim) - 1) {
            break;
        }
    }

    return table;
}

/*
 * Event function to mark a clicked space.
 */
function markSpace() {
    if(this.style.backgroundColor != "red") {
        this.style.backgroundColor = "red";
    } else {
        this.style.backgroundColor = null;
    }
}

/*
 * Helper event function to clear all marks from the board.
 */
function clearMarks() {
    let collection = document.getElementsByClassName("board-space");
    console.log(collection.length);
    if(collection != null && collection.length > 0) {
        for(let idx = 0; idx < collection.length; idx++) {
            if(collection[idx].style.backgroundColor != null) {
                collection[idx].style.backgroundColor = null;
            }
        }
    } else if(collection == null || collection.length == 0) {
        alert("There's nothing to clear.\nGenerate a board first!");
    }
}

/*
 * Driver function to generate table from input, to be called by a button.
 */
function generateBoard() {
    // Get board space input (remove newlines) & delimiter.
    let input = document.getElementById("board-space-input").value.replace(/[\r\n]/gm, "");
    let delim = document.getElementById("delim-input").value;
    let dim = document.getElementById("dim-input").value;
    
    // Process input & filter empty strings.
    let boardSpaceInputArray = processBoardSpaceInput(input, delim);
    boardSpaceInputArray = boardSpaceInputArray.filter(x => x != "");

    // Check that there are enough items.
    if(boardSpaceInputArray.length < (dim * dim)) {
        alert(`Please enter at least ${dim * dim} items, separated by \"${delim}\".\nYou currently have ${boardSpaceInputArray.length} items.`);
        return;
    }

    // Shuffle input.
    boardSpaceInputArray = shuffleArray(boardSpaceInputArray);

    // Write out to designated area on page, replacing old board.
    document.getElementById("board").replaceWith(createTable(boardSpaceInputArray, dim));

    // Add onclick event to board spaces so we can mark spaces when we click on them.
    let collection = document.getElementsByClassName("board-space");
    if(collection != null) {
        for(let idx = 0; idx < collection.length; idx++) {
            collection[idx].addEventListener("click", markSpace);
        }
    }
}

/*
 * Removes existing board (replaces the table with an empty one).
 */
function removeBoard() {
    let table = document.createElement("table");
    table.setAttribute("id", "board");
    document.getElementById("board").replaceWith(table);
}