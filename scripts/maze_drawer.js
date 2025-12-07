// Configuration
const GRID_SIZE = 30; // 30x30 grid for resolution
const CELL_WIDTH = 600 / GRID_SIZE; // Assuming canvas is 600x600

const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
const solveBtn = document.getElementById('solveBtn');
const clearBtn = document.getElementById('clearBtn');
const toolRadios = document.querySelectorAll('input[name="tool"]');

let isDrawing = false;
let currentTool = 'wall';

// Initialize the grid (0: walkable, 1: wall, 2: start, 3: end)
let grid = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));

// Define start and end points
let startNode = { x: 1, y: 1 };
let endNode = { x: GRID_SIZE - 2, y: GRID_SIZE - 2 };

// Mark start and end on the grid initially
grid[startNode.y][startNode.x] = 2;
grid[endNode.y][endNode.x] = 3;

// --- Tool Selection ---
toolRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        currentTool = e.target.value;
    });
});

// --- Rendering Functions ---
function drawGrid() {
    ctx.clearRect(0, 0, 600, 600);

    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            const cellType = grid[y][x];
            ctx.fillStyle = 'white'; // Default walkable

            if (cellType === 1) { ctx.fillStyle = 'black'; } // Wall
            else if (cellType === 2) { ctx.fillStyle = 'red'; } // Start
            else if (cellType === 3) { ctx.fillStyle = 'green'; } // End

            ctx.fillRect(x * CELL_WIDTH, y * CELL_WIDTH, CELL_WIDTH, CELL_WIDTH);
            // Optional: Draw grid lines for better visibility
            ctx.strokeStyle = '#eee';
            ctx.strokeRect(x * CELL_WIDTH, y * CELL_WIDTH, CELL_WIDTH, CELL_WIDTH);
        }
    }
}

// --- User Interaction Functions ---
function getGridCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convert canvas pixel to grid index
    const gridX = Math.floor(x / CELL_WIDTH);
    const gridY = Math.floor(y / CELL_WIDTH);
    return { x: gridX, y: gridY };
}

function handleCanvasInteraction(e) {
    if (!isDrawing && e.type !== 'mousedown') return;

    // Bounds check
    const { x, y } = getGridCoords(e);
    if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return;

    if (currentTool === 'wall') {
        if (grid[y][x] !== 2 && grid[y][x] !== 3) {
            grid[y][x] = 1; // Mark as wall
            drawGrid();
        }
    } else if (e.type === 'mousedown') {
        // Handle set start/end only on click, not drag
        if (currentTool === 'start') {
            if (grid[y][x] !== 1 && grid[y][x] !== 3) { // Not wall, not end
                // Clear old start
                grid[startNode.y][startNode.x] = 0;
                // Set new start
                startNode = { x, y };
                grid[y][x] = 2;
                drawGrid();
            }
        } else if (currentTool === 'end') {
            if (grid[y][x] !== 1 && grid[y][x] !== 2) { // Not wall, not start
                // Clear old end
                grid[endNode.y][endNode.x] = 0;
                // Set new end
                endNode = { x, y };
                grid[y][x] = 3;
                drawGrid();
            }
        }
    }
}


// --- Event Listeners ---
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    handleCanvasInteraction(e);
});

canvas.addEventListener('mousemove', (e) => {
    if (currentTool === 'wall') {
        handleCanvasInteraction(e);
    }
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
});

canvas.addEventListener('mouseleave', () => {
    isDrawing = false;
});

clearBtn.addEventListener('click', () => {
    grid = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));
    grid[startNode.y][startNode.x] = 2;
    grid[endNode.y][endNode.x] = 3;
    drawGrid();
});

solveBtn.addEventListener('click', async () => {
    solveBtn.disabled = true;
    clearBtn.disabled = true;

    // Clear previous visualizations/paths before starting new solve
    // Clear previous visualizations/paths before starting new solve
    drawGrid();

    // Get selected algorithm
    const algorithm = document.getElementById('algorithmSelect').value;

    // Call the solver dispatcher
    const result = await solveMaze(grid, startNode, endNode, algorithm);

    if (result && result.path) {
        // Draw the solved path
        drawPath(result.path);

        // Add to statistics table
        const tbody = document.querySelector('#statsTable tbody');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${result.algorithm}</td>
            <td>${Math.round(result.timeMs)}</td>
            <td>${result.visitedCount}</td>
            <td>${result.path.length}</td>
        `;
        tbody.appendChild(row);
    } else {
        alert('No path found! Try drawing a clear route.');
    }

    solveBtn.disabled = false;
    clearBtn.disabled = false;
});

drawGrid(); // Initial draw