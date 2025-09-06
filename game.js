
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  if (typeof resetGame === 'function') resetGame();
}


// Bird
let bird = {
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



let pipeGap, pipeSpeed, minPipeTop, maxPipeTop, groundHeight, groundX, groundSpeed;
let score, best = 0, gameOver, started;

function setSizes() {
  const base = Math.min(canvas.width, canvas.height);
  bird = {
    x: Math.round(canvas.width * 0.15),
    y: Math.round(canvas.height * 0.5),
    width: Math.round(base * 0.085),
    height: Math.round(base * 0.06),
    gravity: base * 0.00025,
    lift: -base * 0.001,
    velocity: 0,
    frame: 0,
    rotation: 0
  };
  pipeWidth = Math.round(base * 0.13);
  pipeGap = Math.round(base * 0.22);
  pipeSpeed = base * 0.0028;
  minPipeTop = Math.round(canvas.height * 0.08);
  maxPipeTop = Math.round(canvas.height * 0.6);
  groundHeight = Math.round(canvas.height * 0.16);
  groundSpeed = pipeSpeed;
}

function resetGame() {
  setSizes();
  pipes = [];
  score = 0;
  gameOver = false;
  started = false;
  groundX = 0;
  bird.y = Math.round(canvas.height * 0.5);
  bird.velocity = 0;
  bird.rotation = 0;
}

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
  ctx.arc(bird.width * 0.24, -bird.height * 0.17, bird.width * 0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(bird.width * 0.29, -bird.height * 0.17, bird.width * 0.06, 0, Math.PI * 2);
  ctx.fill();
  // Bico
  ctx.fillStyle = '#FFA500';
  ctx.beginPath();
  ctx.moveTo(bird.width / 2, 0);
  ctx.lineTo(bird.width / 2 + bird.width * 0.23, bird.height * 0.13);
  ctx.lineTo(bird.width / 2, bird.height * 0.25);
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
  ctx.font = `bold ${Math.round(canvas.height * 0.07)}px Arial`;
  ctx.fillText(score, canvas.width / 2 - canvas.height * 0.02, canvas.height * 0.13);
  ctx.font = `${Math.round(canvas.height * 0.03)}px Arial`;
  ctx.fillText('Recorde: ' + best, 10, Math.round(canvas.height * 0.05));
}

function drawGround() {
  ctx.fillStyle = '#ded895';
  ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);
  ctx.fillStyle = '#bcae6e';
  const tile = Math.round(groundHeight * 0.2);
  for (let i = 0; i < canvas.width; i += tile * 2) {
    ctx.fillRect(i + (groundX % (tile * 2)), canvas.height - groundHeight, tile, tile);
  }
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
  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - Math.round(pipeWidth * 4.2)) {
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
      bird.x + bird.width * 0.18 < pipe.x + pipeWidth &&
      bird.x + bird.width - bird.width * 0.18 > pipe.x &&
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
  if (groundX <= -Math.round(groundHeight * 0.4)) groundX = 0;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPipes();
  drawGround();
  drawBird();
  drawScore();
  if (!started) {
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${Math.round(canvas.height * 0.06)}px Arial`;
    ctx.fillText('Pressione Espaço', canvas.width * 0.18, canvas.height * 0.42);
    ctx.font = `${Math.round(canvas.height * 0.035)}px Arial`;
    ctx.fillText('para começar', canvas.width * 0.32, canvas.height * 0.49);
  }
  if (gameOver) {
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${Math.round(canvas.height * 0.08)}px Arial`;
    ctx.fillText('Game Over', canvas.width * 0.18, canvas.height * 0.5);
    ctx.font = `${Math.round(canvas.height * 0.04)}px Arial`;
    ctx.fillText('Pressione Espaço para Reiniciar', canvas.width * 0.07, canvas.height * 0.58);
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
