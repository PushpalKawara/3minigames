const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
let snake, food, direction, score, gameLoop;

let startX, startY;

function startGame() {
    snake = [{x: 10, y: 10}];
    food = {};
    direction = 'right';
    score = 0;
    document.getElementById('score').textContent = `Score: ${score}`;
    clearInterval(gameLoop);
    generateFood();
    gameLoop = setInterval(draw, 100);
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize))
    };
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    // Move snake
    const head = {x: snake[0].x, y: snake[0].y};
    if (direction === 'right') head.x++;
    if (direction === 'left') head.x--;
    if (direction === 'up') head.y--;
    if (direction === 'down') head.y++;
    snake.unshift(head);

    // Check for collision with walls or self
    if (head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize || checkSelfCollision()) {
        endGame();
        return;
    }

    // Check for eating food
    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById('score').textContent = `Score: ${score}`;
        generateFood();
    } else {
        snake.pop();
    }
    // Draw snake
    ctx.fillStyle = 'lime';
    snake.forEach(segment => ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize));
}

function checkSelfCollision() {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    return false;
}

function endGame() {
    clearInterval(gameLoop);
    alert('Game Over! Your score: ' + score);
}

// Mobile Touch Controls
canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

canvas.addEventListener('touchend', e => {
    e.preventDefault();
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = endX - startX;
    const diffY = endY - startY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 0 && direction !== 'left') direction = 'right';
        else if (diffX < 0 && direction !== 'right') direction = 'left';
    } else {
        // Vertical swipe
        if (diffY > 0 && direction !== 'up') direction = 'down';
        else if (diffY < 0 && direction !== 'down') direction = 'up';
    }
});
