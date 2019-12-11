const stringToNum = [null, 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

function getTileState() {
    let state = [];
    tiles.forEach(tile => {
        state[stringToNum.indexOf(tile.dataset.pos)] = tile.id;
    });
    console.log(state);
}

function solve() {
    let gScore = 0;
}

// function swap(tile, blank, shuffling=false) {
//     //Swapping the data-pos values to keep track of which tiles are where. 
//     let temp = tile.dataset.pos;
//     tile.dataset.pos = blank.dataset.pos;
//     blank.dataset.pos = temp;
//     //Swapping their actual positions in the grid
//     tile.style.gridArea = tile.dataset.pos;
//     blank.style.gridArea = blank.dataset.pos;

//     //This is just to avoid any issues while shuffling the puzzle at beginning of game. 
//     if (!shuffling) {
//         movesMade += 1;
//         movesCounter.innerHTML = movesMade;
//         checkWin();
//     }
// }





function getHScore() {
    hScoreSum = 0;
    tiles.forEach(tile => {
        hScore = countManDistance(tile);
        hScoreSum += hScore;
    })
    return hScoreSum;
}

//Tested and working
function countManDistance(tile){
    if (tile.id === tile.dataset.pos || tile.id === "nine") {
        return 0;
    } else {
        let pos = stringToNum.indexOf(tile.dataset.pos);
        let id = stringToNum.indexOf(tile.id);
        let vertical = Math.floor(Math.abs(pos - id)/3);
        let horizontal = Math.abs(pos - id) % 3;
        return vertical + horizontal;
    }
}