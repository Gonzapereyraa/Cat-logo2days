/**
 * Sistema de Reseñas y Valoraciones
 * Incluye ratings con estrellas, reseñas escritas, estadísticas y moderación básica
 */

// Variables globales para reseñas
let reviewsData = {};
let reviewsInitialized = false;

/**
 * Inicializa el sistema de reseñas
 */
function inicializarReviews() {
    if (reviewsInitialized) return;
    reviewsInitialized = true;
    
    console.log('⭐ Inicializando sistema de reseñas');
    
    // Cargar reseñas desde localStorage
    cargarReviews();
    
    // Actualizar ratings de productos
    actualizarRatingsProductos();
    
    console.log('✅ Sistema de reseñas inicializado');
}

/**
 * Carga las reseñas desde localStorage
 */
function cargarReviews() {
    try {
        const saved = localStorage.getItem('reviewsData');
        if (saved) {
            reviewsData = JSON.parse(saved);
            console.log(`⭐ Reseñas cargadas para ${Object.keys(reviewsData).length} productos`);
        } else {
            // Crear datos de ejemplo si no existen
            crearReviewsDemo();
        }
    } catch (error) {
        console.error('❌ Error al cargar reseñas:', error);
        reviewsData = {};
        crearReviewsDemo();
    }
}

/**
 * Crea reseñas de demostración
 */
function crearReviewsDemo() {
    reviewsData = {
        1: { // Smartphone
            rating: 4.5,
            totalReviews: 124,
            reviews: [
                {
                    id: 1,
                    usuario: 'Carlos M.',
                    rating: 5,
                    titulo: 'Excelente teléfono',
                    comentario: 'La cámara es increíble y la batería dura todo el día. Muy recomendado.',
                    fecha: '2024-12-15',
                    verificado: true,
                    likes: 15,
                    reportado: false
                },
                {
                    id: 2,
                    usuario: 'Ana López',
                    rating: 4,
                    titulo: 'Buena compra',
                    comentario: 'Funciona muy bien, aunque el precio podría ser mejor.',
                    fecha: '2024-12-10',
                    verificado: true,
                    likes: 8,
                    reportado: false
                }
            ],
            distribution: {
                5: 85,
                4: 28,
                3: 8,
                2: 2,
                1: 1
            }
        },
        2: { // Zapatillas Running Pro
            rating: 4.2,
            totalReviews: 67,
            reviews: [
                {
                    id: 3,
                    usuario: 'Miguel R.',
                    rating: 5,
                    titulo: 'Perfectas para correr',
                    comentario: 'Muy cómodas y con excelente amortiguación. Las uso todos los días.',
                    fecha: '2024-12-12',
                    verificado: true,
                    likes: 12,
                    reportado: false
                }
            ],
            distribution: {
                5: 35,
                4: 20,
                3: 8,
                2: 3,
                1: 1
            }
        },
        5: { // Auriculares Inalámbricos
            rating: 4.7,
            totalReviews: 89,
            reviews: [
                {
                    id: 4,
                    usuario: 'Laura García',
                    rating: 5,
                    titulo: 'Sonido excepcional',
                    comentario: 'La cancelación de ruido funciona perfectamente. Excelente calidad de audio.',
                    fecha: '2024-12-08',
                    verificado: true,
                    likes: 23,
                    reportado: false
                }
            ],
            distribution: {
                5: 68,
                4: 15,
                3: 4,
                2: 1,
                1: 1
            }
        }
    };
    
    guardarReviews();
}

/**
 * Guarda las reseñas en localStorage
 */
function guardarReviews() {
    try {
        localStorage.setItem('reviewsData', JSON.stringify(reviewsData));
    } catch (error) {
        console.error('❌ Error al guardar reseñas:', error);
    }
}

/**
 * Actualiza los ratings de productos en la interfaz
 */
