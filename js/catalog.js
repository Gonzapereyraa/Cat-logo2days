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
      oferta: true
    },
    {
      id: 2,
      nombre: "Zapatillas Running Pro",
      descripcion: "Zapatillas para correr con máxima amortiguación y estabilidad para deportistas.",
      precio: 129.99,
      categoria: "Deportes",
      imagen: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      oferta: false
    },
    {
      id: 3,
      nombre: "Licuadora Multifunción",
      descripcion: "Licuadora de alta potencia con 10 velocidades y vaso de vidrio resistente.",
      precio: 89.99,
      categoria: "Hogar",
      imagen: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      oferta: true
    },
    {
      id: 4,
      nombre: "Camiseta Premium",
      descripcion: "Camiseta de algodón 100% con diseño exclusivo y corte moderno.",
      precio: 29.99,
      categoria: "Ropa",
      imagen: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      oferta: false
    },
    {
      id: 5,
      nombre: "Auriculares Inalámbricos",
      descripcion: "Auriculares con cancelación de ruido activa y 30 horas de batería.",
      precio: 149.99,
      categoria: "Electrónicos",
      imagen: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      oferta: true
    },
    {
      id: 6,
      nombre: "Mochila Impermeable",
      descripcion: "Mochila con compartimentos acolchados para laptop y tablet, resistente al agua.",
      precio: 59.99,
      categoria: "Accesorios",
      imagen: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      oferta: false
    },
    {
      id: 7,
      nombre: "Reloj Inteligente",
      descripcion: "Smartwatch con monitoreo de salud, GPS y notificaciones inteligentes.",
      precio: 199.99,
      categoria: "Electrónicos",
      imagen: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      oferta: true
    },
    {
      id: 8,
      nombre: "Silla Ergonómica",
      descripcion: "Silla de oficina con soporte lumbar y reposabrazos ajustables para máximo confort.",
      precio: 249.99,
      categoria: "Hogar",
      imagen: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      oferta: false
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
  
  // Actualizar filtros de categorías
  actualizarFiltrosCategorias(productos);
  
  // Mostrar productos destacados (si existen)
  mostrarProductosDestacados(productos, config);
  
  // Mostrar productos regulares
  mostrarProductos(productos, config);
  
  // Configurar filtros de búsqueda
  configurarFiltros(productos, config);
  
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