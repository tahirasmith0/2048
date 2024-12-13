const board = document.getElementById('board');
let tiles = Array(4).fill(null).map(() => Array(4).fill(0)); // 4x4 grid initialized with 0s
let tileElements = []; // To store tile div elements for animation

// Draw the board
function drawBoard() {
    board.innerHTML = ''; // Clear the current board
    tileElements = []; // Reset tile elements array
    
    tiles.forEach((row, r) => {
        row.forEach((value, c) => {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.dataset.row = r;
            tile.dataset.col = c;

            if (value !== 0) {
                tile.textContent = value; // Add value to the tile
                tile.dataset.value = value; // Set the value as a data attribute for styling
            }

            board.appendChild(tile);
            tileElements.push(tile); // Store the tile div in tileElements array
        });
    });
}

// Spawn a new tile with value 2 or 4 in a random empty position
function spawnTile() {
    const emptyTiles = [];
    tiles.forEach((row, r) => {
        row.forEach((value, c) => {
            if (value === 0) emptyTiles.push([r, c]); // Collect empty positions
        });
    });

    if (emptyTiles.length > 0) {
        const [r, c] = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        tiles[r][c] = Math.random() < 0.9 ? 2 : 4; // Place 2 or 4 in a random empty tile
    }
}

// Slide and merge tiles in one row
function slide(row) {
    let newRow = row.filter(val => val !== 0); // Remove zeros
    for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
            newRow[i] *= 2; // Combine tiles
            newRow[i + 1] = 0; // Clear the merged tile
        }
    }
    newRow = newRow.filter(val => val !== 0); // Remove zeros again
    while (newRow.length < 4) newRow.push(0); // Fill remaining spots with zeros
    return newRow;
}

// Move tiles left
function moveLeft() {
    let hasChanged = false;
    for (let r = 0; r < 4; r++) {
        const newRow = slide(tiles[r]);
        if (tiles[r].toString() !== newRow.toString()) {
            tiles[r] = newRow;
            hasChanged = true; // Record that the board changed
        }
    }
    return hasChanged;
}

// Rotate the board 90 degrees clockwise
function rotateBoard() {
    const newTiles = Array(4).fill(null).map(() => Array(4).fill(0));
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            newTiles[c][3 - r] = tiles[r][c];
        }
    }
    tiles = newTiles;
}

// Move tiles in a specified direction
function move(direction) {
    let hasChanged = false;

    if (direction === 'left') {
        hasChanged = moveLeft();
    } else if (direction === 'right') {
        rotateBoard();
        rotateBoard();
        hasChanged = moveLeft();
        rotateBoard();
        rotateBoard();
    } else if (direction === 'up') {
        rotateBoard();
        rotateBoard();
        rotateBoard();
        hasChanged = moveLeft();
        rotateBoard();
    } else if (direction === 'down') {
        rotateBoard();
        hasChanged = moveLeft();
        rotateBoard();
        rotateBoard();
        rotateBoard();
    }

    if (hasChanged) {
        spawnTile(); // Add a new tile only if the board state changes
    }
    drawBoard(); // Redraw the board
    applyMergeAnimation(); // Apply merge animation to the number tiles
}

// Apply merge animation to number tiles only (those that have values)
function applyMergeAnimation() {
    // Ensure we only apply the merge animation to tiles with values
    tileElements.forEach(tile => {
        if (tile.textContent !== "0") { // Apply animation only for tiles that have a number
            tile.classList.remove('merged'); // Remove any previous merge effects
        }
    });

    // Allow the board to update before applying the merge animation
    setTimeout(() => {
        tileElements.forEach(tile => {
            // Only apply 'merged' class to tiles that have changed
            const newValue = tile.dataset.value;
            const oldValue = tile.textContent;

            if (newValue !== oldValue) {
                tile.classList.add('merged');
            }
        });
    }, 50); // Small delay to allow board to update before applying the animation
}

// Listen for arrow key presses
document.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') move('left');
    if (event.key === 'ArrowRight') move('right');
    if (event.key === 'ArrowUp') move('up');
    if (event.key === 'ArrowDown') move('down');
});

// Initialize the game
function initializeGame() {
    spawnTile();
    spawnTile();
    drawBoard();
}

document.addEventListener('DOMContentLoaded', initializeGame);