function actualizarRatingsProductos() {
    // Actualizar productos globales si existen
    if (window.productosGlobales) {
        window.productosGlobales.forEach(producto => {
            if (reviewsData[producto.id]) {
                producto.rating = reviewsData[producto.id].rating;
                producto.totalReviews = reviewsData[producto.id].totalReviews;
            }
        });
    }
    
    // Actualizar productos originales para filtros
    if (window.productosOriginales) {
        window.productosOriginales.forEach(producto => {
            if (reviewsData[producto.id]) {
                producto.rating = reviewsData[producto.id].rating;
                producto.totalReviews = reviewsData[producto.id].totalReviews;
            }
        });
    }
}

/**
 * Obtiene las reseñas de un producto
 */
function obtenerReviewsProducto(productId) {
    return reviewsData[productId] || {
        rating: 0,
        totalReviews: 0,
        reviews: [],
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };
}

/**
 * Muestra el modal de reseñas para un producto
 */
function mostrarModalReviews(productId) {
    const producto = encontrarProductoPorId(productId);
    if (!producto) return;
    
    // Crear modal si no existe
    if (!document.getElementById('reviewsModal')) {
        crearModalReviews();
    }
    
    const modal = document.getElementById('reviewsModal');
    const reviewsData = obtenerReviewsProducto(productId);
    
    // Actualizar contenido del modal
    actualizarContenidoModalReviews(producto, reviewsData);
    
    modal.classList.remove('hidden');
    modal.dataset.productId = productId;
}

/**
 * Crea el modal de reseñas
 */
