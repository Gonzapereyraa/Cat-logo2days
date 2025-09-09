/**
 * Sistema de Búsqueda Avanzada con Autocompletado y Sugerencias
 * Incluye historial de búsquedas y búsquedas populares
 */

// Variables globales para búsqueda
let searchHistory = [];
let popularSearches = ['smartphone', 'zapatillas nike', 'auriculares', 'camiseta', 'laptop'];
let searchSuggestions = [];

/**
 * Inicializa el sistema de búsqueda avanzada
 */
function inicializarBusquedaAvanzada() {
    console.log('🔍 Inicializando búsqueda avanzada');
    
    // Cargar historial de búsquedas
    cargarHistorialBusquedas();
    
    // Mejorar la barra de búsqueda existente
    mejorarBarraBusqueda();
    
    // Crear componente de sugerencias
    crearComponenteSugerencias();
    
    // Configurar eventos de búsqueda
    configurarEventosBusqueda();
    
    console.log('✅ Sistema de búsqueda avanzada inicializado');
}

/**
 * Mejora la barra de búsqueda existente
 */
function mejorarBarraBusqueda() {
    const searchInput = document.getElementById('advancedSearchInput') || document.getElementById('searchInput');
    if (!searchInput) {
        console.warn('⚠️ Barra de búsqueda no encontrada');
        return;
    }

    // Mejorar el placeholder
    searchInput.placeholder = '🔍 Buscar productos, marcas, categorías...';
    
    // Añadir clases para styling
    searchInput.classList.add('search-enhanced');
    
    // Crear contenedor de sugerencias
    const searchContainer = searchInput.parentElement;
    if (!searchContainer.querySelector('.search-suggestions')) {
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'search-suggestions absolute top-full left-0 right-0 bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg z-50 hidden max-h-80 overflow-y-auto';
        suggestionsContainer.id = 'searchSuggestions';
        searchContainer.style.position = 'relative';
        searchContainer.appendChild(suggestionsContainer);
    }
}

/**
 * Crea el componente de sugerencias de búsqueda
 */
function crearComponenteSugerencias() {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (!suggestionsContainer) return;

    // Función para mostrar sugerencias por defecto
    function mostrarSugerenciasPorDefecto() {
        const historialReciente = searchHistory.slice(-5).reverse();
        
        let html = '<div class="p-4 border-b border-gray-200">';
        
        // Búsquedas populares
        if (popularSearches.length > 0) {
            html += '<h4 class="text-sm font-semibold text-gray-700 mb-2"><i class="fas fa-fire text-orange-500 mr-1"></i>Búsquedas populares</h4>';
            html += '<div class="flex flex-wrap gap-2 mb-3">';
            popularSearches.forEach(search => {
                html += `
                    <button class="suggestion-pill px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-sm rounded-full transition"
                            data-search="${search}">
                        ${search}
                    </button>
                `;
            });
            html += '</div>';
        }

        // Historial reciente
        if (historialReciente.length > 0) {
            html += '<h4 class="text-sm font-semibold text-gray-700 mb-2"><i class="fas fa-history text-gray-500 mr-1"></i>Búsquedas recientes</h4>';
            html += '<div class="space-y-1">';
            historialReciente.forEach(search => {
                html += `
                    <div class="flex items-center justify-between hover:bg-gray-100 p-2 rounded cursor-pointer suggestion-item"
                         data-search="${search}">
                        <div class="flex items-center">
                            <i class="fas fa-history text-gray-400 mr-2"></i>
                            <span class="text-gray-700">${search}</span>
                        </div>
                        <button class="remove-history text-gray-400 hover:text-red-500 p-1" 
                                data-search="${search}" title="Eliminar del historial">
                            <i class="fas fa-times text-xs"></i>
                        </button>
                    </div>
                `;
            });
            html += '</div>';
        }

        html += '</div>';

        if (historialReciente.length === 0 && popularSearches.length === 0) {
            html = `
                <div class="p-4 text-center text-gray-500">
                    <i class="fas fa-search text-2xl mb-2"></i>
                    <p>Comienza a escribir para ver sugerencias</p>
                </div>
            `;
        }

        suggestionsContainer.innerHTML = html;
        configurarEventosSugerencias();
    }

    // Mostrar sugerencias por defecto inicialmente
    mostrarSugerenciasPorDefecto();
}

