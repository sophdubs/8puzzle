const nums = [null, 'pos1', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const neighbors = {
    'one': ['two', 'four'],
    'two': ['one', 'three', 'five'],
    'three': ['two', 'six'],
    'four': ['one', 'five', 'seven'],
    'five': ['two', 'four', 'six', 'eight'],
    'six': ['three', 'five', 'nine'],
    'seven': ['four', 'eight'],
    'eight': ['five', 'seven', 'nine'],
    'nine': ['six', 'eight']
};

let tiles = document.querySelectorAll('.tile');
let blankTile = document.querySelector('#nine');
tiles.forEach(tile => tile.addEventListener("click", switchTiles))

function switchTiles() {
    let tile = this.id;
    console.log(tile);
    let pos = this.dataset.pos;
    let swaps = neighbors[pos];
    checkNeighbors(swaps, this);
}

function checkNeighbors(swaps, tile) {
    console.log(swaps);
    if(swaps.includes(blankTile.dataset.pos)) {
        swap(tile, blankTile)
    } 
}

function swap(tile, blank) {
    let temp = tile.dataset.pos;
    tile.dataset.pos = blank.dataset.pos;
    blank.dataset.pos = temp;
    tile.style.gridArea = tile.dataset.pos;
    blank.style.gridArea = blank.dataset.pos;
    checkWin();
}

function checkWin() {
    let win = true;
    tiles.forEach(tile => {
        if (tile.dataset.pos !== tile.id) {
            win = false;
        }
    })
    if (win) {
        console.log('You Win!');
        blankTile.classList.add('win');
    }
}




