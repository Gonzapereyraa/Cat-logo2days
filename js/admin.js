// Variables globales para administración
let isEditMode = false;
let currentEditingProduct = null;
let currentEditingField = null;
let selectedTemplate = 'clasica';
let adminInitialized = false;

// Credenciales de administrador
const adminCredentials = {
    'admin': 'admin123',
    'Gonzapereyraa': 'admin123'
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    if (adminInitialized) return;
    adminInitialized = true;
    
    console.log('🔧 Inicializando panel de administración - Usuario: Gonzapereyraa');
    console.log('📅 Fecha y hora: 2025-09-02 18:13:58 UTC');
    
    // Asegurar que elementos admin estén ocultos por defecto
    limpiarModoAdminInicial();
    
    // Esperar a que el catálogo se cargue
    setTimeout(() => {
        try {
            initializeAdminPanel();
            console.log('✅ Panel de administración inicializado correctamente');
        } catch (error) {
            console.error('❌ Error al inicializar panel de administración:', error);
        }
    }, 200);
});

// === FUNCIONES DE PERSISTENCIA ===

/**
 * Cargar textos editables guardados desde localStorage
 * Ejecutado al cargar la página
 */
function cargarTextosGuardados() {
    try {
        const savedTexts = JSON.parse(localStorage.getItem('editableTexts') || '{}');
        console.log('📥 Cargando textos guardados por Gonzapereyraa...');
        
        Object.keys(savedTexts).forEach(field => {
            // Saltar metadatos de modificación
            if (field.includes('_lastModified') || field.includes('_modifiedBy') || field.includes('_timestamp')) return;
            
            const element = document.getElementById(field) || document.querySelector(`[data-field="${field}"]`);
            if (element && savedTexts[field]) {
                element.textContent = savedTexts[field];
                console.log(`✅ Texto cargado para ${field}: "${savedTexts[field]}"`);
            }
        });
        
        // Mostrar estadísticas de carga
        const totalTextos = Object.keys(savedTexts).filter(key => 
            !key.includes('_lastModified') && !key.includes('_modifiedBy') && !key.includes('_timestamp')
        ).length;
        
        if (totalTextos > 0) {
            console.log(`📊 ${totalTextos} textos personalizados cargados - Gonzapereyraa`);
        }
        
    } catch (error) {
        console.error('❌ Error al cargar textos guardados:', error);
    }
}

/**
 * Guardar configuración de sitio en localStorage
 */
function guardarConfiguracionSitio() {
    try {
        const config = {
            version: '1.0.0',
            lastModified: '2025-09-02 18:13:58',
            modifiedBy: 'Gonzapereyraa',
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent.substring(0, 100)
        };
        
        localStorage.setItem('siteConfig', JSON.stringify(config));
        console.log('💾 Configuración del sitio guardada - 2025-09-02 18:13:58');
        
    } catch (error) {
        console.error('❌ Error al guardar configuración:', error);
    }
}

/**
 * Crear backup automático de los datos
 */
function crearBackupAutomatico() {
    try {
        const backupData = {
            textos: JSON.parse(localStorage.getItem('editableTexts') || '{}'),
            productos: JSON.parse(localStorage.getItem('productos') || '[]'),
            plantilla: localStorage.getItem('plantillaGuardada') || 'clasica',
            fechaBackup: '2025-09-02 18:13:58',
            timestampBackup: new Date().toISOString(),
            usuario: 'Gonzapereyraa',
            version: '1.0.0'
        };
        
        // Guardar backup con timestamp
        const backupKey = `backup_${Date.now()}`;
        localStorage.setItem(backupKey, JSON.stringify(backupData));
        
        // Mantener solo los últimos 5 backups
        const allKeys = Object.keys(localStorage);
        const backupKeys = allKeys.filter(key => key.startsWith('backup_')).sort();
        
        if (backupKeys.length > 5) {
            const keysToDelete = backupKeys.slice(0, backupKeys.length - 5);
            keysToDelete.forEach(key => localStorage.removeItem(key));
            console.log(`🗑️ ${keysToDelete.length} backups antiguos eliminados`);
        }
        
        console.log(`💾 Backup automático creado: ${backupKey} - Gonzapereyraa`);
        
    } catch (error) {
        console.error('❌ Error al crear backup:', error);
    }
}
/**
 * Configurar guardado automático cada 5 minutos
 */
