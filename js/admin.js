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