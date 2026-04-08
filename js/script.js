/* ========================================
   SPICE & STORIES - OPTIMIZED JAVASCRIPT
   Performance-focused implementation
======================================== */

// ========== UTILITY FUNCTIONS ==========
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ========== PERFORMANCE: PRELOADER ==========
const preloader = $('.preloader');
if (preloader) {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            preloader.classList.add('hide');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 300);
        }, 800);
    });
}

// ========== OPTIMIZED NAVIGATION ==========
class Navigation {
    constructor() {
        this.navbar = $('#navbar');
        this.navToggle = $('#navToggle');
        this.navMenu = $('#navMenu');
        this.navLinks = $$('.nav-link');
        this.scrollThrottle = null;
        this.isScrolling = false;
        
        this.init();
    }
    
    init() {
        // Passive scroll listener for better performance
        window.addEventListener('scroll', () => {
            if (!this.scrollThrottle) {
                this.scrollThrottle = setTimeout(() => {
                    this.handleScroll();
                    this.scrollThrottle = null;
                }, 100);
            }
        }, { passive: true });
        
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMenu();
            });
        }
        
        // Close menu when clicking nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 992) {
                    this.closeMenu();
                }
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 992 && 
                this.navMenu && 
                this.navMenu.classList.contains('active') &&
                !this.navMenu.contains(e.target) && 
                !this.navToggle.contains(e.target)) {
                this.closeMenu();
            }
        });
        
        // Active link on scroll
        this.handleActiveLink();
        window.addEventListener('scroll', () => {
            if (!this.isScrolling) {
                this.isScrolling = true;
                requestAnimationFrame(() => {
                    this.handleActiveLink();
                    this.isScrolling = false;
                });
            }
        }, { passive: true });
    }
    
    handleScroll() {
        if (!this.navbar) return;
        
        if (window.scrollY > 100) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }
    
    toggleMenu() {
        if (!this.navMenu || !this.navToggle) return;
        
        const isActive = this.navMenu.classList.contains('active');
        
        if (isActive) {
            this.closeMenu();
        } else {
            this.navMenu.classList.add('active');
            this.navToggle.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    closeMenu() {
        if (!this.navMenu || !this.navToggle) return;
        
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    handleActiveLink() {
        const sections = $$('section[id]');
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = $(`.nav-link[href*="${sectionId}"]`);
            
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    }
}

// ========== APP INITIALIZATION ==========
function initializeApp() {
    // Initialize Navigation
    const navigation = window.navigation = new Navigation();
    
    // Initialize other critical components after Navigation
    setTimeout(() => {
        const scrollToTop = window.scrollToTop = new ScrollToTop();
        const imageLoader = window.imageLoader = new ImageLoader();
        const menuFilter = window.menuFilter = new MenuFilter();
        const counterAnimation = window.counterAnimation = new CounterAnimation();
        const contactFormValidator = window.contactFormValidator = new FormValidator('#contactForm');
        const orderSystem = window.orderSystem = new OrderSystem();
        const parallax = window.parallax = new Parallax();
    }, 10);
}

// Execute on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOM already loaded
    setTimeout(initializeApp, 0);
}

// ========== SCROLL TO TOP BUTTON ==========
class ScrollToTop {
    constructor() {
        this.button = $('#scrollTop');
        this.throttle = null;
        this.init();
    }
    
    init() {
        if (!this.button) return;
        
        // Throttled scroll event
        window.addEventListener('scroll', () => {
            if (!this.throttle) {
                this.throttle = setTimeout(() => {
                    this.toggleButton();
                    this.throttle = null;
                }, 200);
            }
        }, { passive: true });
        
        this.button.addEventListener('click', () => this.scrollToTop());
    }
    
    toggleButton() {
        if (window.scrollY > 300) {
            this.button.classList.add('show');
        } else {
            this.button.classList.remove('show');
        }
    }
    
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Now instantiated in initializeApp() function
// const scrollToTop = new ScrollToTop();

// ========== SMOOTH SCROLLING ==========
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '#!') return;
            
            const target = $(href);
            
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Call smooth scrolling setup on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupSmoothScrolling);
} else {
    setupSmoothScrolling();
}

