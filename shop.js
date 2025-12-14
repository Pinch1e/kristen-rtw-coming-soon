// Shop Page JavaScript
class Shop {
  constructor() {
    this.products = this.getDefaultProducts();
    this.filteredProducts = [...this.products];
    this.currentPage = 1;
    this.itemsPerPage = 12;
    this.currentCategory = 'All';
    this.searchTerm = '';
    this.init();
  }

  init() {
    this.loadProductsFromStorage();
    
    // Check if there's a search query from the header
    const searchQuery = localStorage.getItem('searchQuery');
    if (searchQuery) {
      this.searchTerm = searchQuery;
      localStorage.removeItem('searchQuery'); // Clear it after use
      
      // Apply search filter
      this.filterAndSort();
      
      // Update the search input field if it exists
      const searchInput = document.getElementById('shop-search');
      if (searchInput) {
        searchInput.value = searchQuery;
      }
    }
    
    this.renderProducts();
    this.renderCategories();
    this.renderPagination();
    this.bindEvents();
  }

  getDefaultProducts() {
    return [
      {
        id: 1,
        name: "Kristen Couture Dress",
        price: 150.00,
        category: "Clothing",
        image: "images/adaeze.jpg",
        images: ["images/adaeze.jpg", "images/adaeze2.jpg"],
        description: "Elegant Kristen Couture dress perfect for special occasions. Made with premium fabrics and intricate detailing."
      },
      {
        id: 2,
        name: "Amira Collection",
        price: 120.00,
        category: "Clothing",
        image: "images/amira.jpg",
        images: ["images/amira.jpg", "images/amira2.jpg"],
        description: "Stunning Amira collection featuring modern designs with traditional elegance."
      },
      {
        id: 3,
        name: "Annabelle Style",
        price: 180.00,
        category: "Clothing",
        image: "images/Annabelle (1).jpg",
        images: ["images/Annabelle (1).jpg", "images/Annabelle (5).JPG", "images/Annabelle (6).JPG"],
        description: "Sophisticated Annabelle style with unique patterns and superior craftsmanship."
      },
      {
        id: 4,
        name: "Arike Outfit",
        price: 140.00,
        category: "Clothing",
        image: "images/arike.jpg",
        images: ["images/arike.jpg", "images/arike2.jpg"],
        description: "Beautiful Arike outfit combining comfort with fashion-forward design."
      },
      {
        id: 5,
        name: "Bee Inspired",
        price: 160.00,
        category: "Clothing",
        image: "images/Bee (1).jpg",
        images: ["images/Bee (1).jpg", "images/Bee (3).jpg", "images/Bee (4).JPG"],
        description: "Bee-inspired collection featuring vibrant colors and artistic patterns."
      },
      {
        id: 6,
        name: "Butler Collection",
        price: 200.00,
        category: "Clothing",
        image: "images/Butler (1).jpg",
        images: ["images/Butler (1).jpg", "images/Butler (2).jpg", "images/Butler (3).JPG"],
        description: "Premium Butler collection with luxurious fabrics and timeless appeal."
      },
      {
        id: 7,
        name: "Diane Style",
        price: 130.00,
        category: "Clothing",
        image: "images/Diane (1).jpg",
        images: ["images/Diane (1).jpg", "images/Diane (2).JPG", "images/Diane (3).jpg"],
        description: "Elegant Diane style perfect for both casual and formal occasions."
      },
      {
        id: 8,
        name: "Ego Oyibo",
        price: 170.00,
        category: "Clothing",
        image: "images/Ego Oyibo (1).jpg",
        images: ["images/Ego Oyibo (1).jpg", "images/Ego Oyibo (2).JPG", "images/Ego Oyibo (3).JPG", "images/Ego Oyibo (4).jpg"],
        description: "Bold Ego Oyibo collection showcasing cultural heritage and modern fashion."
      },
      {
        id: 9,
        name: "Emerald Collection",
        price: 190.00,
        category: "Clothing",
        image: "images/Emerald (1).JPG",
        images: ["images/Emerald (1).JPG", "images/Emerald (2).jpg", "images/Emerald (3).jpg"],
        description: "Gorgeous Emerald collection with rich colors and exquisite detailing."
      },
      {
        id: 10,
        name: "Ezzy Style",
        price: 125.00,
        category: "Clothing",
        image: "images/Ezzy (1).jpg",
        images: ["images/Ezzy (1).jpg", "images/Ezzy (4).JPG", "images/Ezzy (5).jpg", "images/Ezzy (6).JPG"],
        description: "Fun and fashionable Ezzy style for the modern woman."
      },
      {
        id: 11,
        name: "Jasmine Collection",
        price: 155.00,
        category: "Clothing",
        image: "images/Jasmine (1).jpg",
        images: ["images/Jasmine (1).jpg", "images/Jasmine (2).jpg", "images/Jasmine (3).JPG"],
        description: "Delicate Jasmine collection with floral inspirations and soft fabrics."
      },
      {
        id: 12,
        name: "Lavish Style",
        price: 210.00,
        category: "Clothing",
        image: "images/Lavish (1).jpg",
        images: ["images/Lavish (1).jpg", "images/Lavish (2).jpg"],
        description: "Lavish and luxurious style for those special moments."
      },
      {
        id: 13,
        name: "New Wine",
        price: 145.00,
        category: "Clothing",
        image: "images/New Wine (1).jpg",
        images: ["images/New Wine (1).jpg", "images/New Wine (2).jpg"],
        description: "New Wine collection featuring rich burgundy tones and elegant cuts."
      },
      {
        id: 14,
        name: "Pearl Collection",
        price: 175.00,
        category: "Clothing",
        image: "images/Pearl (1).jpg",
        images: ["images/Pearl (1).jpg", "images/Pearl (4).jpg", "images/Pearl (5).JPG", "images/Pearl (6).jpg"],
        description: "Pearl-inspired collection with subtle elegance and timeless beauty."
      },
      {
        id: 15,
        name: "Rachet Style",
        price: 135.00,
        category: "Clothing",
        image: "images/Rachet (1).jpg",
        images: ["images/Rachet (1).jpg", "images/Rachet (2).JPG", "images/Rachet (3).jpg"],
        description: "Bold and confident Rachet style for making statements."
      },
      {
        id: 16,
        name: "Sophia Collection",
        price: 165.00,
        category: "Clothing",
        image: "images/Sophia (1).JPG",
        images: ["images/Sophia (1).JPG", "images/Sophia (2).jpg"],
        description: "Sophia collection with sophisticated designs and premium materials."
      },
      {
        id: 17,
        name: "Tinker Bell",
        price: 185.00,
        category: "Clothing",
        image: "images/Tinker Bell (1).jpg",
        images: ["images/Tinker Bell (1).jpg", "images/Tinker Bell (4).jpg", "images/Tinker Bell (5).JPG", "images/Tinker Bell (6).jpg"],
        description: "Whimsical Tinker Bell collection with magical touches and fairy-tale inspiration."
      },
      {
        id: 18,
        name: "Vantage Style",
        price: 195.00,
        category: "Clothing",
        image: "images/Vantage (1).jpg",
        images: ["images/Vantage (1).jpg", "images/Vantage (2).jpg", "images/Vantage (3).jpg", "images/Vantage (4).JPG"],
        description: "Vantage collection offering a fresh perspective on modern fashion."
      },
      {
        id: 19,
        name: "Yolanda Collection",
        price: 140.00,
        category: "Clothing",
        image: "images/Yolanda (1).jpeg",
        images: ["images/Yolanda (1).jpeg", "images/Yolanda (2).jpeg"],
        description: "Yolanda collection with unique patterns and vibrant energy."
      },
      {
        id: 20,
        name: "Zara Style",
        price: 160.00,
        category: "Clothing",
        image: "images/Zara (1).jpg",
        images: ["images/Zara (1).jpg", "images/Zara (2).jpg"],
        description: "Zara style featuring contemporary designs and comfortable fits."
      },
      {
        id: 21,
        name: "Zoe Collection",
        price: 170.00,
        category: "Clothing",
        image: "images/Zoe (1).jpg",
        images: ["images/Zoe (1).jpg", "images/Zoe (2).jpg", "images/Zoe (3).jpg"],
        description: "Zoe collection with versatile pieces for various occasions."
      }
    ];
  }