function configurarGuardadoAutomatico() {
    // Guardado automático cada 5 minutos
    setInterval(() => {
        if (isEditMode) {
            crearBackupAutomatico();
            console.log('💾 Backup automático ejecutado - Gonzapereyraa - 2025-09-02 18:13:58');
        }
    }, 5 * 60 * 1000); // 5 minutos
    
    // Guardar antes de cerrar la página
    window.addEventListener('beforeunload', (e) => {
        if (isEditMode) {
            crearBackupAutomatico();
            console.log('💾 Backup al cerrar página - Gonzapereyraa');
        }
    });
    
    console.log('⏰ Guardado automático configurado cada 5 minutos - 2025-09-02 18:13:58');
}
function limpiarModoAdminInicial() {
    // Ocultar barra admin si no está en modo edición
    const toolbar = document.getElementById('adminToolbar');
    if (toolbar && !isEditMode) {
        toolbar.style.display = 'none';
        toolbar.style.visibility = 'hidden';
    }
    
    // Remover cualquier clase edit-mode residual
    if (!isEditMode) {
        document.body.classList.remove('edit-mode');
    }
    
    console.log('🧹 Estado admin inicial limpiado - 2025-09-02 18:13:58');
}

/**
 * Inicializa el panel de administración
 */
function initializeAdminPanel() {
    // Cargar textos guardados PRIMERO
    cargarTextosGuardados();
    
    setupLoginSystem();
    setupAdminToolbar();
    setupModals();
    setupCategoryManagement();
    setupTemplateSelection();
    
    // Configurar guardado automático
    configurarGuardadoAutomatico();
    
    console.log('✅ Panel de administración inicializado con persistencia - Gonzapereyraa');
}

// === SISTEMA DE LOGIN ===

function setupLoginSystem() {
    const loginBtn = getElementById('loginBtn');
    const loginModal = getElementById('loginModal');
    const loginForm = getElementById('loginForm');
    const cancelLogin = getElementById('cancelLogin');

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            if (isEditMode) {
                exitEditMode();
            } else {
                openLoginModal();
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (cancelLogin) {
        cancelLogin.addEventListener('click', closeLoginModal);
    }

    // Cerrar modal al hacer clic fuera
    if (loginModal) {
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                closeLoginModal();
            }
        });
    }
}

function openLoginModal() {
    const modal = getElementById('loginModal');
    if (modal) {
        modal.classList.remove('hidden');
        resetLoginForm();
    }
}

function closeLoginModal() {
    const modal = getElementById('loginModal');
    if (modal) {
        modal.classList.add('hidden');
        resetLoginForm();
    }
}

function resetLoginForm() {
    const form = getElementById('loginForm');
    const error = getElementById('loginError');
    
    if (form) form.reset();
    if (error) error.classList.add('hidden');
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = getElementById('username')?.value;
    const password = getElementById('password')?.value;
    
    console.log(`🔐 Intento de login: ${username} - 2025-09-02 18:13:58`);
    
    if (adminCredentials[username] && adminCredentials[username] === password) {
        console.log('✅ Login exitoso para:', username);
        enterEditMode();
        closeLoginModal();
        showNotification(`¡Bienvenido ${username}! Modo edición activado`, 'success');
        
        // Debug temporal
        setTimeout(() => {
            debugModoAdmin();
        }, 1000);
        
    } else {
        console.log('❌ Credenciales incorrectas');
        const error = getElementById('loginError');
        if (error) error.classList.remove('hidden');
    }
}

// === GESTIÓN DE ESTILOS ADMIN ===

