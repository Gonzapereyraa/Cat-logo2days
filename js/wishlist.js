/**
 * Sistema de Lista de Deseos/Favoritos
 * Incluye persistencia local, contador en header y funciones de compartir
 */

// Variables globales para wishlist
let wishlist = [];
let wishlistInitialized = false;

/**
 * Inicializa el sistema de wishlist
 */
function inicializarWishlist() {
    if (wishlistInitialized) return;
    wishlistInitialized = true;
    
    console.log('💖 Inicializando sistema de favoritos');
    
    // Cargar wishlist desde localStorage
    cargarWishlist();
    
    // Crear contador en header
    crearContadorWishlist();
    
    // Actualizar contador inicial
    actualizarContadorWishlist();
    
    // Configurar eventos
    configurarEventosWishlist();
    
    console.log('✅ Sistema de favoritos inicializado');
}

/**
 * Carga la wishlist desde localStorage
 */
function cargarWishlist() {
    try {
        const saved = localStorage.getItem('wishlist');
        if (saved) {
            wishlist = JSON.parse(saved);
            console.log(`💖 ${wishlist.length} favoritos cargados`);
        }
    } catch (error) {
        console.error('❌ Error al cargar favoritos:', error);
        wishlist = [];
    }
}

/**
 * Guarda la wishlist en localStorage
 */
function guardarWishlist() {
    try {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    } catch (error) {
        console.error('❌ Error al guardar favoritos:', error);
    }
}

/**
 * Crea el contador de wishlist en el header
 */
function crearContadorWishlist() {
    // Buscar el área de botones del header con diferentes selectores
    let header = document.querySelector('header .flex.items-center.space-x-4');
    if (!header) {
        header = document.querySelector('.flex.items-center.space-x-4');
    }
    if (!header) {
        // Crear estructura si no existe
        const mainHeader = document.querySelector('header');
        if (mainHeader) {
            const existingActions = mainHeader.querySelector('.flex');
            if (existingActions) {
                header = existingActions;
            }
        }
    }
    
    if (!header) {
        console.warn('⚠️ No se encontró el header para agregar wishlist');
        return;
    }

    // Verificar si ya existe
    if (document.getElementById('wishlistButton')) return;

    // Crear botón de wishlist
    const wishlistButton = document.createElement('div');
    wishlistButton.className = 'relative';
    wishlistButton.innerHTML = `
        <button id="wishlistButton" class="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition" title="Lista de Favoritos">
            <i class="fas fa-heart text-xl"></i>
            <span id="wishlistCount" class="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center hidden">0</span>
        </button>
    `;

    // Insertar antes del carrito
    const cartButton = header.querySelector('#cartButton');
    if (cartButton && cartButton.parentElement) {
        cartButton.parentElement.insertBefore(wishlistButton, cartButton.parentElement);
    } else {
        header.appendChild(wishlistButton);
    }
    
    console.log('💖 Botón de favoritos agregado al header');
}

/**
 * Actualiza el contador de favoritos en el header
 */
function actualizarContadorWishlist() {
    const wishlistCount = document.getElementById('wishlistCount');
    if (!wishlistCount) return;

    if (wishlist.length > 0) {
        wishlistCount.textContent = wishlist.length;
        wishlistCount.classList.remove('hidden');
    } else {
        wishlistCount.classList.add('hidden');
    }
}

/**
 * Configura eventos del sistema de wishlist
 */
function configurarEventosWishlist() {
    // Evento del botón principal de wishlist
    const wishlistButton = document.getElementById('wishlistButton');
    if (wishlistButton) {
        wishlistButton.addEventListener('click', mostrarModalWishlist);
    }

    // Configurar botones de corazón en productos existentes
    actualizarBotonesCorazon();

    // Observar cambios en el DOM para productos nuevos
    observarNuevosProductos();
}

/**
 * Actualiza todos los botones de corazón existentes
 */
