/* Cart page logic: read cart from localStorage, render items, update quantities and total */
(function(){
  const CART_KEY = 'kc_cart';

  function getCart(){ try{ return JSON.parse(localStorage.getItem(CART_KEY)||'[]'); }catch(e){ return []; } }
  function saveCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); }

  function formatPrice(n){ return '$' + Number(n).toFixed(2); }

  function render(){
    const cart = getCart();
    const container = document.getElementById('cart-items');
    const summaryCount = document.getElementById('summary-count');
    const summaryTotal = document.getElementById('summary-total');
    container.innerHTML = '';
    if(cart.length === 0){ container.innerHTML = '<p>Your bag is empty.</p>'; summaryCount.textContent='0'; summaryTotal.textContent='$0.00'; return; }

    let total = 0; let qtySum = 0;
    cart.forEach(item=>{
      const row = document.createElement('div'); row.className='cart-item';
      const img = document.createElement('img'); img.src = item.img; img.alt = item.name;
      const meta = document.createElement('div'); meta.className='item-meta';
      meta.innerHTML = `<div class="item-name">${item.name}</div><div class="item-price">${formatPrice(item.price)}</div>`;
      const qty = document.createElement('div'); qty.className='item-qty';
      const minus = document.createElement('button'); minus.className='qty-btn'; minus.textContent='-';
      const plus = document.createElement('button'); plus.className='qty-btn'; plus.textContent='+';
      const qText = document.createElement('div'); qText.textContent = item.qty; qText.style.minWidth='24px'; qText.style.textAlign='center';
      const remove = document.createElement('button'); remove.className='remove-btn'; remove.textContent='Remove';

      minus.addEventListener('click', ()=>{ if(item.qty>1){ item.qty--; saveAndRender(); } else { removeItem(item.id); } });
      plus.addEventListener('click', ()=>{ item.qty++; saveAndRender(); });
      remove.addEventListener('click', ()=>{ removeItem(item.id); });

      qty.appendChild(minus); qty.appendChild(qText); qty.appendChild(plus); qty.appendChild(remove);
      row.appendChild(img); row.appendChild(meta); row.appendChild(qty);
      container.appendChild(row);

      total += item.price * item.qty; qtySum += item.qty;
    });

    summaryCount.textContent = qtySum;
    summaryTotal.textContent = formatPrice(total);

    function saveAndRender(){ saveCart(cart); render(); }
    function removeItem(id){ const idx = cart.findIndex(i=> i.id===id); if(idx>-1){ cart.splice(idx,1); saveAndRender(); } }

    const checkoutBtn = document.getElementById('checkout-btn');
    if(checkoutBtn){ checkoutBtn.onclick = ()=>{ if(cart.length===0) return alert('Your bag is empty.'); alert('Checkout simulated — clearing cart.'); localStorage.removeItem(CART_KEY); render(); } }
  }

  document.addEventListener('DOMContentLoaded', render);

})();
