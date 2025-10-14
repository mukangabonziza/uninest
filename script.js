// Home Away From Home - Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all features
    initSmoothScrolling();
    initWaitlistForms();
    initCurrencyCalculator();
    initMobileMenu();
    initScrollAnimations();
    initFeatureInteractions();
    
    // Smooth scrolling for navigation links
    function initSmoothScrolling() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Waitlist form functionality
    function initWaitlistForms() {
        const waitlistButtons = document.querySelectorAll('#hero-waitlist-btn, #final-waitlist-btn');
        const finalWaitlistBtn = document.getElementById('final-waitlist-btn');
        const heroWaitlistBtn = document.getElementById('hero-waitlist-btn');
        
        waitlistButtons.forEach(button => {
            button.addEventListener('click', function() {
                if (this === heroWaitlistBtn) {
                    // Scroll to final CTA section
                    document.getElementById('waitlist').scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                } else if (this === finalWaitlistBtn) {
                    // Handle form submission
                    handleWaitlistSubmission();
                }
            });
        });
        
        // Handle waitlist form submission
        function handleWaitlistSubmission() {
            const emailInput = document.getElementById('email-input');
            const countrySelect = document.getElementById('country-select');
            const submitBtn = document.getElementById('final-waitlist-btn');
            
            const email = emailInput.value.trim();
            const country = countrySelect.value;
            
            // Basic validation
            if (!email || !isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                emailInput.focus();
                return;
            }
            
            if (!country) {
                showNotification('Please select your home country', 'error');
                countrySelect.focus();
                return;
            }
            
            // Show loading state
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Joining Waitlist...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                showNotification('🎉 Welcome to the waitlist! We\'ll notify you when we launch.', 'success');
                emailInput.value = '';
                countrySelect.value = '';
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Track conversion
                trackWaitlistSignup(email, country);
            }, 2000);
        }
        
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
    }
    
    // Currency calculator functionality
    function initCurrencyCalculator() {
        // Sample exchange rates (in a real app, these would come from an API)
        const exchangeRates = {
            'NGN': { 'CAD': 0.00165, 'USD': 0.0012, 'EUR': 0.0011, 'GBP': 0.00095 },
            'USD': { 'CAD': 1.37, 'NGN': 833, 'EUR': 0.92, 'GBP': 0.79 },
            'CAD': { 'USD': 0.73, 'NGN': 606, 'EUR': 0.67, 'GBP': 0.58 },
            'EUR': { 'USD': 1.09, 'CAD': 1.49, 'NGN': 909, 'GBP': 0.86 },
            'GBP': { 'USD': 1.27, 'CAD': 1.73, 'NGN': 1053, 'EUR': 1.16 }
        };
        
        // Sample budget categories with CAD amounts
        const budgetCategories = {
            'rent': { amount: 1200, label: 'Monthly Rent' },
            'deposit': { amount: 1200, label: 'Security Deposit' },
            'utilities': { amount: 150, label: 'Utilities' },
            'groceries': { amount: 300, label: 'Groceries' }
        };
        
        // Update currency calculator when buttons are clicked
        const calculateButtons = document.querySelectorAll('.btn-outline');
        
        calculateButtons.forEach(button => {
            button.addEventListener('click', function() {
                if (this.textContent.includes('Calculate') || this.textContent.includes('Budget')) {
                    showCurrencyCalculator();
                }
            });
        });
        
        function showCurrencyCalculator() {
            // Create modal for currency calculator
            const modal = createModal('Currency Calculator', createCalculatorHTML());
            document.body.appendChild(modal);
            
            // Initialize calculator functionality
            const fromSelect = modal.querySelector('#from-currency');
            const toSelect = modal.querySelector('#to-currency');
            const amountInput = modal.querySelector('#amount-input');
            const resultDisplay = modal.querySelector('#result-display');
            
            function updateCalculation() {
                const fromCurrency = fromSelect.value;
                const toCurrency = toSelect.value;
                const amount = parseFloat(amountInput.value) || 0;
                
                if (fromCurrency && toCurrency && amount > 0) {
                    const rate = exchangeRates[fromCurrency]?.[toCurrency];
                    if (rate) {
                        const convertedAmount = amount * rate;
                        resultDisplay.innerHTML = `
                            <div class="conversion-result">
                                <div class="original-amount">${amount.toLocaleString()} ${fromCurrency}</div>
                                <div class="equals">=</div>
                                <div class="converted-amount">${convertedAmount.toLocaleString()} ${toCurrency}</div>
                                <div class="exchange-rate">Rate: 1 ${fromCurrency} = ${rate} ${toCurrency}</div>
                            </div>
                        `;
                    }
                }
            }
            
            fromSelect.addEventListener('change', updateCalculation);
            toSelect.addEventListener('change', updateCalculation);
            amountInput.addEventListener('input', updateCalculation);
            
            // Initial calculation
            updateCalculation();
        }
        
        function createCalculatorHTML() {
            return `
                <div class="calculator-modal">
                    <div class="calculator-form">
                        <div class="form-row">
                            <label for="amount-input">Amount:</label>
                            <input type="number" id="amount-input" placeholder="Enter amount" value="1200">
                        </div>
                        <div class="form-row">
                            <label for="from-currency">From:</label>
                            <select id="from-currency">
                                <option value="NGN">🇳🇬 Nigerian Naira (NGN)</option>
                                <option value="USD">🇺🇸 US Dollar (USD)</option>
                                <option value="CAD" selected>🇨🇦 Canadian Dollar (CAD)</option>
                                <option value="EUR">🇪🇺 Euro (EUR)</option>
                                <option value="GBP">🇬🇧 British Pound (GBP)</option>
                            </select>
                        </div>
                        <div class="form-row">
                            <label for="to-currency">To:</label>
                            <select id="to-currency">
                                <option value="NGN" selected>🇳🇬 Nigerian Naira (NGN)</option>
                                <option value="USD">🇺🇸 US Dollar (USD)</option>
                                <option value="CAD">🇨🇦 Canadian Dollar (CAD)</option>
                                <option value="EUR">🇪🇺 Euro (EUR)</option>
                                <option value="GBP">🇬🇧 British Pound (GBP)</option>
                            </select>
                        </div>
                    </div>
                    <div id="result-display" class="result-display"></div>
                    <div class="budget-breakdown">
                        <h4>Sample Monthly Budget Breakdown:</h4>
                        <div class="budget-items">
                            <div class="budget-item">
                                <span>Rent:</span>
                                <span id="rent-amount">$1,200 CAD</span>
                            </div>
                            <div class="budget-item">
                                <span>Utilities:</span>
                                <span id="utilities-amount">$150 CAD</span>
                            </div>
                            <div class="budget-item">
                                <span>Groceries:</span>
                                <span id="groceries-amount">$300 CAD</span>
                            </div>
                            <div class="budget-item total">
                                <span>Total:</span>
                                <span id="total-amount">$1,650 CAD</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }
    
    // Mobile menu functionality
    function initMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (mobileToggle && navLinks) {
            mobileToggle.addEventListener('click', function() {
                navLinks.classList.toggle('active');
                this.classList.toggle('active');
            });
            
            // Close menu when clicking on a link
            const navLinkItems = navLinks.querySelectorAll('.nav-link');
            navLinkItems.forEach(link => {
                link.addEventListener('click', function() {
                    navLinks.classList.remove('active');
                    mobileToggle.classList.remove('active');
                });
            });
        }
    }
    
    // Scroll animations
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const animateElements = document.querySelectorAll('.feature-section, .hero-content, .cta-content');
        animateElements.forEach(el => observer.observe(el));
        
        // Add CSS for animations
        const style = document.createElement('style');
        style.textContent = `
            .feature-section, .hero-content, .cta-content {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.8s ease, transform 0.8s ease;
            }
            
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
            
            .nav-links.active {
                display: flex !important;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                flex-direction: column;
                padding: var(--spacing-4);
                box-shadow: var(--shadow-lg);
                border-radius: var(--radius-lg);
            }
            
            .mobile-menu-toggle.active span:nth-child(1) {
                transform: rotate(45deg) translate(5px, 5px);
            }
            
            .mobile-menu-toggle.active span:nth-child(2) {
                opacity: 0;
            }
            
            .mobile-menu-toggle.active span:nth-child(3) {
                transform: rotate(-45deg) translate(7px, -6px);
            }
            
            .calculator-modal {
                padding: var(--spacing-6);
            }
            
            .calculator-form {
                margin-bottom: var(--spacing-6);
            }
            
            .form-row {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-2);
                margin-bottom: var(--spacing-4);
            }
            
            .form-row label {
                font-weight: 500;
                color: var(--text-secondary);
            }
            
            .form-row input, .form-row select {
                padding: var(--spacing-3);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                font-size: var(--font-size-base);
            }
            
            .conversion-result {
                background: var(--primary-color);
                color: white;
                padding: var(--spacing-6);
                border-radius: var(--radius-lg);
                text-align: center;
                margin-bottom: var(--spacing-6);
            }
            
            .original-amount, .converted-amount {
                font-size: var(--font-size-2xl);
                font-weight: 700;
            }
            
            .equals {
                font-size: var(--font-size-xl);
                margin: var(--spacing-2) 0;
            }
            
            .exchange-rate {
                font-size: var(--font-size-sm);
                opacity: 0.9;
                margin-top: var(--spacing-2);
            }
            
            .budget-breakdown {
                background: var(--bg-secondary);
                padding: var(--spacing-4);
                border-radius: var(--radius-lg);
            }
            
            .budget-breakdown h4 {
                margin-bottom: var(--spacing-4);
                color: var(--text-primary);
            }
            
            .budget-items {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-2);
            }
            
            .budget-item {
                display: flex;
                justify-content: space-between;
                padding: var(--spacing-2) 0;
                border-bottom: 1px solid var(--border-color);
            }
            
            .budget-item.total {
                font-weight: 700;
                border-top: 2px solid var(--primary-color);
                border-bottom: none;
                padding-top: var(--spacing-3);
            }
            
            .modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                padding: var(--spacing-4);
            }
            
            .modal-content {
                background: white;
                border-radius: var(--radius-xl);
                max-width: 500px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
            }
            
            .modal-header {
                padding: var(--spacing-6);
                border-bottom: 1px solid var(--border-color);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .modal-title {
                font-size: var(--font-size-xl);
                font-weight: 600;
                color: var(--text-primary);
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: var(--font-size-2xl);
                cursor: pointer;
                color: var(--text-secondary);
                padding: var(--spacing-2);
                border-radius: var(--radius-full);
                transition: background-color 0.3s ease;
            }
            
            .modal-close:hover {
                background: var(--bg-secondary);
            }
            
            .notification {
                position: fixed;
                top: 90px;
                right: var(--spacing-4);
                background: white;
                border-radius: var(--radius-lg);
                padding: var(--spacing-4) var(--spacing-6);
                box-shadow: var(--shadow-xl);
                border-left: 4px solid var(--secondary-color);
                z-index: 10001;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                max-width: 400px;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification.error {
                border-left-color: #ef4444;
            }
            
            .notification.success {
                border-left-color: var(--secondary-color);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Feature interactions
    function initFeatureInteractions() {
        // Add hover effects to feature mockups
        const featureMockups = document.querySelectorAll('.feature-mockup');
        
        featureMockups.forEach(mockup => {
            mockup.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px)';
                this.style.transition = 'transform 0.3s ease';
            });
            
            mockup.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
        
        // Add click effects to group cards
        const groupCards = document.querySelectorAll('.group-card');
        
        groupCards.forEach(card => {
            card.addEventListener('click', function() {
                const joinBtn = this.querySelector('.join-btn');
                if (joinBtn) {
                    const originalText = joinBtn.textContent;
                    joinBtn.textContent = 'Joined!';
                    joinBtn.style.background = '#059669';
                    
                    setTimeout(() => {
                        joinBtn.textContent = originalText;
                        joinBtn.style.background = '';
                    }, 2000);
                }
            });
        });
    }
    
    // Utility functions
    function createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                ${content}
            </div>
        `;
        
        // Close modal functionality
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        return modal;
    }
    
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
    
    function trackWaitlistSignup(email, country) {
        // In a real application, this would send data to analytics
        console.log('Waitlist signup:', { email, country, timestamp: new Date() });
        
        // You could integrate with services like:
        // - Google Analytics
        // - Mixpanel
        // - Segment
        // - Custom analytics endpoint
    }
    
    // Parallax effect for hero section
    function initParallaxEffect() {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.hero-visual');
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }
    
    // Initialize parallax effect
    initParallaxEffect();
    
    // Add loading states for better UX
    function addLoadingStates() {
        const buttons = document.querySelectorAll('button');
        
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                if (this.classList.contains('btn-primary')) {
                    // Add loading animation
                    this.style.position = 'relative';
                    this.style.overflow = 'hidden';
                    
                    const loadingOverlay = document.createElement('div');
                    loadingOverlay.style.cssText = `
                        position: absolute;
                        top: 0;
                        left: -100%;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                        animation: loading 1.5s infinite;
                    `;
                    
                    this.appendChild(loadingOverlay);
                    
                    setTimeout(() => {
                        if (this.contains(loadingOverlay)) {
                            this.removeChild(loadingOverlay);
                        }
                    }, 1500);
                }
            });
        });
        
        // Add loading animation CSS
        const loadingStyle = document.createElement('style');
        loadingStyle.textContent = `
            @keyframes loading {
                0% { left: -100%; }
                100% { left: 100%; }
            }
        `;
        document.head.appendChild(loadingStyle);
    }
    
    // Initialize loading states
    addLoadingStates();
    
    // Add keyboard navigation support
    function initKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            // Close modal with Escape key
            if (e.key === 'Escape') {
                const modal = document.querySelector('.modal');
                if (modal) {
                    document.body.removeChild(modal);
                }
            }
            
            // Focus management for accessibility
            if (e.key === 'Tab') {
                const focusableElements = document.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                
                // Add focus indicators
                focusableElements.forEach(element => {
                    element.addEventListener('focus', function() {
                        this.style.outline = '2px solid var(--primary-color)';
                        this.style.outlineOffset = '2px';
                    });
                    
                    element.addEventListener('blur', function() {
                        this.style.outline = '';
                        this.style.outlineOffset = '';
                    });
                });
            }
        });
    }
    
    // Initialize keyboard navigation
    initKeyboardNavigation();
    
    // Performance optimization: Lazy load images and animations
    function initLazyLoading() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // Initialize lazy loading
    initLazyLoading();
    
    console.log('🏠 Home Away From Home - Website initialized successfully!');
});
