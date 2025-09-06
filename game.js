const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Bird
const bird = {
  x: 60,
  y: 300,
  width: 34,
  height: 24,
  gravity: 0.6,
  lift: -10,
  velocity: 0
};

// Pipes
let pipes = [];
const pipeWidth = 52;
const pipeGap = 120;

// Game
let score = 0;
let gameOver = false;

function drawBird() {
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
  ctx.fillStyle = '#228B22';
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillRect(pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height - pipe.top - pipeGap);
  });
}

function drawScore() {
  ctx.fillStyle = '#fff';
  ctx.font = '32px Arial';
  ctx.fillText(score, 20, 50);
}

function resetGame() {
  bird.y = 300;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  gameOver = false;
}

function update() {
  if (gameOver) return;

  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    gameOver = true;
  }

  // Pipes logic
  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
    const top = Math.random() * (canvas.height - pipeGap - 100) + 50;
    pipes.push({ x: canvas.width, top });
  }
  pipes.forEach(pipe => {
    pipe.x -= 2;
  });
  // Remove off-screen pipes
  if (pipes.length && pipes[0].x + pipeWidth < 0) {
    pipes.shift();
    score++;
  }

  // Collision
  pipes.forEach(pipe => {
    if (
      bird.x < pipe.x + pipeWidth &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > pipe.top + pipeGap)
    ) {
      gameOver = true;
    }
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPipes();
  drawBird();
  drawScore();
  if (gameOver) {
    ctx.fillStyle = '#fff';
    ctx.font = '48px Arial';
    ctx.fillText('Game Over', 70, 300);
    ctx.font = '24px Arial';
    ctx.fillText('Press Space to Restart', 70, 350);
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

document.addEventListener('keydown', function (e) {
  if (e.code === 'Space') {
    if (gameOver) {
      resetGame();
    } else {
      bird.velocity = bird.lift;
    }
  }
});

resetGame();
loop();
