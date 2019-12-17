const stringToNum = [null, 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];


//Tested and working
function getTileState() {
    let state = [];
    tiles.forEach(tile => {
        state[stringToNum.indexOf(tile.dataset.pos)] = tile.id;
    });
    return state;
}

//Tested and working
function getHScore(state) {
    let hScoreSum = 0;
    state.forEach((tile, pos) => {
        let hScore = countManDistance(tile, pos);
        hScoreSum += hScore;
    });
    return hScoreSum;
}

//Tested and working
function countManDistance(tile, pos){
    if (tile === stringToNum[pos] || tile === "nine" || tile === null) {
        return 0;
    } else {
        let id = stringToNum.indexOf(tile);
        let vertical = Math.floor(Math.abs(pos - id)/3);
        let horizontal = Math.abs(pos - id) % 3;
        return vertical + horizontal;
    }
}

//Tested and working
function findBlankNeighbors(state) {
    //Finds current position of the blank tile
    let blankPos = state.indexOf('nine');
    let blankNeighbors = neighbors[stringToNum[blankPos]];
    return blankNeighbors;
}


