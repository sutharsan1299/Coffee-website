
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("mobile-menu");
  const navBar = document.querySelector(".navbar");
  const cartCountEl = document.getElementById("cart-count");
  const cartIcon = document.getElementById('cart-btn');
  const cartBox = document.getElementById('cart-box');
  const cartContent = document.getElementById('cart-content');
  const cartTotalPrice = document.getElementById('cart-total-price');

  let cart = [];

  if (menuToggle && navBar) {
    menuToggle.addEventListener("click", () => {
      navBar.classList.toggle("active");
    });
  }

  // Toggle cart display
  cartIcon.addEventListener('click', () => {
    cartBox.classList.toggle('open');
  });

  // Add to cart buttons
  document.querySelectorAll('.add-cart').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const productBox = button.closest('.box') || button.closest('.content')?.parentElement;
      if (!productBox) return;

      const name = productBox.querySelector('h3')?.innerText || "Coffee";
      let priceText = productBox.querySelector('.price')?.childNodes[0]?.nodeValue || "0";
      priceText = priceText.replace("Rs.", "").replace(",", "").trim();
      const price = parseFloat(priceText);
      const image = productBox.querySelector('img')?.src || "";

      const existing = cart.find(item => item.name === name);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ name, price, image, qty: 1 });
      }

      cartCountEl.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
      updateCartDisplay();
    });
  });

  // Update Cart Display
  function updateCartDisplay() {
    cartContent.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
      total += item.price * item.qty;

      const div = document.createElement('div');
      div.classList.add('cart-item');
      div.innerHTML = `
        <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; margin-right: 10px;">
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <p>Rs.${item.price.toFixed(2)} x ${item.qty}</p>
          <div class="cart-item-controls">
            <button class="dec-btn" data-index="${index}">-</button>
            <button class="inc-btn" data-index="${index}">+</button>
            <button class="remove-btn" data-index="${index}">🗑</button>
          </div>
        </div>
      `;
      cartContent.appendChild(div);
    });

    cartTotalPrice.textContent = total.toFixed(2);
  }

  // Delegate click inside cartContent
  cartContent.addEventListener('click', (e) => {
    const index = parseInt(e.target.dataset.index);
    if (e.target.classList.contains('dec-btn')) {
      cart[index].qty--;
      if (cart[index].qty <= 0) cart.splice(index, 1);
    } else if (e.target.classList.contains('inc-btn')) {
      cart[index].qty++;
    } else if (e.target.classList.contains('remove-btn')) {
      cart.splice(index, 1);
    }
    cartCountEl.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
    updateCartDisplay();
  });
});
