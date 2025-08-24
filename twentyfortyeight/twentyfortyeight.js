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

function slide(row) {
    let arr = row.filter(val => val !== 0);
    let missing = 4 - arr.length;
    let newArr = Array(missing).fill(0).concat(arr);
    return newArr;
}

function combine(row) {
    for (let i = 3; i > 0; i--) {
        if (row[i] === row[i - 1] && row[i] !== 0) {
            row[i] *= 2;
            score += row[i];
            row[i - 1] = 0;
        }
    }
    return row;
}

function moveRight() {
    let moved = false;
    for (let r = 0; r < 4; r++) {
        let originalRow = [...board[r]];
        let newRow = slide(combine(slide(originalRow)));
        if (JSON.stringify(newRow) !== JSON.stringify(originalRow)) {
            board[r] = newRow;
            moved = true;
        }
    }
    return moved;
}

function moveLeft() {
    let moved = false;
    for (let r = 0; r < 4; r++) {
        let originalRow = [...board[r]];
        let reversedRow = originalRow.slice().reverse();
        let newRow = slide(combine(slide(reversedRow))).reverse();
        if (JSON.stringify(newRow) !== JSON.stringify(originalRow)) {
            board[r] = newRow;
            moved = true;
        }
    }
    return moved;
}

function moveUp() {
    let moved = false;
    let newBoard = Array.from({ length: 4 }, () => Array(4).fill(0));
    for (let c = 0; c < 4; c++) {
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let newCol = slide(combine(slide(col))).reverse();
        if (JSON.stringify(newCol) !== JSON.stringify(col)) moved = true;
        for (let r = 0; r < 4; r++) {
            newBoard[r][c] = newCol[r];
        }
    }
    board = newBoard;
    return moved;
}

function moveDown() {
    let moved = false;
    let newBoard = Array.from({ length: 4 }, () => Array(4).fill(0));
    for (let c = 0; c < 4; c++) {
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let newCol = slide(combine(slide(col)));
        if (JSON.stringify(newCol) !== JSON.stringify(col)) moved = true;
        for (let r = 0; r < 4; r++) {
            newBoard[r][c] = newCol[r];
        }
    }
    board = newBoard;
    return moved;
}

function isGameOver() {
    // Check if any empty cells exist
    for (let r of board) {
        for (let val of r) {
            if (val === 0) return false;
        }
    }
    // Check if any moves are possible
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (c < 3 && board[r][c] === board[r][c + 1]) return false;
            if (r < 3 && board[r][c] === board[r + 1][c]) return false;
        }
    }
    return true;
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
        updateScore();
    }
    if (isGameOver()) {
        alert('Game Over!');
    }
});

// Mobile Swipe Controls (Optional)
// You can add these similar to the Snake game code for a better mobile experience.
// ...

restartBtn.addEventListener('click', newGame);
newGame();
        
