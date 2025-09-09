// Variables globales
let catalogoInicializado = false;
let productosGlobales = [];
let configGlobal = {};

document.addEventListener('DOMContentLoaded', function() {
  if (catalogoInicializado) return;
  catalogoInicializado = true;
  
  console.log("🚀 Iniciando carga de catálogo - Usuario: Gonzapereyraa");
  
  try {
    inicializarCatalogo();
  } catch (error) {
    console.error("❌ Error crítico al inicializar catálogo:", error);
    mostrarErrorCarga();
  }
});

/**
 * Inicializa todo el catálogo de manera segura
 */
function inicializarCatalogo() {
  // 1. Aplicar plantilla CSS
  aplicarPlantillaCSS();
  
  // 2. Aplicar textos guardados
  aplicarTextosGuardados();
  
  // 3. Cargar configuración
  configGlobal = cargarConfiguracion();
  
  // 4. Aplicar banner (si no existe el elemento, no falla)
  aplicarConfiguracionBanner(configGlobal.banner);
  
  // 5. Cargar productos
  cargarProductos(configGlobal);
  
  // 6. Inicializar carrito
  inicializarCarrito();
  
  // 7. Configurar navegación
  configurarNavegacion();
  
  console.log("✅ Catálogo inicializado correctamente");
}

/**
 * Aplica la plantilla CSS seleccionada
 */
function aplicarPlantillaCSS() {
  const plantilla = localStorage.getItem('plantillaGuardada') || 'clasica';
  console.log("🎨 Aplicando plantilla:", plantilla);
  
  const cssFile = obtenerArchivoCSS(plantilla);
  
  const plantillaLink = document.getElementById('plantillaCSS');
  if (plantillaLink) {
    plantillaLink.href = cssFile;
    console.log("🎨 CSS aplicado:", cssFile);
  } else {
    console.warn("⚠️ Elemento plantillaCSS no encontrado");
  }
}

/**
 * Obtiene el archivo CSS según la plantilla - TODAS LAS PLANTILLAS DISPONIBLES
 */
function obtenerArchivoCSS(plantilla) {
  const plantillasCSS = {
    'clasica': 'Plantillas/plan1.css',      // ✅ Disponible
    'moderna': 'Plantillas/plan2.css',      // ✅ Disponible  
    'minimalista': 'Plantillas/plan3.css',  // ✅ Disponible
    'futurista': 'Plantillas/plan4.css',    // ✅ Disponible
    'gamer': 'Plantillas/plan5.css',        // ✅ Disponible
    'vintaje': 'Plantillas/plan6.css'       // ✅ Disponible
  };
  
  return plantillasCSS[plantilla] || plantillasCSS['clasica'];
}

/**
 * Aplica textos guardados desde localStorage
 */
function aplicarTextosGuardados() {
  const savedTexts = localStorage.getItem('editableTexts');
  if (!savedTexts) {
    console.log("📝 No hay textos guardados");
    return;
  }
  
  try {
    const texts = JSON.parse(savedTexts);
    console.log("📝 Aplicando textos guardados:", Object.keys(texts).length, "elementos");
    
    Object.entries(texts).forEach(([id, texto]) => {
      const elemento = document.getElementById(id);
      if (elemento) {
        elemento.textContent = texto;
        console.log(`📝 Texto aplicado a ${id}`);
      }
      // Removido el warning para elementos no encontrados (reduce ruido en consola)
    });
  } catch (error) {
    console.error("❌ Error al procesar textos guardados:", error);
  }
}

/**
 * Carga la configuración del catálogo
 */
function cargarConfiguracion() {
  const configDefault = {
    showFilters: true,
    showCategoryTags: false, // Tu HTML no tiene categoryTags
    showOfferBadge: true,
    productsPerPage: 12,
    featuredProducts: [],
    banner: {
      title: '',
      text: '',
      show: false
    }
  };
  
  try {
    const configGuardada = localStorage.getItem('catalogoConfig');
    const config = configGuardada ? { ...configDefault, ...JSON.parse(configGuardada) } : configDefault;
    console.log("⚙️ Configuración cargada");
    return config;
  } catch (error) {
    console.error("❌ Error al cargar configuración:", error);
    return configDefault;
  }
}

/**
 * Aplica configuración del banner promocional
 */
