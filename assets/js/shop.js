/* Shop JS: renders products and implements add-to-cart using localStorage with Masonry Grid Layout */
(function(){
  const allImages = [
    'images/adaeze.jpg','images/adaeze2.jpg','images/amira.jpg','images/amira2.jpg',
    'images/Annabelle (1).jpg','images/Annabelle (5).JPG','images/Annabelle (6).JPG','images/Annabelle (7).jpg',
    'images/Annabelle (8).jpg','images/Annabelle (9).jpg','images/arike.jpg','images/arike2.jpg',
    'images/Bee (1).jpg','images/Bee (3).jpg','images/Bee (4).JPG','images/Butler (1).jpg','images/Butler (2).jpg',
    'images/Butler (3).JPG','images/Diane (1).jpg','images/Diane (2).JPG','images/Diane (3).jpg','images/Ego Oyibo (1).jpg',
    'images/Ego Oyibo (2).JPG','images/Ego Oyibo (3).JPG','images/Ego Oyibo (4).jpg','images/Emerald (1).JPG','images/Emerald (2).jpg',
    'images/Emerald (3).jpg','images/Ezzy (1).jpg','images/Ezzy (4).JPG','images/Ezzy (5).jpg','images/Ezzy (6).JPG',
    'images/Jasmine (1).jpg','images/Jasmine (2).jpg','images/Jasmine (3).JPG','images/Lavish (1).jpg','images/Lavish (2).jpg',
    'images/New Wine (1).jpg','images/New Wine (2).jpg','images/Pearl (1).jpg','images/Pearl (4).jpg','images/Pearl (5).JPG',
    'images/Pearl (6).jpg','images/Rachet (1).jpg','images/Rachet (2).JPG','images/Rachet (3).jpg','images/Sophia (1).JPG',
    'images/Sophia (2).jpg','images/Tinker Bell (1).jpg','images/Tinker Bell (4).jpg','images/Tinker Bell (5).JPG','images/Tinker Bell (6).jpg',
    'images/Vantage (1).jpg','images/Vantage (2).jpg','images/Vantage (3).jpg','images/Vantage (4).JPG','images/Yolanda (1).jpeg',
    'images/Yolanda (2).jpeg','images/Zara (1).jpg','images/Zara (2).jpg','images/Zoe (1).jpg','images/Zoe (2).jpg','images/Zoe (3).jpg'
  ];

  // Normalize image file extensions to lowercase
  const normalizedImages = allImages.map(img => img.replace(/\.JPG$/i, '.jpg').replace(/\.JPEG$/i, '.jpeg'));

  function groupImagesByBaseName(images){
    const groups = {};
    images.forEach(img =>{
      const file = img.split('/')[1] || img;
      let base = file.replace(/\s*\(\d+\)|\.JPG|\.jpg|\.jpeg|\.png/gi,'').replace(/\d+$/,'').trim();
      base = base.replace(/\s+/g,' ').trim();
      if(!groups[base]) groups[base]=[];
      groups[base].push(img);
    });
    return groups;
  }

  function createCard(name, images){
    const displayName = name.split(' ').map(w=> w.charAt(0).toUpperCase()+w.slice(1).toLowerCase()).join(' ');
    const mainImg = images[0];
    const card = document.createElement('div');
    card.className = 'product-card kc-reveal';
    const thumbsHtml = images.map((img, i)=>`<img src="${img}" data-img="${img}" class="thumb ${i===0? 'active':''}"/>`).join('');
    card.innerHTML = `
      <div class="product-images">
        <img class="product-main-img" src="${mainImg}" alt="${displayName}" loading="lazy" />
        <div class="product-overlay">
          <div class="overlay-left">
            <h3 class="product-name">${displayName}</h3>
          </div>

        <div class="overlay-right">
            <span class="product-price">$50</span>
            <a href="https://kristen-co-couture.myshopify.com/?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnTAFWIDWtXis4B1eoWTUVSQyJpNinX9MGaI4sxsl6_3Jyenq8BA8UDaoik5U_aem_ZAkHf1nfCRZg3feGDn87eQ" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="overlay-add shop-now-btn" 
               title="Shop now">
              <i class="fas fa-shopping-bag"></i>
              Shop
            </a>
          </div>
        </div>
        <button class="overlay-heart" aria-pressed="false" title="Favorite">♡</button>
        <div class="product-thumbs">${thumbsHtml}</div>
      </div>

      <div class="product-details">
        <h3 class="product-name">${displayName}</h3>
        <p class="product-price">$50</p>
        <a href="https://kristen-co-couture.myshopify.com/?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnTAFWIDWtXis4B1eoWTUVSQyJpNinX9MGaI4sxsl6_3Jyenq8BA8UDaoik5U_aem_ZAkHf1nfCRZg3feGDn87eQ" 
           target="_blank" 
           rel="noopener noreferrer" 
           class="add-btn shop-now-btn">
          <i class="fas fa-shopping-bag"></i>
          Shop Now
        </a>
      </div>
    `;

    // Events for thumbnail navigation
    const mainImgEl = card.querySelector('.product-main-img');
    card.querySelectorAll('.thumb').forEach(t=> t.addEventListener('click', (e)=>{
      const src = e.currentTarget.getAttribute('data-img');
      mainImgEl.src = src;
      card.querySelectorAll('.thumb').forEach(x=> x.classList.remove('active'));
      e.currentTarget.classList.add('active');
    }));

    // Wire favorite heart button
    const heart = card.querySelector('.overlay-heart');
    if(heart){
      const favState = isFavorited(name.replace(/\s+/g,'-').toLowerCase());
      if(favState){ heart.classList.add('liked'); heart.textContent = '♥'; heart.setAttribute('aria-pressed','true'); }
      else { heart.classList.remove('liked'); heart.textContent = '♡'; heart.setAttribute('aria-pressed','false'); }
      heart.addEventListener('click', (ev)=>{ 
        ev.stopPropagation(); 
        const liked = toggleFavoriteId(name.replace(/\s+/g,'-').toLowerCase()); 
        heart.classList.toggle('liked', liked); 
        heart.textContent = liked ? '♥':'♡'; 
        heart.setAttribute('aria-pressed', liked ? 'true':'false'); 
      });
    }



    // Add button and overlay add are now links to Shopify, no cart functionality needed

    // Reveal observer will add loaded class when image scrolls into view
    observeReveal(card);

    return card;
  }

  // Build a products array from image groups
  function buildProducts(){
    const groups = groupImagesByBaseName(normalizedImages);
    const products = Object.keys(groups).map((name, idx)=>{
      return { 
        id: name.replace(/\s+/g,'-').toLowerCase(), 
        name: name, 
        price: (50 + (idx%5)*10), 
        img: groups[name][0], 
        images: groups[name] 
      };
    });
    return products;
  }

  // Render products with masonry layout
  function renderProducts(list){
    const grid = document.getElementById('products-grid');
    if(!grid) return;
    
    grid.innerHTML = '';
    
    const cards = list.map(p=>{
      const card = createCard(p.name, p.images);
      card.dataset.prodId = p.id;
      card.dataset.prodName = p.name.toLowerCase();
      card.dataset.prodPrice = p.price;
      
      const priceEl = card.querySelector('.product-price'); 
      if(priceEl) priceEl.textContent = '$' + Number(p.price).toFixed(2);
      
      return card;
    });

    // Add all cards to grid
    cards.forEach(card => grid.appendChild(card));
    
    // Trigger reflow after render
    setTimeout(() => applyMasonry(), 150);
  }

  // Masonry layout: CSS Grid with grid-auto-flow: dense handles it; refresh layout on resize
  function applyMasonry(){
    // Grid layout is handled by CSS grid-auto-rows and grid-auto-flow: dense
    // This function triggers a reflow for responsive behavior
    const grid = document.getElementById('products-grid');
    if(!grid) return;
    // Force reflow by toggling grid display
    grid.style.display = 'none';
    void grid.offsetHeight; // Trigger reflow
    grid.style.display = 'grid';
  }

  

  // Debounced resize handler
  let resizeTimeout;
  function handleResize(){
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      applyMasonry();
    }, 250);
  }

  window.addEventListener('resize', handleResize);

  /* Reveal / lazy animation: IntersectionObserver to add kc-loaded */
  const _revealObs = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        const el = en.target;
        el.classList.add('kc-loaded');
        const img = el.querySelector && el.querySelector('.product-main-img');
        if(img) img.classList.add('kc-loaded');
        _revealObs.unobserve(el);
      }
    });
  },{ rootMargin: '0px 0px 120px 0px', threshold: 0.05 });

  function observeReveal(card){
    card.classList.add('kc-reveal');
    _revealObs.observe(card);
    
    const img = card.querySelector('.product-main-img');
    if(img){
      if(img.complete && img.naturalHeight){
        card.classList.add('kc-loaded'); 
        img.classList.add('kc-loaded');
      } else {
        img.addEventListener('load', ()=>{ 
          card.classList.add('kc-loaded'); 
          img.classList.add('kc-loaded'); 
          // Recalculate masonry after image loads
          setTimeout(() => applyMasonry(), 100);
        });
        img.addEventListener('error', ()=>{ 
          card.classList.add('kc-loaded'); 
          img.classList.add('kc-loaded'); 
          setTimeout(() => applyMasonry(), 100);
        });
      }
    }
  }

  function generateProducts(){
    window._kc_products = buildProducts();
    renderProducts(window._kc_products);
  }

  // Filtering / sorting utilities
  function applyFilters(){
    const q = (document.getElementById('shop-search')||{}).value || '';
    const sort = (document.getElementById('shop-sort')||{}).value || 'featured';
    let list = (window._kc_products||[]).slice();
    
    if(q.trim()){
      const ql = q.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(ql));
    }
    
    if(sort === 'price-asc') list.sort((a,b)=> a.price - b.price);
    else if(sort === 'price-desc') list.sort((a,b)=> b.price - a.price);
    else if(sort === 'name-asc') list.sort((a,b)=> a.name.localeCompare(b.name));
    
    renderProducts(list);
  }

  function wireControls(){
    const search = document.getElementById('shop-search');
    const sort = document.getElementById('shop-sort');
    const clear = document.getElementById('clear-search');
    
    if(search){ search.addEventListener('input', debounce(applyFilters, 180)); }
    if(sort){ sort.addEventListener('change', applyFilters); }
    if(clear){ clear.addEventListener('click', ()=>{ 
      if(search){ search.value=''; applyFilters(); } 
    }); }
  }

  function debounce(fn, wait){ 
    let t; 
    return function(){ 
      clearTimeout(t); 
      t = setTimeout(()=> fn.apply(this, arguments), wait); 
    }; 
  }


  // Shopify integration - removed cart functionality
  // All purchases now redirect to Shopify store


  // All cart animation and UI functions removed - now using Shopify redirect

  // Favorites persistence helpers
  const FAV_KEY = 'kc_favorites';
  function getFavorites(){
    try{ return JSON.parse(localStorage.getItem(FAV_KEY) || '[]'); }catch(e){ return []; }
  }
  function saveFavorites(list){ localStorage.setItem(FAV_KEY, JSON.stringify(list)); }
  function isFavorited(id){ return getFavorites().indexOf(id) !== -1; }
  function toggleFavoriteId(id){ 
    const fav = getFavorites(); 
    const i = fav.indexOf(id); 
    if(i === -1){ fav.push(id); } 
    else { fav.splice(i,1); }
    saveFavorites(fav);
    return i === -1;
  }


  // INITIALIZATION
  generateProducts();
  wireControls();

  // DEBUG: global access to products list (cart functions removed)
  window._kc_allProducts = normalizedImages;
  window._kc_groupedProducts = groupImagesByBaseName(normalizedImages);
  window._kc_buildProducts = buildProducts;
  window._kc_renderProducts = renderProducts;
  window._kc_applyFilters = applyFilters;
  window._kc_isFavorited = isFavorited;
  window._kc_toggleFavoriteId = toggleFavoriteId;
})();

/* Header JS: search overlay and mobile menu toggle */
(function() {
  const searchBtn = document.querySelector('.search-btn');
  const searchOverlay = document.querySelector('.search-overlay');
  const closeSearch = document.querySelector('.close-search');
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const navMenu = document.querySelector('.nav-menu');

  // Toggle search overlay
  if (searchBtn && searchOverlay && closeSearch) {
    searchBtn.addEventListener('click', () => {
      searchOverlay.classList.add('active');
    });

    closeSearch.addEventListener('click', () => {
      searchOverlay.classList.remove('active');
    });
  }

  // Toggle mobile menu
  if (hamburgerMenu && navMenu) {
    hamburgerMenu.addEventListener('click', () => {
      navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
    });
  }
})();
