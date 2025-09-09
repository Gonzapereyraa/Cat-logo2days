/**
 * Sistema de Filtros Avanzado para Catálogo
 * Gestiona filtros por categoría, precio, talla, marca, color, descuento y rating
 */

// Variables globales para filtros
let filtrosActivos = {
    categoria: [],
    precio: { min: 0, max: Infinity },
    talla: [],
    marca: [],
    color: [],
    descuento: false,
    rating: 0
};

let productosOriginales = [];
let productosFiltrados = [];

/**
 * Inicializa el sistema de filtros
 */
function inicializarFiltros(productos) {
    productosOriginales = productos;
    productosFiltrados = [...productos];
    
    // Crear el sidebar de filtros
    crearSidebarFiltros();
    
    // Configurar eventos
    configurarEventosFiltros();
    
    // Mostrar productos iniciales
    mostrarProductosFiltrados();
    
    // Actualizar contadores
    actualizarContadorResultados();
    
    console.log('🔍 Sistema de filtros inicializado');
}

/**
 * Crea la estructura HTML del sidebar de filtros
 */
function crearSidebarFiltros() {
    const filtersContainer = document.getElementById('filtersContainer');
    if (!filtersContainer) return;

    // Crear el nuevo layout con sidebar
    const newFilterLayout = `
        <div class="flex flex-col lg:flex-row gap-6">
            <!-- Sidebar de Filtros -->
            <div id="filtersSidebar" class="lg:w-1/4 w-full">
                <div class="glass-card p-4 rounded-lg sticky top-4">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-bold text-white flex items-center">
                            <i class="fas fa-filter mr-2"></i>Filtros
                        </h3>
                        <button id="toggleFiltersSidebar" class="lg:hidden p-2 hover:bg-white hover:bg-opacity-20 rounded">
                            <i class="fas fa-chevron-down"></i>
                        </button>
                    </div>
                    
                    <div id="filtersContent" class="space-y-4">
                        <!-- Búsqueda -->
                        <div class="filter-group">
                            <label class="block text-sm font-medium text-gray-300 mb-2">Buscar</label>
                            <div class="relative">
                                <input type="text" id="advancedSearchInput" 
                                       placeholder="Buscar productos..." 
                                       class="w-full px-3 py-2 pl-8 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <i class="fas fa-search absolute left-2 top-3 text-gray-300 text-sm"></i>
                            </div>
                        </div>

                        <!-- Filtro por Categoría -->
                        <div class="filter-group">
                            <h4 class="text-sm font-medium text-gray-300 mb-2">Categoría</h4>
                            <div id="categoryFilters" class="space-y-2">
                                <!-- Se llena dinámicamente -->
                            </div>
                        </div>

                        <!-- Filtro por Precio -->
                        <div class="filter-group">
                            <h4 class="text-sm font-medium text-gray-300 mb-2">Precio</h4>
                            <div class="space-y-2">
                                <div class="flex gap-2">
                                    <input type="number" id="priceMin" placeholder="Min" 
                                           class="w-1/2 px-2 py-1 text-sm rounded bg-white bg-opacity-20 border border-white border-opacity-30 text-white placeholder-gray-300">
                                    <input type="number" id="priceMax" placeholder="Max" 
                                           class="w-1/2 px-2 py-1 text-sm rounded bg-white bg-opacity-20 border border-white border-opacity-30 text-white placeholder-gray-300">
                                </div>
                                <div id="priceRanges" class="space-y-1">
                                    <label class="flex items-center text-sm">
                                        <input type="radio" name="priceRange" value="0-50" class="mr-2">
                                        <span class="text-gray-300">$0 - $50</span>
                                    </label>
                                    <label class="flex items-center text-sm">
                                        <input type="radio" name="priceRange" value="50-100" class="mr-2">
                                        <span class="text-gray-300">$50 - $100</span>
                                    </label>
                                    <label class="flex items-center text-sm">
                                        <input type="radio" name="priceRange" value="100-200" class="mr-2">
                                        <span class="text-gray-300">$100 - $200</span>
                                    </label>
                                    <label class="flex items-center text-sm">
                                        <input type="radio" name="priceRange" value="200+" class="mr-2">
                                        <span class="text-gray-300">$200+</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- Filtro por Talla -->
                        <div class="filter-group">
                            <h4 class="text-sm font-medium text-gray-300 mb-2">Talla</h4>
                            <div id="sizeFilters" class="flex flex-wrap gap-2">
                                <!-- Se llena dinámicamente -->
                            </div>
                        </div>

                        <!-- Filtro por Marca -->
                        <div class="filter-group">
                            <h4 class="text-sm font-medium text-gray-300 mb-2">Marca</h4>
                            <div id="brandFilters" class="space-y-2">
                                <!-- Se llena dinámicamente -->
                            </div>
                        </div>

                        <!-- Filtro por Color -->
                        <div class="filter-group">
                            <h4 class="text-sm font-medium text-gray-300 mb-2">Color</h4>
                            <div id="colorFilters" class="flex flex-wrap gap-2">
                                <!-- Se llena dinámicamente -->
                            </div>
                        </div>

                        <!-- Filtro por Descuento -->
                        <div class="filter-group">
                            <label class="flex items-center text-sm">
                                <input type="checkbox" id="discountFilter" class="mr-2">
                                <span class="text-gray-300">Solo productos en oferta</span>
                            </label>
                        </div>

                        <!-- Filtro por Rating -->
                        <div class="filter-group">
                            <h4 class="text-sm font-medium text-gray-300 mb-2">Rating mínimo</h4>
                            <div id="ratingFilters" class="space-y-1">
                                <label class="flex items-center text-sm">
                                    <input type="radio" name="rating" value="4" class="mr-2">
                                    <span class="text-gray-300">4+ estrellas</span>
                                    <div class="ml-1 text-yellow-400">★★★★☆</div>
                                </label>
                                <label class="flex items-center text-sm">
                                    <input type="radio" name="rating" value="3" class="mr-2">
                                    <span class="text-gray-300">3+ estrellas</span>
                                    <div class="ml-1 text-yellow-400">★★★☆☆</div>
                                </label>
                                <label class="flex items-center text-sm">
                                    <input type="radio" name="rating" value="0" class="mr-2" checked>
                                    <span class="text-gray-300">Todas</span>
                                </label>
                            </div>
                        </div>

                        <!-- Botones de acción -->
                        <div class="pt-4 border-t border-white border-opacity-20">
                            <button id="clearFilters" 
                                    class="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition">
                                <i class="fas fa-times mr-2"></i>Limpiar Filtros
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Área de productos -->
            <div class="lg:w-3/4 w-full">
                <!-- Contador de resultados y ordenamiento -->
                <div class="glass-card p-4 rounded-lg mb-4">
                    <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div id="resultsCounter" class="text-sm text-gray-300">
                            <span id="resultsCount">0</span> productos encontrados
                        </div>
                        <div class="flex gap-4">
                            <select id="sortSelect" class="px-3 py-2 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="">Ordenar por</option>
                                <option value="priceAsc">Precio: Menor a Mayor</option>
                                <option value="priceDesc">Precio: Mayor a Menor</option>
                                <option value="nameAsc">Nombre: A-Z</option>
                                <option value="nameDesc">Nombre: Z-A</option>
                                <option value="ratingDesc">Rating: Mayor a Menor</option>
                                <option value="recent">Más Recientes</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <!-- Grid de productos -->
                <div id="filteredProductsGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                    <!-- Los productos se cargan dinámicamente -->
                </div>
            </div>
        </div>
    `;

    filtersContainer.innerHTML = newFilterLayout;
    
    // Llenar filtros dinámicamente
    llenarFiltrosDinamicos();
}

