// Allows easy conversion between string and int using indexOf('num');
const stringToNum = [null, 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

//  This function builds the starting node and kicks off the A* algorithm
function solvePuzzle() {
    const state = getTileState();
    const neighbors = findBlankNeighbors(state);
    const hScore = getHScore(state);
    const gScore = 0;
    const fScore = gScore + hScore;

    let startNode = {
        fScore,
        gScore, 
        hScore, 
        state,
        neighbors,
        prev: null
    }
    return aStar(startNode);
}

// This is the function that finds the fastest way to the solution state
function aStar(startNode) {
    let openSet = [startNode];
    let closedSet = [];

    while (openSet.length > 0) {
        // 1. Find node with smallest F score (Make a func that does this)
        let index = findSmallestF(openSet);
        // 2. Remove it from openSet and call it curr
        let curr = openSet.splice(index, 1)[0];
        console.log('OpenSet', openSet);
        console.log(curr);
        // console.log('current open set', openSet);
        // console.log('open set length', openSet.length);
        // console.log('current curr', curr);
        // 3. Check to see if curr.state = solution state. If so, return reconstruct path with current node. 
        if (isSolvedState(curr.state)) {
            return reconstructPath(curr);
        }
        // 4. Process each neighbor
        let neighbors = curr.neighbors.map(processNeighbors, curr);
        //Check to see if we have seen it before
        for (let i = 0; i < neighbors.length; i++) {
            let seen = checkIfSeen(neighbors[i], closedSet);
            let open = checkIfSeen(neighbors[i], openSet);
            if (!seen && !open) {
                openSet.push(neighbors[i]); 
            }
        }
        closedSet.push(curr);
        
    }
    //No solution was found.
    return;
}

//Returns the shortest path to the puzzle solution.
function reconstructPath(current) {
    let path = [current];
    while (current.prev) {
        path.unshift(current.prev);
        current = current.prev;
    }
    return makeMoves(path);
}

function makeMoves(path) {
    for (let i = 0; i < path.length; i++) {
        setTimeout(() => {
            updateState(path[i].state)
        }, i * 500);
    }
}

function updateState(state) {
    for (let i = 1; i < state.length; i++) {
        let tile = document.getElementById(state[i]);
        if (tile.dataset.pos !== stringToNum[i]) {
            tile.dataset.pos = stringToNum[i];
            tile.style.gridArea = stringToNum[i];
        }
    }
}

// Returns an array reflecting the current state of the tiles
function getTileState() {
    let state = [];
    tiles.forEach(tile => {
        state[stringToNum.indexOf(tile.dataset.pos)] = tile.id;
    });
    return state;
}

// Returns an array reflecting the state if blank tile swaps with provided neighbor
function findSwappedState(neighbor, state){
    currState = state.slice();
    let blankIndex = currState.indexOf('nine');
    let neighborIndex = stringToNum.indexOf(neighbor);
    let neighborText = currState[neighborIndex];
    currState[blankIndex] = neighborText;
    currState[neighborIndex] = 'nine';
    return currState;
}

// This function returns the sum of all the heuristic scores for each of the tiles. 
function getHScore(state) {
    let hScoreSum = 0;
    state.forEach((tile, pos) => {
        let hScore = countManhattenDistance(tile, pos);
        hScoreSum += hScore;
    });
    return hScoreSum;
}

// This function counts the manhatten distance from the current tiles position to its solved puzzle tile position. 
function countManhattenDistance(tile, pos){
    if (tile === stringToNum[pos] || tile === "nine" || tile === null) {
        return 0;
    } else {
        let id = stringToNum.indexOf(tile);
        let vertical = Math.floor(Math.abs(pos - id)/3);
        let horizontal = Math.abs(pos - id) % 3;
        return vertical + horizontal;
    }
}

// This function returns the position of the tiles that the blank tile could swap with
function findBlankNeighbors(state) {
    //Finds current position of the blank tile
    let blankPos = state.indexOf('nine');
    let blankNeighbors = neighbors[stringToNum[blankPos]];
    return blankNeighbors;
}

// This function returns true if the current state of the board is the solved state, false otherwise.
function isSolvedState(currentState) {
    const solvedState = [null, 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    for (let i = 1; i < currentState.length; i++) {
        if (currentState[i] !== solvedState[i]) {
            return false;
            
        }
    }
    console.log('returning true');
    return true;
}

// This function checks to see if a node (board state) has been seen already 
function checkIfSeen(neighbor, closedSet) {
    for (let i = 0; i < closedSet.length; i++) {
        if (closedSet[i].state === neighbor.state) {
            true
        }
    }
    return false;
}

//Tomorrow will swap this for priority queue instead to avoid linear time search everytime to find the miminum fScore node. 
function findSmallestF(arr){
    let f = Number.POSITIVE_INFINITY;
    let index = null;
    arr.forEach((node, i) => {
        if (node.fScore < f) {
            f = node.fScore;
            index = i;
        }
    });
    return index;
}

// Creates a node for the neighbor that was passed in and returns it. 
function processNeighbors(neighbor) {
    swappedState = findSwappedState(neighbor, this.state);
    const neighbors = findBlankNeighbors(swappedState);
    const hScore = getHScore(swappedState);
    const gScore = this.gScore + 1;
    const fScore = hScore + gScore;
    return {
        state: swappedState,
        neighbors,
        hScore,
        gScore,
        fScore,
        prev: this
    }
}


// function switchTiles() {
//     if (difficulty !== null) {
//         let pos = this.dataset.pos;
//         let swaps = neighbors[pos];
//         checkNeighbors(swaps, this);
//     }
// }

// //This functions checks whether the swaps array contains the blank tile.
// //If so, it dispatches the next action to the swap function. 
// function checkNeighbors(swaps, tile) {
//     if(swaps.includes(blankTile.dataset.pos)) {
//         swap(tile, blankTile)
//     } 
// }

// //This function swaps the current tile's position with the blank tile's position. 
// function swap(tile, blank, shuffling=false) {
//     //Swapping the data-pos values to keep track of which tiles are where. 
//     let temp = tile.dataset.pos;
//     tile.dataset.pos = blank.dataset.pos;
//     blank.dataset.pos = temp;
//     //Swapping their actual positions in the grid
//     tile.style.gridArea = tile.dataset.pos;
//     blank.style.gridArea = blank.dataset.pos;
//     forceGridAnimation();

//     //This is just to avoid any issues while shuffling the puzzle at beginning of game. 
//     if (!shuffling) {
//         movesMade += 1;
//         movesCounter.innerHTML = movesMade;
//         checkWin();
//     }
// }