/**
 * Configura todos los eventos de búsqueda
 */
function configurarEventosBusqueda() {
    const searchInput = document.getElementById('advancedSearchInput') || document.getElementById('searchInput');
    const suggestionsContainer = document.getElementById('searchSuggestions');
    
    if (!searchInput || !suggestionsContainer) return;

    let searchTimeout;

    // Evento de input con debounce
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        const query = this.value.trim();
        
        if (query.length === 0) {
            mostrarSugerenciasPorDefecto();
            return;
        }

        searchTimeout = setTimeout(() => {
            buscarSugerencias(query);
        }, 200);
    });

    // Mostrar sugerencias al hacer focus
    searchInput.addEventListener('focus', function() {
        suggestionsContainer.classList.remove('hidden');
        if (this.value.trim().length === 0) {
            mostrarSugerenciasPorDefecto();
        }
    });

    // Ocultar sugerencias al perder focus (con delay para permitir clicks)
    searchInput.addEventListener('blur', function() {
        setTimeout(() => {
            suggestionsContainer.classList.add('hidden');
        }, 200);
    });

    // Navegación con teclado
    searchInput.addEventListener('keydown', function(e) {
        const items = suggestionsContainer.querySelectorAll('.suggestion-item, .suggestion-pill');
        const selectedItem = suggestionsContainer.querySelector('.suggestion-selected');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            navegarSugerencias(items, 'down');
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            navegarSugerencias(items, 'up');
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedItem) {
                seleccionarSugerencia(selectedItem.dataset.search);
            } else if (this.value.trim()) {
                ejecutarBusqueda(this.value.trim());
            }
        } else if (e.key === 'Escape') {
            suggestionsContainer.classList.add('hidden');
            this.blur();
        }
    });
}

/**
 * Busca sugerencias basadas en la query
 */
function buscarSugerencias(query) {
    const productos = productosGlobales || [];
    const queryLower = query.toLowerCase();
    
    // Buscar coincidencias en productos
    const coincidenciasProductos = productos.filter(producto => {
        return producto.nombre.toLowerCase().includes(queryLower) ||
               producto.descripcion.toLowerCase().includes(queryLower) ||
               producto.marca.toLowerCase().includes(queryLower) ||
               producto.categoria.toLowerCase().includes(queryLower) ||
               (producto.tags && producto.tags.some(tag => tag.toLowerCase().includes(queryLower)));
    }).slice(0, 6);

    // Buscar coincidencias en historial
    const coincidenciasHistorial = searchHistory.filter(search => 
        search.toLowerCase().includes(queryLower)
    ).slice(0, 3);

    // Sugerencias de categorías
    const categorias = [...new Set(productos.map(p => p.categoria))];
    const coincidenciasCategorias = categorias.filter(categoria => 
        categoria.toLowerCase().includes(queryLower)
    ).slice(0, 3);

    // Sugerencias de marcas
    const marcas = [...new Set(productos.map(p => p.marca))];
    const coincidenciasMarcas = marcas.filter(marca => 
        marca.toLowerCase().includes(queryLower)
    ).slice(0, 3);

    mostrarResultadosSugerencias(query, {
        productos: coincidenciasProductos,
        historial: coincidenciasHistorial,
        categorias: coincidenciasCategorias,
        marcas: coincidenciasMarcas
    });
}

/**
 * Muestra los resultados de sugerencias
 */