function crearModalReviews() {
    const modal = document.createElement('div');
    modal.id = 'reviewsModal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden p-4';
    
    modal.innerHTML = `
        <div class="glass-card rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div class="flex justify-between items-center p-6 border-b border-white border-opacity-20 flex-shrink-0">
                <h2 id="reviewsModalTitle" class="text-2xl font-bold text-white flex items-center">
                    <i class="fas fa-star mr-2"></i>
                    Reseñas del Producto
                </h2>
                <button id="closeReviewsModal" class="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition">
                    <i class="fas fa-times text-white text-xl"></i>
                </button>
            </div>
            
            <div class="flex-1 overflow-auto">
                <div class="p-6">
                    <!-- Estadísticas generales -->
                    <div id="reviewsStats" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"></div>
                    
                    <!-- Filtros y ordenamiento -->
                    <div class="flex flex-wrap gap-4 mb-6 p-4 bg-white bg-opacity-10 rounded-lg">
                        <select id="reviewsFilter" class="px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded text-white">
                            <option value="">Todas las reseñas</option>
                            <option value="5">5 estrellas</option>
                            <option value="4">4 estrellas</option>
                            <option value="3">3 estrellas</option>
                            <option value="2">2 estrellas</option>
                            <option value="1">1 estrella</option>
                            <option value="verified">Solo compras verificadas</option>
                        </select>
                        
                        <select id="reviewsSort" class="px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded text-white">
                            <option value="recent">Más recientes</option>
                            <option value="helpful">Más útiles</option>
                            <option value="rating-high">Rating más alto</option>
                            <option value="rating-low">Rating más bajo</option>
                        </select>
                        
                        <button id="writeReviewBtn" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition">
                            <i class="fas fa-edit mr-2"></i>Escribir Reseña
                        </button>
                    </div>
                    
                    <!-- Lista de reseñas -->
                    <div id="reviewsList" class="space-y-4"></div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    configurarEventosModalReviews();
}

/**
 * Configura eventos del modal de reseñas
 */
function configurarEventosModalReviews() {
    const modal = document.getElementById('reviewsModal');
    
    // Cerrar modal
    const closeBtn = document.getElementById('closeReviewsModal');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    }
    
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.add('hidden');
        }
    });
    
    // Filtros y ordenamiento
    const filterSelect = document.getElementById('reviewsFilter');
    const sortSelect = document.getElementById('reviewsSort');
    
    if (filterSelect) {
        filterSelect.addEventListener('change', () => {
            const productId = modal.dataset.productId;
            if (productId) {
                actualizarListaReviews(parseInt(productId));
            }
        });
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            const productId = modal.dataset.productId;
            if (productId) {
                actualizarListaReviews(parseInt(productId));
            }
        });
    }
    
    // Botón escribir reseña
    const writeBtn = document.getElementById('writeReviewBtn');
    if (writeBtn) {
        writeBtn.addEventListener('click', () => {
            const productId = modal.dataset.productId;
            if (productId) {
                mostrarFormularioReview(parseInt(productId));
            }
        });
    }
}

/**
 * Actualiza el contenido del modal de reseñas
 */
function actualizarContenidoModalReviews(producto, reviewsData) {
    // Actualizar título
    const title = document.getElementById('reviewsModalTitle');
    if (title) {
        title.innerHTML = `
            <i class="fas fa-star mr-2"></i>
            Reseñas: ${producto.nombre}
        `;
    }
    
    // Actualizar estadísticas
    actualizarEstadisticasReviews(reviewsData);
    
    // Actualizar lista de reseñas
    actualizarListaReviews(producto.id);
}

/**
 * Actualiza las estadísticas de reseñas
 */
function actualizarEstadisticasReviews(data) {
    const container = document.getElementById('reviewsStats');
    if (!container) return;
    
    const porcentajeRecomendacion = data.totalReviews > 0 
        ? Math.round(((data.distribution[5] + data.distribution[4]) / data.totalReviews) * 100)
        : 0;
    
    container.innerHTML = `
        <!-- Resumen general -->
        <div class="bg-white bg-opacity-10 rounded-lg p-6">
            <div class="text-center">
                <div class="text-4xl font-bold text-white mb-2">${data.rating.toFixed(1)}</div>
                <div class="flex justify-center mb-2">
                    ${generarEstrellas(data.rating, 'text-xl')}
                </div>
                <div class="text-gray-300">${data.totalReviews} reseñas</div>
                <div class="text-green-400 font-medium mt-2">${porcentajeRecomendacion}% recomendado</div>
            </div>
        </div>
        
        <!-- Distribución de estrellas -->
        <div class="bg-white bg-opacity-10 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-white mb-4">Distribución de Ratings</h4>
            ${generarGraficoDistribucion(data.distribution, data.totalReviews)}
        </div>
    `;
}

/**
 * Genera el gráfico de distribución de ratings
 */
function generarGraficoDistribucion(distribution, total) {
    let html = '<div class="space-y-2">';
    
    for (let i = 5; i >= 1; i--) {
        const count = distribution[i] || 0;
        const percentage = total > 0 ? (count / total) * 100 : 0;
        
        html += `
            <div class="flex items-center space-x-3">
                <div class="flex items-center w-16">
                    <span class="text-white mr-1">${i}</span>
                    <i class="fas fa-star text-yellow-400"></i>
                </div>
                <div class="flex-1 bg-gray-600 rounded-full h-2">
                    <div class="bg-yellow-400 h-2 rounded-full" style="width: ${percentage}%"></div>
                </div>
                <div class="text-gray-300 text-sm w-12 text-right">${count}</div>
            </div>
        `;
    }
    
    html += '</div>';
    return html;
}

/**
 * Actualiza la lista de reseñas con filtros y ordenamiento
 */
function actualizarListaReviews(productId) {
    const container = document.getElementById('reviewsList');
    if (!container) return;
    
    const data = obtenerReviewsProducto(productId);
    let reviews = [...data.reviews];
    
    // Aplicar filtros
    const filter = document.getElementById('reviewsFilter')?.value;
    if (filter) {
        switch (filter) {
            case 'verified':
                reviews = reviews.filter(r => r.verificado);
                break;
            case '5':
            case '4':
            case '3':
            case '2':
            case '1':
                reviews = reviews.filter(r => r.rating === parseInt(filter));
                break;
        }
    }
    
    // Aplicar ordenamiento
    const sort = document.getElementById('reviewsSort')?.value || 'recent';
    switch (sort) {
        case 'helpful':
            reviews.sort((a, b) => b.likes - a.likes);
            break;
        case 'rating-high':
            reviews.sort((a, b) => b.rating - a.rating);
            break;
        case 'rating-low':
            reviews.sort((a, b) => a.rating - b.rating);
            break;
        case 'recent':
        default:
            reviews.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
            break;
    }
    
    if (reviews.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-star text-4xl text-gray-400 mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-300 mb-2">No hay reseñas</h3>
                <p class="text-gray-400 mb-6">Sé el primero en escribir una reseña para este producto</p>
                <button onclick="mostrarFormularioReview(${productId})" 
                        class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition">
                    <i class="fas fa-edit mr-2"></i>Escribir Primera Reseña
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = reviews.map(review => generarTarjetaReview(review, productId)).join('');
}

/**
 * Genera una tarjeta de reseña
 */
function generarTarjetaReview(review, productId) {
    const fechaFormateada = new Date(review.fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    return `
        <div class="bg-white bg-opacity-10 rounded-lg p-6 ${review.reportado ? 'opacity-50' : ''}">
            <div class="flex justify-between items-start mb-4">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                        ${review.usuario.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div class="flex items-center space-x-2">
                            <span class="font-medium text-white">${review.usuario}</span>
                            ${review.verificado ? '<i class="fas fa-check-circle text-green-400" title="Compra verificada"></i>' : ''}
                        </div>
                        <div class="flex items-center space-x-2 text-sm text-gray-300">
                            <span>${fechaFormateada}</span>
                            ${review.verificado ? '<span class="text-green-400">• Compra verificada</span>' : ''}
                        </div>
                    </div>
                </div>
                
                <div class="flex items-center space-x-2">
                    ${generarEstrellas(review.rating)}
                    <div class="relative">
                        <button class="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition text-gray-400" 
                                onclick="toggleMenuReview(${review.id})">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                        <div id="menu-${review.id}" class="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg py-2 min-w-32 z-10 hidden">
                            <button onclick="reportarReview(${productId}, ${review.id})" 
                                    class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm">
                                <i class="fas fa-flag mr-2"></i>Reportar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            ${review.titulo ? `<h4 class="text-lg font-semibold text-white mb-2">${review.titulo}</h4>` : ''}
            
            <p class="text-gray-300 mb-4 leading-relaxed">${review.comentario}</p>
            
            <div class="flex justify-between items-center">
                <button onclick="toggleLikeReview(${productId}, ${review.id})" 
                        class="flex items-center space-x-2 text-gray-400 hover:text-white transition">
                    <i class="fas fa-thumbs-up"></i>
                    <span>Útil (${review.likes})</span>
                </button>
                
                ${review.reportado ? '<span class="text-red-400 text-sm">⚠️ Reportado</span>' : ''}
            </div>
        </div>
    `;
}

/**
 * Genera estrellas HTML
 */
function generarEstrellas(rating, className = '') {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let html = '';
    
    // Estrellas completas
    for (let i = 0; i < fullStars; i++) {
        html += `<i class="fas fa-star text-yellow-400 ${className}"></i>`;
    }
    
    // Media estrella
    if (hasHalfStar) {
        html += `<i class="fas fa-star-half-alt text-yellow-400 ${className}"></i>`;
    }
    
    // Estrellas vacías
    for (let i = 0; i < emptyStars; i++) {
        html += `<i class="far fa-star text-gray-400 ${className}"></i>`;
    }
    
    return html;
}

/**
 * Muestra el formulario para escribir una reseña
 */
function mostrarFormularioReview(productId) {
    const producto = encontrarProductoPorId(productId);
    if (!producto) return;
    
    // Crear modal del formulario si no existe
    if (!document.getElementById('reviewFormModal')) {
        crearModalFormularioReview();
    }
    
    const modal = document.getElementById('reviewFormModal');
    modal.dataset.productId = productId;
    
    // Actualizar información del producto
    const productInfo = document.getElementById('reviewProductInfo');
    if (productInfo) {
        productInfo.innerHTML = `
            <div class="flex items-center space-x-4">
                <img src="${producto.imagen}" alt="${producto.nombre}" 
                     class="w-16 h-16 object-cover rounded-lg"
                     onerror="this.src='https://via.placeholder.com/64x64/4F46E5/FFFFFF?text=📦'">
                <div>
                    <h3 class="text-lg font-semibold text-white">${producto.nombre}</h3>
                    <p class="text-gray-300">${producto.categoria}</p>
                </div>
            </div>
        `;
    }
    
    // Resetear formulario
    document.getElementById('reviewForm')?.reset();
    const stars = document.querySelectorAll('#reviewRating .star-btn');
    stars.forEach(star => star.classList.remove('active'));
    
    modal.classList.remove('hidden');
}

/**
 * Crea el modal del formulario de reseña
 */
function crearModalFormularioReview() {
    const modal = document.createElement('div');
    modal.id = 'reviewFormModal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden p-4';
    
    modal.innerHTML = `
        <div class="glass-card rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center p-6 border-b border-white border-opacity-20">
                <h2 class="text-2xl font-bold text-white">
                    <i class="fas fa-edit mr-2"></i>Escribir Reseña
                </h2>
                <button id="closeReviewForm" class="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition">
                    <i class="fas fa-times text-white text-xl"></i>
                </button>
            </div>
            
            <div class="p-6">
                <div id="reviewProductInfo" class="mb-6 p-4 bg-white bg-opacity-10 rounded-lg"></div>
                
                <form id="reviewForm" class="space-y-6">
                    <!-- Rating con estrellas -->
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-3">Tu valoración *</label>
                        <div id="reviewRating" class="flex items-center space-x-1">
                            ${[1,2,3,4,5].map(rating => `
                                <button type="button" class="star-btn text-3xl text-gray-400 hover:text-yellow-400 transition" 
                                        data-rating="${rating}">
                                    <i class="far fa-star"></i>
                                </button>
                            `).join('')}
                        </div>
                        <p class="text-xs text-gray-400 mt-1">Haz clic en las estrellas para valorar</p>
                    </div>
                    
                    <!-- Título opcional -->
                    <div>
                        <label for="reviewTitle" class="block text-sm font-medium text-gray-300 mb-2">
                            Título de tu reseña (opcional)
                        </label>
                        <input type="text" id="reviewTitle" name="title" 
                               placeholder="Resumen de tu experiencia"
                               class="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    </div>
                    
                    <!-- Comentario -->
                    <div>
                        <label for="reviewComment" class="block text-sm font-medium text-gray-300 mb-2">
                            Tu reseña *
                        </label>
                        <textarea id="reviewComment" name="comment" rows="5" required
                                  placeholder="Comparte tu experiencia con este producto..."
                                  class="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"></textarea>
                        <div class="flex justify-between mt-1">
                            <p class="text-xs text-gray-400">Mínimo 10 caracteres</p>
                            <span id="charCount" class="text-xs text-gray-400">0/500</span>
                        </div>
                    </div>
                    
                    <!-- Nombre -->
                    <div>
                        <label for="reviewName" class="block text-sm font-medium text-gray-300 mb-2">
                            Tu nombre *
                        </label>
                        <input type="text" id="reviewName" name="name" required
                               placeholder="¿Cómo te llamas?"
                               class="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    </div>
                    
                    <!-- Checkbox compra verificada -->
                    <div>
                        <label class="flex items-center space-x-3">
                            <input type="checkbox" id="reviewVerified" 
                                   class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500">
                            <span class="text-gray-300">He comprado este producto</span>
                        </label>
                    </div>
                    
                    <!-- Botones -->
                    <div class="flex space-x-4 pt-4">
                        <button type="submit" class="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition">
                            <i class="fas fa-star mr-2"></i>Publicar Reseña
                        </button>
                        <button type="button" id="cancelReview" class="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    configurarEventosFormularioReview();
}

/**
 * Configura eventos del formulario de reseña
 */
function configurarEventosFormularioReview() {
    const modal = document.getElementById('reviewFormModal');
    
    // Cerrar modal
    const closeBtn = document.getElementById('closeReviewForm');
    const cancelBtn = document.getElementById('cancelReview');
    
    [closeBtn, cancelBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => modal.classList.add('hidden'));
        }
    });
    
    // Rating con estrellas interactivo
    const starButtons = document.querySelectorAll('#reviewRating .star-btn');
    starButtons.forEach((star, index) => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.dataset.rating);
            
            // Actualizar estrellas visuales
            starButtons.forEach((s, i) => {
                if (i < rating) {
                    s.classList.add('active');
                    s.querySelector('i').className = 'fas fa-star text-yellow-400';
                } else {
                    s.classList.remove('active');
                    s.querySelector('i').className = 'far fa-star text-gray-400';
                }
            });
            
            // Guardar rating seleccionado
            modal.dataset.selectedRating = rating;
        });
        
        // Hover effect
        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.dataset.rating);
            starButtons.forEach((s, i) => {
                const icon = s.querySelector('i');
                if (i < rating) {
                    icon.className = 'fas fa-star text-yellow-400';
                } else {
                    icon.className = 'far fa-star text-gray-400';
                }
            });
        });
    });
    
    // Restaurar estrellas al salir del hover
    const ratingContainer = document.getElementById('reviewRating');
    if (ratingContainer) {
        ratingContainer.addEventListener('mouseleave', function() {
            const selectedRating = parseInt(modal.dataset.selectedRating || '0');
            starButtons.forEach((s, i) => {
                const icon = s.querySelector('i');
                if (i < selectedRating) {
                    icon.className = 'fas fa-star text-yellow-400';
                } else {
                    icon.className = 'far fa-star text-gray-400';
                }
            });
        });
    }
    
    // Contador de caracteres
    const commentField = document.getElementById('reviewComment');
    const charCount = document.getElementById('charCount');
    
    if (commentField && charCount) {
        commentField.addEventListener('input', function() {
            const count = this.value.length;
            charCount.textContent = `${count}/500`;
            
            if (count > 500) {
                charCount.classList.add('text-red-400');
                this.value = this.value.substring(0, 500);
            } else {
                charCount.classList.remove('text-red-400');
            }
        });
    }
    
    // Envío del formulario
    const form = document.getElementById('reviewForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            enviarReview();
        });
    }
}