function cargarEstilosAdmin() {
    if (document.getElementById('admin-styles')) {
        console.log('ℹ️ Estilos de admin ya están cargados');
        return;
    }
    
    const style = document.createElement('style');
    style.id = 'admin-styles';
    style.textContent = `
        /* === BARRA ADMIN COMPACTA Y VISUAL - Gonzapereyraa === */
        /* Fecha: 2025-09-02 18:13:58 UTC */
        
        /* Barra admin compacta pero funcional */
        .admin-toolbar {
            display: block !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            background: linear-gradient(135deg, #1F2937 0%, #111827 100%) !important;
            backdrop-filter: blur(10px) !important;
            color: white !important;
            padding: 8px 16px !important;
            z-index: 1000 !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
            border-bottom: 2px solid rgba(79, 70, 229, 0.3) !important;
            transform: translateY(-100%) !important;
            transition: transform 0.3s ease !important;
            min-height: 60px !important;
        }
        
        .admin-toolbar.active {
            transform: translateY(0) !important;
        }
        
        /* Contenedor principal más compacto */
        .admin-toolbar .container {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            max-width: 1200px !important;
            margin: 0 auto !important;
            padding: 0 !important;
        }
        
        /* Sección izquierda - Info del admin */
        .admin-toolbar .flex:first-child {
            display: flex !important;
            align-items: center !important;
            gap: 12px !important;
        }
        
        .admin-toolbar .fas.fa-tools {
            font-size: 18px !important;
            color: #FBBF24 !important;
            animation: toolSpin 3s infinite linear !important;
        }
        
        @keyframes toolSpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .admin-toolbar .font-bold {
            font-size: 14px !important;
            font-weight: 600 !important;
            background: linear-gradient(45deg, #FBBF24, #F59E0B) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            background-clip: text !important;
        }
        
        .admin-toolbar .text-sm.opacity-75 {
            font-size: 11px !important;
            color: rgba(255, 255, 255, 0.6) !important;
            font-style: italic !important;
        }
        
        /* Sección derecha - Botones de acción */
        .admin-toolbar .flex:last-child {
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
        }
        
        /* Botones compactos y visuales */
        .admin-toolbar button {
            padding: 6px 12px !important;
            border-radius: 8px !important;
            border: none !important;
            font-size: 12px !important;
            font-weight: 500 !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
            display: flex !important;
            align-items: center !important;
            gap: 4px !important;
            min-width: auto !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
        }
        
        /* Botón Guardar */
        #saveAllBtn {
            background: linear-gradient(45deg, #10B981, #059669) !important;
            color: white !important;
        }
        
        #saveAllBtn:hover {
            background: linear-gradient(45deg, #059669, #047857) !important;
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4) !important;
        }
        
        /* Botón Producto */
        #addProductBtn {
            background: linear-gradient(45deg, #3B82F6, #2563EB) !important;
            color: white !important;
        }
        
        #addProductBtn:hover {
            background: linear-gradient(45deg, #2563EB, #1D4ED8) !important;
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4) !important;
        }
        
        /* Botón Plantillas */
        #templateBtn {
            background: linear-gradient(45deg, #8B5CF6, #7C3AED) !important;
            color: white !important;
        }
        
        #templateBtn:hover {
            background: linear-gradient(45deg, #7C3AED, #6D28D9) !important;
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4) !important;
        }
        
        /* Botón Salir */
        #exitEditBtn {
            background: linear-gradient(45deg, #EF4444, #DC2626) !important;
            color: white !important;
        }
        
        #exitEditBtn:hover {
            background: linear-gradient(45deg, #DC2626, #B91C1C) !important;
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4) !important;
        }
        
        /* Iconos de los botones */
        .admin-toolbar button i {
            font-size: 11px !important;
        }
        
        /* Responsive - pantallas pequeñas */
        @media (max-width: 768px) {
            .admin-toolbar {
                padding: 6px 12px !important;
                min-height: 50px !important;
            }
            
            .admin-toolbar .container {
                flex-direction: column !important;
                gap: 6px !important;
            }
            
            .admin-toolbar .font-bold {
                font-size: 12px !important;
            }
            
            .admin-toolbar .text-sm {
                display: none !important;
            }
            
            .admin-toolbar button {
                padding: 4px 8px !important;
                font-size: 10px !important;
            }
            
            .admin-toolbar button span {
                display: none !important;
            }
        }
        
        /* Ajuste para el contenido principal */
        .edit-mode {
            padding-top: 70px !important;
        }
        
        @media (max-width: 768px) {
            .edit-mode {
                padding-top: 80px !important;
            }
        }
        
        /* Elementos editables */
        .edit-mode .editable {
            border: 2px dashed #4F46E5 !important;
            position: relative !important;
            cursor: pointer !important;
            padding: 4px !important;
            border-radius: 4px !important;
            transition: all 0.3s ease !important;
        }
        
        .edit-mode .editable:hover {
            background-color: rgba(79, 70, 229, 0.1) !important;
            border-color: #7C3AED !important;
            box-shadow: 0 0 10px rgba(79, 70, 229, 0.3) !important;
        }
        
        /* Overlay de edición */
        .edit-overlay {
            position: absolute !important;
            top: -6px !important;
            right: -6px !important;
            background: linear-gradient(45deg, #4F46E5, #7C3AED) !important;
            color: white !important;
            border-radius: 50% !important;
            width: 20px !important;
            height: 20px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 10px !important;
            cursor: pointer !important;
            z-index: 10 !important;
            transition: all 0.2s ease !important;
            box-shadow: 0 2px 8px rgba(79, 70, 229, 0.4) !important;
        }
        
        .edit-overlay:hover {
            background: linear-gradient(45deg, #3730A3, #5B21B6) !important;
            transform: scale(1.1) !important;
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.6) !important;
        }
        
        /* Controles de productos */
        .product-edit-controls {
            opacity: 0 !important;
            transition: opacity 0.3s ease !important;
            background: rgba(0, 0, 0, 0.9) !important;
            padding: 4px !important;
            border-radius: 8px !important;
            backdrop-filter: blur(10px) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        
        .edit-mode .product-card:hover .product-edit-controls {
            opacity: 1 !important;
        }
        
        .product-edit-controls button {
            min-width: 24px !important;
            height: 24px !important;
            padding: 4px !important;
            margin: 0 2px !important;
        }
        
        /* Indicador sutil de estado */
        .edit-mode::after {
            content: "✏️ Editando" !important;
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            background: rgba(79, 70, 229, 0.9) !important;
            color: white !important;
            padding: 6px 12px !important;
            border-radius: 20px !important;
            font-size: 11px !important;
            font-weight: 500 !important;
            z-index: 999 !important;
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4) !important;
            animation: editPulse 2s infinite !important;
        }
        
        @keyframes editPulse {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 1; }
        }
    `;
    
    document.head.appendChild(style);
    console.log('✅ Barra admin compacta y visual cargada - Gonzapereyraa - 2025-09-02 18:13:58');
}

