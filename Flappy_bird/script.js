const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let birdY = canvas.height / 2;
let velocity = 0;
const gravity = 0.5;
const jumpStrength = -10;
let gameOver = false;
let score = 0;
let pipeX = canvas.width;
const pipeGap = 150;
const pipeWidth = 50;
const pipeSpeed = 2;
let pipes = [];
let pipePassed = false;

function drawBird() {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(110, birdY, 10, 0, Math.PI * 2);
    ctx.fill();
}

function drawPipe(pipeY, reverse = false) {
    if (!reverse) {
        ctx.fillStyle = 'green';
        ctx.fillRect(pipeX, 0, pipeWidth, pipeY - pipeGap / 2);
        ctx.fillRect(pipeX, pipeY + pipeGap / 2, pipeWidth, canvas.height - pipeY - pipeGap / 2);
    } else {
        ctx.fillStyle = 'green';
        ctx.fillRect(pipeX, 0, pipeWidth, pipeY - pipeGap / 2);
        ctx.fillRect(pipeX, pipeY + pipeGap / 2, pipeWidth, canvas.height - pipeY - pipeGap / 2);
    }
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function updateBird() {
    velocity += gravity;
    birdY += velocity;
    if (birdY > canvas.height || birdY < 0) {
        gameOver = true;
    }
}

function updatePipe() {
    pipeX -= pipeSpeed;
    if (pipeX + pipeWidth < 0) {
        pipeX = canvas.width;
        pipePassed = false;
        pipes.shift();
    }
    if (pipeX + pipeWidth > 100 && pipeX < 120 && !pipePassed) {
        score++;
        pipePassed = true;
    }
    if (pipes.length > 0 && pipeX < 120 && pipeX + pipeWidth > 100) {
        if (birdY - 10 > pipes[0].y + pipeGap / 2 || birdY + 10 < pipes[0].y - pipeGap / 2) {
            score++;
        }
    }
    if (pipeX + pipeWidth > 100 && pipeX < 120 &&
        (birdY < pipes[0].y - pipeGap / 2 || birdY > pipes[0].y + pipeGap / 2)) {
        gameOver = true;
    }
}

function generatePipe() {
    const y = Math.floor(Math.random() * (canvas.height - pipeGap)) + pipeGap / 2;
    pipes.push({ y });
}

function gameLoop() {
    if (!gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBird();
        pipes.forEach(pipe => drawPipe(pipe.y));
        drawScore();
        updateBird();
        updatePipe();
        if (pipes.length === 0 || pipes[pipes.length - 1].x <= canvas.width - 200) {
            generatePipe();
        }
        requestAnimationFrame(gameLoop);
    } else {
        ctx.fillStyle = 'black';
        ctx.font = '36px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
        ctx.fillText(`Score: ${score}`, canvas.width / 2 - 60, canvas.height / 2 + 40);
    }
}

document.addEventListener('keydown', function (event) {
    if (event.code === 'Space' && !gameOver) {
        velocity = jumpStrength;
    }
});

canvas.addEventListener('click', function (event) {
    if (!gameOver) {
        velocity = jumpStrength;
    }
});

generatePipe();
gameLoop();
