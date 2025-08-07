document.addEventListener("DOMContentLoaded", function() {

    // --- Animasi Counter untuk Halaman Tentang Kami ---
const counters = document.querySelectorAll('.counter');

const options = {
  threshold: 0.5, // Aktif saat 50% elemen terlihat
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counterElement = entry.target;
      const target = +counterElement.dataset.target;
      let count = 0;

      const updateCounter = () => {
        const increment = target / 200; // Kecepatan animasi
        if (count < target) {
          count += increment;
          counterElement.innerText = Math.ceil(count);
          requestAnimationFrame(updateCounter);
        } else {
          counterElement.innerText = target.toLocaleString(); // Menampilkan angka akhir dengan koma
        }
      };

      updateCounter();
      observer.unobserve(counterElement); // Hentikan observasi setelah animasi
    }
  });
}, options);

counters.forEach(counter => {
  observer.observe(counter);
});

})