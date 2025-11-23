// Embla Carousel Implementation for Portfolio Gallery and Fitness
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on desktop (1024px+)
    function isDesktop() {
        return window.innerWidth >= 1024;
    }
    
    // Initialize Gallery Carousel (on all devices including desktop)
    const emblaGalleryNode = document.querySelector('.embla:not(.embla--fitness)');
    
    if (emblaGalleryNode) {
        const viewportNode = emblaGalleryNode.querySelector('.embla__viewport');
        
        // Embla options
        const options = {
            loop: true,
            dragFree: true,
            containScroll: false,
            slidesToScroll: 1,
            align: 'start',
            skipSnaps: false,
            inViewThreshold: 0.7
        };
        
        // Initialize Embla with AutoPlay plugin
        const emblaApi = EmblaCarousel(viewportNode, options, [
            EmblaCarouselAutoplay({
                delay: 1500,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
                stopOnFocusIn: true
            })
        ]);
        
        // Touch/drag interaction enhancements
        emblaApi.on('pointerDown', () => {
            const autoplay = emblaApi.plugins().autoplay;
            if (autoplay) autoplay.stop();
        });
        
        emblaApi.on('pointerUp', () => {
            const autoplay = emblaApi.plugins().autoplay;
            if (autoplay) {
                setTimeout(() => {
                    autoplay.play();
                }, 2000);
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                emblaApi.scrollPrev();
            } else if (event.key === 'ArrowRight') {
                event.preventDefault();
                emblaApi.scrollNext();
            }
        });
        
        // Intersection Observer for performance
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const autoplay = emblaApi.plugins().autoplay;
                if (entry.isIntersecting) {
                    if (autoplay) autoplay.play();
                } else {
                    if (autoplay) autoplay.stop();
                }
            });
        }, {
            threshold: 0.5
        });
        
        observer.observe(emblaGalleryNode);
        
        // Gallery image fullscreen functionality
        const galleryImages = emblaGalleryNode.querySelectorAll('img');
        const galleryImageOverlay = document.getElementById('galleryImageOverlay');
        const galleryFullscreenImage = document.getElementById('galleryFullscreenImage');
        const galleryOverlayClose = document.getElementById('galleryOverlayClose');
        const galleryPrevBtn = document.getElementById('galleryPrevBtn');
        const galleryNextBtn = document.getElementById('galleryNextBtn');
        const currentImageIndex = document.getElementById('currentImageIndex');
        const totalImages = document.getElementById('totalImages');
        
        let currentImageIdx = 0;
        let imageSources = [];
        
        // Collect all image sources
        galleryImages.forEach((image, index) => {
            imageSources.push({
                src: image.src,
                alt: image.alt
            });
        });
        
        // Set total images count
        if (totalImages) {
            totalImages.textContent = imageSources.length;
        }
        
        // Function to load image at specific index
        function loadImageAtIndex(index) {
            if (index >= 0 && index < imageSources.length && galleryFullscreenImage) {
                galleryFullscreenImage.src = imageSources[index].src;
                galleryFullscreenImage.alt = imageSources[index].alt;
                
                // Update counter
                if (currentImageIndex) {
                    currentImageIndex.textContent = index + 1;
                }
                
                currentImageIdx = index;
            }
        }
        
        // Add click handlers to gallery images
        galleryImages.forEach((image, index) => {
            image.addEventListener('click', function() {
                // Stop carousel autoplay
                const autoplay = emblaApi.plugins().autoplay;
                if (autoplay) autoplay.stop();
                
                // Show the overlay and load the clicked image
                if (galleryImageOverlay) {
                    galleryImageOverlay.style.display = 'flex';
                    loadImageAtIndex(index);
                }
            });
        });
        
        // Previous image button
        if (galleryPrevBtn) {
            galleryPrevBtn.addEventListener('click', function() {
                const prevIndex = currentImageIdx > 0 ? currentImageIdx - 1 : imageSources.length - 1;
                loadImageAtIndex(prevIndex);
            });
        }
        
        // Next image button
        if (galleryNextBtn) {
            galleryNextBtn.addEventListener('click', function() {
                const nextIndex = currentImageIdx < imageSources.length - 1 ? currentImageIdx + 1 : 0;
                loadImageAtIndex(nextIndex);
            });
        }
        
        // Close overlay functionality
        if (galleryOverlayClose && galleryImageOverlay) {
            galleryOverlayClose.addEventListener('click', function() {
                galleryImageOverlay.style.display = 'none';
                
                // Resume carousel autoplay after closing
                const autoplay = emblaApi.plugins().autoplay;
                if (autoplay) {
                    setTimeout(() => {
                        autoplay.play();
                    }, 1000);
                }
            });
            
            // Close overlay when clicking outside the image
            galleryImageOverlay.addEventListener('click', function(e) {
                if (e.target === galleryImageOverlay) {
                    galleryOverlayClose.click();
                }
            });
            
            // Enhanced keyboard navigation for gallery fullscreen overlay
            document.addEventListener('keydown', function(e) {
                if (galleryImageOverlay.style.display === 'flex') {
                    switch(e.key) {
                        case 'Escape':
                            galleryOverlayClose.click();
                            break;
                        case 'ArrowLeft':
                            e.preventDefault();
                            galleryPrevBtn.click();
                            break;
                        case 'ArrowRight':
                            e.preventDefault();
                            galleryNextBtn.click();
                            break;
                    }
                }
            });
        }
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            observer.disconnect();
            emblaApi.destroy();
        });
    }
    
    // Initialize Fitness Carousel (only on mobile/tablet)
    const emblaFitnessNode = document.querySelector('.embla--fitness');
    
    if (emblaFitnessNode && !isDesktop()) {
        const viewportNode = emblaFitnessNode.querySelector('.embla__viewport');
        
        // Embla options
        const options = {
            loop: true,
            dragFree: true,
            containScroll: 'trimSnaps',
            slidesToScroll: 1,
            align: 'center',
            skipSnaps: false,
            inViewThreshold: 0.7
        };
        
        // Initialize Embla with AutoPlay plugin
        const emblaFitnessApi = EmblaCarousel(viewportNode, options, [
            EmblaCarouselAutoplay({
                delay: 4500, // Slightly slower for videos
                stopOnInteraction: false,
                stopOnMouseEnter: true,
                stopOnFocusIn: true
            })
        ]);
        
        // Touch/drag interaction enhancements
        emblaFitnessApi.on('pointerDown', () => {
            const autoplay = emblaFitnessApi.plugins().autoplay;
            if (autoplay) autoplay.stop();
        });
        
        emblaFitnessApi.on('pointerUp', () => {
            const autoplay = emblaFitnessApi.plugins().autoplay;
            if (autoplay) {
                setTimeout(() => {
                    autoplay.play();
                }, 2000);
            }
        });
        
        // Keyboard navigation for fitness carousel
        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                emblaFitnessApi.scrollPrev();
            } else if (event.key === 'ArrowRight') {
                event.preventDefault();
                emblaFitnessApi.scrollNext();
            }
        });
        
        // Intersection Observer for performance
        const fitnessObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const autoplay = emblaFitnessApi.plugins().autoplay;
                if (entry.isIntersecting) {
                    if (autoplay) autoplay.play();
                } else {
                    if (autoplay) autoplay.stop();
                }
            });
        }, {
            threshold: 0.5
        });
        
        fitnessObserver.observe(emblaFitnessNode);
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            fitnessObserver.disconnect();
            emblaFitnessApi.destroy();
        });
        
        // Add fitness video fullscreen functionality with navigation
        const fitnessVideos = emblaFitnessNode.querySelectorAll('video');
        const fitnessVideoOverlay = document.getElementById('fitnessVideoOverlay');
        const fitnessFullscreenVideo = document.getElementById('fitnessFullscreenVideo');
        const fitnessOverlayClose = document.getElementById('fitnessOverlayClose');
        const fitnessPrevBtn = document.getElementById('fitnessPrevBtn');
        const fitnessNextBtn = document.getElementById('fitnessNextBtn');
        const currentVideoIndex = document.getElementById('currentVideoIndex');
        const totalVideos = document.getElementById('totalVideos');
        
        let currentVideoIdx = 0;
        let videoSources = [];
        
        // Collect all video sources
        fitnessVideos.forEach((video, index) => {
            const videoSource = video.querySelector('source');
            if (videoSource) {
                videoSources.push(videoSource.src);
            }
        });
        
        // Set total videos count
        if (totalVideos) {
            totalVideos.textContent = videoSources.length;
        }
        
        // Function to load video at specific index
        function loadVideoAtIndex(index) {
            if (index >= 0 && index < videoSources.length && fitnessFullscreenVideo) {
                const fullscreenSource = fitnessFullscreenVideo.querySelector('source');
                if (fullscreenSource) {
                    fullscreenSource.src = videoSources[index];
                    fitnessFullscreenVideo.load();
                    fitnessFullscreenVideo.play();
                    
                    // Update counter
                    if (currentVideoIndex) {
                        currentVideoIndex.textContent = index + 1;
                    }
                    
                    currentVideoIdx = index;
                }
            }
        }
        
        // Add click handlers to fitness videos
        fitnessVideos.forEach((video, index) => {
            video.addEventListener('click', function() {
                // Stop carousel autoplay
                const autoplay = emblaFitnessApi.plugins().autoplay;
                if (autoplay) autoplay.stop();
                
                // Show the overlay and load the clicked video
                if (fitnessVideoOverlay) {
                    fitnessVideoOverlay.style.display = 'flex';
                    loadVideoAtIndex(index);
                }
            });
        });
        
        // Previous video button
        if (fitnessPrevBtn) {
            fitnessPrevBtn.addEventListener('click', function() {
                const prevIndex = currentVideoIdx > 0 ? currentVideoIdx - 1 : videoSources.length - 1;
                loadVideoAtIndex(prevIndex);
            });
        }
        
        // Next video button
        if (fitnessNextBtn) {
            fitnessNextBtn.addEventListener('click', function() {
                const nextIndex = currentVideoIdx < videoSources.length - 1 ? currentVideoIdx + 1 : 0;
                loadVideoAtIndex(nextIndex);
            });
        }
        
        // Close overlay functionality
        if (fitnessOverlayClose && fitnessVideoOverlay && fitnessFullscreenVideo) {
            fitnessOverlayClose.addEventListener('click', function() {
                fitnessVideoOverlay.style.display = 'none';
                fitnessFullscreenVideo.pause();
                fitnessFullscreenVideo.currentTime = 0;
                
                // Resume carousel autoplay after closing
                const autoplay = emblaFitnessApi.plugins().autoplay;
                if (autoplay) {
                    setTimeout(() => {
                        autoplay.play();
                    }, 1000);
                }
            });
            
            // Close overlay when clicking outside the video
            fitnessVideoOverlay.addEventListener('click', function(e) {
                if (e.target === fitnessVideoOverlay) {
                    fitnessOverlayClose.click();
                }
            });
            
            // Enhanced keyboard navigation for fullscreen overlay
            document.addEventListener('keydown', function(e) {
                if (fitnessVideoOverlay.style.display === 'flex') {
                    switch(e.key) {
                        case 'Escape':
                            fitnessOverlayClose.click();
                            break;
                        case 'ArrowLeft':
                            e.preventDefault();
                            fitnessPrevBtn.click();
                            break;
                        case 'ArrowRight':
                            e.preventDefault();
                            fitnessNextBtn.click();
                            break;
                    }
                }
            });
        }
    }
    
    // Desktop fitness video fullscreen functionality
    if (isDesktop()) {
        const fitnessVideos = document.querySelectorAll('.fitness-section .embla__slide video');
        
        fitnessVideos.forEach(video => {
            video.addEventListener('click', function() {
                // Create fullscreen modal
                const modal = document.createElement('div');
                modal.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.95);
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                `;
                
                // Clone video for fullscreen
                const fullscreenVideo = video.cloneNode(true);
                fullscreenVideo.style.cssText = `
                    max-width: 90%;
                    max-height: 90%;
                    object-fit: contain;
                    border-radius: 8px;
                `;
                fullscreenVideo.controls = true;
                fullscreenVideo.autoplay = true;
                
                modal.appendChild(fullscreenVideo);
                document.body.appendChild(modal);
                
                // Close modal on click
                modal.addEventListener('click', function(e) {
                    if (e.target === modal) {
                        document.body.removeChild(modal);
                    }
                });
                
                // Close on Escape key
                document.addEventListener('keydown', function escapeHandler(e) {
                    if (e.key === 'Escape') {
                        if (document.body.contains(modal)) {
                            document.body.removeChild(modal);
                        }
                        document.removeEventListener('keydown', escapeHandler);
                    }
                });
            });
        });
    }
});