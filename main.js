document.addEventListener("DOMContentLoaded", function() {

    const menuBtn = document.getElementById("menu-btn");
    const navLinks = document.getElementById("nav-links");
    const menuBtnIcon = menuBtn.querySelector("i");
    const dropdownToggle = document.querySelector(".dropdown-toggle");
    const dropdownMenu = document.querySelector(".dropdown-menu");
    const navBar = document.querySelector('nav');
    
    // --- Fungsi untuk menutup menu utama dan dropdown ---
    function closeAllMenus() {
        navLinks.classList.remove("open");
        menuBtnIcon.setAttribute("class", "ri-menu-3-line");
        dropdownMenu.classList.remove("open");
        dropdownToggle.setAttribute("aria-expanded", "false");
    }

    // --- Listener untuk tombol menu utama ---
    if (menuBtn) {
        menuBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            navLinks.classList.toggle("open");
            const isOpen = navLinks.classList.contains("open");
            menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-3-line");
            if (!isOpen) { // Jika menu ditutup, pastikan dropdown juga tertutup
                dropdownMenu.classList.remove("open");
                dropdownToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    // --- Listener untuk tombol dropdown ---
    if (dropdownToggle) {
        dropdownToggle.addEventListener("click", (event) => {
            event.stopPropagation(); // Kunci agar klik pada dropdown tidak memicu listener lain
            dropdownMenu.classList.toggle("open");
            const isOpen = dropdownMenu.classList.contains("open");
            dropdownToggle.setAttribute("aria-expanded", isOpen);
        });
    }

    // --- Listener untuk menutup menu utama ketika mengklik tautan ---
    const navLinksAll = navLinks.querySelectorAll('a');
    navLinksAll.forEach(link => {
        link.addEventListener('click', () => {
            closeAllMenus();
        });
    });

    // --- Listener untuk menutup menu utama dan dropdown ketika mengklik di luar navbar ---
    document.addEventListener("click", (event) => {
        const isClickInsideNav = navBar.contains(event.target);
        if (!isClickInsideNav) {
            closeAllMenus();
        }
    });

// --- Responsive Nav Logo Logic ---
const navLogo = document.querySelector('.nav__logo a');
const fullLogoTitle = navLogo.dataset.fullTitle;
const shortLogoTitle = "DSI";

function updateNavLogo() {
  const currentWidth = window.innerWidth;
  if (currentWidth > 786 && currentWidth < 961) {
    navLogo.textContent = shortLogoTitle;
  } else {
    navLogo.textContent = fullLogoTitle;
  }
}
updateNavLogo();
window.addEventListener('resize', updateNavLogo);

// // --- Floating WhatsApp Button Logic ---
// const whatsappBtn = document.getElementById('whatsappBtn');
// const headerBtns = document.querySelector('.header__btns');

// function handleScroll() {
//   const navHeight = navBar.offsetHeight;
//   const headerBtnsPosition = headerBtns.getBoundingClientRect().top;
//   if (headerBtnsPosition <= navHeight) {
//     whatsappBtn.classList.add('show');
//   } else {
//     whatsappBtn.classList.remove('show');
//   }
// }
// window.addEventListener('scroll', handleScroll);
// window.addEventListener('load', handleScroll);

// --- Modal Logic (Sistem yang Disederhanakan) ---
// Gunakan satu sistem yang fleksibel untuk semua modal
const modalTriggers = document.querySelectorAll('[data-modal-target]');
const modalCloseBtns = document.querySelectorAll('[data-close-modal]');

function openModal(modal) {
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modal) {
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

modalTriggers.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const targetModal = document.querySelector(btn.dataset.modalTarget);
    openModal(targetModal);
  });
});

modalCloseBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const modalToClose = btn.closest('.modal-overlay');
    closeModal(modalToClose);
  });
});

document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal(overlay);
        }
    });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const activeModal = document.querySelector('.modal-overlay.active');
    if (activeModal) {
      closeModal(activeModal);
    }
  }
});

// --- CAROUSEL LOGIC ---
const clientCarousel = document.getElementById('clientCarousel');
const carouselPrevBtn = document.getElementById('carouselPrevBtn');
const carouselNextBtn = document.getElementById('carouselNextBtn');
const carouselPagination = document.getElementById('carouselPagination');
const clientCards = document.querySelectorAll('.client__card');

let isDragging = false;
let startX;
let scrollLeft;
let autoScrollInterval;
const autoScrollDelay = 3000;

