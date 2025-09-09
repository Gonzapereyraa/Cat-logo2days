/**
 * Módulo principal para funcionalidades generales del catálogo
 */

import { initCart, addToCart } from './cart.js';
import { initCarousel } from './carousel.js';

// Variables globales
let isEditMode = false;
let adminCredentials = {
  'admin': 'admin123',
  'Gonzapereyraa': 'admin123'
};

/**
 * Inicializar aplicación
 */
export function initApp() {
  console.log('🚀 Iniciando aplicación - Catálogo Digital');
  
  // Inicializar carrito
  initCart();
  
  // Configurar navegación
  setupNavigation();
  
  // Configurar modales
  setupModals();
  
  // Configurar login
  setupLogin();
  
  // Configurar búsqueda y filtros
  setupFilters();
  
  console.log('✅ Aplicación inicializada correctamente');
}

/**
 * Configurar navegación suave
 */
function setupNavigation() {
  // Smooth scrolling para enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Configurar modales
 */
function setupModals() {
  // Modal de login
  const loginModal = document.getElementById('loginModal');
  const loginBtn = document.getElementById('loginBtn');
  const cancelLogin = document.getElementById('cancelLogin');
  
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      if (loginModal) {
        loginModal.classList.remove('hidden');
      }
    });
  }
  
  if (cancelLogin) {
    cancelLogin.addEventListener('click', () => {
      if (loginModal) {
        loginModal.classList.add('hidden');
      }
    });
  }

  // Cerrar modales con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modals = document.querySelectorAll('.fixed.inset-0');
      modals.forEach(modal => {
        if (!modal.classList.contains('hidden')) {
          modal.classList.add('hidden');
        }
      });
    }
  });

  // Cerrar modales clickeando fuera
  const modals = document.querySelectorAll('[id$="Modal"]');
  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  });
}

/**
 * Configurar sistema de login
 */
function setupLogin() {
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');
  
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      if (adminCredentials[username] && adminCredentials[username] === password) {
        console.log(`✅ Login exitoso para usuario: ${username}`);
        enableEditMode();
        document.getElementById('loginModal').classList.add('hidden');
        loginForm.reset();
        if (loginError) loginError.classList.add('hidden');
      } else {
        console.log('❌ Credenciales incorrectas');
        if (loginError) loginError.classList.remove('hidden');
      }
    });
  }
}

/**
 * Habilitar modo de edición
 */
function enableEditMode() {
  isEditMode = true;
  const adminToolbar = document.getElementById('adminToolbar');
  if (adminToolbar) {
    adminToolbar.classList.remove('hidden');
  }
  
  // Habilitar elementos editables
  document.querySelectorAll('.editable').forEach(element => {
    element.classList.add('editable-active');
    element.addEventListener('click', handleEditableClick);
  });
  
  console.log('🔧 Modo de edición activado');
}

/**
 * Deshabilitar modo de edición
 */
function disableEditMode() {
  isEditMode = false;
  const adminToolbar = document.getElementById('adminToolbar');
  if (adminToolbar) {
    adminToolbar.classList.add('hidden');
  }
  
  // Deshabilitar elementos editables
  document.querySelectorAll('.editable').forEach(element => {
    element.classList.remove('editable-active');
    element.removeEventListener('click', handleEditableClick);
  });
  
  console.log('🔒 Modo de edición desactivado');
}

/**
 * Manejar click en elementos editables
 */
function handleEditableClick(e) {
  if (!isEditMode) return;
  
  e.preventDefault();
  e.stopPropagation();
  
  const element = e.target;
  const currentText = element.textContent;
  const field = element.dataset.field;
  
  // Mostrar modal de edición
  showTextEditModal(currentText, (newText) => {
    element.textContent = newText;
    saveEditableText(element.id, newText);
  });
}

/**
 * Mostrar modal de edición de texto
 */
function showTextEditModal(currentText, onSave) {
  const modal = document.getElementById('textEditModal');
  const input = document.getElementById('textEditInput');
  const saveBtn = document.getElementById('saveTextEdit');
  const cancelBtn = document.getElementById('cancelTextEdit');
  
  if (!modal || !input) return;
  
  input.value = currentText;
  modal.classList.remove('hidden');
  input.focus();
  
  // Cleanup previous event listeners
  const newSaveBtn = saveBtn.cloneNode(true);
  const newCancelBtn = cancelBtn.cloneNode(true);
  saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
  cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
  
  newSaveBtn.addEventListener('click', () => {
    onSave(input.value);
    modal.classList.add('hidden');
  });
  
  newCancelBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });
}

