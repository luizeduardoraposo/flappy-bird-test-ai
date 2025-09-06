const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Bird
const bird = {
  x: 60,
  y: 300,
  width: 34,
  height: 24,
  gravity: 0.15,
  lift: -4.7,
  velocity: 0,
  frame: 0,
  rotation: 0
};

// Pipes
let pipes = [];
const pipeWidth = 52;
const pipeGap = Math.round(130 * 1.2); // 20% maior
const pipeSpeed = 1.7;
const minPipeTop = 50;
const maxPipeTop = 350;

// Ground
const groundHeight = 100;
let groundX = 0;
const groundSpeed = pipeSpeed;

// Game
let score = 0;
let best = 0;
let gameOver = false;
let started = false;

function drawBird() {
  ctx.save();
  ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
  ctx.rotate(bird.rotation);
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.ellipse(0, 0, bird.width / 2, bird.height / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  // Olho
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(8, -4, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(10, -4, 2, 0, Math.PI * 2);
  ctx.fill();
  // Bico
  ctx.fillStyle = '#FFA500';
  ctx.beginPath();
  ctx.moveTo(bird.width / 2, 0);
  ctx.lineTo(bird.width / 2 + 8, 3);
  ctx.lineTo(bird.width / 2, 6);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawPipes() {
  ctx.fillStyle = '#228B22';
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillRect(pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height - groundHeight - pipe.top - pipeGap);
  });
}

function drawScore() {
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 40px Arial';
  ctx.fillText(score, canvas.width / 2 - 10, 80);
  ctx.font = '18px Arial';
  ctx.fillText('Recorde: ' + best, 10, 30);
}

function drawGround() {
  ctx.fillStyle = '#ded895';
  ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);
  ctx.fillStyle = '#bcae6e';
  for (let i = 0; i < canvas.width; i += 40) {
    ctx.fillRect(i + (groundX % 40), canvas.height - groundHeight, 20, 20);
  }
}

function resetGame() {
  bird.y = 300;
  bird.velocity = 0;
  bird.rotation = 0;
  pipes = [];
  score = 0;
  gameOver = false;
  started = false;
  groundX = 0;
}

function update() {
  if (!started) return;
  if (gameOver) return;

  bird.velocity += bird.gravity;
  bird.y += bird.velocity;
  bird.frame++;

  // Bird rotation
  bird.rotation = Math.min((bird.velocity / 10), 1) * 0.6;

  // Pipes logic
  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - Math.round(240 * 1.2)) {
    const top = Math.floor(Math.random() * (maxPipeTop - minPipeTop + 1)) + minPipeTop;
    pipes.push({ x: canvas.width, top, passed: false });
  }
  pipes.forEach(pipe => {
    pipe.x -= pipeSpeed;
  });
  // Remove off-screen pipes
  if (pipes.length && pipes[0].x + pipeWidth < 0) {
    pipes.shift();
  }

  // Score
  pipes.forEach(pipe => {
    if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
      score++;
      pipe.passed = true;
      if (score > best) best = score;
    }
  });

  // Collision
  pipes.forEach(pipe => {
    if (
      bird.x + 6 < pipe.x + pipeWidth &&
      bird.x + bird.width - 6 > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > pipe.top + pipeGap)
    ) {
      gameOver = true;
    }
  });

  // Ground collision
  if (bird.y + bird.height > canvas.height - groundHeight) {
    bird.y = canvas.height - groundHeight - bird.height;
    gameOver = true;
  }
  // Top collision
  if (bird.y < 0) {
    bird.y = 0;
    bird.velocity = 0;
  }

  // Ground movement
  groundX -= groundSpeed;
  if (groundX <= -40) groundX = 0;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPipes();
  drawGround();
  drawBird();
  drawScore();
  if (!started) {
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 36px Arial';
    ctx.fillText('Pressione Espaço', 50, 250);
    ctx.font = '24px Arial';
    ctx.fillText('para começar', 120, 290);
  }
  if (gameOver) {
    ctx.fillStyle = '#fff';
    ctx.font = '48px Arial';
    ctx.fillText('Game Over', 70, 300);
    ctx.font = '24px Arial';
    ctx.fillText('Pressione Espaço para Reiniciar', 30, 350);
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

document.addEventListener('keydown', function (e) {
  if (e.code === 'Space') {
    if (!started) {
      started = true;
      bird.velocity = bird.lift;
      return;
    }
    if (gameOver) {
      resetGame();
      return;
    }
    bird.velocity = bird.lift;
  }
});

resetGame();
loop();