function removerEstilosAdmin() {
    const adminStyles = document.getElementById('admin-styles');
    if (adminStyles) {
        adminStyles.remove();
        console.log('🗑️ Estilos de admin removidos - 2025-09-02 18:13:58');
    }
}

// === MODO EDICIÓN ===

function enterEditMode() {
    console.log('🔧 Entrando en modo edición - Gonzapereyraa...');
    console.log('🕐 Hora de entrada: 2025-09-02 18:13:58 UTC');
    
    isEditMode = true;
    
    // Cargar estilos de admin dinámicamente PRIMERO
    cargarEstilosAdmin();
    
    // Asegurar que la toolbar esté visible
    const toolbar = getElementById('adminToolbar');
    if (toolbar) {
        toolbar.style.display = 'block';
        toolbar.style.visibility = 'visible';
        toolbar.style.opacity = '1';
        console.log('👁️ Toolbar admin forzado a visible');
    }
    
    // Aplicar clases después de un pequeño delay para asegurar que los estilos se carguen
    setTimeout(() => {
        document.body.classList.add('edit-mode');
        console.log('📝 Clase edit-mode agregada al body');
        
        if (toolbar) {
            toolbar.classList.add('active');
            console.log('✅ Toolbar admin activado con clase active');
        }
        
        const loginBtn = getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.innerHTML = '<i class="fas fa-sign-out-alt text-xl"></i>';
            loginBtn.title = 'Salir del modo administración';
        }
        
        // Agregar elementos editables después de que los estilos se carguen
        setTimeout(() => {
            addEditableElements();
            console.log('🎨 Elementos editables agregados');
        }, 300);
        
    }, 200);
    
    console.log('🎯 Modo edición activado para Gonzapereyraa - 2025-09-02 18:13:58');
}

