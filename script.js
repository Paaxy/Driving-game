const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const fullscreenButton = document.getElementById('fullscreen');
const pauseButton = document.getElementById('pause');
const controls = document.getElementById('mobile-controls');

// Initial canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game variables
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
    color: `hsl(${Math.random() * 360}, 50%, 50%)`, // Random color
  });
}

function drawCar() {
  ctx.fillStyle = 'red';
  ctx.fillRect(car.x, car.y, car.width, car.height);
}

function drawObstacles() {
  obstacles.forEach((obs) => {
    ctx.fillStyle = obs.color; // Use the random color
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
  });
}

function updateObstacles() {
  obstacles.forEach((obs) => {
    obs.y += obs.speed;
  });
  obstacles = obstacles.filter((obs) => obs.y < canvas.height); // Remove off-screen obstacles
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

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  car.x = canvas.width / 2; // Reposition car after resize
  car.y = canvas.height - 150; // Reposition car after resize
}

// Fullscreen functionality
fullscreenButton.addEventListener('click', () => {
  const gameContainer = document.getElementById('game-container');
  if (!document.fullscreenElement) {
    gameContainer.requestFullscreen();
    resizeCanvas();
  } else {
    document.exitFullscreen();
    resizeCanvas();
  }
});

// Pause functionality
pauseButton.addEventListener('click', () => {
  gameRunning = !gameRunning;
  if (gameRunning) requestAnimationFrame(gameLoop);
});

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

// Spawn obstacles
setInterval(spawnObstacle, 1500);
setInterval(moveCar, 16);

// Adjust canvas size on resize
window.addEventListener('resize', resizeCanvas);

// Start game
gameLoop();