function aplicarConfiguracionBanner(bannerConfig) {
  const bannerContainer = document.getElementById('promoBanner');
  
  // Si no existe el elemento, no es un error crítico
  if (!bannerContainer) {
    console.log("ℹ️ Banner promocional no disponible en esta plantilla");
    return;
  }
  
  if (bannerConfig && bannerConfig.show && bannerConfig.title && bannerConfig.text) {
    bannerContainer.classList.remove('hidden');
    bannerContainer.innerHTML = `
      <div class="glass-card p-4 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600">
        <h4 class="text-lg font-bold">${bannerConfig.title}</h4>
        <p>${bannerConfig.text}</p>
      </div>
    `;
    console.log("🎯 Banner promocional activado");
  } else {
    bannerContainer.classList.add('hidden');
  }
}

/**
 * Carga productos desde localStorage o productos demo
 */
function cargarProductos(config) {
  console.log("📦 Iniciando carga de productos...");
  
  let productos = obtenerProductosAlmacenados();
  
  if (productos && productos.length > 0) {
    console.log(`📦 Cargando ${productos.length} productos desde localStorage`);
    productosGlobales = productos;
    procesarProductos(productos, config);
  } else {
    console.log("📦 Cargando productos demo");
    cargarProductosDemo(config);
  }
}

/**
 * Obtiene productos del localStorage de forma segura
 */
function obtenerProductosAlmacenados() {
  try {
    const productosJson = localStorage.getItem('productos');
    return productosJson ? JSON.parse(productosJson) : null;
  } catch (error) {
    console.error("❌ Error al obtener productos del localStorage:", error);
    localStorage.removeItem('productos'); // Limpiar datos corruptos
    return null;
  }
}

/**
 * Carga productos de demostración y los guarda
 */
function cargarProductosDemo(config) {
  const productosDemo = [
    {
      id: 1,
      nombre: "Smartphone Última Gen",
      descripcion: "Teléfono inteligente con la última tecnología del mercado y cámara de 48MP.",
      precio: 599.99,
      categoria: "Electrónicos",
      imagen: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      oferta: true,
      marca: "Samsung",
      color: "#000000",
      rating: 4.5,
      sizes: [],
      tags: ["smartphone", "tecnología", "cámara"]
    },
    {
      id: 2,
      nombre: "Zapatillas Running Pro",
      descripcion: "Zapatillas para correr con máxima amortiguación y estabilidad para deportistas.",
      precio: 129.99,
      categoria: "Zapatillas",
      imagen: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      oferta: false,
      marca: "Nike",
      color: "#ff0000",
      rating: 4.2,
      sizes: ["38", "39", "40", "41", "42", "43", "44"],
      tags: ["running", "deporte", "comodidad"]
    },
    {
      id: 3,
      nombre: "Licuadora Multifunción",
      descripcion: "Licuadora de alta potencia con 10 velocidades y vaso de vidrio resistente.",
      precio: 89.99,
      categoria: "Hogar",
      imagen: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      oferta: true,
      marca: "Philips",
      color: "#ffffff",
      rating: 4.0,
      sizes: [],
      tags: ["cocina", "licuadora", "hogar"]
    },
    {
      id: 4,
      nombre: "Camiseta Premium",
      descripcion: "Camiseta de algodón 100% con diseño exclusivo y corte moderno.",
      precio: 29.99,
      categoria: "Remeras",
      imagen: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      oferta: false,
      marca: "Adidas",
      color: "#0000ff",
      rating: 4.3,
      sizes: ["S", "M", "L", "XL", "XXL"],
      tags: ["algodón", "casual", "premium"]
    },
    {
      id: 5,
      nombre: "Auriculares Inalámbricos",
      descripcion: "Auriculares con cancelación de ruido activa y 30 horas de batería.",
      precio: 149.99,
      categoria: "Electrónicos",
      imagen: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      oferta: true,
      marca: "Sony",
      color: "#000000",
      rating: 4.7,
      sizes: [],
      tags: ["audio", "inalámbrico", "cancelación ruido"]
    },
    {
      id: 6,
      nombre: "Mochila Impermeable",
      descripcion: "Mochila con compartimentos acolchados para laptop y tablet, resistente al agua.",
      precio: 59.99,
      categoria: "Accesorios",
      imagen: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      oferta: false,
      marca: "North Face",
      color: "#008000",
      rating: 4.1,
      sizes: [],
      tags: ["mochila", "impermeable", "laptop"]
    },
    {
      id: 7,
      nombre: "Reloj Inteligente",
      descripcion: "Smartwatch con monitoreo de salud, GPS y notificaciones inteligentes.",
      precio: 199.99,
      categoria: "Electrónicos",
      imagen: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      oferta: true,
      marca: "Apple",
      color: "#c0c0c0",
      rating: 4.6,
      sizes: [],
      tags: ["smartwatch", "salud", "GPS"]
    },
    {
      id: 8,
      nombre: "Silla Ergonómica",
      descripcion: "Silla de oficina con soporte lumbar y reposabrazos ajustables para máximo confort.",
      precio: 249.99,
      categoria: "Hogar",
      imagen: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      oferta: false,
      marca: "Herman Miller",
      color: "#808080",
      rating: 4.4,
      sizes: [],
      tags: ["oficina", "ergonómica", "confort"]
    },
    {
      id: 9,
      nombre: "Pantalones Cargo",
      descripcion: "Pantalones resistentes con múltiples bolsillos, ideales para actividades al aire libre.",
      precio: 79.99,
      categoria: "Pantalones",
      imagen: "https://via.placeholder.com/600x400/8B4513/FFFFFF?text=Pantalones+Cargo",
      oferta: false,
      marca: "Puma",
      color: "#8B4513",
      rating: 3.9,
      sizes: ["S", "M", "L", "XL"],
      tags: ["cargo", "resistente", "outdoor"]
    },
    {
      id: 10,
      nombre: "Zapatillas Urbanas",
      descripcion: "Zapatillas casuales perfectas para uso diario con diseño moderno y cómodo.",
      precio: 89.99,
      categoria: "Zapatillas",
      imagen: "https://via.placeholder.com/600x400/FFFFFF/000000?text=Zapatillas+Urbanas",
      oferta: true,
      marca: "Adidas",
      color: "#ffffff",
      rating: 4.0,
      sizes: ["36", "37", "38", "39", "40", "41", "42"],
      tags: ["casual", "urbano", "cómodo"]
    }
  ];
  
  // Guardar productos demo en localStorage
  guardarProductos(productosDemo);
  productosGlobales = productosDemo;
  
  console.log("📦 Productos demo cargados y guardados");
  procesarProductos(productosDemo, config);
}

