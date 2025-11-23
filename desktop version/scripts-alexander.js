// MARCO FARRIS - ALEXANDER DESIGN JS

// Hamburger Menu Toggle
const navHamburger = document.getElementById('navHamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuClose = document.getElementById('mobileMenuClose');

if (navHamburger && mobileMenu) {
    navHamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
    });

    // Close menu with close button
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    }

    // Close menu when clicking on a link
    const mobileLinks = document.querySelectorAll('.mobile-menu-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            mobileMenu.classList.remove('active');
        }
    });
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Video Controls
const video = document.querySelector('.showcase-video');
const playPauseBtn = document.getElementById('videoPlayPause');
const pauseIcon = document.querySelector('.pause-icon');
const playIcon = document.querySelector('.play-icon');

if (playPauseBtn && video) {
    playPauseBtn.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            pauseIcon.style.display = 'inline';
            playIcon.style.display = 'none';
        } else {
            video.pause();
            pauseIcon.style.display = 'none';
            playIcon.style.display = 'inline';
        }
    });
}

// Contact Form
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            company: document.getElementById('company').value,
            message: document.getElementById('message').value
        };

        if (!formData.name || !formData.email || !formData.message) {
            alert('Please fill in all required fields.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('Please enter a valid email address.');
            return;
        }

        alert('Thank you for your message! We\'ll get back to you soon.');
        contactForm.reset();
    });
}

// Fitness Video Click-to-Play
const fitnessItems = document.querySelectorAll('.fitness-item');

fitnessItems.forEach(item => {
    const video = item.querySelector('.fitness-video');
    
    item.addEventListener('click', function() {
        // Pause all other fitness videos
        fitnessItems.forEach(otherItem => {
            if (otherItem !== item) {
                const otherVideo = otherItem.querySelector('.fitness-video');
                if (otherVideo && !otherVideo.paused) {
                    otherVideo.pause();
                    otherItem.classList.remove('playing');
                }
            }
        });
        
        // Toggle current video
        if (video.paused) {
            video.play();
            item.classList.add('playing');
        } else {
            video.pause();
            item.classList.remove('playing');
        }
    });
});

// Fitness Carousel Drag-to-Scroll
const fitnessCarousel = document.querySelector('.fitness-carousel');
let isFitnessDown = false;
let fitnessStartX;
let fitnessScrollLeft;

if (fitnessCarousel) {
    fitnessCarousel.addEventListener('mousedown', (e) => {
        isFitnessDown = true;
        fitnessCarousel.style.cursor = 'grabbing';
        fitnessStartX = e.pageX - fitnessCarousel.offsetLeft;
        fitnessScrollLeft = fitnessCarousel.scrollLeft;
    });

    fitnessCarousel.addEventListener('mouseleave', () => {
        isFitnessDown = false;
        fitnessCarousel.style.cursor = 'grab';
    });

    fitnessCarousel.addEventListener('mouseup', () => {
        isFitnessDown = false;
        fitnessCarousel.style.cursor = 'grab';
    });

    fitnessCarousel.addEventListener('mousemove', (e) => {
        if (!isFitnessDown) return;
        e.preventDefault();
        const x = e.pageX - fitnessCarousel.offsetLeft;
        const walk = (x - fitnessStartX) * 2;
        fitnessCarousel.scrollLeft = fitnessScrollLeft - walk;
    });
}

// Scroll Reveal Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('.gallery-section, .fitness-section');
    
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
});