// ========== AOS INITIALIZATION ==========
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
            easing: 'ease-out',
            delay: 50,
            disable: function() {
                // Disable on mobile for better performance
                return window.innerWidth < 768;
            }
        });
    } else {
        // Retry if AOS not loaded yet
        setTimeout(initAOS, 100);
    }
}

// Initialize AOS when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initAOS, 100);
    });
} else {
    setTimeout(initAOS, 100);
}

// ========== IMAGE LAZY LOADING ==========
class ImageLoader {
    constructor() {
        this.images = $$('img[loading="lazy"]');
        this.init();
    }
    
    init() {
        // Check if browser supports native lazy loading
        if ('loading' in HTMLImageElement.prototype) {
            this.images.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
                this.handleImageLoad(img);
            });
        } else {
            // Fallback for older browsers
            this.setupIntersectionObserver();
        }
    }
    
    handleImageLoad(img) {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            }, { once: true });
            
            img.addEventListener('error', () => {
                console.warn('Failed to load image:', img.src);
            }, { once: true });
        }
    }
    
    setupIntersectionObserver() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    this.handleImageLoad(img);
                    imageObserver.unobserve(img);
                }
            });
        }, { 
            rootMargin: '50px',
            threshold: 0.01
        });
        
        this.images.forEach(img => imageObserver.observe(img));
    }
}

// Now instantiated in initializeApp() function
// const imageLoader = new ImageLoader();

// ========== MENU FILTER ==========
class MenuFilter {
    constructor() {
        this.filterBtns = $$('.filter-btn');
        this.menuItems = $$('.menu-item');
        this.menuCategories = $$('.menu-category');
        
        if (this.filterBtns.length > 0) {
            this.init();
        }
    }
    
    init() {
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => this.filter(btn));
        });
        
        // Ensure all items are visible initially
        this.showAll();
    }
    
    showAll() {
        this.menuItems.forEach(item => {
            item.style.display = 'block';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
        });
        
        this.menuCategories.forEach(category => {
            category.style.display = 'block';
            category.style.opacity = '1';
            category.style.transform = 'translateY(0)';
        });
    }
    
    filter(btn) {
        const category = btn.dataset.filter;
        
        // Update active button
        this.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filter items with requestAnimationFrame for smooth performance
        requestAnimationFrame(() => {
            this.menuItems.forEach(item => {
                const itemCategory = item.dataset.category;
                
                if (category === 'all' || itemCategory === category) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
            
            // Hide/show categories based on visible items
            this.updateCategoryVisibility(category);
        });
    }
    
    updateCategoryVisibility(category) {
        this.menuCategories.forEach(categoryDiv => {
            const itemsInCategory = categoryDiv.querySelectorAll('.menu-item');
            
            // Check if this category should be visible based on the filter
            let shouldShow = false;
            if (category === 'all') {
                shouldShow = itemsInCategory.length > 0;
            } else {
                // Check if any item in this category matches the filter
                shouldShow = Array.from(itemsInCategory).some(item => 
                    item.dataset.category === category
                );
            }
            
            if (shouldShow) {
                categoryDiv.style.display = 'block';
                setTimeout(() => {
                    categoryDiv.style.opacity = '1';
                    categoryDiv.style.transform = 'translateY(0)';
                }, 10);
            } else {
                categoryDiv.style.opacity = '0';
                categoryDiv.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    categoryDiv.style.display = 'none';
                }, 300);
            }
        });
    }
}

// Now instantiated in initializeApp() function
// const menuFilter = new MenuFilter();