/**
 * Llena los filtros con los valores únicos de los productos
 */
function llenarFiltrosDinamicos() {
    llenarFiltroCategorias();
    llenarFiltroMarcas();
    llenarFiltroTallas();
    llenarFiltroColores();
}

/**
 * Llena el filtro de categorías
 */
function llenarFiltroCategorias() {
    const categoryFilters = document.getElementById('categoryFilters');
    if (!categoryFilters) return;

    const categorias = [...new Set(productosOriginales.map(p => p.categoria))];
    
    categoryFilters.innerHTML = categorias.map(categoria => `
        <label class="flex items-center text-sm">
            <input type="checkbox" value="${categoria}" class="category-filter mr-2">
            <span class="text-gray-300">${categoria}</span>
            <span class="ml-auto text-xs text-gray-400">(${productosOriginales.filter(p => p.categoria === categoria).length})</span>
        </label>
    `).join('');
}

/**
 * Llena el filtro de marcas
 */
function llenarFiltroMarcas() {
    const brandFilters = document.getElementById('brandFilters');
    if (!brandFilters) return;

    const marcas = [...new Set(productosOriginales.map(p => p.marca))];
    
    brandFilters.innerHTML = marcas.map(marca => `
        <label class="flex items-center text-sm">
            <input type="checkbox" value="${marca}" class="brand-filter mr-2">
            <span class="text-gray-300">${marca}</span>
            <span class="ml-auto text-xs text-gray-400">(${productosOriginales.filter(p => p.marca === marca).length})</span>
        </label>
    `).join('');
}

