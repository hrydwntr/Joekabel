const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("open");

  const isOpen = navLinks.classList.contains("open");
  menuBtnIcon.setAttribute(
    "class",
    isOpen ? "ri-close-line" : "ri-menu-3-line"
  );
});

navLinks.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuBtnIcon.setAttribute("class", "ri-menu-3-line");
});


// Select all elements with the class 'steps__card'
const stepsCards = document.querySelectorAll('.steps__card');

// Select the modal elements
const modalOverlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalCloseBtn = document.getElementById('modalCloseBtn');

// Function to open the modal
function openModal(title, description) {
  modalTitle.textContent = title; // Set the modal title
  modalDescription.textContent = description; // Set the modal description
  modalOverlay.classList.add('active'); // Add 'active' class to show the modal
  document.body.style.overflow = 'hidden'; // Prevent scrolling the background
}

// Function to close the modal
function closeModal() {
  modalOverlay.classList.remove('active'); // Remove 'active' class to hide the modal
  document.body.style.overflow = ''; // Re-enable scrolling
}

// Add click event listeners to each steps card
stepsCards.forEach(card => {
  card.addEventListener('click', () => {
    const title = card.dataset.title; // Get title from data-title attribute
    const description = card.dataset.description; // Get description from data-description attribute
    openModal(title, description);
  });
});

// Click event listener to the close button
modalCloseBtn.addEventListener('click', closeModal);

// Close modal when clicking outside the content (on the overlay)
modalOverlay.addEventListener('click', (event) => {
  if (event.target === modalOverlay) { // Check if the click was directly on the overlay
    closeModal();
  }
});

// Close modal when pressing the Escape key
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modalOverlay.classList.contains('active')) {
    closeModal();
  }
});

// --- NEW MODAL LOGIC (for "Syarat & Ketentuan") ---
const termsModalOverlay = document.getElementById('termsModal');
const openModalBtns = document.querySelectorAll('.open-modal-btn'); // Select all buttons that open modals
const closeModalBtns = document.querySelectorAll('[data-close-modal]'); // Select all buttons with data-close-modal attribute

function openSpecificModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeSpecificModal(modal) {
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Event listeners for opening modals
openModalBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link behavior
    const targetModalId = btn.dataset.target;
    openSpecificModal(targetModalId);
  });
});

// Event listeners for closing modals (either close button or overlay click)
closeModalBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Find the closest parent with .modal-overlay class to close it
    const modalToClose = btn.closest('.modal-overlay');
    closeSpecificModal(modalToClose);
  });
});

termsModalOverlay.addEventListener('click', (event) => {
    if (event.target === termsModalOverlay) {
        closeSpecificModal(termsModalOverlay);
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
const autoScrollDelay = 3000; // 3 seconds for auto-scroll

// Function to update pagination dots
function updatePaginationDots() {
    carouselPagination.innerHTML = ''; // Clear existing dots
    const totalPages = Math.ceil(clientCarousel.scrollWidth / clientCarousel.offsetWidth);
    const currentPage = Math.round(clientCarousel.scrollLeft / clientCarousel.offsetWidth);

    for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('span');
        dot.classList.add('pagination-dot');
        if (i === currentPage) {
            dot.classList.add('active');
        }
        dot.addEventListener('click', () => {
            // Scroll to the corresponding page
            clientCarousel.scrollLeft = clientCarousel.offsetWidth * i;
            resetAutoScroll();
        });
        carouselPagination.appendChild(dot);
    }
}

// Function to scroll carousel by a certain amount
function scrollCarousel(direction) {
    const cardWidth = clientCards[0].offsetWidth + (parseFloat(getComputedStyle(clientCards[0]).marginRight) * 2);
    clientCarousel.scrollBy({
        left: direction * cardWidth,
        behavior: 'smooth'
    });
    resetAutoScroll();
}

// Auto-scroll function
function startAutoScroll() {
    autoScrollInterval = setInterval(() => {
        // If at the end, jump to beginning, otherwise scroll to next
        if (clientCarousel.scrollLeft + clientCarousel.offsetWidth >= clientCarousel.scrollWidth) {
            clientCarousel.scrollLeft = 0; // Jump to start
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

// Reset auto-scroll timer
function resetAutoScroll() {
    clearInterval(autoScrollInterval);
    startAutoScroll();
}

// Drag functionality
clientCarousel.addEventListener('mousedown', (e) => {
    isDragging = true;
    clientCarousel.classList.add('dragging');
    startX = e.pageX - clientCarousel.offsetLeft;
    scrollLeft = clientCarousel.scrollLeft;
    clearInterval(autoScrollInterval); // Pause auto-scroll on drag start
});

clientCarousel.addEventListener('mouseleave', () => {
    if (isDragging) {
        isDragging = false;
        clientCarousel.classList.remove('dragging');
        resetAutoScroll(); // Resume auto-scroll after drag ends
    }
});

clientCarousel.addEventListener('mouseup', () => {
    isDragging = false;
    clientCarousel.classList.remove('dragging');
    resetAutoScroll(); // Resume auto-scroll after drag ends
});

clientCarousel.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault(); // Prevent text selection during drag
    const x = e.pageX - clientCarousel.offsetLeft;
    const walk = (x - startX) * 1.5; // Multiplier for faster drag
    clientCarousel.scrollLeft = scrollLeft - walk;
    updatePaginationDots();
});

// Touch events for mobile dragging
clientCarousel.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].pageX - clientCarousel.offsetLeft;
    scrollLeft = clientCarousel.scrollLeft;
    clearInterval(autoScrollInterval);
}, { passive: true }); // Use passive: true for better scroll performance

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


// Navigation button event listeners
carouselPrevBtn.addEventListener('click', () => scrollCarousel(-1));
carouselNextBtn.addEventListener('click', () => scrollCarousel(1));

// Update pagination and start auto-scroll on load and resize
window.addEventListener('load', () => {
    updatePaginationDots();
    startAutoScroll();
});

window.addEventListener('resize', () => {
    updatePaginationDots();
    resetAutoScroll(); // Reset auto-scroll on resize
});

// Update pagination when carousel is scrolled manually (e.g., by mouse wheel)
clientCarousel.addEventListener('scroll', () => {
    // Debounce this to prevent excessive calls during rapid scrolling
    clearTimeout(clientCarousel.scrollTimeout);
    clientCarousel.scrollTimeout = setTimeout(updatePaginationDots, 100);
});


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