/**
 * Guarda productos en localStorage de forma segura
 */
function guardarProductos(productos) {
  try {
    localStorage.setItem('productos', JSON.stringify(productos));
  } catch (error) {
    console.error("❌ Error al guardar productos:", error);
  }
}

/**
 * Procesa productos y aplica configuración
 */
function procesarProductos(productos, config) {
  console.log(`🏪 Procesando ${productos.length} productos`);
  
  if (!productos || productos.length === 0) {
    mostrarMensajeVacio();
    return;
  }
  
  // Configurar UI según configuración
  configurarInterfazUsuario(config);
  
  // Inicializar sistema de filtros avanzado
  if (typeof inicializarFiltros === 'function') {
    inicializarFiltros(productos);
  } else {
    // Fallback al sistema antiguo si el nuevo no está disponible
    // Actualizar filtros de categorías
    actualizarFiltrosCategorias(productos);
    
    // Mostrar productos destacados (si existen)
    mostrarProductosDestacados(productos, config);
    
    // Mostrar productos regulares
    mostrarProductos(productos, config);
    
    // Configurar filtros de búsqueda
    configurarFiltros(productos, config);
  }
  
  console.log("✅ Productos procesados exitosamente");
}

/**
 * Configura la interfaz según la configuración
 */
function configurarInterfazUsuario(config) {
  // Mostrar/ocultar filtros
  const filtrosContainer = document.getElementById('filtersContainer');
  if (filtrosContainer) {
    filtrosContainer.style.display = config.showFilters ? 'block' : 'none';
  }
  
  // Mostrar/ocultar etiquetas de categorías (si existen)
  const categoriasContainer = document.getElementById('categoryTags');
  if (categoriasContainer) {
    categoriasContainer.style.display = config.showCategoryTags ? 'flex' : 'none';
  }
}

/**
 * Actualiza el filtro de categorías
 */
