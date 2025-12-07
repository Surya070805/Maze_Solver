// --- Node Class for Solvers ---
class Node {
    constructor(x, y, cost = 1) {
        this.x = x;
        this.y = y;
        this.cost = cost;
        this.g = 0; // Cost from start
        this.h = 0; // Heuristic (estimated cost to end)
        this.f = 0; // g + h
        this.parent = null;
    }
}

// --- Helper Functions ---
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function heuristic(node, endNode) {
    return Math.abs(node.x - endNode.x) + Math.abs(node.y - endNode.y);
}

// --- DIRECTIONS ---
const DIRECTIONS = [
    { dx: 0, dy: -1 }, // Up
    { dx: 0, dy: 1 },  // Down
    { dx: -1, dy: 0 }, // Left
    { dx: 1, dy: 0 }   // Right
];

// --- Main Solver Dispatcher ---
async function solveMaze(grid, startNode, endNode, algorithm) {
    let result = null;
    switch (algorithm) {
        case 'astar':
            result = await findAStarPath(grid, startNode, endNode);
            break;
        case 'bfs':
            result = await findBFSPath(grid, startNode, endNode);
            break;
        case 'dfs':
            result = await findDFSPath(grid, startNode, endNode);
            break;
        default:
            result = await findAStarPath(grid, startNode, endNode);
    }
    return result;
}

// --- A* Algorithm ---
async function findAStarPath(grid, startNode, endNode) {
    const startTime = performance.now();
    let visitedCount = 0;

    const GRID_SIZE = grid.length;
    let start = new Node(startNode.x, startNode.y);
    let end = new Node(endNode.x, endNode.y);

    let openList = [start];
    let closedList = new Map();

    while (openList.length > 0) {
        let lowestFIndex = 0;
        for (let i = 1; i < openList.length; i++) {
            if (openList[i].f < openList[lowestFIndex].f) {
                lowestFIndex = i;
            }
        }
        let currentNode = openList.splice(lowestFIndex, 1)[0];
        let currentKey = `${currentNode.x},${currentNode.y}`;

        // Increment visited count when we process a node (move to closed list)
        // Note: Logic allows re-visiting better paths in A*, but strictly 'closed' count is standard for 'visited'.
        // Or we can count distinct closed nodes. Map size will do that.

        if (currentNode.x === end.x && currentNode.y === end.y) {
            const endTime = performance.now();
            return {
                path: reconstructPath(currentNode),
                timeMs: endTime - startTime,
                visitedCount: closedList.size,
                algorithm: "A*"
            };
        }

        closedList.set(currentKey, currentNode);
        drawViz(closedList, openList);
        await sleep(20);

        for (const dir of DIRECTIONS) {
            const neighborX = currentNode.x + dir.dx;
            const neighborY = currentNode.y + dir.dy;

            if (isValid(neighborX, neighborY, GRID_SIZE, grid) && !closedList.has(`${neighborX},${neighborY}`)) {
                let neighbor = new Node(neighborX, neighborY);
                let newGCost = currentNode.g + 1;
                let openNode = openList.find(n => n.x === neighborX && n.y === neighborY);

                if (openNode) {
                    if (newGCost < openNode.g) {
                        openNode.g = newGCost;
                        openNode.f = openNode.g + openNode.h;
                        openNode.parent = currentNode;
                    }
                } else {
                    neighbor.g = newGCost;
                    neighbor.h = heuristic(neighbor, end);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.parent = currentNode;
                    openList.push(neighbor);
                }
            }
        }
    }
    return null;
}

// --- BFS Algorithm ---
async function findBFSPath(grid, startNode, endNode) {
    const startTime = performance.now();
    let visitedCount = 0;

    const GRID_SIZE = grid.length;
    let start = new Node(startNode.x, startNode.y);
    let end = new Node(endNode.x, endNode.y);

    let queue = [start];
    let visited = new Map();
    visited.set(`${start.x},${start.y}`, start);

    while (queue.length > 0) {
        let currentNode = queue.shift();

        if (currentNode.x === end.x && currentNode.y === end.y) {
            const endTime = performance.now();
            return {
                path: reconstructPath(currentNode),
                timeMs: endTime - startTime,
                visitedCount: visited.size,
                algorithm: "BFS"
            };
        }

        // Draw Viz
        drawViz(visited, queue);
        await sleep(20);

        for (const dir of DIRECTIONS) {
            const neighborX = currentNode.x + dir.dx;
            const neighborY = currentNode.y + dir.dy;
            const key = `${neighborX},${neighborY}`;

            if (isValid(neighborX, neighborY, GRID_SIZE, grid) && !visited.has(key)) {
                let neighbor = new Node(neighborX, neighborY);
                neighbor.parent = currentNode;
                visited.set(key, neighbor);
                queue.push(neighbor);
            }
        }
    }
    return null;
}

