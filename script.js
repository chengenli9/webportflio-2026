const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ─── CAROUSEL FUNCTIONALITY ─── //
const carousel = document.querySelector('.projects-carousel');
const carouselBtnLeft = document.querySelector('.carousel-btn-left');
const carouselBtnRight = document.querySelector('.carousel-btn-right');
const cards = Array.from(document.querySelectorAll('.project-card'));
const dotsContainer = document.getElementById('cardDots');
let currentIndex = 0;

// Build dots
cards.forEach((_, i) => {
  const dot = document.createElement('span');
  dot.className = 'card-dot' + (i === 0 ? ' active' : '');
  dot.addEventListener('click', () => { currentIndex = i; updateStack(); });
  dotsContainer.appendChild(dot);
});

function updateStack() {
  const dots = dotsContainer.querySelectorAll('.card-dot');
  cards.forEach((card, i) => {
    card.classList.remove('stack-active', 'stack-behind-1', 'stack-behind-2');
    dots[i].classList.remove('active');
    const diff = (i - currentIndex + cards.length) % cards.length;
    if (diff === 0) { card.classList.add('stack-active'); dots[i].classList.add('active'); }
    else if (diff === 1) card.classList.add('stack-behind-1');
    else if (diff === 2) card.classList.add('stack-behind-2');
  });
}

updateStack();

if (carouselBtnLeft && carouselBtnRight) {
  carouselBtnLeft.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    updateStack();
  });
  carouselBtnRight.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % cards.length;
    updateStack();
  });
}

// ─── MODAL FUNCTIONALITY ─── //
const projectModal = document.getElementById('projectModal');
const modalClose = document.querySelector('.modal-close');
const readMoreBtns = document.querySelectorAll('.read-more-btn');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalTags = document.getElementById('modalTags');

const projectData = [
  {
    title: 'Scenerio',
    desc: 'An agentic video editing tool that uses Gemini models and FFMpeg to generate and edit videos from text prompts. This project was built in 24 hours with the help of Claude, winning 1st place in the Google Track at BeaverHacks 2026.',
    tags: ['React', 'FastAPI', 'Python', 'TypeScript', 'Gemini API', 'FFMpeg']
  },
  {
    title: 'LiBay',
    desc: 'A full stack EBay "clone", final project for database management systems class, featuring a MySQL database, and PHP frontend.',
    tags: ['MySQL', 'PHP', 'HTML/CSS']
  },
  {
    title: 'Dr.Mole',
    desc: 'A mobile app designed to raise awareness about skin cancer. The app uses computer vision and photo scanning to help classify moles and highlight potential signs of melanoma. Dr.Mole allows users to track mole changes over time. Noticing any unusual patterns early on is a major factor in early skin cancer detection, and with the help of our app\'s progression summary feature and AI powered analysis, users are instantly notified when a mole may require attention and are encouraged to connect with a dermatologist promptly. This project was built in 24 hours by a team of four UP students and with the help of Claude, winning 3rd place in the Philanthropy Track at HackUP 2026.',
    tags: ['React-Native', 'TypeScript', 'FastAPI', 'PyTorch-Vision', 'Groq API']
  },
  {
    title: 'UP Time Machine',
    desc: 'A geolocation-enabled web app built for a real client, featuring an interactive real-world map using OpenStreetMap and Leaflet.js, an ExpressJS backend, and MySQL data layer.',
    tags: ['HTML/CSS', 'ExpressJS', 'MySQL', 'Leaflet.js']
  },
  {
    title: 'JavaScript Web Games',
    desc: 'A collection of interactive browser games with polished UIs built in ReactJS and Tailwind CSS, applying OOP and functional programming patterns for clean, modular architecture.',
    tags: ['React', 'Tailwind CSS', 'JavaScript']
  },
  {
    title: 'Hex Mobile Game',
    desc: 'An Android strategy game developed with Android Studio, Java, and XML. Led sprint meetings and team coordination, delivering a product that exceeded course requirements.',
    tags: ['Android Studio', 'Java', 'XML']
  }
];

readMoreBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const projectIndex = parseInt(btn.getAttribute('data-project'));
    const project = projectData[projectIndex];
    
    modalTitle.textContent = project.title;
    modalDesc.textContent = project.desc;
    
    modalTags.innerHTML = project.tags.map(tag => 
      `<span class="tag">${tag}</span>`
    ).join('');
    
    projectModal.classList.add('active');
  });
});

if (modalClose) {
  modalClose.addEventListener('click', () => {
    projectModal.classList.remove('active');
  });
}

projectModal.addEventListener('click', (e) => {
  if (e.target === projectModal) {
    projectModal.classList.remove('active');
  }
});

// ─── DRAWING OVERLAY ─── //
const drawCanvas = document.getElementById('drawCanvas');
const drawToggle = document.getElementById('drawToggle');
const drawColorPicker = document.getElementById('drawColorPicker');
const drawSizeSlider = document.getElementById('drawSize');
const drawSizeLabel = document.getElementById('drawSizeLabel');
const drawEraserBtn = document.getElementById('drawEraser');
const drawClearBtn = document.getElementById('drawClear');
const drawSwatches = document.querySelectorAll('.draw-swatch');
const drawColorPickLabel = document.querySelector('.draw-color-pick');

const ctx = drawCanvas.getContext('2d');

let isDrawingMode = false;
let isPointerDown = false;
let currentColor = '#00d4a0';
let strokeSize = 4;
let isEraser = false;
let lastX = 0, lastY = 0;

function resizeCanvas() {
  const imgData = (drawCanvas.width > 0 && drawCanvas.height > 0)
    ? ctx.getImageData(0, 0, drawCanvas.width, drawCanvas.height)
    : null;
  drawCanvas.width = window.innerWidth;
  drawCanvas.height = window.innerHeight;
  if (imgData) ctx.putImageData(imgData, 0, 0);
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function getPos(e) {
  if (e.touches && e.touches.length > 0) {
    const r = drawCanvas.getBoundingClientRect();
    return { x: e.touches[0].clientX - r.left, y: e.touches[0].clientY - r.top };
  }
  return { x: e.offsetX, y: e.offsetY };
}

function startDraw(e) {
  if (!isDrawingMode) return;
  isPointerDown = true;
  const { x, y } = getPos(e);
  lastX = x; lastY = y;
  // Draw a dot on click/tap
  ctx.beginPath();
  const r = (isEraser ? strokeSize * 2 : strokeSize) / 2;
  ctx.arc(x, y, Math.max(r, 1), 0, Math.PI * 2);
  if (isEraser) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,1)';
  } else {
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = currentColor;
  }
  ctx.fill();
}

function draw(e) {
  if (!isDrawingMode || !isPointerDown) return;
  if (e.cancelable) e.preventDefault();
  const { x, y } = getPos(e);
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.lineWidth = isEraser ? strokeSize * 2 : strokeSize;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  if (isEraser) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.strokeStyle = 'rgba(0,0,0,1)';
  } else {
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = currentColor;
  }
  ctx.stroke();
  lastX = x; lastY = y;
}

function endDraw() {
  isPointerDown = false;
  ctx.globalCompositeOperation = 'source-over';
}

drawCanvas.addEventListener('mousedown', startDraw);
drawCanvas.addEventListener('mousemove', draw);
drawCanvas.addEventListener('mouseup', endDraw);
drawCanvas.addEventListener('mouseleave', endDraw);
drawCanvas.addEventListener('touchstart', startDraw, { passive: true });
drawCanvas.addEventListener('touchmove', draw, { passive: false });
drawCanvas.addEventListener('touchend', endDraw);

// Toggle drawing mode
drawToggle.addEventListener('click', () => {
  isDrawingMode = !isDrawingMode;
  document.body.classList.toggle('draw-active', isDrawingMode);
});

// Color swatches
drawSwatches.forEach(swatch => {
  swatch.addEventListener('click', () => {
    currentColor = swatch.dataset.color;
    isEraser = false;
    drawEraserBtn.classList.remove('active');
    drawSwatches.forEach(s => s.classList.remove('active'));
    drawColorPickLabel.classList.remove('active');
    swatch.classList.add('active');
  });
});

