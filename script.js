// script.js

// Mengambil elemen canvas dan context-nya
let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');

// Ukuran blok ular
const blockSize = 20;
let score = 0;
let level = 1;

// Posisi awal ular
let snake = [
  { x: 160, y: 200 },
  { x: 140, y: 200 },
  { x: 120, y: 200 },
];

// Posisi awal makanan
let food = generateFood();

// Kecepatan ular (gerakan per detik)
let dx = blockSize;
let dy = 0;
let changingDirection = false;
let speed = 100;  // Kecepatan ular pada level 1

// Menangani input keyboard untuk mengubah arah ular
document.addEventListener('keydown', changeDirection);

// Kontrol sentuh (untuk perangkat mobile)
canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchmove', handleTouchMove);

// Fungsi utama untuk menjalankan game
function gameLoop() {
  if (hasGameEnded()) return;

  changingDirection = false;
  
  setTimeout(function() {
    clearCanvas();
    drawWall();  // Gambar dinding pembatas
    drawFood();
    moveSnake();
    drawSnake();
    updateScore();
    updateLevel();
    gameLoop();
  }, speed);
}

// Menggambar ular
function drawSnake() {
  snake.forEach(function(part) {
    ctx.fillStyle = '#00FF00'; // Warna hijau untuk ular
    ctx.fillRect(part.x, part.y, blockSize, blockSize);
  });
}

// Menggambar makanan
function drawFood() {
  ctx.fillStyle = '#FF0000'; // Warna merah untuk makanan
  ctx.fillRect(food.x, food.y, blockSize, blockSize);
}

// Menggambar dinding pembatas
function drawWall() {
  ctx.strokeStyle = '#000';  // Warna hitam untuk dinding
  ctx.lineWidth = 5;         // Ketebalan dinding
  ctx.strokeRect(0, 0, canvas.width, canvas.height);  // Gambar kotak pembatas
}

// Menggerakkan ular
function moveSnake() {
  let head = { x: snake[0].x + dx, y: snake[0].y + dy };
  
  snake.unshift(head);
  
  // Jika ular memakan makanan
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    food = generateFood();
  } else {
    snake.pop();
  }
}

// Mengubah arah ular berdasarkan input pengguna
function changeDirection(event) {
  if (changingDirection) return;
  changingDirection = true;

  if (event.keyCode === 37 && dx === 0) { // Kiri
    dx = -blockSize;
    dy = 0;
  }
  if (event.keyCode === 38 && dy === 0) { // Atas
    dy = -blockSize;
    dx = 0;
  }
  if (event.keyCode === 39 && dx === 0) { // Kanan
    dx = blockSize;
    dy = 0;
  }
  if (event.keyCode === 40 && dy === 0) { // Bawah
    dy = blockSize;
    dx = 0;
  }
}

// Kontrol sentuh untuk perangkat mobile
let touchStartX = 0;
let touchStartY = 0;

function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
  let deltaX = event.touches[0].clientX - touchStartX;
  let deltaY = event.touches[0].clientY - touchStartY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0 && dx === 0) {  // Geser ke kanan
      dx = blockSize;
      dy = 0;
    } else if (deltaX < 0 && dx === 0) {  // Geser ke kiri
      dx = -blockSize;
      dy = 0;
    }
  } else {
    if (deltaY > 0 && dy === 0) {  // Geser ke bawah
      dy = blockSize;
      dx = 0;
    } else if (deltaY < 0 && dy === 0) {  // Geser ke atas
      dy = -blockSize;
      dx = 0;
    }
  }

  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
}

// Membuat makanan di tempat acak
function generateFood() {
  let x = Math.floor(Math.random() * (canvas.width / blockSize)) * blockSize;
  let y = Math.floor(Math.random() * (canvas.height / blockSize)) * blockSize;
  return { x, y };
}

// Membersihkan canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Memeriksa apakah permainan berakhir
function hasGameEnded() {
  let head = snake[0];
  // Jika ular menabrak tembok
  if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
    alert("Game Over! Skor Anda: " + score);
    document.location.reload();
    return true;
  }
  
  // Jika ular menabrak dirinya sendiri
  for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      alert("Game Over! Skor Anda: " + score);
      document.location.reload();
      return true;
    }
  }
  return false;
}

// Memperbarui skor
function updateScore() {
  document.getElementById('score').textContent = "Skor: " + score;
}

// Memperbarui level berdasarkan skor
function updateLevel() {
  level = Math.floor(score / 50) + 1;
  document.getElementById('level').textContent = "Level: " + level;
  
  // Menambah kecepatan ular dengan level
  speed = 100 - level * 10;
}

// Memulai game
gameLoop();