function mostrarResultadosSugerencias(query, resultados) {
    const suggestionsContainer = document.getElementById('searchSugerencias');
    if (!suggestionsContainer) return;

    let html = '';

    // Productos encontrados
    if (resultados.productos.length > 0) {
        html += '<div class="p-3 border-b border-gray-200">';
        html += '<h4 class="text-sm font-semibold text-gray-700 mb-2"><i class="fas fa-box text-indigo-500 mr-1"></i>Productos</h4>';
        resultados.productos.forEach(producto => {
            html += `
                <div class="suggestion-item flex items-center space-x-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
                     data-search="${producto.nombre}" data-type="product" data-id="${producto.id}">
                    <img src="${producto.imagen}" alt="${producto.nombre}" 
                         class="w-8 h-8 object-cover rounded" 
                         onerror="this.src='https://via.placeholder.com/32x32/4F46E5/FFFFFF?text=📦'">
                    <div class="flex-1 min-w-0">
                        <div class="text-sm font-medium text-gray-900 truncate">${resaltarTexto(producto.nombre, query)}</div>
                        <div class="text-xs text-gray-500">${producto.categoria} • $${producto.precio}</div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
    }

    // Categorías
    if (resultados.categorias.length > 0) {
        html += '<div class="p-3 border-b border-gray-200">';
        html += '<h4 class="text-sm font-semibold text-gray-700 mb-2"><i class="fas fa-tags text-green-500 mr-1"></i>Categorías</h4>';
        resultados.categorias.forEach(categoria => {
            html += `
                <div class="suggestion-item flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                     data-search="${categoria}" data-type="category">
                    <i class="fas fa-folder text-green-500 mr-2"></i>
                    <span class="text-gray-700">${resaltarTexto(categoria, query)}</span>
                </div>
            `;
        });
        html += '</div>';
    }

    // Marcas
    if (resultados.marcas.length > 0) {
        html += '<div class="p-3 border-b border-gray-200">';
        html += '<h4 class="text-sm font-semibold text-gray-700 mb-2"><i class="fas fa-star text-yellow-500 mr-1"></i>Marcas</h4>';
        resultados.marcas.forEach(marca => {
            html += `
                <div class="suggestion-item flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                     data-search="${marca}" data-type="brand">
                    <i class="fas fa-award text-yellow-500 mr-2"></i>
                    <span class="text-gray-700">${resaltarTexto(marca, query)}</span>
                </div>
            `;
        });
        html += '</div>';
    }

    // Historial relevante
    if (resultados.historial.length > 0) {
        html += '<div class="p-3">';
        html += '<h4 class="text-sm font-semibold text-gray-700 mb-2"><i class="fas fa-history text-gray-500 mr-1"></i>Búsquedas anteriores</h4>';
        resultados.historial.forEach(search => {
            html += `
                <div class="suggestion-item flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                     data-search="${search}" data-type="history">
                    <i class="fas fa-history text-gray-400 mr-2"></i>
                    <span class="text-gray-700">${resaltarTexto(search, query)}</span>
                </div>
            `;
        });
        html += '</div>';
    }

    if (!html) {
        html = `
            <div class="p-4 text-center text-gray-500">
                <i class="fas fa-search text-2xl mb-2"></i>
                <p>No se encontraron sugerencias para "${query}"</p>
                <button class="mt-2 px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition"
                        onclick="ejecutarBusqueda('${query}')">
                    Buscar de todos modos
                </button>
            </div>
        `;
    }

    suggestionsContainer.innerHTML = html;
    configurarEventosSugerencias();
}

/**
 * Configura eventos de las sugerencias
 */
function configurarEventosSugerencias() {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (!suggestionsContainer) return;

    // Eventos de click en sugerencias
    suggestionsContainer.addEventListener('click', function(e) {
        const item = e.target.closest('.suggestion-item, .suggestion-pill');
        const removeBtn = e.target.closest('.remove-history');
        
        if (removeBtn) {
            e.stopPropagation();
            const searchTerm = removeBtn.dataset.search;
            eliminarDelHistorial(searchTerm);
        } else if (item) {
            const search = item.dataset.search;
            const type = item.dataset.type;
            const id = item.dataset.id;
            
            if (type === 'product' && id) {
                verProducto(parseInt(id));
            } else {
                seleccionarSugerencia(search);
            }
        }
    });

    // Hover effects
    const items = suggestionsContainer.querySelectorAll('.suggestion-item, .suggestion-pill');
    items.forEach(item => {
        item.addEventListener('mouseenter', function() {
            // Remover selección anterior
            suggestionsContainer.querySelector('.suggestion-selected')?.classList.remove('suggestion-selected');
            // Agregar selección actual
            this.classList.add('suggestion-selected', 'bg-gray-100');
        });
        
        item.addEventListener('mouseleave', function() {
            this.classList.remove('suggestion-selected', 'bg-gray-100');
        });
    });
}

/**
 * Navegación con teclado en sugerencias
 */
function navegarSugerencias(items, direction) {
    const currentSelected = document.querySelector('.suggestion-selected');
    let newIndex = 0;
    
    if (currentSelected) {
        const currentIndex = Array.from(items).indexOf(currentSelected);
        newIndex = direction === 'down' 
            ? (currentIndex + 1) % items.length 
            : (currentIndex - 1 + items.length) % items.length;
    }
    
    // Remover selección anterior
    document.querySelector('.suggestion-selected')?.classList.remove('suggestion-selected', 'bg-gray-100');
    
    // Seleccionar nuevo item
    if (items[newIndex]) {
        items[newIndex].classList.add('suggestion-selected', 'bg-gray-100');
        items[newIndex].scrollIntoView({ block: 'nearest' });
    }
}

/**
 * Selecciona una sugerencia y ejecuta la búsqueda
 */
function seleccionarSugerencia(searchTerm) {
    const searchInput = document.getElementById('advancedSearchInput') || document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = searchTerm;
    }
    ejecutarBusqueda(searchTerm);
}

/**
 * Ejecuta una búsqueda y la guarda en el historial
 */
function ejecutarBusqueda(query) {
    if (!query || query.trim().length === 0) return;
    
    const searchTerm = query.trim();
    
    // Agregar al historial
    agregarAlHistorial(searchTerm);
    
    // Actualizar popularidad (simulado)
    actualizarPopularidad(searchTerm);
    
    // Ocultar sugerencias
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (suggestionsContainer) {
        suggestionsContainer.classList.add('hidden');
    }
    
    // Ejecutar filtro si existe
    if (typeof aplicarFiltros === 'function') {
        aplicarFiltros();
    }
    
    console.log('🔍 Búsqueda ejecutada:', searchTerm);
}

/**
 * Agrega un término al historial de búsquedas
 */
function agregarAlHistorial(searchTerm) {
    // Remover si ya existe
    const index = searchHistory.indexOf(searchTerm);
    if (index > -1) {
        searchHistory.splice(index, 1);
    }
    
    // Agregar al inicio
    searchHistory.unshift(searchTerm);
    
    // Limitar a 20 búsquedas
    if (searchHistory.length > 20) {
        searchHistory = searchHistory.slice(0, 20);
    }
    
    // Guardar en localStorage
    guardarHistorialBusquedas();
}

/**
 * Elimina un término del historial
 */
function eliminarDelHistorial(searchTerm) {
    const index = searchHistory.indexOf(searchTerm);
    if (index > -1) {
        searchHistory.splice(index, 1);
        guardarHistorialBusquedas();
        mostrarSugerenciasPorDefecto();
    }
}

/**
 * Actualiza la popularidad de búsquedas (simulado)
 */
function actualizarPopularidad(searchTerm) {
    // En un sistema real, esto se enviaría a un servidor
    // Por ahora, simplemente movemos el término al inicio si ya existe
    const index = popularSearches.indexOf(searchTerm);
    if (index > -1) {
        popularSearches.splice(index, 1);
        popularSearches.unshift(searchTerm);
    } else if (popularSearches.length < 10) {
        popularSearches.push(searchTerm);
    }
}

/**
 * Carga el historial de búsquedas desde localStorage
 */
function cargarHistorialBusquedas() {
    try {
        const saved = localStorage.getItem('searchHistory');
        if (saved) {
            searchHistory = JSON.parse(saved);
        }
    } catch (error) {
        console.error('❌ Error al cargar historial de búsquedas:', error);
        searchHistory = [];
    }
}

/**
 * Guarda el historial de búsquedas en localStorage
 */
function guardarHistorialBusquedas() {
    try {
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    } catch (error) {
        console.error('❌ Error al guardar historial de búsquedas:', error);
    }
}

/**
 * Resalta texto en resultados de búsqueda
 */
function resaltarTexto(texto, query) {
    if (!query) return texto;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return texto.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
}

/**
 * Muestra sugerencias por defecto cuando el input está vacío
 */
function mostrarSugerenciasPorDefecto() {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (!suggestionsContainer) return;

    const historialReciente = searchHistory.slice(-5).reverse();
    
    let html = '<div class="p-4">';
    
    // Búsquedas populares
    if (popularSearches.length > 0) {
        html += '<h4 class="text-sm font-semibold text-gray-700 mb-2"><i class="fas fa-fire text-orange-500 mr-1"></i>Búsquedas populares</h4>';
        html += '<div class="flex flex-wrap gap-2 mb-4">';
        popularSearches.slice(0, 8).forEach(search => {
            html += `
                <button class="suggestion-pill px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-sm rounded-full transition"
                        data-search="${search}">
                    ${search}
                </button>
            `;
        });
        html += '</div>';
    }

    // Historial reciente
    if (historialReciente.length > 0) {
        html += '<div class="border-t border-gray-200 pt-3">';
        html += '<h4 class="text-sm font-semibold text-gray-700 mb-2"><i class="fas fa-history text-gray-500 mr-1"></i>Búsquedas recientes</h4>';
        html += '<div class="space-y-1">';
        historialReciente.forEach(search => {
            html += `
                <div class="suggestion-item flex items-center justify-between hover:bg-gray-100 p-2 rounded cursor-pointer"
                     data-search="${search}">
                    <div class="flex items-center">
                        <i class="fas fa-history text-gray-400 mr-2"></i>
                        <span class="text-gray-700">${search}</span>
                    </div>
                    <button class="remove-history text-gray-400 hover:text-red-500 p-1" 
                            data-search="${search}" title="Eliminar del historial">
                        <i class="fas fa-times text-xs"></i>
                    </button>
                </div>
            `;
        });
        html += '</div></div>';
    }

    html += '</div>';

    if (historialReciente.length === 0 && popularSearches.length === 0) {
        html = `
            <div class="p-6 text-center text-gray-500">
                <i class="fas fa-search text-3xl mb-3 text-gray-300"></i>
                <p class="font-medium">Comienza a escribir para buscar</p>
                <p class="text-sm mt-1">Encuentra productos, marcas y categorías</p>
            </div>
        `;
    }

    suggestionsContainer.innerHTML = html;
    configurarEventosSugerencias();
}

/**
 * Limpia el historial de búsquedas
 */
function limpiarHistorialBusquedas() {
    if (confirm('¿Estás seguro de que quieres limpiar todo el historial de búsquedas?')) {
        searchHistory = [];
        guardarHistorialBusquedas();
        mostrarSugerenciasPorDefecto();
    }
}

// Funciones auxiliares para placeholder (se implementarán en otros módulos)
function verProducto(productId) {
    console.log('Ver producto:', productId);
    // Esta función se implementará en el módulo de páginas de producto
}

// Exportar funciones para uso global
window.inicializarBusquedaAvanzada = inicializarBusquedaAvanzada;
window.ejecutarBusqueda = ejecutarBusqueda;
window.limpiarHistorialBusquedas = limpiarHistorialBusquedas;