function exitEditMode() {
    console.log('🚪 Saliendo del modo edición...');
    console.log('🕐 Hora de salida: 2025-09-02 18:13:58 UTC');
    
    isEditMode = false;
    
    // Limpiar completamente el modo admin
    limpiarModoAdmin();
    
    const loginBtn = getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.innerHTML = '<i class="fas fa-user-shield text-xl"></i>';
        loginBtn.title = 'Panel de Administración';
    }
    
    console.log('✅ Modo edición desactivado - 2025-09-02 18:13:58');
}

function limpiarModoAdmin() {
    // Remover estilos
    removerEstilosAdmin();
    
    // Remover clases
    document.body.classList.remove('edit-mode');
    
    // Ocultar y limpiar toolbar
    const toolbar = getElementById('adminToolbar');
    if (toolbar) {
        toolbar.style.display = 'none';
        toolbar.style.visibility = 'hidden';
        toolbar.classList.remove('active');
    }
    
    // Remover elementos editables
    removeEditableElements();
    
    console.log('🧹 Modo admin completamente limpiado - 2025-09-02 18:13:58');
}

function addEditableElements() {
    console.log('🎨 Agregando elementos editables...');
    
    // Agregar overlays de edición a elementos editables
    const editableElements = document.querySelectorAll('.editable');
    console.log(`📝 Encontrados ${editableElements.length} elementos editables`);
    
    editableElements.forEach(element => {
        if (!element.querySelector('.edit-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'edit-overlay';
            overlay.innerHTML = '<i class="fas fa-edit"></i>';
            overlay.addEventListener('click', (e) => {
                e.stopPropagation();
                editElement(element);
            });
            element.appendChild(overlay);
        }
    });

    // Agregar controles de edición a productos
    const productCards = document.querySelectorAll('.product-card, [data-id]');
    console.log(`📦 Encontradas ${productCards.length} tarjetas de productos`);
    
    productCards.forEach(card => {
        if (!card.querySelector('.product-edit-controls')) {
            const productId = card.dataset.id;
            if (productId) {
                const controls = document.createElement('div');
                controls.className = 'product-edit-controls absolute top-2 right-2 space-x-1 opacity-0 transition-opacity';
                controls.innerHTML = `
                    <button class="bg-blue-500 text-white p-1 rounded text-xs hover:bg-blue-600 transition" onclick="editProductAdmin(${productId})" title="Editar producto">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="bg-red-500 text-white p-1 rounded text-xs hover:bg-red-600 transition" onclick="deleteProductAdmin(${productId})" title="Eliminar producto">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                card.appendChild(controls);
                
                // Mostrar controles al hacer hover
                card.addEventListener('mouseenter', () => {
                    if (isEditMode) {
                        controls.classList.remove('opacity-0');
                        controls.classList.add('opacity-100');
                    }
                });
                
                card.addEventListener('mouseleave', () => {
                    controls.classList.remove('opacity-100');
                    controls.classList.add('opacity-0');
                });
            }
        }
    });
    
    console.log('✅ Elementos editables agregados correctamente - 2025-09-02 18:13:58');
}

function removeEditableElements() {
    document.querySelectorAll('.edit-overlay').forEach(overlay => overlay.remove());
    document.querySelectorAll('.product-edit-controls').forEach(controls => controls.remove());
    console.log('🗑️ Elementos editables removidos - 2025-09-02 18:13:58');
}
// === BARRA DE HERRAMIENTAS ===

function setupAdminToolbar() {
    addEventListenerSafe('exitEditBtn', 'click', exitEditMode);
    addEventListenerSafe('saveAllBtn', 'click', saveAllChanges);
    addEventListenerSafe('addProductBtn', 'click', () => openProductModal());
    addEventListenerSafe('templateBtn', 'click', openTemplateModal);
}
// === GESTIÓN DE PRODUCTOS ===

function openProductModal(product = null) {
    currentEditingProduct = product;
    const modal = getElementById('productModal');
    const title = getElementById('productModalTitle');

    updateProductCategorySelect();

    if (product) {
        if (title) title.textContent = 'Editar Producto';
        fillProductForm(product);
        console.log(`📝 Editando producto: ${product.nombre} - 2025-09-02 18:13:58`);
    } else {
        if (title) title.textContent = 'Agregar Producto';
        resetProductForm();
        console.log('➕ Agregando nuevo producto - 2025-09-02 18:13:58');
    }

    if (modal) modal.classList.remove('hidden');
}

function fillProductForm(product) {
    setElementValue('productName', product.nombre || '');
    setElementValue('productDescription', product.descripcion || '');
    setElementValue('productPrice', product.precio || '');
    setElementValue('productCategory', product.categoria || '');
    setElementValue('productImage', product.imagen || '');
}

function resetProductForm() {
    const form = getElementById('productForm');
    if (form) form.reset();
}

function closeProductModal() {
    const modal = getElementById('productModal');
    if (modal) modal.classList.add('hidden');
    currentEditingProduct = null;
}

function handleProductSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const productName = formData.get('name');
    
    if (!productName || !formData.get('price') || !formData.get('category')) {
        showNotification('Por favor completa todos los campos obligatorios', 'error');
        return;
    }
    
    const productData = {
        id: currentEditingProduct ? currentEditingProduct.id : Date.now(),
        nombre: productName,
        descripcion: formData.get('description') || '',
        precio: parseFloat(formData.get('price')),
        categoria: formData.get('category'),
        imagen: formData.get('image') || generateFallbackImage(productName),
        oferta: Math.random() > 0.7,
        fechaCreacion: '2025-09-02 18:13:58',
        timestampCreacion: new Date().toISOString(),
        creadoPor: 'Gonzapereyraa'
    };

    let productos = getStoredProducts();

    if (currentEditingProduct) {
        const index = productos.findIndex(p => p.id === currentEditingProduct.id);
        if (index !== -1) {
            productos[index] = { 
                ...productos[index], 
                ...productData, 
                fechaModificacion: '2025-09-02 18:13:58',
                timestampModificacion: new Date().toISOString()
            };
        }
        console.log(`✅ Producto actualizado: ${productName} - Gonzapereyraa`);
        showNotification('Producto actualizado correctamente', 'success');
    } else {
        productos.push(productData);
        console.log(`➕ Producto agregado: ${productName} - Gonzapereyraa`);
        showNotification('Producto agregado correctamente', 'success');
    }

    saveProducts(productos);
    closeProductModal();
    
    // Crear backup automático
    crearBackupAutomatico();
    
    // Recargar productos sin recargar página completa
    if (window.recargarProductos) {
        setTimeout(() => {
            window.recargarProductos();
            setTimeout(() => {
                if (isEditMode) addEditableElements();
            }, 200);
        }, 500);
    } else {
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
}

function updateProductCategorySelect() {
    const categorySelect = getElementById('productCategory');
    if (!categorySelect) return;
    
    const productos = getStoredProducts();
    const categorias = [...new Set(productos.map(p => p.categoria))];
    
    const currentValue = categorySelect.value;
    categorySelect.innerHTML = '<option value="">Seleccionar categoría</option>';
    
    const categoriasDefault = ['Electrónicos', 'Ropa', 'Hogar', 'Deportes', 'Accesorios'];
    const todasCategorias = [...new Set([...categoriasDefault, ...categorias])];
    
    todasCategorias.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
    
    if (currentValue) categorySelect.value = currentValue;
}

function setupCategoryManagement() {
    setTimeout(() => {
        const categoryContainer = getElementById('categoryContainer');
        if (!categoryContainer || categoryContainer.querySelector('.add-category-btn')) return;

        const addCategoryBtn = document.createElement('button');
        addCategoryBtn.type = 'button';
        addCategoryBtn.className = 'add-category-btn mt-2 text-sm text-indigo-600 hover:text-indigo-800 transition';
        addCategoryBtn.innerHTML = '<i class="fas fa-plus mr-1"></i>Agregar nueva categoría';
        addCategoryBtn.addEventListener('click', addNewCategory);
        categoryContainer.appendChild(addCategoryBtn);
    }, 500);
}

function addNewCategory() {
    const categoryName = prompt('Ingresa el nombre de la nueva categoría:');
    if (categoryName && categoryName.trim()) {
        const trimmedName = categoryName.trim();
        updateProductCategorySelect();
        
        const productCategory = getElementById('productCategory');
        if (productCategory) productCategory.value = trimmedName;
        
        console.log(`📂 Nueva categoría agregada: ${trimmedName} - Gonzapereyraa - 2025-09-02 18:13:58`);
        showNotification(`Categoría "${trimmedName}" agregada`, 'success');
    }
}

// Funciones globales para productos
window.editProductAdmin = function(id) {
    const productos = getStoredProducts();
    const product = productos.find(p => p.id === parseInt(id));
    if (product) {
        console.log(`✏️ Editando producto ID: ${id} - Gonzapereyraa - 2025-09-02 18:13:58`);
        openProductModal(product);
    }
};

window.deleteProductAdmin = function(id) {
    const productos = getStoredProducts();
    const product = productos.find(p => p.id === parseInt(id));
    
    if (product && confirm(`¿Estás seguro de que quieres eliminar "${product.nombre}"?`)) {
        const productosFiltered = productos.filter(p => p.id !== parseInt(id));
        saveProducts(productosFiltered);
        
        console.log(`🗑️ Producto eliminado: ${product.nombre} - Gonzapereyraa - 2025-09-02 18:13:58`);
        showNotification('Producto eliminado correctamente', 'success');
        
        // Crear backup automático
        crearBackupAutomatico();
        
        if (window.recargarProductos) {
            setTimeout(() => {
                window.recargarProductos();
                setTimeout(() => {
                    if (isEditMode) addEditableElements();
                }, 200);
            }, 500);
        } else {
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }
};

// === PLANTILLAS ===

function setupTemplateSelection() {
    window.editarPlantilla = function(plantilla) {
        console.log(`🎨 Seleccionando plantilla: ${plantilla} por Gonzapereyraa - 2025-09-02 18:13:58`);
        
        document.querySelectorAll('.template-option').forEach(option => {
            option.classList.remove('border-indigo-500', 'bg-indigo-50');
        });
        
        const selectedOption = document.querySelector(`[data-template="${plantilla}"]`);
        if (selectedOption) {
            selectedOption.classList.add('border-indigo-500', 'bg-indigo-50');
        }
        
        selectedTemplate = plantilla;
        console.log(`✅ Plantilla "${plantilla}" seleccionada`);
    };
}

function openTemplateModal() {
    const modal = getElementById('templateModal');
    if (modal) modal.classList.remove('hidden');
    
    const currentTemplate = localStorage.getItem('plantillaGuardada') || 'clasica';
    document.querySelectorAll('.template-option').forEach(option => {
        option.classList.remove('border-indigo-500', 'bg-indigo-50');
        
        if (option.dataset.template === currentTemplate) {
            option.classList.add('border-indigo-500', 'bg-indigo-50');
            selectedTemplate = currentTemplate;
        }
    });
    
    console.log(`🎨 Modal de plantillas abierto. Plantilla actual: ${currentTemplate} - 2025-09-02 18:13:58`);
}

function closeTemplateModal() {
    const modal = getElementById('templateModal');
    if (modal) modal.classList.add('hidden');
}

function selectTemplate(templateName) {
    document.querySelectorAll('.template-option').forEach(option => {
        option.classList.remove('border-indigo-500', 'bg-indigo-50');
    });

    const selectedOption = document.querySelector(`[data-template="${templateName}"]`);
    if (selectedOption) {
        selectedOption.classList.add('border-indigo-500', 'bg-indigo-50');
    }
    
    selectedTemplate = templateName;
}

function applySelectedTemplate() {
    if (!selectedTemplate) {
        showNotification('Por favor selecciona una plantilla', 'error');
        return;
    }
    
    localStorage.setItem('plantillaGuardada', selectedTemplate);
    
    // Guardar metadatos de plantilla
    const templateMetadata = {
        plantilla: selectedTemplate,
        fechaCambio: '2025-09-02 18:13:58',
        timestampCambio: new Date().toISOString(),
        cambiadoPor: 'Gonzapereyraa'
    };
    localStorage.setItem('templateMetadata', JSON.stringify(templateMetadata));
    
    closeTemplateModal();
    
    console.log(`🎨 Plantilla aplicada: ${selectedTemplate} por Gonzapereyraa - 2025-09-02 18:13:58`);
    showNotification(`Plantilla "${selectedTemplate}" aplicada correctamente`, 'success');
    
    // Crear backup automático
    crearBackupAutomatico();
    
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}