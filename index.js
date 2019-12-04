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
    let pos = this.dataset.pos;
    let swaps = neighbors[pos];
    checkNeighbors(swaps, this);
}

function checkNeighbors(swaps, tile) {
    if(swaps.includes(blankTile.dataset.pos)) {
        swap(tile, blankTile)
    } 
}

function swap(tile, blank, shuffling=false) {
    let temp = tile.dataset.pos;
    tile.dataset.pos = blank.dataset.pos;
    blank.dataset.pos = temp;
    tile.style.gridArea = tile.dataset.pos;
    blank.style.gridArea = blank.dataset.pos;
    if (!shuffling) {
        checkWin();
    }
}

function checkWin() {
    let win = true;
    tiles.forEach(tile => {
        if (tile.dataset.pos !== tile.id) {
            win = false;
        }
    })
    if (win) {
        blankTile.classList.add('win');
        setTimeout(() => {alert('You Win!')}, 500);
    }
}

function shuffle() {
    let blank = 'nine';
    for (let i = 0; i < 100; i++) {
        let swaps = neighbors[blank];
        let index = Math.floor((Math.random() * swaps.length));
        let id = swaps[index];
        tile = document.getElementById(id);
        swap(tile, blankTile, true);
        blank = tile.id;
    }
}
shuffle();



