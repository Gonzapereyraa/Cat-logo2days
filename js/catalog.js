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