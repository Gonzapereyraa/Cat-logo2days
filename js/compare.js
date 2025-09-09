/**
 * Sistema de Comparación de Productos
 * Permite comparar hasta 4 productos lado a lado con recomendaciones automáticas
 */

// Variables globales para comparación
let compareList = [];
let compareInitialized = false;
const MAX_COMPARE = 4;

/**
 * Inicializa el sistema de comparación
 */
function inicializarComparacion() {
    if (compareInitialized) return;
    compareInitialized = true;
    
    console.log('⚖️ Inicializando sistema de comparación');
    
    // Cargar lista de comparación desde localStorage
    cargarListaComparacion();
    
    // Crear widget de comparación
    crearWidgetComparacion();
    
    // Actualizar contador inicial
    actualizarContadorComparacion();
    
    // Configurar eventos
    configurarEventosComparacion();
    
    // Observar nuevos productos
    observarNuevosProductosComparacion();
    
    console.log('✅ Sistema de comparación inicializado');
}

/**
 * Carga la lista de comparación desde localStorage
 */
function cargarListaComparacion() {
    try {
        const saved = localStorage.getItem('compareList');
        if (saved) {
            compareList = JSON.parse(saved);
            console.log(`⚖️ ${compareList.length} productos cargados para comparación`);
        }
    } catch (error) {
        console.error('❌ Error al cargar lista de comparación:', error);
        compareList = [];
    }
}

/**
 * Guarda la lista de comparación en localStorage
 */
function guardarListaComparacion() {
    try {
        localStorage.setItem('compareList', JSON.stringify(compareList));
    } catch (error) {
        console.error('❌ Error al guardar lista de comparación:', error);
    }
}

/**
 * Crea el widget flotante de comparación
 */
