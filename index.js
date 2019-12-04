//Map of which each tile's neighbors
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

//Select tiles to add 'click' event listener
let tiles = document.querySelectorAll('.tile');
tiles.forEach(tile => tile.addEventListener("click", switchTiles))
let blankTile = document.querySelector('#nine');

//This is the first method called when user clicks on a tile.
//It finds its neighbors and then calls checkNeighbors to see if one of them is the blank tile.
function switchTiles() {
    let pos = this.dataset.pos;
    let swaps = neighbors[pos];
    checkNeighbors(swaps, this);
}

//This functions checks whether the swaps array contains the blank tile.
//If so, it dispatches the next action to the swap function. 
function checkNeighbors(swaps, tile) {
    if(swaps.includes(blankTile.dataset.pos)) {
        swap(tile, blankTile)
    } 
}

//This function swaps the current tile's position with the blank tile's position. 
function swap(tile, blank, shuffling=false) {
    //Swapping the data-pos values to keep track of which tiles are where. 
    let temp = tile.dataset.pos;
    tile.dataset.pos = blank.dataset.pos;
    blank.dataset.pos = temp;
    //Swapping their actual positions in the grid
    tile.style.gridArea = tile.dataset.pos;
    blank.style.gridArea = blank.dataset.pos;
    //This is just to avoid any issues while shuffling the puzzle at beginning of game. 
    if (!shuffling) {
        checkWin();
    }
}

//If all tiles have matching ids and data-pos attributes, then they are in their original spots and the puzzle has been solved successfully. 
function checkWin() {
    let win = true;
    tiles.forEach(tile => {
        if (tile.dataset.pos !== tile.id) {
            win = false;
        }
    })
    //Adding 'win' to the bankTile's classList allows us to view the missing tile image. 
    if (win) {
        blankTile.classList.add('win');
        setTimeout(() => {alert('You Win!')}, 500);
    }
}

//This shuffle function runs at the beginning of the game. 
//We start from a solved puzzle and make 100 moves to ensure the puzzle is solvable for the user. 
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

//This is where the game is initiated. 
shuffle();