// ========== COUNTER ANIMATION (STATS) ==========
class CounterAnimation {
    constructor() {
        this.counters = $$('.stat-number');
        this.animated = new Set();
        
        if (this.counters.length > 0) {
            this.init();
        }
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated.has(entry.target)) {
                    this.animate(entry.target);
                    this.animated.add(entry.target);
                }
            });
        }, { 
            threshold: 0.5,
            rootMargin: '0px'
        });
        
        this.counters.forEach(counter => observer.observe(counter));
    }
    
    animate(counter) {
        const target = parseInt(counter.dataset.target) || 0;
        const duration = 2000; // 2 seconds
        const start = performance.now();
        
        const step = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuad = progress * (2 - progress);
            const current = Math.floor(easeOutQuad * target);
            
            counter.textContent = current.toLocaleString() + (target > 999 ? '+' : '');
            
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                counter.textContent = target.toLocaleString() + (target > 999 ? '+' : '');
            }
        };
        
        requestAnimationFrame(step);
    }
}

// Now instantiated in initializeApp() function
// const counterAnimation = new CounterAnimation();

// ========== FORM VALIDATION ==========
class FormValidator {
    constructor(formSelector) {
        this.form = $(formSelector);
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        // Clear previous errors
        this.clearAllErrors();
        
        // Validate all required fields
        const inputs = this.form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            this.submitForm();
        } else {
            this.showNotification('Please fill in all required fields correctly.', 'error');
        }
    }
    
    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        
        // Check if empty
        if (field.hasAttribute('required') && value === '') {
            this.showError(field, 'This field is required');
            return false;
        }
        
        // Email validation
        if (type === 'email' && value !== '') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(value)) {
                this.showError(field, 'Please enter a valid email address');
                return false;
            }
        }
        
        // Phone validation
        if (type === 'tel' && value !== '') {
            const phonePattern = /^[\d\s\-\+KATEX_INLINE_OPENKATEX_INLINE_CLOSE]+$/;
            const digitsOnly = value.replace(/\D/g, '');
            if (!phonePattern.test(value) || digitsOnly.length < 10) {
                this.showError(field, 'Please enter a valid phone number');
                return false;
            }
        }
        
        this.clearError(field);
        return true;
    }
    
    showError(field, message) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;
        
        // Remove existing error
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) existingError.remove();
        
        // Add error class
        field.classList.add('error');
        
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        errorDiv.style.cssText = `
            color: #e74c3c;
            font-size: 12px;
            margin-top: 5px;
            display: flex;
            align-items: center;
            gap: 5px;
        `;
        
        formGroup.appendChild(errorDiv);
    }
    
    clearError(field) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;
        
        field.classList.remove('error');
        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) errorMessage.remove();
    }
    
    clearAllErrors() {
        const errorMessages = this.form.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());
        
        const errorFields = this.form.querySelectorAll('.error');
        errorFields.forEach(field => field.classList.remove('error'));
    }
    
    submitForm() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Get form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Simulate API call
        setTimeout(() => {
            console.log('Contact form submitted:', data);
            
            // Show success message
            this.showNotification('Message sent successfully! We will contact you soon.', 'success');
            
            // Reset form
            this.form.reset();
            
            // Restore button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }
    
    showNotification(message, type = 'success') {
        // Remove existing notifications
        const existingNotif = $('.notification');
        if (existingNotif) existingNotif.remove();
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            background: type === 'success' ? '#10b981' : '#e74c3c',
            color: 'white',
            padding: '15px 25px',
            borderRadius: '8px',
            boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: '99999',
            animation: 'slideInRight 0.5s ease',
            fontSize: '14px',
            fontWeight: '500',
            maxWidth: '400px'
        });
        
        document.body.appendChild(notification);
        
        // Auto remove
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }
}

// Now instantiated in initializeApp() function
// const contactFormValidator = new FormValidator('#contactForm');