function crearWidgetComparacion() {
    // Verificar si ya existe
    if (document.getElementById('compareWidget')) return;

    const widget = document.createElement('div');
    widget.id = 'compareWidget';
    widget.className = 'fixed bottom-6 right-6 z-40 transform translate-y-full transition-transform duration-300';
    
    widget.innerHTML = `
        <div class="glass-card p-4 rounded-lg shadow-xl max-w-sm">
            <div class="flex justify-between items-center mb-3">
                <h3 class="text-lg font-bold text-white flex items-center">
                    <i class="fas fa-balance-scale mr-2"></i>
                    Comparar (<span id="compareCount">0</span>/${MAX_COMPARE})
                </h3>
                <button id="minimizeCompare" class="p-1 hover:bg-white hover:bg-opacity-20 rounded transition">
                    <i class="fas fa-minus text-white"></i>
                </button>
            </div>
            
            <div id="compareItems" class="space-y-2 mb-3 max-h-40 overflow-y-auto"></div>
            
            <div class="flex space-x-2">
                <button id="showCompareTable" class="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded transition disabled:opacity-50" disabled>
                    <i class="fas fa-table mr-1"></i>Comparar
                </button>
                <button id="clearCompare" class="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition">
                    <i class="fas fa-trash mr-1"></i>Limpiar
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(widget);
    configurarEventosWidget();
}

/**
 * Configura eventos del widget
 */
function configurarEventosWidget() {
    const widget = document.getElementById('compareWidget');
    const minimizeBtn = document.getElementById('minimizeCompare');
    const showTableBtn = document.getElementById('showCompareTable');
    const clearBtn = document.getElementById('clearCompare');
    
    // Minimizar/expandir widget
    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', function() {
            const items = document.getElementById('compareItems');
            const isMinimized = items.style.display === 'none';
            
            items.style.display = isMinimized ? 'block' : 'none';
            this.querySelector('i').className = isMinimized ? 'fas fa-minus text-white' : 'fas fa-plus text-white';
        });
    }
    
    // Mostrar tabla de comparación
    if (showTableBtn) {
        showTableBtn.addEventListener('click', mostrarTablaComparacion);
    }
    
    // Limpiar lista
    if (clearBtn) {
        clearBtn.addEventListener('click', limpiarListaComparacion);
    }
}

/**
 * Configura eventos generales del sistema de comparación
 */
function configurarEventosComparacion() {
    // Los botones individuales se configuran cuando se agregan a los productos
}

/**
 * Observa nuevos productos para agregar botones de comparación
 */
function observarNuevosProductosComparacion() {
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) {
                    // Buscar productos en el nodo añadido
                    const products = node.querySelectorAll ? 
                        node.querySelectorAll('.product-card, .glass-card[data-id]') : [];
                    
                    products.forEach(productCard => {
                        agregarBotonComparacion(productCard);
                    });
                    
                    // Si el propio nodo es un producto
                    if (node.classList && (node.classList.contains('product-card') || 
                        (node.classList.contains('glass-card') && node.dataset.id))) {
                        agregarBotonComparacion(node);
                    }
                }
            });
        });
    });

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
 * Agrega botón de comparación a una tarjeta de producto
 */
function agregarBotonComparacion(productCard) {
    const productId = parseInt(productCard.dataset.id);
    if (!productId) return;

    // Verificar si ya tiene botón de comparación
    if (productCard.querySelector('.compare-btn')) return;

    // Buscar el contenedor de botones overlay o crearlo
    let buttonContainer = productCard.querySelector('.absolute.inset-0 .flex.gap-2');
    if (!buttonContainer) {
        // Crear overlay si no existe (para productos sin sistema de filtros)
        const imageContainer = productCard.querySelector('img')?.parentElement;
        if (imageContainer && !imageContainer.querySelector('.absolute.inset-0')) {
            const overlay = document.createElement('div');
            overlay.className = 'absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100';
            
            const buttonsDiv = document.createElement('div');
            buttonsDiv.className = 'flex gap-2';
            overlay.appendChild(buttonsDiv);
            
            imageContainer.classList.add('relative', 'group');
            imageContainer.appendChild(overlay);
            buttonContainer = buttonsDiv;
        }
    }

    if (!buttonContainer) return;

    // Crear botón de comparación
    const compareButton = document.createElement('button');
    compareButton.className = 'compare-btn p-2 bg-white bg-opacity-20 hover:bg-opacity-40 rounded-full transition';
    compareButton.title = 'Comparar producto';
    compareButton.dataset.id = productId;
    
    // Verificar si el producto está en la lista de comparación
    const enComparacion = compareList.some(item => item.id === productId);
    const iconClass = enComparacion ? 'fas fa-balance-scale text-blue-400' : 'fas fa-balance-scale text-white';
    
    compareButton.innerHTML = `<i class="${iconClass}"></i>`;
    
    // Agregar evento
    compareButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleComparacion(productId);
    });
    
    buttonContainer.appendChild(compareButton);
}

/**
 * Alterna un producto en la lista de comparación
 */
function toggleComparacion(productId) {
    const producto = encontrarProductoPorId(productId);
    if (!producto) {
        console.error('Producto no encontrado:', productId);
        return;
    }

    const index = compareList.findIndex(item => item.id === productId);
    const compareButton = document.querySelector(`.compare-btn[data-id="${productId}"]`);
    const icon = compareButton ? compareButton.querySelector('i') : null;

    if (index >= 0) {
        // Remover de comparación
        compareList.splice(index, 1);
        
        if (icon) {
            icon.className = 'fas fa-balance-scale text-white';
        }
        
        mostrarNotificacionComparacion(`${producto.nombre} removido de comparación`, 'remove');
    } else {
        // Verificar límite máximo
        if (compareList.length >= MAX_COMPARE) {
            mostrarNotificacionComparacion(`Máximo ${MAX_COMPARE} productos para comparar`, 'error');
            return;
        }
        
        // Agregar a comparación
        compareList.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            categoria: producto.categoria,
            marca: producto.marca,
            descripcion: producto.descripcion,
            rating: producto.rating || 0,
            sizes: producto.sizes || [],
            color: producto.color,
            oferta: producto.oferta || false,
            fechaAgregado: new Date().toISOString()
        });
        
        if (icon) {
            icon.className = 'fas fa-balance-scale text-blue-400';
        }
        
        mostrarNotificacionComparacion(`${producto.nombre} agregado a comparación`, 'add');
    }

    // Actualizar datos y widget
    guardarListaComparacion();
    actualizarContadorComparacion();
    actualizarWidgetComparacion();
}

/**
 * Actualiza el contador de comparación
 */
function actualizarContadorComparacion() {
    const countElement = document.getElementById('compareCount');
    if (countElement) {
        countElement.textContent = compareList.length;
    }
    
    // Mostrar/ocultar widget
    const widget = document.getElementById('compareWidget');
    if (widget) {
        if (compareList.length > 0) {
            widget.classList.remove('translate-y-full');
        } else {
            widget.classList.add('translate-y-full');
        }
    }
    
    // Habilitar/deshabilitar botón de comparar
    const showTableBtn = document.getElementById('showCompareTable');
    if (showTableBtn) {
        showTableBtn.disabled = compareList.length < 2;
    }
}

/**
 * Actualiza el contenido del widget
 */
function actualizarWidgetComparacion() {
    const itemsContainer = document.getElementById('compareItems');
    if (!itemsContainer) return;
    
    if (compareList.length === 0) {
        itemsContainer.innerHTML = '<p class="text-sm text-gray-300 text-center">Agrega productos para comparar</p>';
        return;
    }
    
    itemsContainer.innerHTML = compareList.map(item => `
        <div class="flex items-center space-x-2 bg-white bg-opacity-10 p-2 rounded">
            <img src="${item.imagen}" alt="${item.nombre}" 
                 class="w-8 h-8 object-cover rounded"
                 onerror="this.src='https://via.placeholder.com/32x32/4F46E5/FFFFFF?text=📦'">
            <div class="flex-1 min-w-0">
                <div class="text-xs font-medium text-white truncate">${item.nombre}</div>
                <div class="text-xs text-gray-300">$${item.precio.toFixed(2)}</div>
            </div>
            <button onclick="eliminarDeComparacion(${item.id})" 
                    class="p-1 hover:bg-red-500 hover:bg-opacity-20 rounded text-xs text-red-400"
                    title="Eliminar">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

/**
 * Elimina un producto de la comparación
 */
function eliminarDeComparacion(productId) {
    const index = compareList.findIndex(item => item.id === productId);
    if (index >= 0) {
        const producto = compareList[index];
        compareList.splice(index, 1);
        
        // Actualizar botón de comparación
        const compareButton = document.querySelector(`.compare-btn[data-id="${productId}"]`);
        if (compareButton) {
            const icon = compareButton.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-balance-scale text-white';
            }
        }
        
        guardarListaComparacion();
        actualizarContadorComparacion();
        actualizarWidgetComparacion();
        
        mostrarNotificacionComparacion(`${producto.nombre} eliminado de comparación`, 'remove');
    }
}

