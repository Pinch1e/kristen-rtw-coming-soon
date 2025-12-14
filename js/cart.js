// ASOS-style Cart System
class Cart {
  constructor() {
    this.items = [];
    this.loadFromStorage();
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateCartDisplay();
  }

  bindEvents() {
    // Cart icon click
    const cartLink = document.querySelector('.cart-link');
    if (cartLink) {
      cartLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleCart();
      });
    }

    // Close cart button
    const closeBtn = document.querySelector('.close-cart-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeCart());
    }

    // Checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => this.checkout());
    }

    // Close cart when clicking outside
    document.addEventListener('click', (e) => {
      const cart = document.querySelector('.cart-sidebar');
      const cartLink = document.querySelector('.cart-link');
      if (cart && cart.classList.contains('open') &&
          !cart.contains(e.target) && !cartLink.contains(e.target)) {
        this.closeCart();
      }
    });
  }

  addToCart(name, price, imgSrc) {
    const existingItem = this.items.find(item => item.name === name && item.imgSrc === imgSrc);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({
        id: Date.now(),
        name: name,
        price: parseFloat(price.replace('$', '')),
        imgSrc: imgSrc,
        quantity: 1
      });
    }

    this.saveToStorage();
    this.updateCartDisplay();
    this.showAddedNotification(name);
  }

  removeFromCart(itemId) {
    this.items = this.items.filter(item => item.id !== itemId);
    this.saveToStorage();
    this.updateCartDisplay();
  }

  updateQuantity(itemId, newQuantity) {
    if (newQuantity <= 0) {
      this.removeFromCart(itemId);
      return;
    }

    const item = this.items.find(item => item.id === itemId);
    if (item) {
      item.quantity = newQuantity;
      this.saveToStorage();
      this.updateCartDisplay();
    }
  }

  getTotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  updateCartDisplay() {
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total');
    const cartLink = document.querySelector('.cart-link');

    if (!cartItems || !cartTotal) return;

    // Update cart items
    cartItems.innerHTML = this.items.length === 0 ?
      '<p class="empty-cart">Your cart is empty</p>' :
      this.items.map(item => `
        <div class="cart-item" data-id="${item.id}">
          <img src="${item.imgSrc}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-details">
            <h4 class="cart-item-name">${item.name}</h4>
            <p class="cart-item-price">$${item.price.toFixed(2)}</p>
            <div class="cart-item-quantity">
              <button class="quantity-btn minus" onclick="cart.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
              <span class="quantity">${item.quantity}</span>
              <button class="quantity-btn plus" onclick="cart.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
            </div>
          </div>
          <button class="remove-item-btn" onclick="cart.removeFromCart(${item.id})">×</button>
        </div>
      `).join('');

    // Update total
    cartTotal.innerHTML = `
      <span>Total: $${this.getTotal().toFixed(2)}</span>
    `;

    // Update cart icon count
    if (cartLink) {
      const count = this.getItemCount();
      let badge = cartLink.querySelector('.cart-badge');
      if (!badge && count > 0) {
        badge = document.createElement('span');
        badge.className = 'cart-badge';
        cartLink.appendChild(badge);
      }
      if (badge) {
        if (count > 0) {
          badge.textContent = count;
          badge.style.display = 'block';
        } else {
          badge.style.display = 'none';
        }
      }
    }
  }

  toggleCart() {
    const cart = document.querySelector('.cart-sidebar');
    if (cart) {
      cart.classList.toggle('open');
    }
  }

  openCart() {
    const cart = document.querySelector('.cart-sidebar');
    if (cart) {
      cart.classList.add('open');
    }
  }

  closeCart() {
    const cart = document.querySelector('.cart-sidebar');
    if (cart) {
      cart.classList.remove('open');
    }
  }

  showAddedNotification(name) {
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-check-circle"></i>
        Added ${name} to cart
      </div>
    `;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Hide notification
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  checkout() {
    if (this.items.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    alert(`Checkout functionality would be implemented here. Total: $${this.getTotal().toFixed(2)}`);
    // In a real implementation, this would redirect to checkout page
  }

  saveToStorage() {
    localStorage.setItem('asosCart', JSON.stringify(this.items));
  }

  loadFromStorage() {
    const saved = localStorage.getItem('asosCart');
    if (saved) {
      this.items = JSON.parse(saved);
    }
  }

  clearCart() {
    this.items = [];
    this.saveToStorage();
    this.updateCartDisplay();
  }
}

// Initialize cart immediately
let cart = new Cart();

// Make cart available globally for onclick handlers
window.cart = cart;

// Bind events when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  cart.init();
});
