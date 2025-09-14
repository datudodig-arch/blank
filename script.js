// ================================
// Falling Hearts Animation
// ================================

const canvas = document.getElementById('hearts-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let hearts = [];

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Heart {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * -height;
    this.size = 10 + Math.random() * 15;
    this.speed = 1 + Math.random() * 2;
    this.angle = Math.random() * Math.PI * 2;
    this.spin = (Math.random() - 0.5) * 0.02;
    this.opacity = 0.6 + Math.random() * 0.4;
  }
  update() {
    this.y += this.speed;
    this.angle += this.spin;
    if (this.y > height + this.size) {
      this.reset();
      this.y = -this.size;
    }
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.scale(this.size / 20, this.size / 20);
    ctx.fillStyle = `rgba(255, 77, 109, ${this.opacity})`;
    ctx.beginPath();
    // Heart shape path
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(0, -3, -5, -10, -10, -10);
    ctx.bezierCurveTo(-20, -10, -20, 5, -20, 5);
    ctx.bezierCurveTo(-20, 15, -10, 20, 0, 30);
    ctx.bezierCurveTo(10, 20, 20, 15, 20, 5);
    ctx.bezierCurveTo(20, 5, 20, -10, 10, -10);
    ctx.bezierCurveTo(5, -10, 0, -3, 0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

function initHearts(num = 40) {
  hearts = [];
  for (let i = 0; i < num; i++) {
    hearts.push(new Heart());
  }
}
initHearts();

function animateHearts() {
  ctx.clearRect(0, 0, width, height);
  hearts.forEach(h => {
    h.update();
    h.draw();
  });
  requestAnimationFrame(animateHearts);
}
animateHearts();

// ================================
// Background Music Autoplay & Controls
// ================================

const music = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');

function updateMusicButton() {
  if (music.paused) {
    musicToggle.textContent = '▶️';
  } else {
    musicToggle.textContent = '⏸️';
  }
}

musicToggle.addEventListener('click', () => {
  if (music.paused) {
    music.play();
  } else {
    music.pause();
  }
  updateMusicButton();
});

// Try to autoplay music on page load (may be blocked by some browsers)
window.addEventListener('load', () => {
  music.play().catch(() => {
    // Autoplay blocked, user must click play
    updateMusicButton();
  });
  updateMusicButton();
});

// ================================
// Photo Album (Book Flip Logic)
// ================================

const book = document.getElementById('book');
const prevBtn = document.getElementById('prev-page');
const nextBtn = document.getElementById('next-page');
const pageIndicator = document.getElementById('page-indicator');

const totalPages = 10; // 10 pages (20 pictures)
let currentPage = 1; // 1-based index

// Insert your pictures here:
// Each page shows 2 pictures side-by-side (left and right pages)
// But per requirement, each page shows one picture, so we show left and right pages each with one picture.
// So total 20 pictures for 10 pages (2 pictures per page view).
// We'll store pictures in an array of 20 image URLs.

const pictures = [
  // Insert your 20 picture URLs here, in order.
  // Example placeholders:
  'https://picsum.photos/id/1011/400/400',
  'https://picsum.photos/id/1012/400/400',
  'https://picsum.photos/id/1013/400/400',
  'https://picsum.photos/id/1015/400/400',
  'https://picsum.photos/id/1016/400/400',
  'https://picsum.photos/id/1018/400/400',
  'https://picsum.photos/id/1020/400/400',
  'https://picsum.photos/id/1024/400/400',
  'https://picsum.photos/id/1025/400/400',
  'https://picsum.photos/id/1027/400/400',
  'https://picsum.photos/id/1031/400/400',
  'https://picsum.photos/id/1033/400/400',
  'https://picsum.photos/id/1035/400/400',
  'https://picsum.photos/id/1037/400/400',
  'https://picsum.photos/id/1039/400/400',
  'https://picsum.photos/id/1041/400/400',
  'https://picsum.photos/id/1043/400/400',
  'https://picsum.photos/id/1045/400/400',
  'https://picsum.photos/id/1047/400/400',
  'https://picsum.photos/id/1049/400/400',
];

// Function to render current pages
function renderPages() {
  // Clear book content
  book.innerHTML = '';

  // Calculate left and right page indexes (0-based)
  // currentPage is 1-based page number (1 to 10)
  // Left page index = (currentPage - 1) * 2
  // Right page index = left + 1
  const leftIndex = (currentPage - 1) *
