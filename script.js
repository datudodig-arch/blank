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

// ... (keep all the previous code for falling hearts, music, etc.)

// ================================
// Photo Album (Book Flip Logic) - UPDATED FOR LOCAL IMAGES
// ================================

const book = document.getElementById('book');
const prevBtn = document.getElementById('prev-page');
const nextBtn = document.getElementById('next-page');
const pageIndicator = document.getElementById('page-indicator');

const totalPages = 10; // 10 pages (20 pictures)
let currentPage = 1; // 1-based index

// Local images from the images/ folder
// Place your 20 images in the images/ folder with these exact names
const pictures = [
  'images/photo1.jpg',
  'images/photo2.jpg',
  'images/photo3.jpg',
  'images/photo4.jpg',
  'images/photo5.jpg',
  'images/photo6.jpg',
  'images/photo7.jpg',
  'images/photo8.jpg',
  'images/photo9.jpg',
  'images/photo10.jpg',
  'images/photo11.jpg',
  'images/photo12.jpg',
  'images/photo13.jpg',
  'images/photo14.jpg',
  'images/photo15.jpg',
  'images/photo16.jpg',
  'images/photo17.jpg',
  'images/photo18.jpg',
  'images/photo19.jpg',
  'images/photo20.jpg'
];

// Function to render current pages
function renderPages() {
  // Clear book content
  book.innerHTML = '';

  // Calculate left and right page indexes (0-based)
  const leftIndex = (currentPage - 1) * 2;
  const rightIndex = leftIndex + 1;

  // Create left page
  const leftPage = document.createElement('div');
  leftPage.className = 'page left';
  
  // Only create and add image if it exists in the array
  if (leftIndex < pictures.length) {
    const leftImg = document.createElement('img');
    leftImg.src = pictures[leftIndex];
    leftImg.alt = `Our memory photo ${leftIndex + 1} showing a special moment together`;
    leftPage.appendChild(leftImg);
  } else {
    // Placeholder for empty page
    leftPage.innerHTML = '<div class="empty-page">No photo yet ❤️</div>';
  }
  book.appendChild(leftPage);

  // Create right page
  const rightPage = document.createElement('div');
  rightPage.className = 'page';
  
  // Only create and add image if it exists in the array
  if (rightIndex < pictures.length) {
    const rightImg = document.createElement('img');
    rightImg.src = pictures[rightIndex];
    rightImg.alt = `Our memory photo ${rightIndex + 1} capturing our beautiful moments`;
    rightPage.appendChild(rightImg);
  } else {
    // Placeholder for empty page
    rightPage.innerHTML = '<div class="empty-page">No photo yet ❤️</div>';
  }
  book.appendChild(rightPage);

  // Update page indicator
  pageIndicator.textContent = `Page ${currentPage} / ${totalPages}`;

  // Update button states
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

// Navigation functions
function goToNextPage() {
  if (currentPage < totalPages) {
    currentPage++;
    book.style.transform = `rotateY(${180 * (currentPage - 1)}deg)`;
    renderPages();
  }
}

function goToPrevPage() {
  if (currentPage > 1) {
    currentPage--;
    book.style.transform = `rotateY(${180 * (currentPage - 1)}deg)`;
    renderPages();
  }
}

// Event listeners
prevBtn.addEventListener('click', goToPrevPage);
nextBtn.addEventListener('click', goToNextPage);

// Initialize the book
renderPages();

// ================================
// Countdown Timer (UPDATE YOUR DATE/TIME HERE)
// ================================

// Set your next meetup date and time here
// Format: new Date(year, month-1, day, hour, minute, second)
// Example: December 25, 2024 at 3:30 PM
const countdownDate = new Date(2024, 11, 25, 15, 30, 0);

function updateCountdown() {
  const now = new Date();
  const distance = countdownDate - now;

  if (distance < 0) {
    // Countdown finished
    document.getElementById('days').textContent = '00';
    document.getElementById('hours').textContent = '00';
    document.getElementById('minutes').textContent = '00';
    document.getElementById('seconds').textContent = '00';
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById('days').textContent = days.toString().padStart(2, '0');
  document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
  document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
  document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown();