function actualizarBotonesCorazon() {
    // Buscar todos los productos y agregar botones de corazón si no existen
    const products = document.querySelectorAll('.product-card, .glass-card[data-id]');
    
    products.forEach(productCard => {
        agregarBotonCorazon(productCard);
    });
}

/**
 * Agrega un botón de corazón a una tarjeta de producto
 */
function agregarBotonCorazon(productCard) {
    const productId = parseInt(productCard.dataset.id);
    if (!productId) return;

    // Verificar si ya tiene botón de corazón
    if (productCard.querySelector('.wishlist-btn')) return;

    // Crear botón de corazón
    const heartButton = document.createElement('button');
    heartButton.className = 'wishlist-btn absolute top-2 right-2 p-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full shadow-md transition-all duration-200 z-10';
    heartButton.title = 'Agregar a favoritos';
    heartButton.dataset.id = productId;
    
    // Verificar si el producto está en favoritos
    const esFavorito = wishlist.some(item => item.id === productId);
    const iconClass = esFavorito ? 'fas fa-heart text-pink-500' : 'far fa-heart text-gray-600';
    
    heartButton.innerHTML = `<i class="${iconClass}"></i>`;
    
    // Agregar evento
    heartButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorito(productId);
    });
    
    // Asegurar que el producto tenga posición relativa
    if (!productCard.classList.contains('relative')) {
        productCard.classList.add('relative');
    }
    
    productCard.appendChild(heartButton);
}

/**
 * Observa cambios en el DOM para productos nuevos
 */
function observarNuevosProductos() {
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Element node
                    // Buscar productos en el nodo añadido
                    const products = node.querySelectorAll ? 
                        node.querySelectorAll('.product-card, .glass-card[data-id]') : [];
                    
                    products.forEach(productCard => {
                        agregarBotonCorazon(productCard);
                    });
                    
                    // Si el propio nodo es un producto
                    if (node.classList && (node.classList.contains('product-card') || 
                        (node.classList.contains('glass-card') && node.dataset.id))) {
                        agregarBotonCorazon(node);
                    }
                }
            });
        });
    });

    // Observar cambios en el contenedor de productos
    const productsContainer = document.getElementById('productsContainer') || 
                              document.getElementById('filteredProductsGrid');
    if (productsContainer) {
        observer.observe(productsContainer, { 
            childList: true, 
            subtree: true 
        });
    }
}

/**
 * Alterna el estado de favorito de un producto
 */
function toggleFavorito(productId) {
    const producto = encontrarProductoPorId(productId);
    if (!producto) {
        console.error('Producto no encontrado:', productId);
        return;
    }

    const index = wishlist.findIndex(item => item.id === productId);
    const heartButton = document.querySelector(`.wishlist-btn[data-id="${productId}"]`);
    const icon = heartButton ? heartButton.querySelector('i') : null;

    if (index >= 0) {
        // Remover de favoritos
        wishlist.splice(index, 1);
        
        if (icon) {
            icon.className = 'far fa-heart text-gray-600';
            animarBotonCorazon(heartButton, false);
        }
        
        mostrarNotificacionWishlist(`${producto.nombre} removido de favoritos`, 'remove');
    } else {
        // Agregar a favoritos
        wishlist.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            categoria: producto.categoria,
            marca: producto.marca,
            fechaAgregado: new Date().toISOString()
        });
        
        if (icon) {
            icon.className = 'fas fa-heart text-pink-500';
            animarBotonCorazon(heartButton, true);
        }
        
        mostrarNotificacionWishlist(`${producto.nombre} agregado a favoritos`, 'add');
    }

    // Actualizar localStorage y contador
    guardarWishlist();
    actualizarContadorWishlist();
    
    // Actualizar modal si está abierto
    const wishlistModal = document.getElementById('wishlistModal');
    if (wishlistModal && !wishlistModal.classList.contains('hidden')) {
        mostrarItemsWishlist();
    }
}

/**
 * Anima el botón de corazón al agregar/quitar favorito
 */
