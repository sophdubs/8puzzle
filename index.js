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
function shuffle(moves) {
    let blank = 'nine';
    for (let i = 0; i < moves; i++) {
        let swaps = neighbors[blank];
        let index = Math.floor((Math.random() * swaps.length));
        let id = swaps[index];
        tile = document.getElementById(id);
        swap(tile, blankTile, true);
        blank = tile.id;
    }
}

//Different buttons for different starting difficulties:
//Easy starts 5 moves away from solved
//Medium starts 15 moves away from solved
//Hard starts 50 moves away from solved
const startEasy = document.querySelector('.start-easy');
const startMedium = document.querySelector('.start-medium');
const startHard = document.querySelector('.start-hard');
startEasy.addEventListener('click', () => startGame(5));
startMedium.addEventListener('click', () => startGame(15));
startHard.addEventListener('click', ()=> startGame(50));

//This is where the game is initiated. 
function startGame(moves) {
    shuffle(moves);
    updateTimer();
}

//Grab the timer div on the document to be able to update the innerHTML as the seconds tic by. 
const timer = document.querySelector('.timer');
let t;
function updateTimer(count=0, pause=false) {
    if(pause) {
        clearInterval(t);
        console.log('stopped timer');
        return;
    }
    t = setInterval(() => {
        count += 1;
        const formattedTime = formatTime(count);
        timer.innerHTML = formattedTime;
    }, 1000);
}

//Formats the time properly to fit on the timer. (00:00)
function formatTime(count) {
    minutes = count % 60;
    hours = Math.floor(count/60);
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    if (hours < 10) {
        hours = `0${hours}`;
    }
    return `${hours}:${minutes}`;
}

//Grabbing the pause and resume buttons. 
//Adding event listeners to handle the pause and resume click events.
let pause = document.querySelector('.pause-button');
pause.addEventListener('click', handlePause);
let resume = document.querySelector('.resume-button');
resume.addEventListener('click', handleResume);

const puzzleContainer = document.querySelector('#puzzle-container');

//Clears timers interval by passing pause = true
function handlePause() {
    updateTimer(0,true);
    puzzleContainer.classList.add('paused');

}

//Resets timer by passing in the current count and starting a new set interval to update the count every second. 
function handleResume() {
    console.log(timer.innerHTML);
    let regexp = /(\d\d):(\d\d)/
    let time = timer.innerHTML.match(regexp);
    count = parseInt(time[1]) * 60 + parseInt(time[2]);
    updateTimer(count);
    puzzleContainer.classList.remove('paused');
}

