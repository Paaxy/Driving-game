const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const controls = document.getElementById('mobile-controls');
const fullscreenButton = document.getElementById('fullscreen');
const pauseButton = document.getElementById('pause');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let car = { x: canvas.width / 2, y: canvas.height - 100, width: 50, height: 100, speed: 5 };
let obstacles = [];
let gameRunning = true;

function spawnObstacle() {
  const width = Math.random() * 100 + 50;
  obstacles.push({
    x: Math.random() * (canvas.width - width),
    y: -50,
    width,
    height: 50,
    speed: 3 + Math.random() * 3,
  });
}

function drawCar() {
  ctx.fillStyle = 'red';
  ctx.fillRect(car.x, car.y, car.width, car.height);
}

function drawObstacles() {
  ctx.fillStyle = 'black';
  obstacles.forEach((obs) => {
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
  });
}

function updateObstacles() {
  obstacles.forEach((obs) => {
    obs.y += obs.speed;
  });
  obstacles = obstacles.filter((obs) => obs.y < canvas.height);
}

function checkCollision() {
  for (let obs of obstacles) {
    if (
      car.x < obs.x + obs.width &&
      car.x + car.width > obs.x &&
      car.y < obs.y + obs.height &&
      car.y + car.height > obs.y
    ) {
      gameRunning = false;
      alert('Game Over');
    }
  }
}

function gameLoop() {
  if (!gameRunning) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawCar();
  drawObstacles();
  updateObstacles();
  checkCollision();

  requestAnimationFrame(gameLoop);
}

// Movement logic
let keys = {};
document.addEventListener('keydown', (e) => (keys[e.key] = true));
document.addEventListener('keyup', (e) => (keys[e.key] = false));

function moveCar() {
  if (keys['ArrowUp'] || keys['w']) car.y -= car.speed;
  if (keys['ArrowDown'] || keys['s']) car.y += car.speed;
  if (keys['ArrowLeft'] || keys['a']) car.x -= car.speed;
  if (keys['ArrowRight'] || keys['d']) car.x += car.speed;

  // Mobile controls
  document.getElementById('up').ontouchstart = () => (keys['ArrowUp'] = true);
  document.getElementById('down').ontouchstart = () => (keys['ArrowDown'] = true);
  document.getElementById('left').ontouchstart = () => (keys['ArrowLeft'] = true);
  document.getElementById('right').ontouchstart = () => (keys['ArrowRight'] = true);
  document.querySelectorAll('button').forEach((btn) =>
    btn.ontouchend = () => (keys = {})
  );
}

// Fullscreen functionality
fullscreenButton.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

// Pause functionality
pauseButton.addEventListener('click', () => {
  gameRunning = !gameRunning;
  if (gameRunning) requestAnimationFrame(gameLoop);
});

// Spawn obstacles
setInterval(spawnObstacle, 1500);
setInterval(moveCar, 16);

// Start game
gameLoop();