function actualizarFiltrosCategorias(productos) {
  const selectCategorias = document.getElementById('categoryFilter');
  if (!selectCategorias) {
    return; // Sin warning, simplemente salir
  }
  
  const categorias = [...new Set(productos.map(p => p.categoria))];
  
  // Limpiar opciones existentes excepto la primera
  while (selectCategorias.options.length > 1) {
    selectCategorias.remove(1);
  }
  
  // Agregar categorías
  categorias.forEach(categoria => {
    const option = document.createElement('option');
    option.value = categoria;
    option.textContent = categoria;
    selectCategorias.appendChild(option);
  });
  
  console.log(`📂 ${categorias.length} categorías actualizadas`);
}

/**
 * Muestra productos destacados (si están configurados)
 */
function mostrarProductosDestacados(productos, config) {
  const featuredContainer = document.getElementById('featuredProducts');
  
  // Si no existe el contenedor o no hay productos destacados, salir
  if (!featuredContainer || !config.featuredProducts || config.featuredProducts.length === 0) {
    if (featuredContainer) featuredContainer.classList.add('hidden');
    return;
  }
  
  console.log("⭐ Mostrando productos destacados");
  
  featuredContainer.innerHTML = '';
  featuredContainer.classList.remove('hidden');
  
  // Crear encabezado
  const header = document.createElement('h2');
  header.className = 'text-2xl font-bold text-center mb-6 text-white';
  header.textContent = 'Productos Destacados';
  featuredContainer.appendChild(header);
  
  // Crear grid de productos
  const productsGrid = document.createElement('div');
  productsGrid.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6';
  featuredContainer.appendChild(productsGrid);
  
  // Agregar productos destacados
  config.featuredProducts.forEach(id => {
    const producto = productos.find(p => p.id === id);
    if (producto) {
      const card = crearTarjetaProducto(producto, config, true);
      productsGrid.appendChild(card);
    }
  });
  
  // Configurar botones del carrito
  configurarBotonesCarrito(featuredContainer, productos);
}

/**
 * Muestra los productos en el contenedor principal
 */
function mostrarProductos(productos, config) {
  const contenedor = document.getElementById('productsContainer');
  if (!contenedor) {
    console.error("❌ Contenedor de productos no encontrado");
    return;
  }
  
  console.log(`🏪 Mostrando ${productos.length} productos`);
  
  // Limpiar contenedor
  contenedor.innerHTML = '';
  
  // Filtrar productos destacados para no duplicar
  const idsDestacados = config.featuredProducts || [];
  const productosRegulares = productos.filter(p => !idsDestacados.includes(p.id));
  
  // Limitar productos según configuración
  const productosAMostrar = productosRegulares.slice(0, config.productsPerPage || 12);
  
  if (productosAMostrar.length === 0) {
    mostrarMensajeVacio();
    return;
  }
  
  // Crear tarjetas de productos
  productosAMostrar.forEach(producto => {
    const card = crearTarjetaProducto(producto, config);
    contenedor.appendChild(card);
  });
  
  // Configurar botones del carrito
  configurarBotonesCarrito(contenedor, productos);
  
  console.log(`✅ ${productosAMostrar.length} productos mostrados`);
}

/**
 * Crea una tarjeta de producto
 */
