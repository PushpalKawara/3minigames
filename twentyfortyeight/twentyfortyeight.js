const boardElement = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const restartBtn = document.getElementById('restartBtn');
let board, score;

function newGame() {
    board = Array.from({ length: 4 }, () => Array(4).fill(0));
    score = 0;
    updateScore();
    addRandomTile();
    addRandomTile();
    renderBoard();
}

function addRandomTile() {
    let emptyCells = [];
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (board[row][col] === 0) {
                emptyCells.push({ row, col });
            }
        }
    }
    if (emptyCells.length === 0) return;
    const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[row][col] = Math.random() < 0.9 ? 2 : 4;
}

function renderBoard() {
    boardElement.innerHTML = '';
    for (let row of board) {
        for (let cell of row) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            if (cell !== 0) {
                tile.textContent = cell;
                tile.style.backgroundColor = getTileColor(cell);
            }
            boardElement.appendChild(tile);
        }
    }
}

function getTileColor(value) {
    const colors = {
        2: '#eee4da', 4: '#ede0c8', 8: '#f2b179', 16: '#f59563', 32: '#f67c5f',
        64: '#f65e3b', 128: '#edcf72', 256: '#edcc61', 512: '#edc850', 1024: '#edc53f',
        2048: '#edc22e'
    };
    return colors[value] || '#cdc1b4';
}

function updateScore() {
    scoreElement.textContent = `Score: ${score}`;
}

document.addEventListener('keydown', e => {
    let moved = false;
    if (e.key === 'ArrowUp') moved = moveUp();
    if (e.key === 'ArrowDown') moved = moveDown();
    if (e.key === 'ArrowLeft') moved = moveLeft();
    if (e.key === 'ArrowRight') moved = moveRight();

    if (moved) {
        addRandomTile();
        renderBoard();
    }
});

// A simplified move function example
function moveRight() {
    let moved = false;
    for (let r = 0; r < 4; r++) {
        let row = board[r].filter(val => val !== 0);
        let newRow = [];
        while (row.length < 4) row.unshift(0);
        
        for(let i = 3; i > 0; i--) {
            if (row[i] === row[i-1] && row[i] !== 0) {
                row[i] *= 2;
                score += row[i];
                row[i-1] = 0;
            }
        }
        
        row = row.filter(val => val !== 0);
        while (row.length < 4) row.unshift(0);
        if (JSON.stringify(row) !== JSON.stringify(board[r])) {
            moved = true;
            board[r] = row;
        }
    }
    return moved;
}

// You would need to implement moveLeft, moveUp, moveDown similarly
function moveLeft() { /* ... */ return false; }
function moveUp() { /* ... */ return false; }
function moveDown() { /* ... */ return false; }

restartBtn.addEventListener('click', newGame);
newGame();
