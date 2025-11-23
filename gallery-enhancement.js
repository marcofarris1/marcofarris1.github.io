// SIMPLE WORKING INFINITE CAROUSEL
(function() {
    const carousel = document.querySelector('.gallery-carousel');
    const track = document.querySelector('.gallery-track');
    
    if (!carousel || !track) return;
    
    const items = Array.from(track.children);
    const totalItems = items.length;
    let currentIndex = 0;
    let isUserInteracting = false;
    
    // Touch handling
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let startScrollLeft = 0;
    
    // Get item width including gap
    function getItemWidth() {
        if (items.length === 0) return 200;
        const itemRect = items[0].getBoundingClientRect();
        const trackStyle = getComputedStyle(track);
        const gap = parseFloat(trackStyle.gap) || 0;
        return itemRect.width + gap;
    }
    
    // Scroll to specific item
    function scrollToItem(index, smooth = true) {
        const itemWidth = getItemWidth();
        const targetScrollLeft = index * itemWidth;
        
        carousel.style.scrollBehavior = smooth ? 'smooth' : 'auto';
        carousel.scrollLeft = targetScrollLeft;
        currentIndex = index;
    }
    
    // Go to next item with looping
    function next() {
        let nextIndex = currentIndex + 1;
        if (nextIndex >= totalItems) {
            nextIndex = 0; // Loop to first
        }
        scrollToItem(nextIndex, true);
    }
    
    // Go to previous item with looping
    function previous() {
        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) {
            prevIndex = totalItems - 1; // Loop to last
        }
        scrollToItem(prevIndex, true);
    }
    
    // Handle infinite scrolling at boundaries
    function handleBoundaryScroll() {
        if (isUserInteracting) return;
        
        const itemWidth = getItemWidth();
        const maxScrollLeft = (totalItems - 1) * itemWidth;
        const currentScrollLeft = carousel.scrollLeft;
        
        // If scrolled past the end, jump to beginning
        if (currentScrollLeft >= maxScrollLeft + itemWidth * 0.1) {
            setTimeout(() => {
                carousel.style.scrollBehavior = 'auto';
                carousel.scrollLeft = 0;
                currentIndex = 0;
            }, 50);
        }
        // If scrolled before the beginning, jump to end
        else if (currentScrollLeft <= -itemWidth * 0.1) {
            setTimeout(() => {
                carousel.style.scrollBehavior = 'auto';
                carousel.scrollLeft = maxScrollLeft;
                currentIndex = totalItems - 1;
            }, 50);
        }
        // Update current index based on scroll position
        else {
            currentIndex = Math.round(currentScrollLeft / itemWidth);
        }
    }
    
    // Touch start
    carousel.addEventListener('touchstart', function(e) {
        isUserInteracting = true;
        isDragging = true;
        
        startX = e.touches[0].clientX;
        currentX = startX;
        startScrollLeft = carousel.scrollLeft;
        
        carousel.style.scrollBehavior = 'auto';
    }, { passive: true });
    
    // Touch move
    carousel.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        
        e.preventDefault();
        currentX = e.touches[0].clientX;
        const deltaX = startX - currentX;
        
        carousel.scrollLeft = startScrollLeft + deltaX;
    }, { passive: false });
    
    // Touch end
    carousel.addEventListener('touchend', function(e) {
        if (!isDragging) return;
        
        isDragging = false;
        const deltaX = startX - currentX;
        const itemWidth = getItemWidth();
        
        // Determine direction and distance
        if (Math.abs(deltaX) > itemWidth * 0.2) { // 20% threshold
            if (deltaX > 0) {
                next(); // Swiped left, go to next
            } else {
                previous(); // Swiped right, go to previous
            }
        } else {
            // Snap to current item
            scrollToItem(currentIndex, true);
        }
        
        setTimeout(() => {
            isUserInteracting = false;
        }, 1000);
    }, { passive: true });
    
    // Handle scroll events for boundary detection
    carousel.addEventListener('scroll', function() {
        if (!isDragging) {
            handleBoundaryScroll();
        }
    }, { passive: true });
    
    // Keyboard support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            previous();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            next();
        }
    });
    
    // Auto-advance every 4 seconds
    setInterval(() => {
        if (!isUserInteracting && !isDragging) {
            next();
        }
    }, 4000);
    
    // Initialize
    scrollToItem(0, false);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        scrollToItem(currentIndex, false);
    });
    
    // Expose controls
    window.galleryControls = { next, previous, currentIndex: () => currentIndex };
})();