/**
 * Guardar texto editable en localStorage
 */
function saveEditableText(elementId, text) {
  try {
    const savedTexts = JSON.parse(localStorage.getItem('editableTexts') || '{}');
    savedTexts[elementId] = text;
    localStorage.setItem('editableTexts', JSON.stringify(savedTexts));
    console.log(`💾 Texto guardado para ${elementId}`);
  } catch (error) {
    console.error('Error saving editable text:', error);
  }
}

/**
 * Cargar textos editables desde localStorage
 */
export function loadEditableTexts() {
  try {
    const savedTexts = JSON.parse(localStorage.getItem('editableTexts') || '{}');
    Object.entries(savedTexts).forEach(([elementId, text]) => {
      const element = document.getElementById(elementId);
      if (element) {
        element.textContent = text;
      }
    });
    console.log('📝 Textos editables cargados');
  } catch (error) {
    console.error('Error loading editable texts:', error);
  }
}

/**
 * Configurar filtros de productos
 */
function setupFilters() {
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const sortFilter = document.getElementById('sortFilter');
  
  if (searchInput) {
    searchInput.addEventListener('input', debounce(handleSearch, 300));
  }
  
  if (categoryFilter) {
    categoryFilter.addEventListener('change', handleCategoryFilter);
  }
  
  if (sortFilter) {
    sortFilter.addEventListener('change', handleSortFilter);
  }
}

/**
 * Manejar búsqueda de productos
 */
function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase();
  const productCards = document.querySelectorAll('.product-card');
  
  productCards.forEach(card => {
    const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
    const description = card.querySelector('.product-description')?.textContent.toLowerCase() || '';
    
    if (title.includes(searchTerm) || description.includes(searchTerm)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

/**
 * Manejar filtro por categoría
 */
function handleCategoryFilter(e) {
  const selectedCategory = e.target.value;
  const productCards = document.querySelectorAll('.product-card');
  
  productCards.forEach(card => {
    const category = card.dataset.category;
    
    if (!selectedCategory || category === selectedCategory) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

/**
 * Manejar ordenamiento de productos
 */
function handleSortFilter(e) {
  const sortBy = e.target.value;
  const productsContainer = document.getElementById('productsContainer');
  
  if (!productsContainer) return;
  
  const productCards = Array.from(productsContainer.querySelectorAll('.product-card'));
  
  productCards.sort((a, b) => {
    switch (sortBy) {
      case 'priceAsc':
        return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
      case 'priceDesc':
        return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
      case 'nameAsc':
        return a.dataset.name.localeCompare(b.dataset.name);
      case 'nameDesc':
        return b.dataset.name.localeCompare(a.dataset.name);
      default:
        return 0;
    }
  });
  
  productCards.forEach(card => {
    productsContainer.appendChild(card);
  });
}

/**
 * Utility: Debounce function
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

/**
 * Configurar plantillas CSS
 */
export function applyTemplate(templateName) {
  const templates = {
    'clasica': '/Plantillas/plan1.css',
    'moderna': '/Plantillas/plan2.css',
    'minimalista': '/Plantillas/plan3.css',
    'futurista': '/Plantillas/plan4.css',
    'gamer': '/Plantillas/plan5.css',
    'vintaje': '/Plantillas/plan6.css'
  };
  
  const cssFile = templates[templateName] || templates['clasica'];
  const linkElement = document.getElementById('plantillaCSS');
  
  if (linkElement) {
    linkElement.href = cssFile;
    localStorage.setItem('plantillaGuardada', templateName);
    console.log(`🎨 Plantilla aplicada: ${templateName}`);
  }
}

/**
 * Cargar plantilla guardada
 */
export function loadSavedTemplate() {
  const savedTemplate = localStorage.getItem('plantillaGuardada') || 'clasica';
  applyTemplate(savedTemplate);
}

// Export para agregar productos al carrito desde componentes
export { addToCart };