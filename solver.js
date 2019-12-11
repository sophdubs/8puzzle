const stringToNum = [null, 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

function solve() {
    
}







function getTileState() {
    hScoreSum = 0;
    tiles.forEach(tile => {
        hScore = countMovesToPos(tile);
        hsScoreSum += hScore;
    })
}

//Tested and working
function countMovesToPos(tile){
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