function crearTarjetaProducto(producto, config, esDestacado = false) {
  const card = document.createElement('div');
  card.className = `relative glass-card rounded-lg overflow-hidden shadow-lg hover:scale-105 hover:shadow-xl transition product-card group`;
  card.dataset.id = producto.id;
  card.dataset.categoria = producto.categoria;
  card.dataset.precio = producto.precio;
  
  const imagenFallback = generarImagenFallback(producto.nombre);
  const totalReviews = producto.totalReviews || 0;
  const estrellas = generarEstrellasRating(producto.rating || 0);
  
  card.innerHTML = `
    ${producto.oferta && config.showOfferBadge ? '<span class="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10">Oferta</span>' : ''}
    ${esDestacado ? '<span class="absolute top-2 right-2 bg-yellow-500 text-yellow-900 text-xs px-2 py-1 rounded-full z-10 font-bold">⭐ Destacado</span>' : ''}
    
    <!-- Imagen del producto con overlay de acciones -->
    <div class="relative overflow-hidden">
      <img src="${producto.imagen}" alt="${producto.nombre}" class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" 
           onerror="this.src='${imagenFallback}';">
      
      <!-- Overlay con botones de acción -->
      <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div class="flex space-x-2">
          <button onclick="toggleFavorito(${producto.id})" 
                  class="p-2 bg-white bg-opacity-20 hover:bg-opacity-40 rounded-full transition transform hover:scale-110"
                  title="Agregar a favoritos">
            <i class="fas fa-heart text-white"></i>
          </button>
          <button onclick="toggleComparacion(${producto.id})" 
                  class="p-2 bg-white bg-opacity-20 hover:bg-opacity-40 rounded-full transition transform hover:scale-110"
                  title="Comparar producto">
            <i class="fas fa-balance-scale text-white"></i>
          </button>
          <button onclick="verProducto(${producto.id})" 
                  class="p-2 bg-white bg-opacity-20 hover:bg-opacity-40 rounded-full transition transform hover:scale-110"
                  title="Ver detalles y reseñas">
            <i class="fas fa-eye text-white"></i>
          </button>
        </div>
      </div>
    </div>
    
    <div class="p-4">
      <div class="flex justify-between items-start mb-2">
        <h3 class="text-lg font-bold line-clamp-2 flex-1">${producto.nombre}</h3>
        ${config.showCategoryTags ? `<span class="bg-indigo-600 text-white px-2 py-1 rounded text-xs whitespace-nowrap ml-2">${producto.categoria}</span>` : ''}
      </div>
      
      <!-- Rating y reseñas clickeable -->
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm text-indigo-400 font-medium">${producto.marca || 'Sin marca'}</span>
        <div class="flex items-center cursor-pointer hover:text-yellow-300 transition" 
             onclick="verProducto(${producto.id})" 
             title="Ver reseñas">
          ${estrellas}
          <span class="text-xs text-gray-400 ml-1">(${totalReviews > 0 ? totalReviews : 'Sin reseñas'})</span>
        </div>
      </div>
      
      <p class="text-sm text-gray-300 mb-3 line-clamp-2">${producto.descripcion}</p>
      
      <div class="flex justify-between items-center">
        <span class="font-bold text-indigo-400 text-lg">$${Number(producto.precio).toFixed(2)}</span>
        <div class="flex space-x-2">
          <button onclick="verProducto(${producto.id})" 
                  class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition"
                  title="Ver detalles">
            <i class="fas fa-info-circle mr-1"></i>Ver
          </button>
          <button class="add-to-cart px-3 py-1 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition" data-id="${producto.id}">
            <i class="fas fa-cart-plus mr-1"></i>Agregar
          </button>
        </div>
      </div>
    </div>
  `;
  
  return card;
}

/**
 * Genera estrellas de rating
 */
function generarEstrellasRating(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  let html = '';
  
  // Estrellas completas
  for (let i = 0; i < fullStars; i++) {
    html += '<i class="fas fa-star text-yellow-400"></i>';
  }
  
  // Media estrella
  if (hasHalfStar) {
    html += '<i class="fas fa-star-half-alt text-yellow-400"></i>';
  }
  
  // Estrellas vacías
  for (let i = 0; i < emptyStars; i++) {
    html += '<i class="far fa-star text-gray-400"></i>';
  }
  
  return html;
}

// Funciones para integración con otros sistemas
function toggleFavorito(productId) {
  if (typeof window.toggleFavorito === 'function') {
    window.toggleFavorito(productId);
  } else {
    console.log('Sistema de favoritos no disponible');
  }
}

function toggleComparacion(productId) {
  if (typeof window.toggleComparacion === 'function') {
    window.toggleComparacion(productId);
  } else {
    console.log('Sistema de comparación no disponible');
  }
}

function verProducto(productId) {
  if (typeof window.mostrarModalReviews === 'function') {
    window.mostrarModalReviews(productId);
  } else {
    console.log('Sistema de reseñas no disponible');
  }
}

/**
 * Genera imagen de fallback personalizada
 */
function generarImagenFallback(nombreProducto) {
  const emoji = obtenerEmojiProducto(nombreProducto);
  const textoEncoded = encodeURIComponent(`${emoji} ${nombreProducto.substring(0, 12)}`);
  return `https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=${textoEncoded}`;
}

/**
 * Obtiene emoji apropiado según el tipo de producto
 */
