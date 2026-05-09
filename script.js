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
const cardWidth = 320 + 24; // card width + gap

if (carousel && carouselBtnLeft && carouselBtnRight) {
  carouselBtnLeft.addEventListener('click', () => {
    carousel.scrollBy({
      left: -cardWidth,
      behavior: 'smooth'
    });
  });

  carouselBtnRight.addEventListener('click', () => {
    carousel.scrollBy({
      left: cardWidth,
      behavior: 'smooth'
    });
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