// Custom color picker
drawColorPicker.addEventListener('input', (e) => {
  currentColor = e.target.value;
  isEraser = false;
  drawEraserBtn.classList.remove('active');
  drawSwatches.forEach(s => s.classList.remove('active'));
  drawColorPickLabel.classList.add('active');
});

// Size slider
drawSizeSlider.addEventListener('input', () => {
  strokeSize = parseInt(drawSizeSlider.value, 10);
  drawSizeLabel.textContent = strokeSize;
});

// Eraser toggle
drawEraserBtn.addEventListener('click', () => {
  isEraser = !isEraser;
  drawEraserBtn.classList.toggle('active', isEraser);
});

// Clear canvas
drawClearBtn.addEventListener('click', () => {
  ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
});

// ─── RUNNING DUCK ─── //
(function () {
  const duck = document.getElementById('runningDuck');
  const sprite = document.getElementById('duckSprite');
  const frames = ['images/duck_run1.png', 'images/duck_run2.png'];
  let frameIdx = 0;

  function launchDuck() {
    frameIdx = 0;
    sprite.src = frames[0];
    duck.style.display = 'block';
    // Force reflow so the animation restarts cleanly
    duck.classList.remove('duck-go');
    void duck.offsetWidth;
    duck.classList.add('duck-go');

    const frameInterval = setInterval(() => {
      frameIdx = (frameIdx + 1) % 2;
      sprite.src = frames[frameIdx];
    }, 150);

    duck.addEventListener('animationend', () => {
      clearInterval(frameInterval);
      duck.classList.remove('duck-go');
      duck.style.display = 'none';
      setTimeout(launchDuck, 20000);
    }, { once: true });
  }

  setTimeout(launchDuck, 10000);
}());

// ─── BALLGAME POPUP ─── //
(function () {
  const btn = document.getElementById('ballgameBtn');
  const MARGIN = 70; // keep it fully on screen

  function showBallgame() {
    const maxX = window.innerWidth  - MARGIN * 2;
    const maxY = window.innerHeight - MARGIN * 2;
    const x = Math.floor(Math.random() * maxX) + MARGIN;
    const y = Math.floor(Math.random() * maxY) + MARGIN;

    btn.style.left = x + 'px';
    btn.style.top  = y + 'px';
    btn.classList.add('ballgame-visible');

    // Hide after 6 seconds if not clicked
    const hideTimer = setTimeout(hideBallgame, 6000);

    btn.addEventListener('click', () => {
      clearTimeout(hideTimer);
      hideBallgame();
    }, { once: true });
  }

  function hideBallgame() {
    btn.classList.remove('ballgame-visible');
    btn.style.display = '';
    setTimeout(showBallgame, 30000);
  }

  // First appearance after 30 seconds
  setTimeout(showBallgame, 30000);
}());

// ─── RICE BOWL POPUP ─── //
(function () {
  const btn = document.getElementById('riceBowlBtn');
  const MARGIN = 70;

  function showRiceBowl() {
    const maxX = window.innerWidth  - MARGIN * 2;
    const maxY = window.innerHeight - MARGIN * 2;
    const x = Math.floor(Math.random() * maxX) + MARGIN;
    const y = Math.floor(Math.random() * maxY) + MARGIN;

    btn.style.left = x + 'px';
    btn.style.top  = y + 'px';
    btn.classList.add('ricebowl-visible');

    const hideTimer = setTimeout(hideRiceBowl, 6000);

    btn.addEventListener('click', () => {
      clearTimeout(hideTimer);
      hideRiceBowl();
    }, { once: true });
  }

  function hideRiceBowl() {
    btn.classList.remove('ricebowl-visible');
    btn.style.display = '';
    setTimeout(showRiceBowl, 30000);
  }

  // Offset by 15s so both popups don't appear at the same time
  setTimeout(showRiceBowl, 45000);
}());