function obtenerEmojiProducto(nombre) {
  const nombreLower = nombre.toLowerCase();
  
  const emojis = {
    'smartphone': '📱', 'phone': '📱', 'teléfono': '📱',
    'laptop': '💻', 'computador': '💻',
    'auricular': '🎧', 'headphone': '🎧',
    'zapatilla': '👟', 'shoe': '👟',
    'camiseta': '👕', 'shirt': '👕',
    'reloj': '⌚', 'watch': '⌚',
    'mochila': '🎒', 'backpack': '🎒',
    'silla': '🪑', 'chair': '🪑',
    'licuadora': '🥤', 'blender': '🥤'
  };
  
  for (const [clave, emoji] of Object.entries(emojis)) {
    if (nombreLower.includes(clave)) return emoji;
  }
  
  return '📦';
}

/**
 * Configura botones de agregar al carrito
 */
function configurarBotonesCarrito(contenedor, productos) {
  const botones = contenedor.querySelectorAll('.add-to-cart');
  
  botones.forEach(boton => {
    // Remover listeners anteriores
    boton.replaceWith(boton.cloneNode(true));
    const nuevoBoton = contenedor.querySelector(`[data-id="${boton.dataset.id}"]`);
    
    nuevoBoton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const id = parseInt(this.dataset.id);
      const producto = productos.find(p => p.id === id);
      
      if (producto) {
        agregarAlCarrito(producto);
      }
    });
  });
}

/**
 * Configura filtros de búsqueda y ordenamiento
 */
function configurarFiltros(productos, config) {
  if (!config.showFilters) return;
  
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const sortFilter = document.getElementById('sortFilter');
  
  if (!searchInput || !categoryFilter || !sortFilter) {
    return; // Sin warning, simplemente salir
  }
  
  function aplicarFiltros() {
    const busqueda = searchInput.value.toLowerCase().trim();
    const categoria = categoryFilter.value;
    const orden = sortFilter.value;
    
    // Filtrar productos
    let productosFiltrados = productos.filter(producto => {
      const coincideBusqueda = !busqueda || 
        producto.nombre.toLowerCase().includes(busqueda) || 
        producto.descripcion.toLowerCase().includes(busqueda);
      
      const coincideCategoria = !categoria || producto.categoria === categoria;
      
      return coincideBusqueda && coincideCategoria;
    });
    
    // Ordenar productos
    if (orden) {
      const ordenamientos = {
        'priceAsc': (a, b) => a.precio - b.precio,
        'priceDesc': (a, b) => b.precio - a.precio,
        'nameAsc': (a, b) => a.nombre.localeCompare(b.nombre),
        'nameDesc': (a, b) => b.nombre.localeCompare(a.nombre),
        'recent': (a, b) => b.id - a.id
      };
      
      if (ordenamientos[orden]) {
        productosFiltrados.sort(ordenamientos[orden]);
      }
    }
    
    // Actualizar vista
    mostrarProductos(productosFiltrados, config);
  }
  
  // Configurar eventos de filtros con validación
  if (searchInput) searchInput.addEventListener('input', aplicarFiltros);
  if (categoryFilter) categoryFilter.addEventListener('change', aplicarFiltros);
  if (sortFilter) sortFilter.addEventListener('change', aplicarFiltros);
  
  console.log("🔍 Filtros configurados");
}

/**
 * Muestra mensaje cuando no hay productos
 */
function mostrarMensajeVacio() {
  const contenedor = document.getElementById('productsContainer');
  if (!contenedor) return;
  
  contenedor.innerHTML = `
    <div class="col-span-full text-center py-12">
      <i class="fas fa-box-open text-4xl text-gray-400 mb-4"></i>
      <h3 class="text-xl font-semibold text-gray-300 mb-2">No hay productos disponibles</h3>
      <p class="text-gray-400">Los productos se cargarán automáticamente</p>
    </div>
  `;
}

/**
 * Muestra error de carga
 */
function mostrarErrorCarga() {
  const contenedor = document.getElementById('productsContainer');
  if (!contenedor) return;
  
  contenedor.innerHTML = `
    <div class="col-span-full text-center py-12">
      <i class="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
      <h3 class="text-xl font-semibold text-red-300 mb-2">Error al cargar productos</h3>
      <p class="text-red-400">Por favor, recarga la página</p>
      <button onclick="window.location.reload()" class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
        <i class="fas fa-redo mr-2"></i>Recargar
      </button>
    </div>
  `;
}

