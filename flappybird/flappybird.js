const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let birdY, birdVelocity, pipes, score, gameLoop;

const gravity = 0.5;
const jumpStrength = -8;
const pipeGap = 120;
const pipeWidth = 50;

function startGame() {
    birdY = canvas.height / 2;
    birdVelocity = 0;
    pipes = [];
    score = 0;
    clearInterval(gameLoop);
    gameLoop = setInterval(game, 20);
    document.addEventListener('keydown', flap);
    pipes.push({ x: canvas.width, y: Math.random() * (canvas.height - pipeGap) });
}

function game() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Bird physics
    birdVelocity += gravity;
    birdY += birdVelocity;
    
    // Draw bird
    ctx.fillStyle = 'yellow';
    ctx.fillRect(50, birdY, 20, 20);

    // Pipe logic
    if (pipes.length > 0 && pipes[0].x < -pipeWidth) {
        pipes.shift();
        pipes.push({ x: canvas.width, y: Math.random() * (canvas.height - pipeGap) });
    }

    for (let i = 0; i < pipes.length; i++) {
        const p = pipes[i];
        p.x -= 2;
        
        // Draw pipes
        ctx.fillStyle = 'green';
        ctx.fillRect(p.x, 0, pipeWidth, p.y);
        ctx.fillRect(p.x, p.y + pipeGap, pipeWidth, canvas.height - (p.y + pipeGap));
        
        // Collision detection
        if (50 < p.x + pipeWidth && 70 > p.x && (birdY < p.y || birdY + 20 > p.y + pipeGap)) {
            endGame();
            return;
        }
        
        // Score
        if (p.x === 50) {
            score++;
            console.log(score);
        }
    }

    // Ground and sky collision
    if (birdY > canvas.height - 20 || birdY < 0) {
        endGame();
        return;
    }
}

function flap(e) {
    if (e.key === ' ' || e.key === 'ArrowUp') {
        birdVelocity = jumpStrength;
    }
}

function endGame() {
    clearInterval(gameLoop);
    alert('Game Over! Score: ' + score);
    document.removeEventListener('keydown', flap);
}