/**
 * Llena el filtro de tallas
 */
function llenarFiltroTallas() {
    const sizeFilters = document.getElementById('sizeFilters');
    if (!sizeFilters) return;

    const tallas = [...new Set(productosOriginales.flatMap(p => p.sizes || []))];
    
    sizeFilters.innerHTML = tallas.map(talla => `
        <button class="size-filter-btn px-3 py-1 text-xs rounded border border-white border-opacity-30 text-gray-300 hover:bg-white hover:bg-opacity-20 transition" 
                data-size="${talla}">
            ${talla}
        </button>
    `).join('');
}

/**
 * Llena el filtro de colores
 */
function llenarFiltroColores() {
    const colorFilters = document.getElementById('colorFilters');
    if (!colorFilters) return;

    const colores = [...new Set(productosOriginales.map(p => p.color).filter(Boolean))];
    
    colorFilters.innerHTML = colores.map(color => `
        <button class="color-filter-btn w-8 h-8 rounded-full border-2 border-white border-opacity-30 hover:border-opacity-60 transition" 
                style="background-color: ${color}" 
                data-color="${color}"
                title="Color ${color}">
        </button>
    `).join('');
}

/**
 * Configura todos los eventos de los filtros
 */
function configurarEventosFiltros() {
    // Toggle sidebar en móvil
    const toggleBtn = document.getElementById('toggleFiltersSidebar');
    const filtersContent = document.getElementById('filtersContent');
    
    if (toggleBtn && filtersContent) {
        toggleBtn.addEventListener('click', () => {
            filtersContent.classList.toggle('hidden');
            const icon = toggleBtn.querySelector('i');
            icon.classList.toggle('fa-chevron-down');
            icon.classList.toggle('fa-chevron-up');
        });
    }

    // Búsqueda avanzada
    const searchInput = document.getElementById('advancedSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(aplicarFiltros, 300));
    }

    // Filtros de categoría
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('category-filter')) {
            aplicarFiltros();
        }
    });

    // Filtros de precio
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    
    if (priceMin) priceMin.addEventListener('input', debounce(aplicarFiltros, 500));
    if (priceMax) priceMax.addEventListener('input', debounce(aplicarFiltros, 500));
    
    // Rangos de precio predefinidos
    document.addEventListener('change', (e) => {
        if (e.target.name === 'priceRange') {
            const value = e.target.value;
            const priceMin = document.getElementById('priceMin');
            const priceMax = document.getElementById('priceMax');
            
            if (value === '0-50') {
                priceMin.value = '0';
                priceMax.value = '50';
            } else if (value === '50-100') {
                priceMin.value = '50';
                priceMax.value = '100';
            } else if (value === '100-200') {
                priceMin.value = '100';
                priceMax.value = '200';
            } else if (value === '200+') {
                priceMin.value = '200';
                priceMax.value = '';
            }
            
            aplicarFiltros();
        }
    });

    // Filtros de marca
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('brand-filter')) {
            aplicarFiltros();
        }
    });

    // Filtros de talla
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('size-filter-btn')) {
            e.target.classList.toggle('bg-indigo-600');
            e.target.classList.toggle('text-white');
            aplicarFiltros();
        }
    });

    // Filtros de color
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('color-filter-btn')) {
            e.target.classList.toggle('ring-2');
            e.target.classList.toggle('ring-indigo-500');
            aplicarFiltros();
        }
    });

    // Filtro de descuento
    const discountFilter = document.getElementById('discountFilter');
    if (discountFilter) {
        discountFilter.addEventListener('change', aplicarFiltros);
    }

    // Filtros de rating
    document.addEventListener('change', (e) => {
        if (e.target.name === 'rating') {
            aplicarFiltros();
        }
    });

    // Limpiar filtros
    const clearFilters = document.getElementById('clearFilters');
    if (clearFilters) {
        clearFilters.addEventListener('click', limpiarFiltros);
    }

    // Ordenamiento
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', aplicarOrdenamiento);
    }
}

/**
 * Aplica todos los filtros activos
 */