// === FUNCIONES DEL CARRITO ===

/**
 * Inicializa el sistema de carrito
 */
function inicializarCarrito() {
  console.log("🛒 Inicializando carrito");
  
  const elementos = {
    carrito: obtenerCarritoStorage(),
    cartBtn: document.getElementById('cartButton'),
    cartModal: document.getElementById('cartModal'),
    closeCart: document.getElementById('closeCart'),
    clearCart: document.getElementById('clearCart'),
    checkout: document.getElementById('checkout')
  };
  
  if (!elementos.cartBtn || !elementos.cartModal) {
    return; // Sin warning
  }
  
  // Actualizar contador inicial
  actualizarContadorCarrito(elementos.carrito);
  
  // Configurar eventos
  elementos.cartBtn.addEventListener('click', () => abrirModalCarrito(elementos.carrito));
  
  if (elementos.closeCart) {
    elementos.closeCart.addEventListener('click', cerrarModalCarrito);
  }
  
  if (elementos.clearCart) {
    elementos.clearCart.addEventListener('click', vaciarCarrito);
  }
  
  if (elementos.checkout) {
    elementos.checkout.addEventListener('click', procesarCheckout);
  }
  
  console.log("✅ Carrito inicializado");
}

/**
 * Obtiene carrito del localStorage de forma segura
 */
function obtenerCarritoStorage() {
  try {
    return JSON.parse(localStorage.getItem('carrito') || '[]');
  } catch (error) {
    console.error("❌ Error al obtener carrito:", error);
    return [];
  }
}

/**
 * Guarda carrito en localStorage
 */
function guardarCarritoStorage(carrito) {
  try {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  } catch (error) {
    console.error("❌ Error al guardar carrito:", error);
  }
}

/**
 * Agrega producto al carrito
 */
function agregarAlCarrito(producto) {
  if (!producto) {
    return; // Sin error, simplemente salir
  }
  
  let carrito = obtenerCarritoStorage();
  
  // Buscar si el producto ya existe
  const indiceExistente = carrito.findIndex(item => item.id === producto.id);
  
  if (indiceExistente >= 0) {
    carrito[indiceExistente].cantidad += 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  
  // Guardar y actualizar UI
  guardarCarritoStorage(carrito);
  actualizarContadorCarrito(carrito);
  mostrarNotificacionCarrito(`${producto.nombre} agregado al carrito`);
}

/**
 * Actualiza contador del carrito
 */
function actualizarContadorCarrito(carrito) {
  const cartCount = document.getElementById('cartCount');
  if (!cartCount) return;
  
  const cantidad = carrito.reduce((total, item) => total + item.cantidad, 0);
  
  if (cantidad > 0) {
    cartCount.textContent = cantidad;
    cartCount.classList.remove('hidden');
  } else {
    cartCount.classList.add('hidden');
  }
}

/**
 * Abre modal del carrito
 */
function abrirModalCarrito(carrito) {
  const modal = document.getElementById('cartModal');
  if (modal) {
    modal.classList.remove('hidden');
    mostrarItemsCarrito(carrito);
  }
}

/**
 * Cierra modal del carrito
 */
function cerrarModalCarrito() {
  const modal = document.getElementById('cartModal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

/**
 * Muestra items en el modal del carrito
 */
function mostrarItemsCarrito(carrito) {
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  
  if (!cartItems || !cartTotal) return;
  
  cartItems.innerHTML = '';
  
  if (carrito.length === 0) {
    cartItems.innerHTML = `
      <div class="text-center py-8">
        <i class="fas fa-shopping-cart text-4xl text-gray-400 mb-4"></i>
        <p class="text-gray-300">Tu carrito está vacío</p>
        <p class="text-sm text-gray-400 mt-2">Agrega algunos productos para comenzar</p>
      </div>
    `;
    cartTotal.textContent = '$0.00';
    return;
  }
  
  let total = 0;
  
  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    
    const itemDiv = document.createElement('div');
    itemDiv.className = 'flex items-center justify-between bg-white bg-opacity-10 p-3 rounded mb-3';
    itemDiv.innerHTML = `
      <div class="flex items-center space-x-3">
        <img src="${item.imagen}" alt="${item.nombre}" class="w-12 h-12 object-cover rounded" 
             onerror="this.src='${generarImagenFallback(item.nombre)}'">
        <div>
          <h4 class="font-medium text-sm">${item.nombre}</h4>
          <p class="text-xs text-gray-400">$${item.precio.toFixed(2)} x ${item.cantidad}</p>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <span class="font-bold text-sm">$${subtotal.toFixed(2)}</span>
        <button class="remove-item p-1 hover:bg-red-500 hover:bg-opacity-20 rounded text-xs" data-id="${item.id}" title="Eliminar">
          <i class="fas fa-trash text-red-500"></i>
        </button>
      </div>
    `;
    
    cartItems.appendChild(itemDiv);
  });
  
  cartTotal.textContent = `$${total.toFixed(2)}`;
  
  // Configurar botones de eliminar
  cartItems.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = parseInt(this.dataset.id);
      eliminarDelCarrito(id);
    });
  });
}

