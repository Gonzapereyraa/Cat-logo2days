/**
 * Módulo de Carrito de Compras
 */

export class ShoppingCart {
  constructor() {
    this.items = [];
    this.isOpen = false;
    this.init();
  }

  init() {
    this.loadFromStorage();
    this.bindEvents();
    this.updateCartDisplay();
  }

  bindEvents() {
    // Event listeners para el carrito
    const cartButton = document.getElementById('cartButton');
    const closeCart = document.getElementById('closeCart');
    const clearCart = document.getElementById('clearCart');
    const checkout = document.getElementById('checkout');

    if (cartButton) {
      cartButton.addEventListener('click', () => this.toggleCart());
    }

    if (closeCart) {
      closeCart.addEventListener('click', () => this.closeCart());
    }

    if (clearCart) {
      clearCart.addEventListener('click', () => this.clearCart());
    }

    if (checkout) {
      checkout.addEventListener('click', () => this.processCheckout());
    }

    // Cerrar carrito con ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeCart();
      }
    });

    // Cerrar carrito clickeando fuera
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
      cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
          this.closeCart();
        }
      });
    }
  }

  addItem(product, quantity = 1) {
    const existingItem = this.items.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        ...product,
        quantity: quantity
      });
    }

    this.saveToStorage();
    this.updateCartDisplay();
    this.showAddedNotification(product.nombre);
    
    console.log(`✅ Producto añadido al carrito: ${product.nombre}`);
  }

  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.saveToStorage();
    this.updateCartDisplay();
  }

  updateQuantity(productId, quantity) {
    const item = this.items.find(item => item.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = quantity;
        this.saveToStorage();
        this.updateCartDisplay();
      }
    }
  }

  clearCart() {
    if (this.items.length === 0) return;
    
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      this.items = [];
      this.saveToStorage();
      this.updateCartDisplay();
      console.log('🗑️ Carrito vaciado');
    }
  }

  getTotal() {
    return this.items.reduce((total, item) => {
      return total + (item.precio * item.quantity);
    }, 0);
  }

  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  toggleCart() {
    if (this.isOpen) {
      this.closeCart();
    } else {
      this.openCart();
    }
  }

  openCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
      cartModal.classList.remove('hidden');
      this.isOpen = true;
      this.renderCartItems();
    }
  }

  closeCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
      cartModal.classList.add('hidden');
      this.isOpen = false;
    }
  }

  renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';

    if (this.items.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="text-center py-8 text-gray-400">
          <i class="fas fa-shopping-cart text-4xl mb-4"></i>
          <p>Tu carrito está vacío</p>
        </div>
      `;
      return;
    }

    this.items.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.className = 'flex items-center space-x-4 p-4 bg-white bg-opacity-10 rounded-lg';
      cartItem.innerHTML = `
        <img src="${item.imagen}" alt="${item.nombre}" class="w-16 h-16 object-cover rounded-lg">
        <div class="flex-1">
          <h4 class="font-semibold text-sm">${item.nombre}</h4>
          <p class="text-gray-300 text-sm">$${item.precio.toFixed(2)}</p>
          <div class="flex items-center space-x-2 mt-2">
            <button class="quantity-btn minus bg-red-600 hover:bg-red-700 w-8 h-8 rounded-full text-sm" data-id="${item.id}">-</button>
            <span class="quantity-display bg-white bg-opacity-20 px-3 py-1 rounded text-sm min-w-[2rem] text-center">${item.quantity}</span>
            <button class="quantity-btn plus bg-green-600 hover:bg-green-700 w-8 h-8 rounded-full text-sm" data-id="${item.id}">+</button>
          </div>
        </div>
        <div class="text-right">
          <p class="font-semibold">$${(item.precio * item.quantity).toFixed(2)}</p>
          <button class="remove-item text-red-400 hover:text-red-300 mt-2" data-id="${item.id}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      
      cartItemsContainer.appendChild(cartItem);
    });

    // Bind events for quantity buttons
    cartItemsContainer.querySelectorAll('.quantity-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = parseInt(e.target.dataset.id);
        const isPlus = e.target.classList.contains('plus');
        const item = this.items.find(item => item.id === productId);
        
        if (item) {
          const newQuantity = isPlus ? item.quantity + 1 : item.quantity - 1;
          this.updateQuantity(productId, newQuantity);
        }
      });
    });

    // Bind events for remove buttons
    cartItemsContainer.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = parseInt(e.target.dataset.id);
        this.removeItem(productId);
      });
    });
  }

  updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    
    const itemCount = this.getItemCount();
    const total = this.getTotal();

    if (cartCount) {
      cartCount.textContent = itemCount;
      cartCount.classList.toggle('hidden', itemCount === 0);
    }

    if (cartTotal) {
      cartTotal.textContent = `$${total.toFixed(2)}`;
    }

    // Update cart items if cart is open
    if (this.isOpen) {
      this.renderCartItems();
    }
  }

  showAddedNotification(productName) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all transform translate-x-full';
    notification.innerHTML = `
      <div class="flex items-center space-x-2">
        <i class="fas fa-check-circle"></i>
        <span>Añadido al carrito: ${productName}</span>
      </div>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  processCheckout() {
    if (this.items.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }

    const total = this.getTotal();
    const itemCount = this.getItemCount();
    
    const message = `¡Gracias por tu compra!\n\nResumen:\n${itemCount} artículos\nTotal: $${total.toFixed(2)}\n\n¿Proceder con el pago?`;
    
    if (confirm(message)) {
      // Simulate checkout process
      alert('Redirigiendo al sistema de pago...');
      console.log('🛒 Procesando checkout:', {
        items: this.items,
        total: total,
        timestamp: new Date().toISOString()
      });
      
      // Clear cart after successful checkout
      this.clearCart();
      this.closeCart();
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem('cart', JSON.stringify(this.items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }

  loadFromStorage() {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.items = JSON.parse(savedCart);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      this.items = [];
    }
  }
}

// Global cart instance
let cartInstance = null;

// Export functions for global use
export function initCart() {
  if (!cartInstance) {
    cartInstance = new ShoppingCart();
  }
  return cartInstance;
}

export function getCart() {
  return cartInstance;
}

export function addToCart(product, quantity = 1) {
  if (!cartInstance) {
    cartInstance = initCart();
  }
  cartInstance.addItem(product, quantity);
}