  loadProductsFromStorage() {
    const saved = localStorage.getItem('shopProducts');
    if (saved) {
      this.products = JSON.parse(saved);
    }
  }

  saveProductsToStorage() {
    localStorage.setItem('shopProducts', JSON.stringify(this.products));
  }

  bindEvents() {
    // Search
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchTerm = e.target.value.toLowerCase();
        this.filterProducts();
      });
    }

    // Category filters
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-btn')) {
        this.currentCategory = e.target.dataset.category;
        this.filterProducts();
        this.updateFilterButtons();
      }
    });

    // Pagination
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('page-btn')) {
        this.currentPage = parseInt(e.target.dataset.page);
        this.renderProducts();
        this.renderPagination();
      }
    });

    // Product cards
    document.addEventListener('click', (e) => {
      if (e.target.closest('.product-card')) {
        const card = e.target.closest('.product-card');
        const productId = parseInt(card.dataset.id);
        this.openProductModal(productId);
      }
    });

    // Modal
    const modal = document.getElementById('product-modal');
    if (modal) {
      const closeBtn = modal.querySelector('.close-modal');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.closeProductModal());
      }

      window.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeProductModal();
        }
      });
    }

    // Admin panel
    const adminToggle = document.querySelector('.admin-toggle');
    if (adminToggle) {
      adminToggle.addEventListener('click', () => {
        const content = document.querySelector('.admin-content');
        content.classList.toggle('show');
      });
    }

    const adminSave = document.querySelector('.admin-save');
    if (adminSave) {
      adminSave.addEventListener('click', () => this.saveProductsFromAdmin());
    }

    const adminRefresh = document.querySelector('.admin-refresh');
    if (adminRefresh) {
      adminRefresh.addEventListener('click', () => this.refreshProducts());
    }
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(this.searchTerm) ||
                           product.description.toLowerCase().includes(this.searchTerm);
      const matchesCategory = this.currentCategory === 'All' || product.category === this.currentCategory;
      return matchesSearch && matchesCategory;
    });
    this.currentPage = 1;
    this.renderProducts();
    this.renderPagination();
  }

  updateFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.category === this.currentCategory);
    });
  }

  renderCategories() {
    const categories = ['All', ...new Set(this.products.map(p => p.category))];
    const filtersContainer = document.querySelector('.category-filters');
    if (filtersContainer) {
      filtersContainer.innerHTML = categories.map(cat =>
        `<button class="filter-btn ${cat === 'All' ? 'active' : ''}" data-category="${cat}">${cat}</button>`
      ).join('');
    }
  }

  renderProducts() {
    const grid = document.querySelector('.products-grid');
    if (!grid) return;

    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    const productsToShow = this.filteredProducts.slice(start, end);

    grid.innerHTML = productsToShow.map(product => `
      <div class="product-card" data-id="${product.id}">
        <div class="product-images">
          <img src="${product.image}" alt="${product.name}" class="product-main-img" />
          ${product.images.length > 1 ? `
            <div class="product-thumbs">
              ${product.images.slice(0, 4).map((img, index) =>
                `<img src="${img}" onclick="event.stopPropagation(); shop.changeImage(${product.id}, '${img}')" class="thumb ${index === 0 ? 'active' : ''}" />`
              ).join('')}
            </div>
          ` : ''}
        </div>
        <div class="product-details">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-price">$${product.price.toFixed(2)}</p>
          <button class="add-btn" onclick="event.stopPropagation(); shop.addToCart(${product.id})">Add to bag</button>
        </div>
      </div>
    `).join('');
  }

  renderPagination() {
    const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    const pagination = document.querySelector('.pagination');
    if (!pagination) return;

    let buttons = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i);
      }
    } else {
      if (this.currentPage <= 4) {
        buttons = [1, 2, 3, 4, 5, '...', totalPages];
      } else if (this.currentPage >= totalPages - 3) {
        buttons = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        buttons = [1, '...', this.currentPage - 1, this.currentPage, this.currentPage + 1, '...', totalPages];
      }
    }

    pagination.innerHTML = buttons.map(btn =>
      typeof btn === 'number' ?
        `<button class="page-btn ${btn === this.currentPage ? 'active' : ''}" data-page="${btn}">${btn}</button>` :
        `<span>${btn}</span>`
    ).join('');
  }

  changeImage(productId, imgSrc) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const card = document.querySelector(`.product-card[data-id="${productId}"]`);
    if (!card) return;

    const mainImg = card.querySelector('.product-main-img');
    mainImg.src = imgSrc;

    const thumbs = card.querySelectorAll('.thumb');
    thumbs.forEach(thumb => {
      thumb.classList.toggle('active', thumb.src.includes(imgSrc));
    });
  }

  addToCart(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    if (window.cart) {
      cart.addToCart(product.name, `$${product.price.toFixed(2)}`, product.image);
    }
  }

  openProductModal(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('product-modal');
    if (!modal) return;

    modal.style.display = 'block';

    const modalImage = modal.querySelector('.modal-image img');
    const modalTitle = modal.querySelector('.modal-title');
    const modalPrice = modal.querySelector('.modal-price');
    const modalDescription = modal.querySelector('.modal-description');
    const modalAddBtn = modal.querySelector('.modal-add-btn');

    if (modalImage) modalImage.src = product.image;
    if (modalTitle) modalTitle.textContent = product.name;
    if (modalPrice) modalPrice.textContent = `$${product.price.toFixed(2)}`;
    if (modalDescription) modalDescription.textContent = product.description;
    if (modalAddBtn) {
      modalAddBtn.onclick = () => {
        this.addToCart(productId);
        this.closeProductModal();
      };
    }
  }

  closeProductModal() {
    const modal = document.getElementById('product-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  saveProductsFromAdmin() {
    const textarea = document.querySelector('.admin-textarea');
    if (!textarea) return;

    try {
      const newProducts = JSON.parse(textarea.value);
      this.products = newProducts;
      this.saveProductsToStorage();
      this.filterProducts();
      alert('Products saved successfully!');
    } catch (e) {
      alert('Invalid JSON format. Please check your syntax.');
    }
  }

  refreshProducts() {
    this.loadProductsFromStorage();
    this.filterProducts();
  }
}

// Initialize shop immediately
let shop = new Shop();

// Make shop available globally
window.shop = shop;
