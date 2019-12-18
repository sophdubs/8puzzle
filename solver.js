const stringToNum = [null, 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];


//Tested and working
function getTileState() {
    let state = [];
    tiles.forEach(tile => {
        state[stringToNum.indexOf(tile.dataset.pos)] = tile.id;
    });
    return state;
}

function findSwappedState(neighbor, state){
    currState = state.slice();
   
    let blankIndex = currState.indexOf('nine');
    let neighborIndex = stringToNum.indexOf(neighbor);
    let neighborText = currState[neighborIndex];
   
    currState[blankIndex] = neighborText;
    currState[neighborIndex] = 'nine';

    return currState;
    
}

//Tested and working
function getHScore(state) {
    let hScoreSum = 0;
    state.forEach((tile, pos) => {
        let hScore = countManDistance(tile, pos);
        hScoreSum += hScore;
    });
    return hScoreSum;
}

//Tested and working
function countManDistance(tile, pos){
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
        path.unshift(current.prev);
        current = current.prev;
    }
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

function aStar(startNode, endState) {
    let openSet = [startNode];
    let closedSet = [];

    while (openSet.length > 0) {
        // 1. Find node with smallest F score (Make a func that does this)
        let index = findSmallestF(openSet);
        // 2. Remove it from openSet and call it curr
        let curr = openSet.splice(index, 1)[0];
        // 3. Check to see if curr.state = solution state. If so, return reconstruct path with current node. 
        if (curr.state === endState) {
            console.log('here');
            return reconstructPath(curr);
        }
        // 4. Process eacg neighbor
        let neighbors = curr.neighbors.map(processNeighbors, curr);
                //Check to see if we have seen it before
             
                //If so, set its parent to be curr
                //Set its gscore to be curr.gscore + 1
            //If not, it means we havent seen it yet, process it normally
        // 5. Add all neighbor nodes to openSet. 
        //
    }

    //Tomorrow will swap this for priority queue instead to avoid linear time search everytime to find the miminum fScore node. 
    function findSmallestF(arr){
        let f = Number.POSITIVE_INFINITY;
        let index = null;
        arr.forEach((node, i) => {
            if (node.fScore < f) {
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
}

let startNode = {
    fScore: null,
    gScore: 0,
    hScore: null,
    state: [],
    neighbors: [],
    prev: null
}

function solvePuzzle() {
    const state = getTileState();
    const neighbors = findBlankNeighbors(state);
    const hScore = getHScore(state);
    const gScore = 0;
    const fScore = gScore + hScore;

    const endState = [null, 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

    let startNode = {
        fScore,
        gScore, 
        hScore, 
        state,
        neighbors,
        prev: null
    }

    return aStar(startNode, endState);
}


