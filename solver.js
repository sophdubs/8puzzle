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

// 
function getHScore(state) {
    let hScoreSum = 0;
    state.forEach((tile, pos) => {
        let hScore = countManhattenDistance(tile, pos);
        hScoreSum += hScore;
    });
    return hScoreSum;
}

//Tested and working
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

//Tested and working
function findBlankNeighbors(state) {
    //Finds current position of the blank tile
    let blankPos = state.indexOf('nine');
    let blankNeighbors = neighbors[stringToNum[blankPos]];
    return blankNeighbors;
}

//Returns the shortest path to the puzzle solution.
function reconstructPath(current) {
    let path = [current];
    while (current.prev) {
        path.push(current.prev);
        current = current.prev;
    }
    console.log('path', path);
    return path;
}

// let a = {
//     prev: null
// }
// let b = {
//     prev: a
// }
// let c = {
//     prev: b
// }
// let d = {
//     prev: c
// }

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
        console.log('here no issues');
        if (isSolvedState(curr.state)) {
            console.log('SOLVED');
            return reconstructPath(curr);
        }
        // 4. Process each neighbor
        let neighbors = curr.neighbors.map(processNeighbors, curr);
        console.log(neighbors);
        //Check to see if we have seen it before
        for (let i = 0; i < neighbors.length; i++) {
            let seen = checkIfSeen(neighbors[i], closedSet);
            let open = checkIfSeen(neighbors[i], openSet);
            if (!seen && !open) {
                // console.log(`pushed ${i}`);
                openSet.push(neighbors[i]); 
            }
        }
        // console.log('openSet',openSet);
        closedSet.push(curr);
        console.log('closedSet', closedSet);
    }
}

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



