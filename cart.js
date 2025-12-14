// Cart Page JavaScript - Production Standard Version
class CartPage {
  constructor() {
    this.items = [];
    this.init();
  }

  init() {
    this.loadFromStorage();
    this.renderCart();
    this.bindEvents();
    this.updateCartBadge();
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem('kc_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.items = Array.isArray(parsed) ? parsed : [];
        // Validate cart items
        this.items = this.items.filter(item => this.isValidItem(item));
      }
    } catch (e) {
      console.error('Error loading cart from storage:', e);
      this.items = [];
    }
  }

  isValidItem(item) {
    return item && 
           item.id !== undefined && 
           item.name && 
           typeof item.price === 'number' && 
           item.price >= 0 &&
           item.quantity && 
           item.quantity > 0;
  }

  saveToStorage() {
    try {
      localStorage.setItem('kc_cart', JSON.stringify(this.items));
    } catch (e) {
      console.error('Error saving cart to storage:', e);
      alert('Unable to save cart. Please check your browser storage.');
    }
  }

  bindEvents() {
    // Quantity buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('quantity-btn')) {
        const itemId = e.target.dataset.id;
        const action = e.target.dataset.action;
        this.updateQuantity(itemId, action);
      }
    });

    // Remove item buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-item-btn')) {
        const itemId = e.target.dataset.id;
        this.removeItem(itemId);
      }
    });

    // Clear cart button
    const clearBtn = document.getElementById('clear-cart-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your cart?')) {
          this.clearCart();
        }
      });
    }
  }

  updateQuantity(itemId, action) {
    const item = this.items.find(item => item.id == itemId);
    if (!item) {
      console.warn('Item not found:', itemId);
      return;
    }

    const oldQuantity = item.quantity;
    
    if (action === 'plus') {
      item.quantity = Math.min(item.quantity + 1, 999); // Max 999 items
    } else if (action === 'minus') {
      item.quantity = Math.max(item.quantity - 1, 0);
      if (item.quantity <= 0) {
        this.removeItem(itemId);
        return;
      }
    }

    if (oldQuantity !== item.quantity) {
      this.saveToStorage();
      this.renderCart();
      this.updateCartBadge();
    }
  }

  removeItem(itemId) {
    const beforeCount = this.items.length;
    this.items = this.items.filter(item => item.id != itemId);
    
    if (beforeCount !== this.items.length) {
      this.saveToStorage();
      this.renderCart();
      this.updateCartBadge();
    }
  }

  clearCart() {
    this.items = [];
    this.saveToStorage();
    this.renderCart();
    this.updateCartBadge();
  }

  getTotal() {
    return this.items.reduce((total, item) => {
      const itemTotal = (item.price || 0) * (item.quantity || 0);
      return total + itemTotal;
    }, 0);
  }

  updateCartBadge() {
    const badges = document.querySelectorAll('.cart-badge');
    const totalItems = this.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    badges.forEach(badge => {
      badge.textContent = totalItems;
      badge.style.display = totalItems > 0 ? 'flex' : 'none';
    });
  }

  escapeHtml(text) {
    if (!text) return '';
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  renderCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    if (!cartItems || !cartTotal) return;

    if (this.items.length === 0) {
      cartItems.innerHTML = '<p class="empty-cart">Your cart is empty. <a href="shop.html">Continue shopping</a></p>';
      cartTotal.textContent = '0.00';
      return;
    }

    cartItems.innerHTML = this.items.map(item => `
      <div class="cart-item">
        <img src="${this.escapeHtml(item.image || 'images/placeholder.jpg')}" 
             alt="${this.escapeHtml(item.name)}" 
             class="cart-item-img" 
             onerror="this.src='images/placeholder.jpg'">
        <div class="cart-item-details">
          <h4 class="cart-item-name">${this.escapeHtml(item.name)}</h4>
          <p class="cart-item-price">$${(item.price || 0).toFixed(2)}</p>
          <div class="cart-item-quantity">
            <button class="quantity-btn" data-id="${this.escapeHtml(String(item.id))}" data-action="minus">-</button>
            <span class="quantity">${item.quantity || 1}</span>
            <button class="quantity-btn" data-id="${this.escapeHtml(String(item.id))}" data-action="plus">+</button>
          </div>
        </div>
        <button class="remove-item-btn" data-id="${this.escapeHtml(String(item.id))}">×</button>
      </div>
    `).join('');

    cartTotal.textContent = this.getTotal().toFixed(2);
  }
}

// Initialize cart page
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.cartPage = new CartPage();
  });
} else {
  window.cartPage = new CartPage();
}
