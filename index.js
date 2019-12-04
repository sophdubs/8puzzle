const nums = [null, 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const neighbors = {
    'one': [2, 4],
    'two': [1, 3, 5],
    'three': [2, 6],
    'four': [1, 5, 7],
    'five': [2, 4, 6, 8],
    'six': [3, 5, 9],
    'seven': [4, 8],
    'eight': [5, 7, 9],
    'nine': [6, 8]
};

let tiles = document.querySelectorAll('.tile');
tiles.forEach(tile => tile.addEventListener("click", switchTiles))

function switchTiles(tile) {
    // console.log(this.parentElement.classList[0]);
    let tiles = neighbors[this.parentElement.classList[0]];
    checkNeighbors(tiles);
    // let trade = checkNeighbors(neighbors[this.parentElement.classList[0]]);
}

function checkNeighbors(tiles) {
    let trade = false;
    let tradetile;
    tiles.forEach(tile => {
        let temp = document.querySelector(`.${nums[tile]}`);
        if (temp.childNodes[1].id === 'nine') {
            trade = true;
            tradeTile = temp;
        }
    })
    if (trade) {
        console.log(trade);
        console.log(tradeTile);
    }
}

