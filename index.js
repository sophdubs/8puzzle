const grid = document.querySelector('.container');
const { forceGridAnimation } = animateCSSGrid.wrapGrid(grid);


//Different buttons for different starting difficulties:
//Easy starts 5 moves away from solved
//Medium starts 15 moves away from solved
//Hard starts 50 moves away from solved
const EASY = 1;
const MEDIUM = 2;
const HARD = 3;
let difficulty = null;
const startEasy = document.querySelector('.start-easy');
const startMedium = document.querySelector('.start-medium');
const startHard = document.querySelector('.start-hard');
startEasy.addEventListener('click', () => startGame(EASY));
startMedium.addEventListener('click', () => startGame(MEDIUM));
startHard.addEventListener('click', ()=> startGame(HARD));

let movesMade = 0;
const movesCounter = document.querySelector('.move-counter');


//This is where the game is initiated. 
function startGame(movesFromStart) {
    resetGame();
    shuffle(movesFromStart);
    updateTimer();
    if (hackerButton.classList.contains('clicked')) {
        clickHereButton();
    }
    if (movesFromStart === EASY) difficulty = 'easy';
    if (movesFromStart === MEDIUM) difficulty = 'medium';
    if (movesFromStart === HARD) difficulty = 'hard';
}

//Grab the timer div on the document to be able to update the innerHTML as the seconds tic by. 
const timer = document.querySelector('.timer-text');
let t;
function updateTimer(count=0, pause=false) {
    if(pause) {
        clearInterval(t);
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
let pauseResume = document.querySelector('.pause-resume');
pauseResume.addEventListener('click', handlePauseResume);


const puzzleContainer = document.querySelector('#puzzle-container');

//Clears timers interval by passing pause = true
function handlePauseResume() {
    if (this.classList.contains('pause')) {
        this.classList.remove('pause');
        this.innerHTML='PAUSE';
        
        let count = htmlToCount(timer.innerHTML);
        updateTimer(count);
        puzzleContainer.classList.remove('paused');
    
    } else {
        updateTimer(0,true);
        puzzleContainer.classList.add('paused');
        this.innerHTML='RESUME';
        this.classList.add('pause');
    }
}

// Grabs the string representation of how much time has elapsed and returns it in seconds. 
function htmlToCount(html) {
    let time = html.match(/(\d\d):(\d\d)/);
    let count = parseInt(time[1]) * 60 + parseInt(time[2]);
    return count;
}

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
    if (difficulty !== null) {
        let pos = this.dataset.pos;
        let swaps = neighbors[pos];
        checkNeighbors(swaps, this);
    }
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
    forceGridAnimation();

    //This is just to avoid any issues while shuffling the puzzle at beginning of game. 
    if (!shuffling) {
        movesMade += 1;
        movesCounter.innerHTML = movesMade;
        checkWin();
    }
}

//This shuffle function runs at the beginning of the game. 
function shuffle(movesFromSolved) {
    for (let i = 0; i < movesFromSolved; i++) {
        // let blank = 'nine';
        let swaps = neighbors[blankTile.dataset.pos];
        let index = Math.floor((Math.random() * swaps.length));
        let id = swaps[index];
        tile = document.getElementById(id);
        swap(tile, blankTile, true);
    }
}

let modal = document.querySelector('.modal');

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
        clearInterval(t);
        modal.classList.remove('modal-no-show');
        modal.classList.add('modal-show');
        page.classList.add('modal-open');
    }
}

const modalForm = document.querySelector('.modal-form');
modalForm.addEventListener('submit', handleModalSubmit);

const modalX = document.querySelector('.modal-close');
modalX.addEventListener('click', closeModal);

function handleModalSubmit(e) {
    e.preventDefault();
    let name = e.target.name.value;
    let time = timer.innerHTML;
    let moves = movesCounter.innerHTML;

    db.collection(difficulty).add({
        name: name,
        moves: moves,
        time: time
    })
    .then(() => {
        fetchLeaderboard(difficulty);
        closeModal()
    });
}

const page = document.querySelector('#page');
const bod = document.querySelector('body');

function closeModal() {
    page.classList.remove('modal-open');
    modal.classList.remove("modal-show");
    modal.classList.add('modal-no-show');
    resetGame();
}

function resetGame(){
    tiles.forEach(tile => {
        tile.style.gridArea = tile.id;
        tile.dataset.pos = tile.id;
    });
    movesMade = 0;
    movesCounter.innerHTML = movesMade;
    if (t !== undefined) {
        clearInterval(t);
    }
    timer.innerHTML = '00:00';
    difficulty = null;
    blankTile.classList.remove('win');
}

//DB STUFF
firebase.initializeApp(fbConfig);
let db = firebase.firestore();

function fetchLeaderboard(diff) {
    let info = [];
    db.collection(diff).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            info.push(doc.data());
        })
    }).then(() => {
        updateLeaderboards(info, diff);
    }) 
}

