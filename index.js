const nums = [null, 'pos1', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const neighbors = {
    'pos1': ['pos2', 'pos4'],
    'pos2': ['pos1', 'pos3', 'pos5'],
    'pos3': ['pos2', 'pos6'],
    'pos4': ['pos1', 'pos5', 'pos7'],
    'pos5': ['pos2', 'pos4', 'pos6', 'pos8'],
    'pos6': ['pos3', 'pos5', 'pos9'],
    'pos7': ['pos4', 'pos8'],
    'pos8': ['pos5', 'pos7', 'pos9'],
    'pos9': ['pos6', 'pos8']
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
    updatePuzzle();
}


function updatePuzzle(){
    tiles.forEach(tile => {
        let pos = tile.dataset.pos;
        switch (true) {
            case pos === 'pos1':
                tile.style.gridArea = "pos1";
                break;
            case pos === 'pos2':
                tile.style.gridArea = "pos2";
                break;
            case pos === 'pos3':
                tile.style.gridArea = "pos3";
                break;   
            case pos === 'pos4':
                tile.style.gridArea = "pos4";
                break;
            case pos === 'pos5':
                tile.style.gridArea = "pos5";
                break;
            case pos === 'pos6':
                tile.style.gridArea = "pos6";
                break;   
            case pos === 'pos7':
                tile.style.gridArea = "pos7";
                break;
            case pos === 'pos8':
                tile.style.gridArea = "pos8";
                break;
            case pos === 'pos9':
                tile.style.gridArea = "pos9";
                break;
        }
    })
    console.log('done');
}



updatePuzzle();
