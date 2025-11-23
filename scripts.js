/* ================================================
   MARCO FARRIS - HYBRID PORTFOLIO JAVASCRIPT
   All interactions and animations
   ================================================ */

(function() {
    'use strict';

    // ========================================
    // NAVIGATION - Hamburger Menu Toggle
    // ========================================
    const hamburger = document.getElementById('navHamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
    const mobileSocialLinks = document.querySelectorAll('.mobile-social-link');

    if (hamburger && mobileMenu) {
        // Open menu
        hamburger.addEventListener('click', function() {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        // Close menu with X button
        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        // Close menu when clicking a link
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking a social link
        mobileSocialLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        mobileMenu.addEventListener('click', function(e) {
            if (e.target === mobileMenu) {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ========================================
    // SMOOTH SCROLLING
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ========================================
    // VIDEO SHOWCASE - Play/Pause Control
    // ========================================
    const showcaseVideo = document.getElementById('showcaseVideo');
    const videoToggle = document.getElementById('videoToggle');

    if (showcaseVideo && videoToggle) {
        // Initial state setup
        function updateButtonState() {
            if (showcaseVideo.paused) {
                videoToggle.classList.add('paused');
            } else {
                videoToggle.classList.remove('paused');
            }
        }
        
        // Set initial state
        updateButtonState();
        
        // Click handler
        videoToggle.addEventListener('click', function() {
            if (showcaseVideo.paused) {
                showcaseVideo.play();
            } else {
                showcaseVideo.pause();
            }
        });
        
        // Sync with video events
        showcaseVideo.addEventListener('play', updateButtonState);
        showcaseVideo.addEventListener('pause', updateButtonState);
        showcaseVideo.addEventListener('loadedmetadata', updateButtonState);
        
        // Restore fullscreen functionality with proper event handling and mobile support
        showcaseVideo.addEventListener('click', function(e) {
            // Only trigger fullscreen if clicking directly on video element
            // and not on any overlay elements
            if (e.target === showcaseVideo) {
                e.preventDefault();
                e.stopPropagation();
                
                // Enhanced mobile support for fullscreen
                if (showcaseVideo.requestFullscreen) {
                    showcaseVideo.requestFullscreen().catch(err => {
                        console.log('Fullscreen request failed:', err);
                    });
                } else if (showcaseVideo.webkitRequestFullscreen) { // Safari
                    showcaseVideo.webkitRequestFullscreen();
                } else if (showcaseVideo.webkitEnterFullscreen) { // iOS Safari
                    showcaseVideo.webkitEnterFullscreen();
                } else if (showcaseVideo.mozRequestFullScreen) { // Firefox
                    showcaseVideo.mozRequestFullScreen();
                } else if (showcaseVideo.msRequestFullscreen) { // IE/Edge
                    showcaseVideo.msRequestFullscreen();
                } else {
                    // Fallback for mobile browsers that don't support fullscreen API
                    // Try to play the video in a maximized state
                    showcaseVideo.style.position = 'fixed';
                    showcaseVideo.style.top = '0';
                    showcaseVideo.style.left = '0';
                    showcaseVideo.style.width = '100vw';
                    showcaseVideo.style.height = '100vh';
                    showcaseVideo.style.zIndex = '9999';
                    showcaseVideo.style.backgroundColor = '#000';
                    
                    // Add a close button for fallback mode
                    const closeBtn = document.createElement('button');
                    closeBtn.innerHTML = '×';
                    closeBtn.style.position = 'fixed';
                    closeBtn.style.top = '20px';
                    closeBtn.style.right = '20px';
                    closeBtn.style.zIndex = '10000';
                    closeBtn.style.background = 'rgba(0,0,0,0.7)';
                    closeBtn.style.color = 'white';
                    closeBtn.style.border = 'none';
                    closeBtn.style.fontSize = '2rem';
                    closeBtn.style.width = '50px';
                    closeBtn.style.height = '50px';
                    closeBtn.style.borderRadius = '50%';
                    closeBtn.style.cursor = 'pointer';
                    
                    closeBtn.addEventListener('click', function() {
                        showcaseVideo.style.position = '';
                        showcaseVideo.style.top = '';
                        showcaseVideo.style.left = '';
                        showcaseVideo.style.width = '';
                        showcaseVideo.style.height = '';
                        showcaseVideo.style.zIndex = '';
                        showcaseVideo.style.backgroundColor = '';
                        document.body.removeChild(closeBtn);
                    });
                    
                    document.body.appendChild(closeBtn);
                }
            }
        });
        
        // Add cursor pointer to indicate clickable video
        showcaseVideo.style.cursor = 'pointer';
    }

    // ========================================
    // FITNESS VIDEOS - Click to Play
    // ========================================
    const fitnessItems = document.querySelectorAll('.fitness-item');
    
    fitnessItems.forEach(item => {
        const video = item.querySelector('video');
        const overlay = item.querySelector('.fitness-play-overlay');
        
        if (video && overlay) {
            item.addEventListener('click', function() {
                // Pause all other fitness videos
                fitnessItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        const otherVideo = otherItem.querySelector('video');
                        if (otherVideo && !otherVideo.paused) {
                            otherVideo.pause();
                            otherVideo.currentTime = 0;
                        }
                    }
                });
                
                // Toggle current video
                if (video.paused) {
                    video.play();
                    overlay.style.opacity = '0';
                } else {
                    video.pause();
                    overlay.style.opacity = '1';
                }
            });
            
            // Show overlay when video ends
            video.addEventListener('ended', function() {
                overlay.style.opacity = '1';
            });
        }
    });

    // ========================================
    // FITNESS CAROUSEL - Enhanced Drag/Touch Scroll
    // ========================================
    const fitnessCarousel = document.querySelector('.fitness-carousel');
    let fitnessUserInteracting = false;
    let fitnessInteractionTimeout;

    // Function to mark user interaction with fitness carousel
    function markFitnessUserInteraction() {
        fitnessUserInteracting = true;
        clearTimeout(fitnessInteractionTimeout);
        fitnessInteractionTimeout = setTimeout(() => {
            fitnessUserInteracting = false;
        }, 3000); // 3 seconds of no interaction
    }
    
    if (fitnessCarousel) {
        let isDown = false;
        let startX;
        let scrollLeft;

        // Desktop mouse events
        fitnessCarousel.addEventListener('mousedown', function(e) {
            isDown = true;
            markFitnessUserInteraction();
            fitnessCarousel.style.cursor = 'grabbing';
            startX = e.pageX - fitnessCarousel.offsetLeft;
            scrollLeft = fitnessCarousel.scrollLeft;
        });

        fitnessCarousel.addEventListener('mouseleave', function() {
            isDown = false;
            fitnessCarousel.style.cursor = 'grab';
        });

        fitnessCarousel.addEventListener('mouseup', function() {
            isDown = false;
            fitnessCarousel.style.cursor = 'grab';
        });

        fitnessCarousel.addEventListener('mousemove', function(e) {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - fitnessCarousel.offsetLeft;
            const walk = (x - startX) * 2;
            fitnessCarousel.scrollLeft = scrollLeft - walk;
        });

        // Scroll event detection  
        fitnessCarousel.addEventListener('scroll', function() {
            markFitnessUserInteraction();
        }, { passive: true });
    }

    // FITNESS CAROUSEL - Exactly like Gallery Carousel
    // ========================================
    (function() {
        const fitnessCarousel = document.querySelector('.fitness-carousel');
        const fitnessTrack = document.querySelector('.fitness-track');
        
        if (!fitnessCarousel || !fitnessTrack) return;
        
        let userInteracting = false;
        let interactionTimeout;
        let isHovering = false;
        let isManuallyScrolling = false;
        
        // Function to pause auto-scroll
        function pauseAutoScroll() {
            fitnessTrack.style.animationPlayState = 'paused';
        }
        
        // Function to resume auto-scroll immediately
        function resumeAutoScroll() {
            if (!userInteracting && !isHovering && !isManuallyScrolling) {
                fitnessTrack.style.animationPlayState = 'running';
            }
        }
        
        // Function to schedule auto-scroll resume with shorter delay
        function scheduleAutoScrollResume() {
            clearTimeout(interactionTimeout);
            userInteracting = false;
            isManuallyScrolling = false;
            
            interactionTimeout = setTimeout(() => {
                resumeAutoScroll();
            }, 1500); // Reduced to 1.5 seconds for faster resume
        }
        
        // Enhanced wheel scrolling with video-by-video centering
        fitnessCarousel.addEventListener('wheel', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            userInteracting = true;
            isManuallyScrolling = true;
            pauseAutoScroll();
            
            // Get all fitness items
            const items = Array.from(fitnessCarousel.querySelectorAll('.fitness-item'));
            const containerWidth = fitnessCarousel.offsetWidth;
            const containerCenter = fitnessCarousel.scrollLeft + containerWidth / 2;
            
            // Find currently centered item
            let currentIndex = 0;
            let minDistance = Infinity;
            
            items.forEach((item, index) => {
                const itemCenter = item.offsetLeft + item.offsetWidth / 2;
                const distance = Math.abs(containerCenter - itemCenter);
                if (distance < minDistance) {
                    minDistance = distance;
                    currentIndex = index;
                }
            });
            
            // Move to next/previous video based on scroll direction
            const direction = e.deltaY > 0 ? 1 : -1;
            const targetIndex = Math.max(0, Math.min(items.length - 1, currentIndex + direction));
            
            if (targetIndex !== currentIndex) {
                const targetItem = items[targetIndex];
                const targetCenter = targetItem.offsetLeft + targetItem.offsetWidth / 2;
                const targetScrollLeft = targetCenter - containerWidth / 2;
                
                fitnessCarousel.scrollTo({
                    left: targetScrollLeft,
                    behavior: 'smooth'
                });
            }
            
            scheduleAutoScrollResume();
        }, { passive: false });
        
        // Simple and responsive touch handling for mobile
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        let startTime = 0;
        let startScrollLeft = 0;
        
        fitnessCarousel.addEventListener('touchstart', function(e) {
            userInteracting = true;
            isManuallyScrolling = true;
            pauseAutoScroll();
            
            isDragging = true;
            startX = e.touches[0].clientX;
            currentX = startX;
            startTime = Date.now();
            startScrollLeft = fitnessCarousel.scrollLeft;
            
            // Remove any existing smooth behavior for immediate response
            fitnessCarousel.style.scrollBehavior = 'auto';
        }, { passive: true });
        
        fitnessCarousel.addEventListener('touchmove', function(e) {
            if (!isDragging) return;
            
            e.preventDefault();
            currentX = e.touches[0].clientX;
            const deltaX = startX - currentX;
            
            // Direct 1:1 scroll mapping for immediate responsiveness
            fitnessCarousel.scrollLeft = startScrollLeft + deltaX;
        }, { passive: false });
        
        fitnessCarousel.addEventListener('touchend', function(e) {
            if (!isDragging) return;
            isDragging = false;
            
            const endTime = Date.now();
            const deltaX = startX - currentX;
            const deltaTime = endTime - startTime;
            const velocity = Math.abs(deltaX) / deltaTime;
            
            // Determine if it's a swipe or just a tap
            if (Math.abs(deltaX) > 30 || velocity > 0.5) {
                // It's a swipe - move to next/previous item
                const items = fitnessCarousel.querySelectorAll('.fitness-item');
                const itemWidth = items[0].offsetWidth;
                const gap = 20; // vw gap converted to px
                const itemSpacing = itemWidth + gap;
                
                let currentIndex = Math.round(fitnessCarousel.scrollLeft / itemSpacing);
                
                // Determine direction
                if (deltaX > 0) {
                    // Swiped left - go to next item
                    currentIndex++;
                } else {
                    // Swiped right - go to previous item
                    currentIndex--;
                }
                
                // Handle looping
                if (currentIndex < 0) {
                    currentIndex = items.length - 1; // Loop to last item
                } else if (currentIndex >= items.length) {
                    currentIndex = 0; // Loop to first item
                }
                
                // Smooth scroll to target item
                const targetScroll = currentIndex * itemSpacing;
                fitnessCarousel.style.scrollBehavior = 'smooth';
                fitnessCarousel.scrollLeft = targetScroll;
            } else {
                // Just a tap - snap to nearest item
                const items = fitnessCarousel.querySelectorAll('.fitness-item');
                const itemWidth = items[0].offsetWidth;
                const gap = 20;
                const itemSpacing = itemWidth + gap;
                const nearestIndex = Math.round(fitnessCarousel.scrollLeft / itemSpacing);
                
                fitnessCarousel.style.scrollBehavior = 'smooth';
                fitnessCarousel.scrollLeft = nearestIndex * itemSpacing;
            }
            
            // Reset scroll behavior and resume auto-scroll after delay
            setTimeout(() => {
                fitnessCarousel.style.scrollBehavior = 'auto';
                userInteracting = false;
                isManuallyScrolling = false;
                resumeAutoScroll();
            }, 1500);
        }, { passive: true });
        
        // Simple scroll detection - only pause when user is actively interacting
        let scrollEndTimeout;
        fitnessCarousel.addEventListener('scroll', function() {
            // Only handle scroll events during user interaction
            if (isTouching || isManuallyScrolling) {
                clearTimeout(scrollEndTimeout);
                scrollEndTimeout = setTimeout(() => {
                    if (!isTouching && !userInteracting) {
                        isManuallyScrolling = false;
                        resumeAutoScroll();
                    }
                }, 2000);
            }
        }, { passive: true });
        
        // Simplified hover handling
        // Handle clicks for video interaction (don't pause auto-scroll for simple clicks)
        fitnessCarousel.addEventListener('click', (e) => {
            // Only handle actual video play clicks, not general carousel interaction
            const playOverlay = e.target.closest('.fitness-play-overlay');
            if (playOverlay) {
                userInteracting = true;
                pauseAutoScroll();
                // Resume after video interaction
                setTimeout(() => {
                    userInteracting = false;
                    resumeAutoScroll();
                }, 1000);
            }
        });
        
        // Enhanced keyboard scrolling with video centering
        fitnessCarousel.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                userInteracting = true;
                isManuallyScrolling = true;
                pauseAutoScroll();
                
                // Get all fitness items
                const items = Array.from(fitnessCarousel.querySelectorAll('.fitness-item'));
                const containerWidth = fitnessCarousel.offsetWidth;
                const containerCenter = fitnessCarousel.scrollLeft + containerWidth / 2;
                
                // Find currently centered item
                let currentIndex = 0;
                let minDistance = Infinity;
                
                items.forEach((item, index) => {
                    const itemCenter = item.offsetLeft + item.offsetWidth / 2;
                    const distance = Math.abs(containerCenter - itemCenter);
                    if (distance < minDistance) {
                        minDistance = distance;
                        currentIndex = index;
                    }
                });
                
                // Move to next/previous video
                const direction = e.key === 'ArrowLeft' ? -1 : 1;
                const targetIndex = Math.max(0, Math.min(items.length - 1, currentIndex + direction));
                
                // Center the target video
                const targetItem = items[targetIndex];
                const itemCenter = targetItem.offsetLeft + targetItem.offsetWidth / 2;
                const centeredScrollLeft = itemCenter - containerWidth / 2;
                
                fitnessCarousel.scrollTo({
                    left: centeredScrollLeft,
                    behavior: 'smooth'
                });
                
                scheduleAutoScrollResume();
            }
        });
    })();

    // ========================================
    // FITNESS VIDEOS - Fullscreen on Click
    // ========================================
    const fitnessVideoOverlay = document.getElementById('fitnessVideoOverlay');
    const fitnessFullscreenVideo = document.getElementById('fitnessFullscreenVideo');
    const fitnessOverlayClose = document.getElementById('fitnessOverlayClose');
    
    if (fitnessVideoOverlay && fitnessFullscreenVideo && fitnessOverlayClose) {
        fitnessItems.forEach(item => {
            const video = item.querySelector('video');
            
            if (video) {
                item.addEventListener('click', function() {
                    // Get video source
                    const videoSource = video.querySelector('source').src;
                    
                    // Set fullscreen video source
                    fitnessFullscreenVideo.querySelector('source').src = videoSource;
                    fitnessFullscreenVideo.load();
                    
                    // Show overlay
                    fitnessVideoOverlay.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                    
                    // Play video
                    fitnessFullscreenVideo.play();
                });
            }
        });
        
        // Close overlay
        fitnessOverlayClose.addEventListener('click', function() {
            fitnessVideoOverlay.style.display = 'none';
            document.body.style.overflow = '';
            fitnessFullscreenVideo.pause();
            fitnessFullscreenVideo.currentTime = 0;
        });
        
        // Close on overlay click
        fitnessVideoOverlay.addEventListener('click', function(e) {
            if (e.target === fitnessVideoOverlay) {
                fitnessVideoOverlay.style.display = 'none';
                document.body.style.overflow = '';
                fitnessFullscreenVideo.pause();
                fitnessFullscreenVideo.currentTime = 0;
            }
        });
        
        // Close on ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && fitnessVideoOverlay.style.display === 'flex') {
                fitnessVideoOverlay.style.display = 'none';
                document.body.style.overflow = '';
                fitnessFullscreenVideo.pause();
                fitnessFullscreenVideo.currentTime = 0;
            }
        });
        
        // Start auto-scroll on page load for mobile
        setTimeout(() => {
            if (!userInteracting && !isManuallyScrolling) {
                resumeAutoScroll();
            }
        }, 1000);
    }

    // ========================================
    // CONTACT FORM - Validation & Submit
    // ========================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const name = contactForm.querySelector('input[name="name"]').value.trim();
            const email = contactForm.querySelector('input[name="email"]').value.trim();
            const message = contactForm.querySelector('textarea[name="message"]').value.trim();

            // Validate required fields
            if (!name || !email || !message) {
                alert('Please fill in all required fields (Name, Email, Message).');
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // Success message
            alert('Thank you for your message! I will get back to you soon.');
            
            // Reset form
            contactForm.reset();
        });
    }

    // ========================================
    // HEADER TRANSPARENCY ON SCROLL
    // ========================================
    const header = document.querySelector('.nav-top-bar');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // ========================================
    // SCROLL ANIMATIONS - Fade In
    // ========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeInObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe sections for fade-in animation
    document.addEventListener('DOMContentLoaded', function() {
        const sectionsToAnimate = document.querySelectorAll('.gallery-section, .video-showcase, .fitness-section, .contact-section');
        
        sectionsToAnimate.forEach(section => {
            // section.style.opacity = '0';
            // section.style.transform = 'translateY(30px)';
            // section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            fadeInObserver.observe(section);
        });
    });

    // ========================================
    // PERFORMANCE - Lazy Load Videos
    // ========================================
    const lazyVideos = document.querySelectorAll('video[data-src]');
    
    if ('IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const video = entry.target;
                    const sources = video.querySelectorAll('source[data-src]');
                    
                    sources.forEach(source => {
                        source.src = source.dataset.src;
                    });
                    
                    video.load();
                    videoObserver.unobserve(video);
                }
            });
        });
        
        lazyVideos.forEach(video => videoObserver.observe(video));
    }

    // ========================================
    // PARALLAX EFFECT - Hero Image & Overlay (subtle, performant)
    // Uses requestAnimationFrame to keep scroll handling smooth
    // ========================================
    (function() {
        const heroImage = document.querySelector('.hero-img-bg');
        const heroOverlay = document.querySelector('.hero-overlay');
        const heroSection = document.querySelector('.hero-cinematic');

        if (!heroImage || !heroSection) return;

        let lastScroll = 0;
        let ticking = false;

        function update() {
            const heroHeight = heroSection.offsetHeight || window.innerHeight;
            const scrolled = Math.max(0, lastScroll);

            // parallax: move image down slightly as the page scrolls
            const parallaxStrength = 0.01; // smaller = subtler
            const parallax = scrolled * parallaxStrength;

            // cinematic scale & blur: subtle scale up and blur as user scrolls
            const progress = Math.min(1, scrolled / heroHeight);
            const scaleStrength = 0.01; // max scale increase
            const maxBlur = 1; // px
            const scale = 1 + (progress * scaleStrength);
            const blur = progress * maxBlur;

            // heroImage.style.transform = `translate3d(0, ${Math.round(parallax)}px, 0) scale(${scale})`;
            // heroImage.style.filter = `blur(${blur}px)`;
            // heroImage.style.transformOrigin = 'center center';

            if(scrolled > heroHeight + 100) {
                heroImage.style.position = `absolute`;
            } else {
                heroImage.style.position = `fixed`;
            }

            // overlay fade: increase opacity as user scrolls past hero
            if (heroOverlay) {
                // base 0.3 -> up to 1.0
                const target = 0.3 + (progress * 0.7);
                heroOverlay.style.opacity = String(target);
            }
        }

        function onScroll() {
            lastScroll = window.pageYOffset || document.documentElement.scrollTop;
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    update();
                    ticking = false;
                });
                ticking = true;
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });

        // initialize on load
        onScroll();
    })();

    // ========================================
    // GALLERY - Horizontal Scrolling for Desktop & Mobile
    // ========================================
    (function() {
        const galleryCarousel = document.querySelector('.gallery-carousel');
        const galleryTrack = document.querySelector('.gallery-track');
        
        if (!galleryCarousel || !galleryTrack) return;
        
        let userInteracting = false;
        let interactionTimeout;
        let isHovering = false;
        let isManuallyScrolling = false;
        
        // Function to pause auto-scroll
        function pauseAutoScroll() {
            galleryTrack.style.animationPlayState = 'paused';
        }
        
        // Function to resume auto-scroll immediately
        function resumeAutoScroll() {
            if (!userInteracting && !isHovering && !isManuallyScrolling) {
                galleryTrack.style.animationPlayState = 'running';
            }
        }
        
        // Function to schedule auto-scroll resume with shorter delay
        function scheduleAutoScrollResume() {
            clearTimeout(interactionTimeout);
            userInteracting = false;
            isManuallyScrolling = false;
            
            interactionTimeout = setTimeout(() => {
                resumeAutoScroll();
            }, 1500); // Reduced to 1.5 seconds for faster resume
        }
        
        // Ultra-responsive but smooth mouse wheel scrolling
        galleryCarousel.addEventListener('wheel', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            userInteracting = true;
            isManuallyScrolling = true;
            pauseAutoScroll();
            
            // Smooth but responsive scrolling
            const scrollSpeed = 2.5;
            const scrollAmount = e.deltaY * scrollSpeed;
            const targetScroll = galleryCarousel.scrollLeft + scrollAmount;
            
            // Use smooth scrolling for better visual experience
            galleryCarousel.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
            
            scheduleAutoScrollResume();
        }, { passive: false });
        
        // Simple and responsive touch handling for mobile
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        let startTime = 0;
        let startScrollLeft = 0;
        
        galleryCarousel.addEventListener('touchstart', function(e) {
            userInteracting = true;
            isManuallyScrolling = true;
            pauseAutoScroll();
            
            isDragging = true;
            startX = e.touches[0].clientX;
            currentX = startX;
            startTime = Date.now();
            startScrollLeft = galleryCarousel.scrollLeft;
            
            // Remove any existing smooth behavior for immediate response
            galleryCarousel.style.scrollBehavior = 'auto';
        }, { passive: true });
        
        galleryCarousel.addEventListener('touchmove', function(e) {
            if (!isDragging) return;
            
            e.preventDefault();
            currentX = e.touches[0].clientX;
            const deltaX = startX - currentX;
            
            // Direct 1:1 scroll mapping for immediate responsiveness
            galleryCarousel.scrollLeft = startScrollLeft + deltaX;
        }, { passive: false });
        
        galleryCarousel.addEventListener('touchend', function(e) {
            if (!isDragging) return;
            isDragging = false;
            
            const endTime = Date.now();
            const deltaX = startX - currentX;
            const deltaTime = endTime - startTime;
            const velocity = Math.abs(deltaX) / deltaTime;
            
            // Determine if it's a swipe or just a tap
            if (Math.abs(deltaX) > 30 || velocity > 0.5) {
                // It's a swipe - move to next/previous item
                const items = galleryCarousel.querySelectorAll('.gallery-item');
                const itemWidth = items[0].offsetWidth;
                const gap = 20; // vw gap converted to px
                const itemSpacing = itemWidth + gap;
                
                let currentIndex = Math.round(galleryCarousel.scrollLeft / itemSpacing);
                
                // Determine direction
                if (deltaX > 0) {
                    // Swiped left - go to next item
                    currentIndex++;
                } else {
                    // Swiped right - go to previous item
                    currentIndex--;
                }
                
                // Handle looping
                if (currentIndex < 0) {
                    currentIndex = items.length - 1; // Loop to last item
                } else if (currentIndex >= items.length) {
                    currentIndex = 0; // Loop to first item
                }
                
                // Smooth scroll to target item
                const targetScroll = currentIndex * itemSpacing;
                galleryCarousel.style.scrollBehavior = 'smooth';
                galleryCarousel.scrollLeft = targetScroll;
            } else {
                // Just a tap - snap to nearest item
                const items = galleryCarousel.querySelectorAll('.gallery-item');
                const itemWidth = items[0].offsetWidth;
                const gap = 20;
                const itemSpacing = itemWidth + gap;
                const nearestIndex = Math.round(galleryCarousel.scrollLeft / itemSpacing);
                
                galleryCarousel.style.scrollBehavior = 'smooth';
                galleryCarousel.scrollLeft = nearestIndex * itemSpacing;
            }
            
            // Reset scroll behavior and resume auto-scroll after delay
            setTimeout(() => {
                galleryCarousel.style.scrollBehavior = 'auto';
                userInteracting = false;
                isManuallyScrolling = false;
                resumeAutoScroll();
            }, 1500);
        }, { passive: true });
        
        // Simple scroll detection - only pause when user is actively interacting
        let scrollEndTimeout;
        galleryCarousel.addEventListener('scroll', function() {
            // Only handle scroll events during user interaction
            if (isTouching || isManuallyScrolling) {
                clearTimeout(scrollEndTimeout);
                scrollEndTimeout = setTimeout(() => {
                    if (!isTouching && !userInteracting) {
                        isManuallyScrolling = false;
                        resumeAutoScroll();
                    }
                }, 2000);
            }
        }, { passive: true });
        
        // Handle clicks for image interaction (don't pause auto-scroll for simple clicks)
        galleryCarousel.addEventListener('click', (e) => {
            // Only handle actual image clicks, not general carousel interaction
            const galleryItem = e.target.closest('.gallery-item');
            if (galleryItem && e.target.tagName === 'IMG') {
                userInteracting = true;
                pauseAutoScroll();
                // Resume after brief pause for image interaction
                setTimeout(() => {
                    userInteracting = false;
                    resumeAutoScroll();
                }, 500);
            }
        });
        
        // Keyboard scrolling support
        galleryCarousel.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                userInteracting = true;
                isManuallyScrolling = true;
                pauseAutoScroll();
                
                const scrollAmount = 200;
                const direction = e.key === 'ArrowLeft' ? -1 : 1;
                
                galleryCarousel.scrollTo({
                    left: galleryCarousel.scrollLeft + (scrollAmount * direction),
                    behavior: 'smooth'
                });
                
                scheduleAutoScrollResume();
            }
        });
        
        // Start auto-scroll on page load for mobile
        setTimeout(() => {
            if (!userInteracting && !isManuallyScrolling && !isHovering) {
                resumeAutoScroll();
            }
        }, 1000);
    })();

    // ========================================
    // GALLERY - Mobile: tap to pause & fullscreen image + swipe navigation
    // ========================================
    (function() {
        const galleryTrack = document.querySelector('.gallery-track');
        const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));

        // reuse existing mobile detection function
        if (!galleryTrack || galleryItems.length === 0) return;
        if (!isMobileDevice()) return; // only enable on mobile

        const imgs = galleryItems.map(item => {
            const img = item.querySelector('img');
            return img ? { src: img.src, alt: img.alt || '' } : null;
        }).filter(Boolean);

        let overlayEl = null;
        let overlayImgEl = null;
        let currentIndex = -1;

        // touch/swipe state
        let touchStartX = 0;
        let touchStartY = 0;
        let touchMoved = false;

        function openFullscreenImage(index) {
            if (index < 0 || index >= imgs.length) return;

            // pause the carousel animation
            galleryTrack.style.animationPlayState = 'paused';

            // create overlay
            overlayEl = document.createElement('div');
            overlayEl.className = 'gallery-overlay';

            overlayImgEl = document.createElement('img');
            overlayImgEl.src = imgs[index].src;
            overlayImgEl.alt = imgs[index].alt;

            const closeBtn = document.createElement('button');
            closeBtn.className = 'overlay-close';
            closeBtn.setAttribute('aria-label', 'Close image');
            closeBtn.innerHTML = '&times;';

            // left/right arrows
            const leftBtn = document.createElement('button');
            leftBtn.className = 'overlay-arrow left';
            leftBtn.setAttribute('aria-label', 'Previous image');
            leftBtn.innerHTML = '&#x2039;'; // ‹

            const rightBtn = document.createElement('button');
            rightBtn.className = 'overlay-arrow right';
            rightBtn.setAttribute('aria-label', 'Next image');
            rightBtn.innerHTML = '&#x203A;'; // ›

            overlayEl.appendChild(overlayImgEl);
            overlayEl.appendChild(closeBtn);
            overlayEl.appendChild(leftBtn);
            overlayEl.appendChild(rightBtn);
            document.body.appendChild(overlayEl);

            // prevent body scroll while open
            document.body.style.overflow = 'hidden';

            currentIndex = index;

            // event listeners
            closeBtn.addEventListener('click', closeOverlay);
            overlayEl.addEventListener('click', onOverlayClick);
            overlayEl.addEventListener('touchstart', onTouchStart, { passive: true });
            overlayEl.addEventListener('touchmove', onTouchMove, { passive: true });
            overlayEl.addEventListener('touchend', onTouchEnd, { passive: true });
            document.addEventListener('keydown', onKeyDown);

            // arrow click handlers (stop propagation so overlay doesn't close)
            leftBtn.addEventListener('click', function(e) { e.stopPropagation(); showPrev(); });
            rightBtn.addEventListener('click', function(e) { e.stopPropagation(); showNext(); });
        }

        function updateOverlayImage() {
            if (!overlayImgEl) return;
            overlayImgEl.src = imgs[currentIndex].src;
            overlayImgEl.alt = imgs[currentIndex].alt;
        }

        function showNext() {
            currentIndex = (currentIndex + 1) % imgs.length;
            updateOverlayImage();
        }

        function showPrev() {
            currentIndex = (currentIndex - 1 + imgs.length) % imgs.length;
            updateOverlayImage();
        }

        function closeOverlay() {
            if (!overlayEl) return;

            // remove event listeners
            overlayEl.removeEventListener('click', onOverlayClick);
            overlayEl.removeEventListener('touchstart', onTouchStart);
            overlayEl.removeEventListener('touchmove', onTouchMove);
            overlayEl.removeEventListener('touchend', onTouchEnd);
            document.removeEventListener('keydown', onKeyDown);

            overlayEl.remove();
            overlayEl = null;
            overlayImgEl = null;
            currentIndex = -1;

            // resume carousel
            galleryTrack.style.animationPlayState = '';
            document.body.style.overflow = '';
        }

        function onOverlayClick(e) {
            if (e.target === overlayEl) closeOverlay();
        }

        function onTouchStart(e) {
            if (!e.touches || e.touches.length === 0) return;
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchMoved = false;
        }

        function onTouchMove(e) {
            touchMoved = true;
        }

        function onTouchEnd(e) {
            if (!touchMoved) return;
            const touch = e.changedTouches && e.changedTouches[0];
            if (!touch) return;
            const dx = touch.clientX - touchStartX;
            const dy = touch.clientY - touchStartY;

            // require horizontal swipe bigger than vertical movement
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
                if (dx < 0) {
                    // swiped left -> next
                    showNext();
                } else {
                    // swiped right -> prev
                    showPrev();
                }
            }
        }

        function onKeyDown(e) {
            if (!overlayEl) return;
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'Escape') closeOverlay();
        }

        // attach handlers to gallery items
        galleryItems.forEach((item, idx) => {
            const img = item.querySelector('img');
            if (!img) return;

            item.addEventListener('click', function(e) {
                e.preventDefault();
                openFullscreenImage(idx);
            });
        });
    })();

    // ========================================
    // HIDE SCROLL INDICATOR ON SCROLL
    // ========================================
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 100) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        });
    }

    // ========================================
    // PREVENT VIDEO AUTOPLAY ON MOBILE
    // Mobile optimization
    // ========================================
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    if (isMobileDevice()) {
        // Pause hero video on mobile to save data
        const heroVideoMobile = document.querySelector('.hero-video');
        if (heroVideoMobile) {
            heroVideoMobile.pause();
            heroVideoMobile.removeAttribute('autoplay');
        }
    }

    // ========================================
    // ESC KEY - Close Mobile Menu
    // ========================================
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    // ========================================
    // TOUCH EVENTS - Better Mobile Experience
    // ========================================
    let touchStartX = 0;
    let touchEndX = 0;

    // Swipe to close mobile menu
    if (mobileMenu) {
        mobileMenu.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });

        mobileMenu.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            // Swipe right to close menu
            if (touchEndX > touchStartX + 50) {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    }

    // ========================================
    // CONSOLE MESSAGE (Optional)
    // ========================================
    console.log('%cMarco Farris Portfolio', 'font-size: 20px; font-weight: bold; color: #1A1A1A;');
    console.log('%cDesigned for excellence 🎬', 'font-size: 14px; color: #666;');

})();
