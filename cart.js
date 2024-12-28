document.addEventListener('DOMContentLoaded', () => {
  const cartKey = 'cart'; // Key to store cart data
  const cartCountDesktop = document.getElementById('cart-count'); // Desktop cart count
  const cartCountMobile = document.getElementById('mobile-cart-count'); // Mobile cart count

  // Check if this is a new session (tab closed and reopened)
  if (!sessionStorage.getItem('sessionActive')) {
    // New session detected, clear localStorage cart
    localStorage.removeItem(cartKey);
    sessionStorage.setItem('sessionActive', 'true');
  }

  // Load the cart from localStorage or initialize an empty cart
  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

  // Function to update cart count in the navbar
  function updateCartCount() {
    const itemCount = cart.length;

    if (itemCount === 0) {
      // Hide cart count if no items
      cartCountDesktop.style.display = 'none';
      cartCountMobile.style.display = 'none';
    } else {
      // Show cart count and update the value
      cartCountDesktop.style.display = 'inline';
      cartCountDesktop.textContent = itemCount;

      cartCountMobile.style.display = 'inline';
      cartCountMobile.textContent = itemCount;
    }
  }

  // Add product to cart (Modify based on your product add logic)
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault();

      const productElement = event.target.closest('.pro');
      const productName = productElement.querySelector('.product-name').textContent;
      const productPrice = productElement.querySelector('.product-price').textContent;
      const productImage = productElement.querySelector('img').src; // Capture product image

      const product = {
        name: productName,
        price: productPrice,
        image: productImage // Store product image
      };

      cart.push(product); // Add product to the cart array
      localStorage.setItem(cartKey, JSON.stringify(cart)); // Save updated cart to localStorage
      alert(`${productName} has been added to your cart!`);
      updateCartCount();
    });
  });

  // Initial cart count update
  updateCartCount();
});

// Update item quantity
function updateQuantity(index, change) {
  const updatedCart = [...cart];

  updatedCart[index].quantity += change;

  if (updatedCart[index].quantity <= 0) {
    updatedCart.splice(index, 1);
  }

  localStorage.setItem('cart', JSON.stringify(updatedCart));

  cart.length = 0; // Clear the original array
  cart.push(...updatedCart); // Repopulate the cart array

  renderCart();
}

// Retrieve cart data from localStorage
const cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM elements
const cartItemsContainer = document.getElementById('cart-items');
const totalItemsElement = document.getElementById('total-items');
const totalPriceElement = document.getElementById('total-price');

// Render cart items
function renderCart() {
  cartItemsContainer.innerHTML = '';
  let totalItems = 0;
  let totalPrice = 0;

  cart.forEach((item, index) => {
    if (!item.quantity || item.quantity < 1) {
      item.quantity = 1;
    }
    const price = parseFloat(item.price) || 0;

    
    const itemElement = document.createElement('div');
    itemElement.classList.add('cart-item');
    itemElement.style.display = 'flex'; 
    itemElement.style.alignItems = 'center'; 
    itemElement.style.marginBottom = '20px'; 

    itemElement.innerHTML = `
      <!-- Product Details -->
      <div class="cart-item-details" style="flex: 2; padding-right: 20px;">
          <h3>${item.name}</h3>
          <p>Price: $${item.price}</p>
          <p>
              Quantity: 
              <button id="incdec" onclick="updateQuantity(${index}, -1)">-</button>
              <span>${item.quantity}</span>
              <button id="incdec" onclick="updateQuantity(${index}, 1)">+</button>
          </p>
          <p>Subtotal: $${(item.price * item.quantity).toFixed(2)}</p>
          <button id="remove-btn" onclick="removeItem(${index})">Remove</button>
      </div>

      <!-- Product Image -->
      <div class="cart-item-image" style="flex: 1; border: 1px solid #cce7d0;  padding: 10px 12px; border-radius: 15px;  cursor: pointer;
  ">
          <img src="${item.image}" alt="${item.name}" style="width: 100%; border-radius: 20px;">
      </div>
    `;

    // Append item to cart container
    cartItemsContainer.appendChild(itemElement);
    totalItems += item.quantity;
    totalPrice += item.price * item.quantity;
  });

  totalItemsElement.textContent = totalItems;
  totalPriceElement.textContent = totalPrice.toFixed(2);

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>Your cart is empty!</p>';
  }

  // Save the updated cart back to localStorage to ensure consistent state
  localStorage.setItem('cart', JSON.stringify(cart));
}


// Add items to cart from the product page
function addToCart(productName, productPrice) {
  const existingItem = cart.find(item => item.name === productName);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ name: productName, price: productPrice, quantity: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`${productName} has been added to your cart!`);
  renderCart();
}

// Remove item from cart
function removeItem(index) {
  if (cart[index]) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
  }
}


renderCart();