/**
 * Envía una nueva reseña
 */
function enviarReview() {
    const modal = document.getElementById('reviewFormModal');
    const productId = parseInt(modal.dataset.productId);
    const selectedRating = parseInt(modal.dataset.selectedRating || '0');
    
    // Validaciones
    if (selectedRating === 0) {
        mostrarNotificacionReviews('Por favor selecciona una valoración', 'error');
        return;
    }
    
    const comment = document.getElementById('reviewComment').value.trim();
    if (comment.length < 10) {
        mostrarNotificacionReviews('La reseña debe tener al menos 10 caracteres', 'error');
        return;
    }
    
    const name = document.getElementById('reviewName').value.trim();
    if (name.length < 2) {
        mostrarNotificacionReviews('Por favor ingresa tu nombre', 'error');
        return;
    }
    
    // Crear nueva reseña
    const newReview = {
        id: Date.now(), // ID único basado en timestamp
        usuario: name,
        rating: selectedRating,
        titulo: document.getElementById('reviewTitle').value.trim(),
        comentario: comment,
        fecha: new Date().toISOString().split('T')[0],
        verificado: document.getElementById('reviewVerified').checked,
        likes: 0,
        reportado: false
    };
    
    // Agregar reseña a los datos
    if (!reviewsData[productId]) {
        reviewsData[productId] = {
            rating: 0,
            totalReviews: 0,
            reviews: [],
            distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        };
    }
    
    reviewsData[productId].reviews.unshift(newReview);
    reviewsData[productId].totalReviews++;
    reviewsData[productId].distribution[selectedRating]++;
    
    // Recalcular rating promedio
    recalcularRatingProducto(productId);
    
    // Guardar datos
    guardarReviews();
    
    // Actualizar ratings de productos
    actualizarRatingsProductos();
    
    // Cerrar modal del formulario
    modal.classList.add('hidden');
    
    // Actualizar modal de reseñas si está abierto
    const reviewsModal = document.getElementById('reviewsModal');
    if (reviewsModal && !reviewsModal.classList.contains('hidden')) {
        const producto = encontrarProductoPorId(productId);
        if (producto) {
            actualizarContenidoModalReviews(producto, reviewsData[productId]);
        }
    }
    
    mostrarNotificacionReviews('¡Reseña publicada con éxito!', 'success');
}