function updatePaginationDots() {
    carouselPagination.innerHTML = '';
    const totalPages = Math.ceil(clientCarousel.scrollWidth / clientCarousel.offsetWidth);
    const currentPage = Math.round(clientCarousel.scrollLeft / clientCarousel.offsetWidth);

    for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('span');
        dot.classList.add('pagination-dot');
        if (i === currentPage) {
            dot.classList.add('active');
        }
        dot.addEventListener('click', () => {
            clientCarousel.scrollLeft = clientCarousel.offsetWidth * i;
            resetAutoScroll();
        });
        carouselPagination.appendChild(dot);
    }
}

function scrollCarousel(direction) {
    const cardWidth = clientCards[0].offsetWidth + (parseFloat(getComputedStyle(clientCards[0]).marginRight) * 2);
    clientCarousel.scrollBy({
        left: direction * cardWidth,
        behavior: 'smooth'
    });
    resetAutoScroll();
}

function startAutoScroll() {
    autoScrollInterval = setInterval(() => {
        if (clientCarousel.scrollLeft + clientCarousel.offsetWidth >= clientCarousel.scrollWidth) {
            clientCarousel.scrollLeft = 0;
        } else {
            const cardWidth = clientCards[0].offsetWidth + (parseFloat(getComputedStyle(clientCards[0]).marginRight) * 2);
            clientCarousel.scrollBy({
                left: cardWidth,
                behavior: 'smooth'
            });
        }
        updatePaginationDots();
    }, autoScrollDelay);
}

function resetAutoScroll() {
    clearInterval(autoScrollInterval);
    startAutoScroll();
}

clientCarousel.addEventListener('mousedown', (e) => {
    isDragging = true;
    clientCarousel.classList.add('dragging');
    startX = e.pageX - clientCarousel.offsetLeft;
    scrollLeft = clientCarousel.scrollLeft;
    clearInterval(autoScrollInterval);
});

clientCarousel.addEventListener('mouseleave', () => {
    if (isDragging) {
        isDragging = false;
        clientCarousel.classList.remove('dragging');
        resetAutoScroll();
    }
});

clientCarousel.addEventListener('mouseup', () => {
    isDragging = false;
    clientCarousel.classList.remove('dragging');
    resetAutoScroll();
});

clientCarousel.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - clientCarousel.offsetLeft;
    const walk = (x - startX) * 1.5;
    clientCarousel.scrollLeft = scrollLeft - walk;
    updatePaginationDots();
});

clientCarousel.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].pageX - clientCarousel.offsetLeft;
    scrollLeft = clientCarousel.scrollLeft;
    clearInterval(autoScrollInterval);
}, { passive: true });

clientCarousel.addEventListener('touchend', () => {
    isDragging = false;
    resetAutoScroll();
});

clientCarousel.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - clientCarousel.offsetLeft;
    const walk = (x - startX) * 1.5;
    clientCarousel.scrollLeft = scrollLeft - walk;
    updatePaginationDots();
}, { passive: true });


carouselPrevBtn.addEventListener('click', () => scrollCarousel(-1));
carouselNextBtn.addEventListener('click', () => scrollCarousel(1));

window.addEventListener('load', () => {
    updatePaginationDots();
    startAutoScroll();
});

window.addEventListener('resize', () => {
    updatePaginationDots();
    resetAutoScroll();
});

clientCarousel.addEventListener('scroll', () => {
    clearTimeout(clientCarousel.scrollTimeout);
    clientCarousel.scrollTimeout = setTimeout(updatePaginationDots, 100);
});

// --- ScrollReveal & Animation ---
const scrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
};

ScrollReveal().reveal(".header__container h1", {
  ...scrollRevealOption,
});
ScrollReveal().reveal(".header__content .section__description", {
  ...scrollRevealOption,
  delay: 500,
});
ScrollReveal().reveal(".header__btns", {
  ...scrollRevealOption,
  delay: 1000,
});

ScrollReveal().reveal(".kabellistrik__card", {
  ...scrollRevealOption,
  interval: 500,
});

ScrollReveal().reveal(".steps__card", {
  ...scrollRevealOption,
  interval: 500,
});

const inspiration = document.querySelector(".inspiration__wrapper");
const inspirationImages = Array.from(inspiration.children);

inspirationImages.forEach((item) => {
  const duplicateNode = item.cloneNode(true);
  duplicateNode.setAttribute("aria-hidden", true);
  inspiration.appendChild(duplicateNode);
});

ScrollReveal().reveal(".property__card", {
  ...scrollRevealOption,
  interval: 500,
});

ScrollReveal().reveal(".trip__card", {
  ...scrollRevealOption,
  interval: 500,
});

})