function animarBotonCorazon(button, esAgregar) {
    if (!button) return;
    
    // Animación de pulso
    button.style.transform = 'scale(1.3)';
    
    if (esAgregar) {
        // Efecto de agregar (rosa)
        button.style.backgroundColor = '#ec4899';
        button.style.color = 'white';
    }
    
    setTimeout(() => {
        button.style.transform = 'scale(1)';
        if (esAgregar) {
            button.style.backgroundColor = '';
            button.style.color = '';
        }
    }, 200);
}

/**
 * Encuentra un producto por su ID
 */
function encontrarProductoPorId(productId) {
    // Intentar buscar en productos globales primero
    if (window.productosGlobales && window.productosGlobales.length > 0) {
        return window.productosGlobales.find(p => p.id === productId);
    }
    
    // Intentar buscar en productos originales de filtros
    if (window.productosOriginales && window.productosOriginales.length > 0) {
        return window.productosOriginales.find(p => p.id === productId);
    }
    
    // Buscar en localStorage como último recurso
    try {
        const productos = JSON.parse(localStorage.getItem('productos') || '[]');
        return productos.find(p => p.id === productId);
    } catch (error) {
        console.error('Error al buscar producto:', error);
        return null;
    }
}

/**
 * Muestra el modal de wishlist
 */
function mostrarModalWishlist() {
    // Crear modal si no existe
    if (!document.getElementById('wishlistModal')) {
        crearModalWishlist();
    }
    
    const modal = document.getElementById('wishlistModal');
    modal.classList.remove('hidden');
    mostrarItemsWishlist();
}

/**
 * Crea el modal de wishlist
 */