/**
 * Elimina item del carrito
 */
function eliminarDelCarrito(id) {
  let carrito = obtenerCarritoStorage();
  carrito = carrito.filter(item => item.id !== id);
  
  guardarCarritoStorage(carrito);
  actualizarContadorCarrito(carrito);
  mostrarItemsCarrito(carrito);
}

/**
 * Vacía todo el carrito
 */
function vaciarCarrito() {
  if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
    guardarCarritoStorage([]);
    actualizarContadorCarrito([]);
    mostrarItemsCarrito([]);
    mostrarNotificacionCarrito('Carrito vaciado');
  }
}

/**
 * Procesa el checkout
 */
function procesarCheckout() {
  const carrito = obtenerCarritoStorage();
  
  if (carrito.length === 0) {
    mostrarNotificacionCarrito('Tu carrito está vacío', 'error');
    return;
  }
  
  const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const cantidadItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  
  const mensaje = `¡Gracias por tu compra!

Total: $${total.toFixed(2)}
Productos: ${cantidadItems} items
Fecha: ${new Date().toLocaleDateString('es-ES')}

En un sistema real, serías redirigido al proceso de pago.`;

  alert(mensaje);
  
  // Limpiar carrito después de la compra
  guardarCarritoStorage([]);
  actualizarContadorCarrito([]);
  cerrarModalCarrito();
}

/**
 * Muestra notificación del carrito
 */
function mostrarNotificacionCarrito(mensaje, tipo = 'success') {
  const notificacion = document.createElement('div');
  notificacion.className = `fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 ${
    tipo === 'success' ? 'bg-green-500' : 'bg-red-500'
  } text-white transform translate-x-full transition-transform duration-300`;
  
  notificacion.innerHTML = `
    <div class="flex items-center">
      <i class="fas ${tipo === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'} mr-2"></i>
      <span class="text-sm">${mensaje}</span>
    </div>
  `;
  
  document.body.appendChild(notificacion);
  
  // Animación de entrada
  setTimeout(() => notificacion.classList.remove('translate-x-full'), 100);
  
  // Remover después de 3 segundos
  setTimeout(() => {
    notificacion.classList.add('translate-x-full');
    setTimeout(() => notificacion.remove(), 300);
  }, 3000);
}

// === NAVEGACIÓN ===

/**
 * Configura la navegación suave
 */
function configurarNavegacion() {
  const elementos = [
    { id: 'viewCatalogBtn', target: 'catalogView' },
    { id: 'heroCatalogBtn', target: 'catalogView' }
  ];
  
  elementos.forEach(({ id, target }) => {
    const elemento = document.getElementById(id);
    const objetivo = document.getElementById(target);
    
    if (elemento && objetivo) {
      elemento.addEventListener('click', (e) => {
        e.preventDefault();
        objetivo.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      });
    }
  });
  
  console.log("🧭 Navegación configurada");
}

// === FUNCIÓN PARA RECARGAR PRODUCTOS (usada por admin.js) ===

/**
 * Recarga productos desde localStorage (llamada desde admin.js)
 */
function recargarProductos() {
  console.log("🔄 Recargando productos...");
  const productos = obtenerProductosAlmacenados();
  if (productos) {
    productosGlobales = productos;
    procesarProductos(productos, configGlobal);
  }
}

// Hacer función global para que admin.js pueda usarla
window.recargarProductos = recargarProductos;

console.log('✅ Catálogo Digital cargado - Gonzapereyraa - 2025-09-02 14:36:22');