/**
 * Limpia toda la lista de comparación
 */
function limpiarListaComparacion() {
    if (compareList.length === 0) return;
    
    if (confirm('¿Estás seguro de que quieres limpiar la lista de comparación?')) {
        // Actualizar botones de comparación
        compareList.forEach(item => {
            const compareButton = document.querySelector(`.compare-btn[data-id="${item.id}"]`);
            if (compareButton) {
                const icon = compareButton.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-balance-scale text-white';
                }
            }
        });
        
        compareList = [];
        guardarListaComparacion();
        actualizarContadorComparacion();
        actualizarWidgetComparacion();
        
        mostrarNotificacionComparacion('Lista de comparación limpiada', 'remove');
    }
}

/**
 * Muestra la tabla de comparación completa
 */
function mostrarTablaComparacion() {
    if (compareList.length < 2) {
        mostrarNotificacionComparacion('Necesitas al menos 2 productos para comparar', 'error');
        return;
    }
    
    // Crear modal si no existe
    if (!document.getElementById('compareModal')) {
        crearModalComparacion();
    }
    
    const modal = document.getElementById('compareModal');
    modal.classList.remove('hidden');
    generarTablaComparacion();
}

/**
 * Crea el modal de comparación
 */
function crearModalComparacion() {
    const modal = document.createElement('div');
    modal.id = 'compareModal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden p-4';
    
    modal.innerHTML = `
        <div class="glass-card rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div class="flex justify-between items-center p-6 border-b border-white border-opacity-20">
                <h2 class="text-2xl font-bold text-white flex items-center">
                    <i class="fas fa-balance-scale mr-2"></i>
                    Comparación de Productos
                </h2>
                <button id="closeCompareModal" class="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition">
                    <i class="fas fa-times text-white text-xl"></i>
                </button>
            </div>
            
            <div id="compareTableContainer" class="p-6 overflow-auto max-h-[calc(90vh-120px)]"></div>
            
            <div class="p-6 border-t border-white border-opacity-20">
                <div id="compareRecommendation" class="mb-4"></div>
                <div class="flex flex-wrap gap-3">
                    <button onclick="agregarTodosAlCarrito()" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition">
                        <i class="fas fa-shopping-cart mr-2"></i>Agregar Todos al Carrito
                    </button>
                    <button onclick="limpiarListaComparacion(); document.getElementById('compareModal').classList.add('hidden')" 
                            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition">
                        <i class="fas fa-trash mr-2"></i>Limpiar Comparación
                    </button>
                    <button onclick="compartirComparacion()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                        <i class="fas fa-share mr-2"></i>Compartir
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Configurar eventos del modal
    const closeBtn = document.getElementById('closeCompareModal');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    }
    
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.add('hidden');
        }
    });
}

/**
 * Genera la tabla de comparación
 */
function generarTablaComparacion() {
    const container = document.getElementById('compareTableContainer');
    if (!container) return;
    
    const caracteristicas = [
        { key: 'imagen', label: 'Imagen', type: 'image' },
        { key: 'nombre', label: 'Producto', type: 'text' },
        { key: 'precio', label: 'Precio', type: 'price' },
        { key: 'categoria', label: 'Categoría', type: 'text' },
        { key: 'marca', label: 'Marca', type: 'text' },
        { key: 'rating', label: 'Rating', type: 'rating' },
        { key: 'descripcion', label: 'Descripción', type: 'text' },
        { key: 'sizes', label: 'Tallas Disponibles', type: 'sizes' },
        { key: 'color', label: 'Color', type: 'color' },
        { key: 'oferta', label: 'En Oferta', type: 'boolean' }
    ];
    
    let html = '<div class="overflow-x-auto">';
    html += '<table class="w-full border-collapse">';
    
    // Encabezados
    html += '<thead><tr class="border-b border-white border-opacity-20">';
    html += '<th class="text-left p-3 text-white font-semibold">Característica</th>';
    compareList.forEach(producto => {
        html += `<th class="text-center p-3 text-white font-semibold min-w-48">${producto.nombre}</th>`;
    });
    html += '</tr></thead>';
    
    // Filas de características
    html += '<tbody>';
    caracteristicas.forEach(caracteristica => {
        html += '<tr class="border-b border-white border-opacity-10 hover:bg-white hover:bg-opacity-5">';
        html += `<td class="p-3 text-gray-300 font-medium">${caracteristica.label}</td>`;
        
        // Obtener valores para esta característica
        const valores = compareList.map(producto => obtenerValorCaracteristica(producto, caracteristica));
        
        // Resaltar diferencias si hay más de un valor único
        const valoresUnicos = [...new Set(valores.map(v => JSON.stringify(v)))];
        const hayDiferencias = valoresUnicos.length > 1;
        
        compareList.forEach((producto, index) => {
            const valor = valores[index];
            const esMejor = esMejorValor(valor, valores, caracteristica.type);
            
            let cellClass = 'p-3 text-center text-white';
            if (hayDiferencias) {
                if (esMejor) {
                    cellClass += ' bg-green-600 bg-opacity-30 border-l-4 border-green-500';
                } else if (caracteristica.type === 'price' && valor === Math.max(...valores.filter(v => typeof v === 'number'))) {
                    cellClass += ' bg-red-600 bg-opacity-30 border-l-4 border-red-500';
                }
            }
            
            html += `<td class="${cellClass}">`;
            html += formatearValorCaracteristica(valor, caracteristica.type);
            html += '</td>';
        });
        
        html += '</tr>';
    });
    html += '</tbody></table></div>';
    
    container.innerHTML = html;
    
    // Generar recomendación
    generarRecomendacion();
}

/**
 * Obtiene el valor de una característica de un producto
 */
function obtenerValorCaracteristica(producto, caracteristica) {
    switch (caracteristica.key) {
        case 'sizes':
            return producto.sizes || [];
        case 'rating':
            return producto.rating || 0;
        case 'precio':
            return producto.precio;
        case 'oferta':
            return producto.oferta || false;
        default:
            return producto[caracteristica.key] || 'N/A';
    }
}

/**
 * Determina si un valor es mejor que otros
 */
function esMejorValor(valor, valores, tipo) {
    switch (tipo) {
        case 'price':
            return valor === Math.min(...valores.filter(v => typeof v === 'number'));
        case 'rating':
            return valor === Math.max(...valores.filter(v => typeof v === 'number'));
        case 'boolean':
            return valor === true;
        case 'sizes':
            return Array.isArray(valor) && valor.length === Math.max(...valores.map(v => Array.isArray(v) ? v.length : 0));
        default:
            return false;
    }
}

/**
 * Formatea el valor de una característica para mostrar
 */
function formatearValorCaracteristica(valor, tipo) {
    switch (tipo) {
        case 'image':
            return `<img src="${valor}" class="w-16 h-16 object-cover rounded mx-auto" onerror="this.src='https://via.placeholder.com/64x64/4F46E5/FFFFFF?text=📦'">`;
        case 'price':
            return `<span class="text-lg font-bold">$${typeof valor === 'number' ? valor.toFixed(2) : '0.00'}</span>`;
        case 'rating':
            if (typeof valor === 'number' && valor > 0) {
                const stars = Math.round(valor);
                let starsHtml = '';
                for (let i = 1; i <= 5; i++) {
                    starsHtml += `<i class="fas fa-star ${i <= stars ? 'text-yellow-400' : 'text-gray-600'}"></i>`;
                }
                return `<div class="flex justify-center">${starsHtml}</div><div class="text-sm mt-1">${valor.toFixed(1)}</div>`;
            }
            return '<span class="text-gray-500">Sin rating</span>';
        case 'sizes':
            if (Array.isArray(valor) && valor.length > 0) {
                return `<div class="flex flex-wrap gap-1 justify-center">${valor.slice(0, 4).map(size => 
                    `<span class="px-2 py-1 bg-indigo-600 text-xs rounded">${size}</span>`
                ).join('')}${valor.length > 4 ? '<span class="text-xs">...</span>' : ''}</div>`;
            }
            return '<span class="text-gray-500">No disponible</span>';
        case 'color':
            if (valor && valor !== 'N/A') {
                return `<div class="flex items-center justify-center"><div class="w-6 h-6 rounded-full border border-gray-400" style="background-color: ${valor}"></div></div>`;
            }
            return '<span class="text-gray-500">No especificado</span>';
        case 'boolean':
            return valor ? '<i class="fas fa-check text-green-400 text-xl"></i>' : '<i class="fas fa-times text-red-400 text-xl"></i>';
        default:
            return valor || '<span class="text-gray-500">No disponible</span>';
    }
}

/**
 * Genera recomendación automática
 */
function generarRecomendacion() {
    const container = document.getElementById('compareRecommendation');
    if (!container) return;
    
    // Calcular puntajes
    const puntajes = compareList.map((producto, index) => {
        let puntaje = 0;
        
        // Precio (más barato = mejor)
        const precios = compareList.map(p => p.precio);
        if (producto.precio === Math.min(...precios)) puntaje += 3;
        
        // Rating (más alto = mejor)
        const ratings = compareList.map(p => p.rating || 0);
        if (producto.rating === Math.max(...ratings)) puntaje += 2;
        
        // Oferta (sí = mejor)
        if (producto.oferta) puntaje += 1;
        
        // Tallas disponibles (más = mejor)
        const sizes = compareList.map(p => (p.sizes || []).length);
        if ((producto.sizes || []).length === Math.max(...sizes)) puntaje += 1;
        
        return { producto, puntaje, index };
    });
    
    // Ordenar por puntaje
    puntajes.sort((a, b) => b.puntaje - a.puntaje);
    
    const mejor = puntajes[0];
    const razones = [];
    
    if (mejor.producto.precio === Math.min(...compareList.map(p => p.precio))) {
        razones.push('mejor precio');
    }
    if (mejor.producto.rating === Math.max(...compareList.map(p => p.rating || 0))) {
        razones.push('mejor rating');
    }
    if (mejor.producto.oferta) {
        razones.push('en oferta');
    }
    
    container.innerHTML = `
        <div class="bg-green-600 bg-opacity-20 border border-green-500 rounded-lg p-4">
            <h3 class="text-lg font-bold text-green-400 mb-2">
                <i class="fas fa-trophy mr-2"></i>Mejor Valor: ${mejor.producto.nombre}
            </h3>
            <p class="text-green-300">
                Recomendado por: ${razones.length > 0 ? razones.join(', ') : 'características generales'}
            </p>
        </div>
    `;
}

/**
 * Agrega todos los productos comparados al carrito
 */
function agregarTodosAlCarrito() {
    if (compareList.length === 0) return;
    
    let agregados = 0;
    compareList.forEach(item => {
        if (typeof agregarAlCarrito === 'function') {
            agregarAlCarrito(item);
            agregados++;
        }
    });
    
    if (agregados > 0) {
        mostrarNotificacionComparacion(`${agregados} productos agregados al carrito`, 'success');
    }
}

/**
 * Comparte la comparación
 */
function compartirComparacion() {
    if (compareList.length === 0) return;
    
    let mensaje = '⚖️ Comparación de Productos\n\n';
    
    compareList.forEach((item, index) => {
        mensaje += `${index + 1}. ${item.nombre}\n`;
        mensaje += `   💰 $${item.precio.toFixed(2)}\n`;
        mensaje += `   ⭐ ${(item.rating || 0).toFixed(1)} estrellas\n`;
        mensaje += `   📱 ${item.categoria}\n\n`;
    });
    
    mensaje += `¡Visita nuestro catálogo! ${window.location.href}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Comparación de Productos',
            text: mensaje,
            url: window.location.href
        });
    } else {
        // Fallback a WhatsApp
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
        window.open(whatsappUrl, '_blank');
    }
    
    mostrarNotificacionComparacion('Comparación compartida', 'success');
}