function crearModalWishlist() {
    const modal = document.createElement('div');
    modal.id = 'wishlistModal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden';
    
    modal.innerHTML = `
        <div class="glass-card p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-white flex items-center">
                    <i class="fas fa-heart text-pink-500 mr-2"></i>
                    Mis Favoritos
                </h2>
                <button id="closeWishlist" class="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition">
                    <i class="fas fa-times text-white"></i>
                </button>
            </div>
            
            <div id="wishlistItems" class="space-y-4 mb-6"></div>
            
            <div class="border-t border-white border-opacity-30 pt-4">
                <div class="flex flex-wrap gap-3">
                    <button id="clearWishlist" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center">
                        <i class="fas fa-trash mr-2"></i>Limpiar Lista
                    </button>
                    <button id="shareWishlist" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center">
                        <i class="fab fa-whatsapp mr-2"></i>Compartir por WhatsApp
                    </button>
                    <button id="addAllToCart" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center">
                        <i class="fas fa-shopping-cart mr-2"></i>Agregar Todo al Carrito
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Configurar eventos del modal
    configurarEventosModalWishlist();
}

/**
 * Configura eventos del modal de wishlist
 */
function configurarEventosModalWishlist() {
    const modal = document.getElementById('wishlistModal');
    
    // Cerrar modal
    const closeBtn = document.getElementById('closeWishlist');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    }
    
    // Cerrar al hacer click fuera
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.add('hidden');
        }
    });
    
    // Limpiar wishlist
    const clearBtn = document.getElementById('clearWishlist');
    if (clearBtn) {
        clearBtn.addEventListener('click', limpiarWishlist);
    }
    
    // Compartir wishlist
    const shareBtn = document.getElementById('shareWishlist');
    if (shareBtn) {
        shareBtn.addEventListener('click', compartirWishlist);
    }
    
    // Agregar todo al carrito
    const addAllBtn = document.getElementById('addAllToCart');
    if (addAllBtn) {
        addAllBtn.addEventListener('click', agregarTodoAlCarrito);
    }
}

/**
 * Muestra los items de la wishlist en el modal
 */
function mostrarItemsWishlist() {
    const container = document.getElementById('wishlistItems');
    if (!container) return;
    
    if (wishlist.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-heart text-6xl text-gray-400 mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-300 mb-2">Tu lista de favoritos está vacía</h3>
                <p class="text-gray-400 mb-6">Agrega productos que te gusten usando el ❤️ en cada producto</p>
                <button onclick="document.getElementById('wishlistModal').classList.add('hidden')" 
                        class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition">
                    <i class="fas fa-shopping-bag mr-2"></i>Explorar Productos
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = wishlist.map(item => `
        <div class="flex items-center space-x-4 bg-white bg-opacity-10 p-4 rounded-lg">
            <img src="${item.imagen}" 
                 alt="${item.nombre}" 
                 class="w-16 h-16 object-cover rounded-lg"
                 onerror="this.src='https://via.placeholder.com/64x64/4F46E5/FFFFFF?text=📦'">
            
            <div class="flex-1 min-w-0">
                <h4 class="text-lg font-semibold text-white truncate">${item.nombre}</h4>
                <p class="text-sm text-gray-300">${item.categoria} • ${item.marca || 'Sin marca'}</p>
                <p class="text-sm text-gray-400">Agregado el ${new Date(item.fechaAgregado).toLocaleDateString('es-ES')}</p>
            </div>
            
            <div class="flex flex-col items-end space-y-2">
                <div class="text-xl font-bold text-white">$${item.precio.toFixed(2)}</div>
                <div class="flex space-x-2">
                    <button onclick="agregarAlCarritoDesdeWishlist(${item.id})" 
                            class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition"
                            title="Agregar al carrito">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                    <button onclick="verProducto(${item.id})" 
                            class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition"
                            title="Ver producto">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="eliminarDeFavoritos(${item.id})" 
                            class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition"
                            title="Eliminar de favoritos">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Elimina un producto de favoritos
 */
function eliminarDeFavoritos(productId) {
    const index = wishlist.findIndex(item => item.id === productId);
    if (index >= 0) {
        const producto = wishlist[index];
        wishlist.splice(index, 1);
        
        // Actualizar botón de corazón
        const heartButton = document.querySelector(`.wishlist-btn[data-id="${productId}"]`);
        if (heartButton) {
            const icon = heartButton.querySelector('i');
            if (icon) {
                icon.className = 'far fa-heart text-gray-600';
                animarBotonCorazon(heartButton, false);
            }
        }
        
        // Actualizar datos
        guardarWishlist();
        actualizarContadorWishlist();
        mostrarItemsWishlist();
        
        mostrarNotificacionWishlist(`${producto.nombre} eliminado de favoritos`, 'remove');
    }
}

/**
 * Agrega un producto al carrito desde la wishlist
 */
function agregarAlCarritoDesdeWishlist(productId) {
    const producto = encontrarProductoPorId(productId);
    if (producto && typeof agregarAlCarrito === 'function') {
        agregarAlCarrito(producto);
    } else {
        console.error('No se pudo agregar al carrito:', productId);
    }
}

/**
 * Limpia toda la wishlist
 */
function limpiarWishlist() {
    if (confirm('¿Estás seguro de que quieres limpiar toda tu lista de favoritos?')) {
        // Actualizar botones de corazón
        wishlist.forEach(item => {
            const heartButton = document.querySelector(`.wishlist-btn[data-id="${item.id}"]`);
            if (heartButton) {
                const icon = heartButton.querySelector('i');
                if (icon) {
                    icon.className = 'far fa-heart text-gray-600';
                }
            }
        });
        
        wishlist = [];
        guardarWishlist();
        actualizarContadorWishlist();
        mostrarItemsWishlist();
        
        mostrarNotificacionWishlist('Lista de favoritos limpiada', 'remove');
    }
}

/**
 * Comparte la wishlist por WhatsApp
 */
function compartirWishlist() {
    if (wishlist.length === 0) {
        mostrarNotificacionWishlist('No tienes productos en favoritos para compartir', 'error');
        return;
    }
    
    let mensaje = '🛍️ ¡Mira mi lista de productos favoritos!\n\n';
    
    wishlist.forEach((item, index) => {
        mensaje += `${index + 1}. ${item.nombre}\n`;
        mensaje += `   💰 $${item.precio.toFixed(2)}\n`;
        mensaje += `   📱 ${item.categoria}\n\n`;
    });
    
    mensaje += `Total: ${wishlist.length} productos favoritos\n`;
    mensaje += `¡Visita nuestro catálogo digital! ${window.location.href}`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, '_blank');
    
    mostrarNotificacionWishlist('Lista compartida por WhatsApp', 'success');
}