function aplicarFiltros() {
    // Recopilar filtros activos
    recopilarFiltrosActivos();
    
    // Aplicar filtros
    productosFiltrados = productosOriginales.filter(producto => {
        return cumpleFiltros(producto, filtrosActivos);
    });
    
    // Aplicar ordenamiento si hay uno seleccionado
    aplicarOrdenamiento();
    
    // Actualizar la vista
    mostrarProductosFiltrados();
    actualizarContadorResultados();
}

/**
 * Recopila todos los filtros activos del DOM
 */
function recopilarFiltrosActivos() {
    // Búsqueda por texto
    const searchInput = document.getElementById('advancedSearchInput');
    filtrosActivos.busqueda = searchInput ? searchInput.value.toLowerCase() : '';
    
    // Categorías
    const categoriesChecked = document.querySelectorAll('.category-filter:checked');
    filtrosActivos.categoria = Array.from(categoriesChecked).map(cb => cb.value);
    
    // Precio
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    filtrosActivos.precio.min = priceMin && priceMin.value ? parseFloat(priceMin.value) : 0;
    filtrosActivos.precio.max = priceMax && priceMax.value ? parseFloat(priceMax.value) : Infinity;
    
    // Marcas
    const brandsChecked = document.querySelectorAll('.brand-filter:checked');
    filtrosActivos.marca = Array.from(brandsChecked).map(cb => cb.value);
    
    // Tallas
    const sizesSelected = document.querySelectorAll('.size-filter-btn.bg-indigo-600');
    filtrosActivos.talla = Array.from(sizesSelected).map(btn => btn.dataset.size);
    
    // Colores
    const colorsSelected = document.querySelectorAll('.color-filter-btn.ring-2');
    filtrosActivos.color = Array.from(colorsSelected).map(btn => btn.dataset.color);
    
    // Descuento
    const discountFilter = document.getElementById('discountFilter');
    filtrosActivos.descuento = discountFilter ? discountFilter.checked : false;
    
    // Rating
    const ratingSelected = document.querySelector('input[name="rating"]:checked');
    filtrosActivos.rating = ratingSelected ? parseFloat(ratingSelected.value) : 0;
}

/**
 * Verifica si un producto cumple con todos los filtros activos
 */
function cumpleFiltros(producto, filtros) {
    // Filtro de búsqueda por texto
    if (filtros.busqueda && filtros.busqueda.length > 0) {
        const searchText = filtros.busqueda.toLowerCase();
        const productText = `${producto.nombre} ${producto.descripcion} ${producto.marca} ${(producto.tags || []).join(' ')}`.toLowerCase();
        if (!productText.includes(searchText)) {
            return false;
        }
    }
    
    // Filtro de categoría
    if (filtros.categoria.length > 0 && !filtros.categoria.includes(producto.categoria)) {
        return false;
    }
    
    // Filtro de precio
    if (producto.precio < filtros.precio.min || producto.precio > filtros.precio.max) {
        return false;
    }
    
    // Filtro de marca
    if (filtros.marca.length > 0 && !filtros.marca.includes(producto.marca)) {
        return false;
    }
    
    // Filtro de talla
    if (filtros.talla.length > 0) {
        const productSizes = producto.sizes || [];
        if (!filtros.talla.some(talla => productSizes.includes(talla))) {
            return false;
        }
    }
    
    // Filtro de color
    if (filtros.color.length > 0 && !filtros.color.includes(producto.color)) {
        return false;
    }
    
    // Filtro de descuento
    if (filtros.descuento && !producto.oferta) {
        return false;
    }
    
    // Filtro de rating
    if (filtros.rating > 0 && (producto.rating || 0) < filtros.rating) {
        return false;
    }
    
    return true;
}

/**
 * Aplica el ordenamiento seleccionado
 */
function aplicarOrdenamiento() {
    const sortSelect = document.getElementById('sortSelect');
    if (!sortSelect) return;
    
    const sortValue = sortSelect.value;
    
    switch (sortValue) {
        case 'priceAsc':
            productosFiltrados.sort((a, b) => a.precio - b.precio);
            break;
        case 'priceDesc':
            productosFiltrados.sort((a, b) => b.precio - a.precio);
            break;
        case 'nameAsc':
            productosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
            break;
        case 'nameDesc':
            productosFiltrados.sort((a, b) => b.nombre.localeCompare(a.nombre));
            break;
        case 'ratingDesc':
            productosFiltrados.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
        case 'recent':
            productosFiltrados.sort((a, b) => b.id - a.id);
            break;
    }
    
    mostrarProductosFiltrados();
}

/**
 * Muestra los productos filtrados en el grid
 */
