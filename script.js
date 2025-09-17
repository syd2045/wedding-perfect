// Wedding Invitation JavaScript

class WeddingInvitation {
    constructor() {
        this.isInvitationOpened = false;
        this.isMusicPlaying = false;
        this.guestName = '';
        this.countdownInterval = null;
        this.audioElement = null;
        
        this.init();
    }

    init() {
        // Wait for DOM to be loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.extractGuestName();
        this.populateContent();
        this.setupEventListeners();
        this.startCountdown();
        this.hideLoading();
    }

    extractGuestName() {
        const urlParams = new URLSearchParams(window.location.search);
        const to = urlParams.get('to');
        if (to) {
            this.guestName = decodeURIComponent(to);
        }
    }

    populateContent() {
        // Landing page content
        document.getElementById('couplePhoto').src = weddingData.couplePhoto;
        document.getElementById('coupleNames').textContent = `${weddingData.groom.name} & ${weddingData.bride.name}`;
        document.getElementById('openingText').textContent = weddingData.openingText;

        // Show guest card if guest name exists
        if (this.guestName) {
            document.getElementById('guestName').textContent = this.guestName;
            document.getElementById('guestCard').classList.remove('hidden');
        }

        // Hero section
        document.getElementById('heroNames').textContent = `${weddingData.groom.name} & ${weddingData.bride.name}`;
        document.getElementById('heroDate').textContent = this.formatDate(weddingData.akadNikah.date);

        // Couple details
        document.getElementById('groomPhoto').src = weddingData.groom.photo;
        document.getElementById('groomFullName').textContent = weddingData.groom.fullName;
        document.getElementById('groomParents').textContent = `Putra dari ${weddingData.groom.father} & ${weddingData.groom.mother}`;

        document.getElementById('bridePhoto').src = weddingData.bride.photo;
        document.getElementById('brideFullName').textContent = weddingData.bride.fullName;
        document.getElementById('brideParents').textContent = `Putri dari ${weddingData.bride.father} & ${weddingData.bride.mother}`;

        // Event details
        document.getElementById('akadDate').textContent = this.formatDate(weddingData.akadNikah.date);
        document.getElementById('akadTime').textContent = `${weddingData.akadNikah.time} WIB`;
        document.getElementById('akadLocation').textContent = weddingData.akadNikah.location;
        document.getElementById('akadAddress').textContent = weddingData.akadNikah.address;

        document.getElementById('receptionDate').textContent = this.formatDate(weddingData.reception.date);
        document.getElementById('receptionTime').textContent = `${weddingData.reception.time} WIB`;
        document.getElementById('receptionLocation').textContent = weddingData.reception.location;
        document.getElementById('receptionAddress').textContent = weddingData.reception.address;

        // Gallery
        if (weddingData.features.photoGallery) {
            this.populateGallery();
        } else {
            document.getElementById('gallerySection').classList.add('hidden');
        }

        // Countdown
        if (!weddingData.features.countdown) {
            document.getElementById('countdownSection').classList.add('hidden');
        }

        // Islamic quote
        document.getElementById('hadithText').textContent = `"${weddingData.hadith.text}"`;
        document.getElementById('hadithSource').textContent = weddingData.hadith.source;

        // Footer
        document.getElementById('footerNames').textContent = `${weddingData.groom.name} & ${weddingData.bride.name}`;
    }

    populateGallery() {
        const gallery = document.getElementById('photoGallery');
        gallery.innerHTML = '';

        weddingData.gallery.forEach((photo, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.innerHTML = `
                <img src="${photo}" alt="Gallery ${index + 1}" loading="lazy">
            `;
            gallery.appendChild(galleryItem);
        });
    }

    setupEventListeners() {
        // Open invitation button
        document.getElementById('openInvitationBtn').addEventListener('click', () => {
            this.openInvitation();
        });

        // Music toggle
        document.getElementById('musicToggle').addEventListener('click', () => {
            this.toggleMusic();
        });

        // Maps button
        document.getElementById('mapsButton').addEventListener('click', () => {
            window.open(weddingData.mapsLink, '_blank');
        });

        // Audio element
        this.audioElement = document.getElementById('backgroundMusic');
    }

    openInvitation() {
        this.isInvitationOpened = true;
        
        // Hide landing page and show main content
        document.getElementById('landingPage').classList.add('hidden');
        document.getElementById('mainContent').classList.remove('hidden');

        // Show music control if enabled
        if (weddingData.features.backgroundMusic) {
            document.getElementById('musicControl').classList.remove('hidden');
            this.playMusic();
        }

        // Start falling hearts effect if enabled
        if (weddingData.features.loveEffects) {
            this.startFallingHearts();
        }

        // Smooth scroll to main content
        setTimeout(() => {
            document.getElementById('mainContent').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }, 300);
    }

    playMusic() {
        if (this.audioElement) {
            this.audioElement.play().then(() => {
                this.isMusicPlaying = true;
                this.updateMusicIcon();
            }).catch(error => {
                console.log('Auto-play prevented:', error);
            });
        }
    }

    toggleMusic() {
        if (!this.audioElement) return;

        if (this.isMusicPlaying) {
            this.audioElement.pause();
            this.isMusicPlaying = false;
        } else {
            this.audioElement.play().then(() => {
                this.isMusicPlaying = true;
            }).catch(error => {
                console.log('Music play failed:', error);
            });
        }
        this.updateMusicIcon();
    }

    updateMusicIcon() {
        const icon = document.getElementById('musicIcon');
        icon.textContent = this.isMusicPlaying ? '🎵' : '🔇';
    }

    startFallingHearts() {
        const container = document.getElementById('fallingHearts');
        container.classList.remove('hidden');

        const createHeart = () => {
            const heart = document.createElement('div');
            heart.className = 'falling-heart';
            heart.textContent = '💕';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.fontSize = (16 + Math.random() * 16) + 'px';
            heart.style.animationDuration = (3 + Math.random() * 2) + 's';
            heart.style.animationDelay = Math.random() * 3 + 's';
            
            container.appendChild(heart);

            // Remove heart after animation
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
            }, 6000);
        };

        // Create hearts periodically
        setInterval(createHeart, 300);
    }

    startCountdown() {
        if (!weddingData.features.countdown) return;

        const weddingDate = new Date(`${weddingData.akadNikah.date}T${weddingData.akadNikah.time}:00`);
        
        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = weddingDate.getTime() - now;
            
            if (distance > 0) {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                
                document.getElementById('countDays').textContent = days.toString().padStart(2, '0');
                document.getElementById('countHours').textContent = hours.toString().padStart(2, '0');
                document.getElementById('countMinutes').textContent = minutes.toString().padStart(2, '0');
                document.getElementById('countSeconds').textContent = seconds.toString().padStart(2, '0');
            } else {
                // Wedding day has arrived
                document.getElementById('countDays').textContent = '00';
                document.getElementById('countHours').textContent = '00';
                document.getElementById('countMinutes').textContent = '00';
                document.getElementById('countSeconds').textContent = '00';
            }
        };

        // Initial call
        updateCountdown();
        
        // Update every second
        this.countdownInterval = setInterval(updateCountdown, 1000);
    }

    formatDate(dateStr) {
        const date = new Date(dateStr);
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return date.toLocaleDateString('id-ID', options);
    }

    hideLoading() {
        setTimeout(() => {
            document.getElementById('loading').classList.add('hidden');
        }, 1500);
    }
}

// Initialize the wedding invitation
const invitation = new WeddingInvitation();