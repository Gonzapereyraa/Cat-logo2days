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