function mostrarProductosFiltrados() {
    // Intentar usar el grid de filtros avanzado primero, luego el contenedor original
    let grid = document.getElementById('filteredProductsGrid');
    if (!grid) {
        grid = document.getElementById('productsContainer');
    }
    if (!grid) return;
    
    if (productosFiltrados.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <div class="glass-card p-8 rounded-lg">
                    <i class="fas fa-search text-4xl text-gray-400 mb-4"></i>
                    <h3 class="text-xl font-semibold text-gray-300 mb-2">No se encontraron productos</h3>
                    <p class="text-gray-400 mb-4">Intenta ajustar los filtros para encontrar más productos.</p>
                    <button onclick="limpiarFiltros()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition">
                        Limpiar Filtros
                    </button>
                </div>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = productosFiltrados.map(producto => crearTarjetaProductoFiltrado(producto)).join('');
}

/**
 * Crea la tarjeta HTML de un producto para el sistema de filtros
 */
function crearTarjetaProductoFiltrado(producto) {
    const estrellas = generarEstrellas(producto.rating || 0);
    const totalReviews = producto.totalReviews || 0;
    
    return `
        <div class="glass-card p-4 rounded-lg hover:transform hover:scale-105 transition-all duration-200 relative fade-in" data-id="${producto.id}">
            ${producto.oferta ? '<div class="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10">Oferta</div>' : ''}
            
            <div class="relative mb-4 group">
                <img src="${producto.imagen}" 
                     alt="${producto.nombre}" 
                     class="w-full h-48 object-cover rounded-lg"
                     onerror="this.src='https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=${encodeURIComponent(producto.nombre)}'">
                
                <!-- Botones de acción overlay -->
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div class="flex gap-2">
                        <button onclick="toggleFavorito(${producto.id})" 
                                class="p-2 bg-white bg-opacity-20 hover:bg-opacity-40 rounded-full transition"
                                title="Agregar a favoritos">
                            <i class="fas fa-heart text-white"></i>
                        </button>
                        <button onclick="toggleComparacion(${producto.id})" 
                                class="p-2 bg-white bg-opacity-20 hover:bg-opacity-40 rounded-full transition"
                                title="Comparar">
                            <i class="fas fa-balance-scale text-white"></i>
                        </button>
                        <button onclick="verProducto(${producto.id})" 
                                class="p-2 bg-white bg-opacity-20 hover:bg-opacity-40 rounded-full transition"
                                title="Ver reseñas y detalles">
                            <i class="fas fa-eye text-white"></i>
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="space-y-2">
                <div class="flex items-center justify-between">
                    <span class="text-xs text-indigo-400 font-medium">${producto.marca || 'Sin marca'}</span>
                    <div class="flex items-center cursor-pointer" onclick="verProducto(${producto.id})" title="Ver reseñas">
                        ${estrellas}
                        <span class="text-xs text-gray-400 ml-1">(${totalReviews > 0 ? totalReviews : 'Sin reseñas'})</span>
                    </div>
                </div>
                
                <h3 class="text-lg font-semibold text-white leading-tight">${producto.nombre}</h3>
                <p class="text-sm text-gray-400 line-clamp-2">${producto.descripcion}</p>
                
                ${producto.sizes && producto.sizes.length > 0 ? `
                    <div class="flex items-center text-xs text-gray-400">
                        <i class="fas fa-ruler mr-1"></i>
                        <span>Tallas: ${producto.sizes.slice(0, 3).join(', ')}${producto.sizes.length > 3 ? '...' : ''}</span>
                    </div>
                ` : ''}
                
                ${producto.color ? `
                    <div class="flex items-center text-xs text-gray-400">
                        <i class="fas fa-palette mr-1"></i>
                        <div class="w-4 h-4 rounded-full border border-gray-500 ml-1" style="background-color: ${producto.color}"></div>
                    </div>
                ` : ''}
                
                <div class="flex items-center justify-between pt-2">
                    <div class="text-xl font-bold text-white">$${producto.precio.toFixed(2)}</div>
                    <div class="flex space-x-2">
                        <button onclick="verProducto(${producto.id})" 
                                class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition"
                                title="Ver detalles y reseñas">
                            <i class="fas fa-info-circle mr-1"></i>Ver
                        </button>
                        <button onclick="agregarAlCarritoRapido(${producto.id})" 
                                class="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition">
                            <i class="fas fa-shopping-cart mr-1"></i>Agregar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Genera las estrellas de rating
 */
function generarEstrellas(rating) {
    const estrellas = [];
    const ratingRedondeado = Math.round(rating * 2) / 2; // Redondear a 0.5
    
    for (let i = 1; i <= 5; i++) {
        if (i <= ratingRedondeado) {
            estrellas.push('<i class="fas fa-star text-yellow-400"></i>');
        } else if (i - 0.5 <= ratingRedondeado) {
            estrellas.push('<i class="fas fa-star-half-alt text-yellow-400"></i>');
        } else {
            estrellas.push('<i class="far fa-star text-gray-400"></i>');
        }
    }
    
    return estrellas.join('');
}

/**
 * Actualiza el contador de resultados
 */
function actualizarContadorResultados() {
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.textContent = productosFiltrados.length;
    }
}

/**
 * Limpia todos los filtros
 */
function limpiarFiltros() {
    // Limpiar búsqueda
    const searchInput = document.getElementById('advancedSearchInput');
    if (searchInput) searchInput.value = '';
    
    // Limpiar categorías
    document.querySelectorAll('.category-filter:checked').forEach(cb => cb.checked = false);
    
    // Limpiar precio
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    if (priceMin) priceMin.value = '';
    if (priceMax) priceMax.value = '';
    
    // Limpiar rangos de precio
    document.querySelectorAll('input[name="priceRange"]:checked').forEach(rb => rb.checked = false);
    
    // Limpiar marcas
    document.querySelectorAll('.brand-filter:checked').forEach(cb => cb.checked = false);
    
    // Limpiar tallas
    document.querySelectorAll('.size-filter-btn.bg-indigo-600').forEach(btn => {
        btn.classList.remove('bg-indigo-600', 'text-white');
    });
    
    // Limpiar colores
    document.querySelectorAll('.color-filter-btn.ring-2').forEach(btn => {
        btn.classList.remove('ring-2', 'ring-indigo-500');
    });
    
    // Limpiar descuento
    const discountFilter = document.getElementById('discountFilter');
    if (discountFilter) discountFilter.checked = false;
    
    // Limpiar rating (seleccionar "Todas")
    const allRatingRadio = document.querySelector('input[name="rating"][value="0"]');
    if (allRatingRadio) allRatingRadio.checked = true;
    
    // Limpiar ordenamiento
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) sortSelect.value = '';
    
    // Resetear filtros activos
    filtrosActivos = {
        categoria: [],
        precio: { min: 0, max: Infinity },
        talla: [],
        marca: [],
        color: [],
        descuento: false,
        rating: 0,
        busqueda: ''
    };
    
    // Mostrar todos los productos
    productosFiltrados = [...productosOriginales];
    mostrarProductosFiltrados();
    actualizarContadorResultados();
}

/**
 * Función debounce para optimizar las búsquedas
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Funciones placeholder para integrar con otras funcionalidades
function toggleFavorito(productId) {
    // Usar la función global del sistema de wishlist
    if (typeof window.toggleFavorito === 'function') {
        window.toggleFavorito(productId);
    } else {
        console.log('Toggle favorito:', productId);
        // Fallback: cambiar icono del botón
        const btn = event.target.closest('button');
        const icon = btn.querySelector('i');
        if (icon.classList.contains('fas')) {
            icon.classList.remove('fas');
            icon.classList.add('far');
        } else {
            icon.classList.remove('far');
            icon.classList.add('fas');
        }
    }
}

function toggleComparacion(productId) {
    // Usar la función global del sistema de comparación
    if (typeof window.toggleComparacion === 'function') {
        window.toggleComparacion(productId);
    } else {
        console.log('Toggle comparación:', productId);
    }
}

function verProducto(productId) {
    // Mostrar modal de reseñas del producto
    if (typeof window.mostrarModalReviews === 'function') {
        window.mostrarModalReviews(productId);
    } else {
        console.log('Ver producto:', productId);
        // Fallback: mostrar información básica
        const producto = productosOriginales.find(p => p.id === productId);
        if (producto) {
            alert(`Producto: ${producto.nombre}\nPrecio: $${producto.precio}\nCategoría: ${producto.categoria}`);
        }
    }
}

function agregarAlCarritoRapido(productId) {
    // Buscar el producto por ID
    const producto = productosOriginales.find(p => p.id === productId);
    if (producto) {
        // Usar la función del carrito existente
        agregarAlCarrito({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio
        });
    }
}

// Exportar funciones para uso global
window.inicializarFiltros = inicializarFiltros;
window.aplicarFiltros = aplicarFiltros;
window.limpiarFiltros = limpiarFiltros;