// js/script.js

document.addEventListener('DOMContentLoaded', function () {
    // ---- PENGATURAN AWAL & DATA INJECTION ----
    const root = document.documentElement;
    const guestNameElement = document.getElementById('guest-name');
    const openButton = document.getElementById('open-invitation');
    const mainContent = document.getElementById('main-content');
    const landingPage = document.getElementById('landing');
    const audio = document.getElementById('background-music');
    const bottomNav = document.getElementById('bottom-nav');

    // Mengatur variabel CSS dari data.js
    root.style.setProperty('--theme-color', data.theme_color);
    root.style.setProperty('--font-title', data.font_title);
    root.style.setProperty('--font-content', data.font_content);

    // Mengambil nama tamu dari URL
    const urlParams = new URLSearchParams(window.location.search);
    const to = urlParams.get('to');
    guestNameElement.textContent = to ? to.replace(/_/g, ' ') : 'Bapak/Ibu/Saudara/i';
    
    // Mengisi data dari data.js ke HTML
    document.title = `Undangan Pernikahan ${data.groom_name} & ${data.bride_name}`;
    document.getElementById('couple-name-landing').textContent = `${data.groom_name} & ${data.bride_name}`;
    document.getElementById('intro-text-landing').textContent = data.intro_text;
    document.getElementById('groom-name-main').textContent = data.groom_full_name;
    document.getElementById('groom-parents').textContent = `Bapak ${data.groom_father} & Ibu ${data.groom_mother}`;
    document.getElementById('bride-name-main').textContent = data.bride_full_name;
    document.getElementById('bride-parents').textContent = `Bapak ${data.bride_father} & Ibu ${data.bride_mother}`;
    document.getElementById('quote-text').textContent = data.quote;
    document.getElementById('quote-source').textContent = data.quote_source;
    document.getElementById('akad-date').textContent = data.akad.date;
    document.getElementById('akad-time').textContent = `Pukul ${data.akad.time_start} - ${data.akad.time_end} WIB`;
    document.getElementById('akad-place').textContent = data.akad.place;
    document.getElementById('resepsi-date').textContent = data.resepsi.date;
    document.getElementById('resepsi-time').textContent = `Pukul ${data.resepsi.time_start} - ${data.resepsi.time_end} WIB`;
    document.getElementById('resepsi-place').textContent = data.resepsi.place;
    document.getElementById('gmaps-button').href = data.gmaps_link;
    document.getElementById('made-by').textContent = data.made_by;
    document.getElementById('tiktok-username').textContent = `@${data.tiktok_username}`;
    document.getElementById('tiktok-link').href = `https://tiktok.com/@${data.tiktok_username}`;

    // ---- FUNGSI UTAMA ----

    // Countdown Timer
    function startCountdown() {
        const weddingDate = new Date(data.wedding_date).getTime();
        const countdownInterval = setInterval(() => {
            const now = new Date().getTime();
            const distance = weddingDate - now;
            if (distance < 0) {
                clearInterval(countdownInterval);
                document.getElementById('countdown').innerHTML = "<h3>Acara Telah Selesai</h3>";
                return;
            }
            document.getElementById('days').textContent = Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
            document.getElementById('hours').textContent = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
            document.getElementById('minutes').textContent = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
            document.getElementById('seconds').textContent = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0');
        }, 1000);
    }

    // Efek love berjatuhan
    function createFallingLove() {
        if (!data.enable_falling_love) return;
        setInterval(() => {
            const heart = document.createElement('div');
            heart.classList.add('love-heart');
            heart.innerHTML = '❤';
            heart.style.left = `${Math.random() * 100}vw`;
            heart.style.animationDuration = `${Math.random() * 5 + 5}s`;
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 10000);
        }, 300);
    }

    // Galeri Foto
    function setupGallery() {
        const galleryNavItem = document.getElementById('gallery-nav-item');
        const gallerySection = document.getElementById('gallery-section');
        if (!data.enable_gallery) {
            gallerySection.style.display = 'none';
            galleryNavItem.style.display = 'none';
            return;
        }
        gallerySection.style.display = 'block';
        const galleryContainer = document.getElementById('gallery-container');
        data.gallery_images.forEach(image => {
            const col = document.createElement('div');
            col.className = 'col-md-4 col-6';
            col.innerHTML = `<img src="images/${image}" alt="Foto Galeri" class="img-fluid">`;
            galleryContainer.appendChild(col);
        });
    }
    
    // Efek scroll reveal
    function setupScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }

    // ---- EVENT LISTENER ----
    openButton.addEventListener('click', () => {
        landingPage.style.transform = 'scale(1.2)';
        landingPage.style.opacity = '0';
        setTimeout(() => {
            landingPage.style.display = 'none';
            mainContent.style.display = 'block';
            document.body.style.overflowY = 'auto';
            bottomNav.classList.add('show');
            document.getElementById('mempelai').scrollIntoView({ behavior: 'smooth' });
            if (data.enable_music) audio.play();
            createFallingLove();
        }, 1500);
    });

    // ---- FUNGSI UNTUK NAVIGASI BAWAH (SCROLLSPY) ----
    function setupBottomNav() {
        const sections = document.querySelectorAll('main section[id]');
        const navLinks = document.querySelectorAll('.bottom-nav .nav-item');
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.5 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => link.classList.remove('active'));
                    const activeLink = document.querySelector(`.bottom-nav a[href="#${id}"]`);
                    if (activeLink) activeLink.classList.add('active');
                }
            });
        }, observerOptions);
        sections.forEach(section => observer.observe(section));
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    // ---- INISIALISASI ----
    startCountdown();
    setupGallery();
    setupScrollReveal();
    setupBottomNav();
    document.body.style.overflow = 'hidden';
});