/**
 * Agrega todos los productos de la wishlist al carrito
 */
function agregarTodoAlCarrito() {
    if (wishlist.length === 0) {
        mostrarNotificacionWishlist('No tienes productos en favoritos', 'error');
        return;
    }
    
    if (!confirm(`¿Quieres agregar todos los ${wishlist.length} productos al carrito?`)) {
        return;
    }
    
    let agregados = 0;
    wishlist.forEach(item => {
        const producto = encontrarProductoPorId(item.id);
        if (producto && typeof agregarAlCarrito === 'function') {
            agregarAlCarrito(producto);
            agregados++;
        }
    });
    
    if (agregados > 0) {
        mostrarNotificacionWishlist(`${agregados} productos agregados al carrito`, 'success');
        
        // Cerrar modal después de un momento
        setTimeout(() => {
            const modal = document.getElementById('wishlistModal');
            if (modal) modal.classList.add('hidden');
        }, 1500);
    }
}

/**
 * Muestra notificaciones de wishlist
 */
function mostrarNotificacionWishlist(mensaje, tipo = 'success') {
    const notification = document.createElement('div');
    
    let bgColor, icon;
    switch (tipo) {
        case 'add':
            bgColor = 'bg-pink-500';
            icon = 'fas fa-heart';
            break;
        case 'remove':
            bgColor = 'bg-gray-600';
            icon = 'far fa-heart';
            break;
        case 'error':
            bgColor = 'bg-red-500';
            icon = 'fas fa-exclamation-triangle';
            break;
        default:
            bgColor = 'bg-green-500';
            icon = 'fas fa-check-circle';
    }
    
    notification.className = `fixed bottom-4 left-4 px-4 py-3 ${bgColor} text-white rounded-lg shadow-lg z-50 transform -translate-x-full transition-transform duration-300`;
    
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="${icon} mr-2"></i>
            <span class="text-sm font-medium">${mensaje}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animación de entrada
    setTimeout(() => notification.classList.remove('-translate-x-full'), 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.classList.add('-translate-x-full');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * Obtiene estadísticas de la wishlist
 */
function obtenerEstadisticasWishlist() {
    const stats = {
        total: wishlist.length,
        categorias: {},
        marcas: {},
        precioTotal: 0,
        precioPromedio: 0
    };
    
    wishlist.forEach(item => {
        // Contar categorías
        stats.categorias[item.categoria] = (stats.categorias[item.categoria] || 0) + 1;
        
        // Contar marcas
        if (item.marca) {
            stats.marcas[item.marca] = (stats.marcas[item.marca] || 0) + 1;
        }
        
        // Sumar precios
        stats.precioTotal += item.precio;
    });
    
    if (wishlist.length > 0) {
        stats.precioPromedio = stats.precioTotal / wishlist.length;
    }
    
    return stats;
}

/**
 * Verifica si un producto está en favoritos
 */
function esFavorito(productId) {
    return wishlist.some(item => item.id === productId);
}

// Funciones para uso global
window.inicializarWishlist = inicializarWishlist;
window.toggleFavorito = toggleFavorito;
window.eliminarDeFavoritos = eliminarDeFavoritos;
window.agregarAlCarritoDesdeWishlist = agregarAlCarritoDesdeWishlist;
window.esFavorito = esFavorito;
window.obtenerEstadisticasWishlist = obtenerEstadisticasWishlist;