// --- DFS Algorithm ---
async function findDFSPath(grid, startNode, endNode) {
    const startTime = performance.now();

    const GRID_SIZE = grid.length;
    let start = new Node(startNode.x, startNode.y);
    let end = new Node(endNode.x, endNode.y);

    let stack = [start];
    let visited = new Map();
    visited.set(`${start.x},${start.y}`, start);

    while (stack.length > 0) {
        let currentNode = stack.pop();

        if (currentNode.x === end.x && currentNode.y === end.y) {
            const endTime = performance.now();
            return {
                path: reconstructPath(currentNode),
                timeMs: endTime - startTime,
                visitedCount: visited.size,
                algorithm: "DFS"
            };
        }

        drawViz(visited, stack);
        await sleep(20);

        for (const dir of DIRECTIONS) {
            const neighborX = currentNode.x + dir.dx;
            const neighborY = currentNode.y + dir.dy;
            const key = `${neighborX},${neighborY}`;

            if (isValid(neighborX, neighborY, GRID_SIZE, grid) && !visited.has(key)) {
                let neighbor = new Node(neighborX, neighborY);
                neighbor.parent = currentNode;
                visited.set(key, neighbor);
                stack.push(neighbor);
            }
        }
    }
    return null;
}


// --- Helper: Check Validity ---
function isValid(x, y, size, grid) {
    return x >= 0 && x < size && y >= 0 && y < size && grid[y][x] !== 1;
}

// --- Helper: Reconstruct Path ---
function reconstructPath(node) {
    let path = [];
    let curr = node;
    while (curr.parent) {
        path.push(curr);
        curr = curr.parent;
    }
    return path.reverse();
}

// --- Visualization Helper ---
function drawViz(closedSet, openSet) {
    const canvas = document.getElementById('mazeCanvas');
    const ctx = canvas.getContext('2d');
    const GRID_SIZE = 30;
    const CELL_WIDTH = 600 / GRID_SIZE;

    // Closed Set (Visited/Processed): Light Pink
    // Support Map (values()) or Array
    const closedNodes = (closedSet instanceof Map) ? closedSet.values() : closedSet;

    for (const node of closedNodes) {
        if (node.x === 1 && node.y === 1) continue;
        if (node.x === GRID_SIZE - 2 && node.y === GRID_SIZE - 2) continue;

        ctx.fillStyle = '#ffc0cb'; // Pink
        ctx.fillRect(node.x * CELL_WIDTH + 1, node.y * CELL_WIDTH + 1, CELL_WIDTH - 2, CELL_WIDTH - 2);
    }

    // Open Set (Frontier): Light Blue
    for (const node of openSet) {
        if (node.x === 1 && node.y === 1) continue;
        if (node.x === GRID_SIZE - 2 && node.y === GRID_SIZE - 2) continue;

        ctx.fillStyle = '#add8e6'; // Light Blue
        ctx.fillRect(node.x * CELL_WIDTH + 1, node.y * CELL_WIDTH + 1, CELL_WIDTH - 2, CELL_WIDTH - 2);
    }
}

// --- Visualization of the Solution Path ---
function drawPath(path) {
    const canvas = document.getElementById('mazeCanvas');
    const ctx = canvas.getContext('2d');
    const GRID_SIZE = 30;
    const CELL_WIDTH = 600 / GRID_SIZE;

    setTimeout(() => {
        ctx.strokeStyle = 'gold';
        ctx.lineWidth = 3;
        ctx.beginPath();

        ctx.moveTo(
            path[0].x * CELL_WIDTH + CELL_WIDTH / 2,
            path[0].y * CELL_WIDTH + CELL_WIDTH / 2
        );

        for (const node of path) {
            const centerX = node.x * CELL_WIDTH + CELL_WIDTH / 2;
            const centerY = node.y * CELL_WIDTH + CELL_WIDTH / 2;
            ctx.lineTo(centerX, centerY);
        }

        ctx.stroke();
    }, 50);
}