
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const hamburgerBtn = document.querySelector('.hamburger-menu');
    const mobileMenu = document.querySelector('.mobile-menu-overlay');
    
    if (hamburgerBtn && mobileMenu) {
        hamburgerBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            const icon = hamburgerBtn.querySelector('i');
            if (mobileMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Search Overlay Toggle and Search Functionality
    const searchTrigger = document.querySelector('.search-trigger');
    const searchOverlay = document.querySelector('.search-overlay');
    const closeSearch = document.querySelector('.close-search');
    const searchInput = searchOverlay ? searchOverlay.querySelector('input') : null;

    if (searchTrigger && searchOverlay) {
        searchTrigger.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            const input = searchOverlay.querySelector('input');
            if(input) setTimeout(() => input.focus(), 100);
        });
    }

    // Handle search input submission
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    if (closeSearch && searchOverlay) {
        closeSearch.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
        });
    }

    function performSearch() {
        const searchTerm = searchInput ? searchInput.value.trim() : '';
        if (searchTerm) {
            // Store search term in localStorage for the shop page to use
            localStorage.setItem('searchQuery', searchTerm);
            // Redirect to shop page
            window.location.href = 'shop.html';
        }
    }

    // Cart Sidebar Toggle
    const cartToggle = document.querySelectorAll('.cart-trigger');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCart = document.getElementById('close-cart');

    function openCart() {
        if (cartSidebar) {
            cartSidebar.classList.add('open');
            cartSidebar.setAttribute('aria-hidden', 'false');
            updateCartDisplay();
        }
    }

    function closeCartFn() {
        if (cartSidebar) {
            cartSidebar.classList.remove('open');
            cartSidebar.setAttribute('aria-hidden', 'true');
        }
    }

    // Add click listeners to cart triggers
    cartToggle.forEach(el => {
        if (el) {
            el.addEventListener('click', (e) => { 
                e.preventDefault(); 
                openCart(); 
            });
        }
    });

    // Close cart button
    if (closeCart) {
        closeCart.addEventListener('click', closeCartFn);
    }

    // Close cart when clicking outside
    document.addEventListener('click', (e) => {
        if (cartSidebar && cartSidebar.classList.contains('open')) {
            if (!cartSidebar.contains(e.target) && !e.target.closest('.cart-trigger')) {
                closeCartFn();
            }
        }
    });


    // Update cart display with items
    function updateCartDisplay() {
        const cartItems = document.querySelector('.cart-items');
        const cartTotal = document.getElementById('cart-total');
        
        if (!cartItems || !cartTotal) return;

        // Get cart from localStorage (using same key as shop.js)
        const cart = JSON.parse(localStorage.getItem('kc_cart') || '[]');
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            cartTotal.textContent = '0.00';
            return;
        }

        let total = 0;
        let itemsHTML = '';

        cart.forEach(item => {
            const price = parseFloat(item.price) || 0;
            const quantity = parseInt(item.quantity) || 0;
            const itemTotal = price * quantity;
            total += itemTotal;
            
            itemsHTML += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
                    <div class="cart-item-details">
                        <h4 class="cart-item-name">${item.name}</h4>
                        <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                    <button class="remove-item-btn" onclick="removeItem('${item.id}')">&times;</button>
                </div>
            `;
        });

        cartItems.innerHTML = itemsHTML;
        cartTotal.textContent = total.toFixed(2);
    }


    // Cart utility functions
    window.updateQuantity = function(id, newQuantity) {
        if (newQuantity <= 0) {
            removeItem(id);
            return;
        }
        
        const cart = JSON.parse(localStorage.getItem('kc_cart') || '[]');
        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity = newQuantity;
            localStorage.setItem('kc_cart', JSON.stringify(cart));
            updateCartDisplay();
            updateCartBadge();
        }
    };

    window.removeItem = function(id) {
        const cart = JSON.parse(localStorage.getItem('kc_cart') || '[]');
        const updatedCart = cart.filter(item => item.id != id);
        localStorage.setItem('kc_cart', JSON.stringify(updatedCart));
        updateCartDisplay();
        updateCartBadge();
        // Keep cart sidebar open after removing item
    };

    function updateCartBadge() {
        const cart = JSON.parse(localStorage.getItem('kc_cart') || '[]');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        document.querySelectorAll('.cart-badge').forEach(badge => {
            badge.textContent = totalItems;
            badge.style.display = totalItems > 0 ? 'flex' : 'none';
        });
    }

    // Initialize cart badge on page load
    updateCartBadge();

    // Checkout button handler
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const cart = JSON.parse(localStorage.getItem('kc_cart') || '[]');
            if (cart.length === 0) {
                alert('Your cart is empty. Please add items before checkout.');
                return;
            }
            
            // Redirect to Instagram for checkout
            window.location.href = 'https://instagram.com/kristen_rtw_couture';
        });
    }


    // Close search on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (searchOverlay && searchOverlay.classList.contains('active')) {
                searchOverlay.classList.remove('active');
            }
            if (cartSidebar && cartSidebar.classList.contains('open')) {
                closeCartFn();
            }
        }
    });

    // Theme Toggle Functionality (2025 Luxury)
    class ThemeToggle {
        constructor() {
            this.theme = 'dark'; // Default to dark mode
            this.init();
        }

        init() {
            this.loadTheme();
            this.createToggleButton();
            this.attachEvents();
        }

        createToggleButton() {
            const headerRight = document.querySelector('.header-right');
            if (!headerRight) return;

            // Remove existing theme toggle if present
            const existingToggle = document.querySelector('.theme-toggle');
            if (existingToggle) {
                existingToggle.remove();
            }

            // Create theme toggle button
            const themeToggle = document.createElement('button');
            themeToggle.className = 'icon-btn theme-toggle';
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            themeToggle.title = 'Toggle theme';
            themeToggle.setAttribute('aria-label', 'Toggle between dark and light mode');

            // Insert before the cart button
            const cartBtn = document.querySelector('.cart-trigger');
            if (cartBtn) {
                headerRight.insertBefore(themeToggle, cartBtn);
            } else {
                headerRight.appendChild(themeToggle);
            }

            this.themeToggleBtn = themeToggle;
        }

        attachEvents() {
            this.themeToggleBtn?.addEventListener('click', () => {
                this.toggleTheme();
            });

            // Keyboard shortcut for theme toggle (Ctrl/Cmd + Shift + T)
            document.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                    e.preventDefault();
                    this.toggleTheme();
                }
            });
        }

        toggleTheme() {
            this.theme = this.theme === 'dark' ? 'light' : 'dark';
            this.applyTheme();
            this.saveTheme();
            this.updateButtonIcon();
            
            // Add transition effect
            document.body.style.transition = 'all 0.3s ease-out';
            setTimeout(() => {
                document.body.style.transition = '';
            }, 300);
        }

        applyTheme() {
            document.documentElement.setAttribute('data-theme', this.theme);
            
            // Add smooth transition to all elements
            const elements = document.querySelectorAll('*');
            elements.forEach(el => {
                el.style.transition = 'background-color 0.3s ease-out, color 0.3s ease-out, border-color 0.3s ease-out';
            });
            
            // Remove transition after animation
            setTimeout(() => {
                elements.forEach(el => {
                    el.style.transition = '';
                });
            }, 300);
        }

        updateButtonIcon() {
            if (!this.themeToggleBtn) return;
            
            const icon = this.themeToggleBtn.querySelector('i');
            if (icon) {
                if (this.theme === 'dark') {
                    icon.className = 'fas fa-sun';
                    this.themeToggleBtn.title = 'Switch to light mode';
                } else {
                    icon.className = 'fas fa-moon';
                    this.themeToggleBtn.title = 'Switch to dark mode';
                }
            }
        }

        saveTheme() {
            localStorage.setItem('kristen-theme', this.theme);
        }

        loadTheme() {
            const savedTheme = localStorage.getItem('kristen-theme');
            if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
                this.theme = savedTheme;
            }
            this.applyTheme();
            this.updateButtonIcon();
        }
    }

    // Initialize theme toggle
    new ThemeToggle();
});
