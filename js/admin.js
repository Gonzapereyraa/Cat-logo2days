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