// ========== ORDER SYSTEM ==========
class OrderSystem {
    constructor() {
        this.orderBtns = $$('.btn-order');
        this.cart = [];
        
        if (this.orderBtns.length > 0) {
            this.init();
        }
    }
    
    init() {
        this.orderBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.addToCart(e));
        });
    }
    
    addToCart(e) {
        const btn = e.currentTarget;
        const menuItem = btn.closest('.menu-item');
        
        if (!menuItem) return;
        
        const name = menuItem.querySelector('h3').textContent;
        const price = menuItem.querySelector('.menu-price').textContent;
        
        // Add to cart
        this.cart.push({ name, price });
        
        // Show feedback
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Added!';
        btn.style.background = '#10b981';
        btn.disabled = true;
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.disabled = false;
        }, 2000);
        
        // Show notification
        this.showNotification(`${name} added to order!`);
        
        console.log('Cart:', this.cart);
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #10b981;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            z-index: 9999;
            animation: slideInRight 0.5s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
}

// Now instantiated in initializeApp() function
// const orderSystem = new OrderSystem();

// ========== PARALLAX EFFECT (Optional) ==========
class Parallax {
    constructor() {
        this.elements = $$('[data-parallax]');
        this.ticking = false;
        
        if (this.elements.length > 0) {
            this.init();
        }
    }
    
    init() {
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        }, { passive: true });
    }
    
    handleScroll() {
        const scrolled = window.pageYOffset;
        
        this.elements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const offset = scrolled * speed;
            element.style.transform = `translateY(${offset}px)`;
        });
    }
}

// Now instantiated in initializeApp() function
// const parallax = new Parallax();

// ========== PERFORMANCE MONITORING ==========
window.addEventListener('load', () => {
    if ('performance' in window) {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            
            if (perfData) {
                const loadTime = (perfData.loadEventEnd - perfData.fetchStart).toFixed(2);
                const domReady = (perfData.domContentLoadedEventEnd - perfData.fetchStart).toFixed(2);
                
                console.log('%c⚡ Performance Metrics', 'background: #10b981; color: white; padding: 5px 10px; border-radius: 3px; font-weight: bold;');
                console.log(`📊 Page Load Time: ${loadTime}ms`);
                console.log(`🎨 DOM Ready: ${domReady}ms`);
                console.log('%c✅ All optimizations loaded!', 'color: #10b981; font-weight: bold;');
            }
        }, 0);
    }
});

// ========== ACCESSIBILITY ==========
// Keyboard navigation
document.addEventListener('keydown', (e) => {
    // ESC to close mobile menu
    if (e.key === 'Escape') {
        const navMenu = $('#navMenu');
        if (navMenu && navMenu.classList.contains('active')) {
            navigation.closeMenu();
        }
    }
});

// ========== ERROR HANDLING ==========
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.message, 'at', e.filename, ':', e.lineno);
});

// ========== REDUCE ANIMATIONS ON LOW-END DEVICES ==========
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    document.documentElement.style.setProperty('--transition-fast', 'all 0.15s ease');
    document.documentElement.style.setProperty('--transition-normal', 'all 0.25s ease');
    document.documentElement.style.setProperty('--transition-slow', 'all 0.4s ease');
}

// ========== ADD ANIMATIONS CSS ==========
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .error {
        border-color: #e74c3c !important;
    }
    
    img.loaded {
        animation: fadeIn 0.5s ease;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// ========== CONSOLE BRANDING ==========
console.log('%c🍛 Spice & Stories', 'background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%); color: white; padding: 10px 20px; font-size: 20px; font-weight: bold; border-radius: 5px;');
console.log('%c✨ Website optimized for maximum performance', 'color: #ff6b35; font-size: 14px; font-weight: 500;');
console.log('%c💼 Developed by Muthumanickam Digital Services', 'color: #666; font-size: 12px;');

console.log('✅ Main JavaScript loaded successfully!');