/**
 * Encuentra un producto por ID (reutiliza función del wishlist)
 */
function encontrarProductoPorId(productId) {
    if (window.productosGlobales && window.productosGlobales.length > 0) {
        return window.productosGlobales.find(p => p.id === productId);
    }
    
    if (window.productosOriginales && window.productosOriginales.length > 0) {
        return window.productosOriginales.find(p => p.id === productId);
    }
    
    try {
        const productos = JSON.parse(localStorage.getItem('productos') || '[]');
        return productos.find(p => p.id === productId);
    } catch (error) {
        console.error('Error al buscar producto:', error);
        return null;
    }
}

/**
 * Muestra notificaciones del sistema de comparación
 */
function mostrarNotificacionComparacion(mensaje, tipo = 'success') {
    const notification = document.createElement('div');
    
    let bgColor, icon;
    switch (tipo) {
        case 'add':
            bgColor = 'bg-blue-500';
            icon = 'fas fa-balance-scale';
            break;
        case 'remove':
            bgColor = 'bg-gray-600';
            icon = 'fas fa-minus-circle';
            break;
        case 'error':
            bgColor = 'bg-red-500';
            icon = 'fas fa-exclamation-triangle';
            break;
        default:
            bgColor = 'bg-green-500';
            icon = 'fas fa-check-circle';
    }
    
    notification.className = `fixed top-4 right-4 px-4 py-3 ${bgColor} text-white rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300`;
    
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="${icon} mr-2"></i>
            <span class="text-sm font-medium">${mensaje}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animación de entrada
    setTimeout(() => notification.classList.remove('translate-x-full'), 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * Verifica si un producto está en comparación
 */
function enComparacion(productId) {
    return compareList.some(item => item.id === productId);
}

// Funciones para uso global
window.inicializarComparacion = inicializarComparacion;
window.toggleComparacion = toggleComparacion;
window.eliminarDeComparacion = eliminarDeComparacion;
window.agregarTodosAlCarrito = agregarTodosAlCarrito;
window.compartirComparacion = compartirComparacion;
window.enComparacion = enComparacion;