function updateLeaderboards(arr, diff) {
    const lb = document.querySelector(`.${diff}-list`);
    lb.innerHTML = "";
    let sortedArr;
    if (sortButton.classList.contains('sbm')) {
        sortedArr = sortByMoves(arr);
        sortedArr.forEach(leader => {
            let listItem = document.createElement('li');
            listItem.innerHTML = `${leader.name}<span class="right">${leader.moves}</span>`;
            lb.appendChild(listItem);
        })
    } else {
        sortedArr = sortByTime(arr);
        sortedArr.forEach(leader => {
            let listItem = document.createElement('li');
            listItem.innerHTML = `${leader.name}<span class="right">${leader.time}</span>`;
            lb.appendChild(listItem);
        })
    }
}

function sortByMoves(arr) {
    sorted = arr.sort((a,b) => {
        return parseInt(a.moves) - parseInt(b.moves);
    });
    return sorted;
}

function sortByTime(arr) {
    sorted = arr.sort((a,b) =>{
        a = htmlToCount(a.time);
        b = htmlToCount(b.time);
        return a - b;
    });
    return sorted;
}

let sortButton = document.querySelector('.sort-by-button');
sortButton.addEventListener('click', toggleSort);

function toggleSort() {
    if (sortButton.classList.contains('sbm')) {
        sortButton.classList.remove('sbm');
        sortButton.classList.add('sbt');
        sortButton.innerHTML = "sort by time";
    } else {
        sortButton.classList.remove('sbt');
        sortButton.classList.add('sbm');
        sortButton.innerHTML = "sort by moves";
    }
    fetchLeaderboard('easy');
    fetchLeaderboard('medium');
    fetchLeaderboard('hard');
}

fetchLeaderboard('easy');
fetchLeaderboard('medium');
fetchLeaderboard('hard');
resetGame();

const hackerButton = document.querySelector('.hacker-button');
hackerButton.addEventListener('click', hackerMode);

let title = document.querySelector('.title');
let movesDiv = document.querySelector('.move-count');
let timerBorder = document.querySelector(".timer");
let leaderboardEasy = document.querySelector('.leaderboard-easy');
let leaderboardMedium = document.querySelector('.leaderboard-medium');
let leaderboardHard = document.querySelector('.leaderboard-hard');
let leaderboardTitle = document.querySelector('.lb-h1');
let psSection = document.querySelector('.ps-section');


function hackerMode() {
    let active;
    //Change a bunch of style
    if (hackerButton.classList.contains('clicked')) {
        hackerButton.classList.remove('clicked');
        hackerButton.innerHTML = "super secret hacker mode";
        pauseResume.classList.remove('click-here');
        active = false;
    } else {
        hackerButton.classList.add('clicked');
        hackerButton.innerHTML = "go back to normal"; 
        active = true;
    }
    hackerBackground(active);
    hackerTitle(active);
    hackerTiles(active);
    hackerBorders(active);
    hackerButtons(active);
   

    //Change pause button to a Hacker button

    //Change hacker button to "return to normal"
}

function hackerBackground(active) {
    if (active) {
        page.classList.add('hacker-background-color');
        bod.style.background = "black";
    } else {
        page.classList.remove('hacker-background-color');
        bod.style.background = "#edb531";
    }
}

function hackerTitle(active) {
    if (active) {
        title.classList.add('hacker-title');
        leaderboardTitle.classList.add('hacker-title');
        psSection.classList.add('hacker-ps');
    } else {
        title.classList.remove('hacker-title');
        leaderboardTitle.classList.remove('hacker-title');
        psSection.classList.remove('hacker-ps');
    }
}

function hackerTiles(active) {
    if (active) {
        tiles.forEach(tile => {
            tile.classList.add('hacker-tiles');
        });
    } else {
        tiles.forEach(tile => {
            tile.classList.remove('hacker-tiles')
        });
    }
}

function hackerBorders(active) {
    if (active) {
        page.classList.add('hacker-border-fuchsia');
        puzzleContainer.classList.add('hacker-border-green');
        leaderboardEasy.classList.add('hacker-outline-green');
        leaderboardMedium.classList.add('hacker-outline-fuchsia');
        leaderboardHard.classList.add('hacker-outline-green');
    } else {
        page.classList.remove('hacker-border-fuchsia');
        puzzleContainer.classList.remove('hacker-border-green');
        leaderboardEasy.classList.remove('hacker-outline-green');
        leaderboardMedium.classList.remove('hacker-outline-fuchsia');
        leaderboardHard.classList.remove('hacker-outline-green');

    }
}

function hackerButtons(active) {
    if(active) {
        startEasy.classList.add('hacker-easy');
        startMedium.classList.add('hacker-medium');
        startHard.classList.add('hacker-hard');
        pauseResume.classList.add('hacker-solve');
        movesDiv.classList.add('hacker-count');
        timerBorder.classList.add('hacker-timer');
        sortButton.classList.add('hacker-sort-button');
    } else {
        startEasy.classList.remove('hacker-easy');
        startMedium.classList.remove('hacker-medium');
        startHard.classList.remove('hacker-hard');
        pauseResume.classList.remove('hacker-solve');
        movesDiv.classList.remove('hacker-count');
        timerBorder.classList.remove('hacker-timer');
        sortButton.classList.remove('hacker-sort-button');
    }
}

//This is not perfect.. try to fix it later. 
function clickHereButton() {
    pauseResume.classList.add('click-here');
    pauseResume.innerHTML = "click";
}