/**
 * Recalcula el rating promedio de un producto
 */
function recalcularRatingProducto(productId) {
    const data = reviewsData[productId];
    if (!data || data.totalReviews === 0) return;
    
    let totalPuntos = 0;
    Object.entries(data.distribution).forEach(([rating, count]) => {
        totalPuntos += parseInt(rating) * count;
    });
    
    data.rating = totalPuntos / data.totalReviews;
}

/**
 * Toggle like en una reseña
 */
function toggleLikeReview(productId, reviewId) {
    const data = reviewsData[productId];
    if (!data) return;
    
    const review = data.reviews.find(r => r.id === reviewId);
    if (!review) return;
    
    // En un sistema real, verificaríamos si el usuario ya dio like
    review.likes++;
    
    guardarReviews();
    
    // Actualizar la vista
    actualizarListaReviews(productId);
    
    mostrarNotificacionReviews('¡Gracias por tu feedback!', 'success');
}

/**
 * Toggle menú de acciones de reseña
 */
function toggleMenuReview(reviewId) {
    const menu = document.getElementById(`menu-${reviewId}`);
    if (menu) {
        menu.classList.toggle('hidden');
        
        // Cerrar otros menús
        document.querySelectorAll('[id^="menu-"]').forEach(m => {
            if (m !== menu) m.classList.add('hidden');
        });
    }
}

/**
 * Reportar una reseña
 */
function reportarReview(productId, reviewId) {
    if (confirm('¿Estás seguro de que quieres reportar esta reseña?')) {
        const data = reviewsData[productId];
        if (!data) return;
        
        const review = data.reviews.find(r => r.id === reviewId);
        if (review) {
            review.reportado = true;
            guardarReviews();
            actualizarListaReviews(productId);
            mostrarNotificacionReviews('Reseña reportada para moderación', 'success');
        }
    }
    
    // Cerrar menú
    const menu = document.getElementById(`menu-${reviewId}`);
    if (menu) menu.classList.add('hidden');
}

/**
 * Encuentra un producto por ID (reutiliza funciones anteriores)
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
 * Muestra notificaciones del sistema de reseñas
 */
function mostrarNotificacionReviews(mensaje, tipo = 'success') {
    const notification = document.createElement('div');
    
    let bgColor, icon;
    switch (tipo) {
        case 'error':
            bgColor = 'bg-red-500';
            icon = 'fas fa-exclamation-triangle';
            break;
        default:
            bgColor = 'bg-green-500';
            icon = 'fas fa-check-circle';
    }
    
    notification.className = `fixed bottom-4 right-4 px-4 py-3 ${bgColor} text-white rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300`;
    
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

// Funciones para uso global
window.inicializarReviews = inicializarReviews;
window.mostrarModalReviews = mostrarModalReviews;
window.mostrarFormularioReview = mostrarFormularioReview;
window.toggleLikeReview = toggleLikeReview;
window.toggleMenuReview = toggleMenuReview;
window.reportarReview = reportarReview;
window.obtenerReviewsProducto = obtenerReviewsProducto;