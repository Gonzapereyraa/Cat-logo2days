# Catálogo Digital Modularizado - Astro

Este proyecto ha sido completamente modularizado utilizando **Astro** para una mejor organización, mantenibilidad y reutilización de componentes.

## 🏗️ Estructura del Proyecto

```
src/
├── components/           # Componentes Astro reutilizables
│   ├── BannerCarousel.astro      # Carousel de banners promocionales
│   ├── CategoriesSection.astro   # Sección de categorías de productos
│   ├── BestsellersSection.astro  # Productos destacados/bestsellers
│   ├── FeaturesSection.astro     # Características del negocio
│   └── CartSidebar.astro         # Modal del carrito de compras
├── data/                # Datos estructurados
│   ├── banners.js              # Configuración de banners
│   ├── bestsellers.js          # Productos y bestsellers
│   └── categories.js           # Categorías disponibles
├── scripts/             # Módulos JavaScript
│   ├── carousel.js             # Lógica del carousel
│   ├── cart.js                 # Gestión del carrito
│   └── main.js                 # Funciones principales
├── layouts/             # Layouts base
│   └── Layout.astro            # Layout principal
└── pages/               # Páginas del sitio
    └── index.astro             # Página principal modularizada
```

## ✨ Características Implementadas

### 🎠 Componentes Modularizados
- **BannerCarousel**: Carousel automático con navegación e indicadores
- **CategoriesSection**: Grid de categorías con iconos y descripciones
- **BestsellersSection**: Productos destacados con etiquetas especiales
- **FeaturesSection**: Características del negocio (envío, devoluciones, etc.)
- **CartSidebar**: Modal completo del carrito con gestión de cantidades

### 📊 Datos Estructurados
- **banners.js**: Configuración de banners con imágenes, textos y enlaces
- **bestsellers.js**: Base de datos de productos con categorías y ofertas
- **categories.js**: Definición de categorías con iconos y colores

### 🔧 Módulos JavaScript
- **carousel.js**: Clase reutilizable para carousels con autoplay
- **cart.js**: Sistema completo de carrito con localStorage
- **main.js**: Funciones de aplicación, filtros y modo edición

## 🚀 Funcionalidades

### 🛒 Carrito de Compras
- Añadir/quitar productos
- Modificar cantidades
- Cálculo automático de totales
- Persistencia en localStorage
- Notificaciones visuales

### 🔍 Filtros y Búsqueda
- Búsqueda por texto
- Filtrado por categorías
- Ordenamiento (precio, nombre, fecha)
- Navegación por categorías

### 🎨 Sistema de Plantillas
- 6 plantillas CSS predefinidas
- Cambio dinámico de temas
- Persistencia de preferencias

### ⚙️ Panel de Administración
- Modo de edición en vivo
- Login con credenciales
- Edición de textos
- Gestión de productos

## 🛠️ Comandos Disponibles

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de producción
npm run preview
```

## 🌐 Tecnologías Utilizadas

- **Astro**: Framework principal
- **Tailwind CSS**: Estilos y diseño responsive
- **Vanilla JavaScript**: Funcionalidad interactiva
- **LocalStorage**: Persistencia de datos
- **Font Awesome**: Iconografía

## 📱 Responsive Design

El catálogo está completamente optimizado para:
- 📱 Móviles (320px+)
- 📱 Tablets (768px+)  
- 💻 Desktop (1024px+)

## 🎯 Mejoras Implementadas

### Antes (HTML Monolítico)
- ❌ Un solo archivo HTML de +400 líneas
- ❌ JavaScript y CSS inline
- ❌ Datos hardcodeados
- ❌ Difícil de mantener

### Después (Astro Modularizado)
- ✅ Componentes reutilizables
- ✅ Separación de responsabilidades
- ✅ Datos estructurados y centralizados
- ✅ Fácil mantenimiento y escalabilidad
- ✅ Performance optimizada
- ✅ TypeScript support ready

## 🔐 Credenciales de Administrador

- **Usuario**: `admin` o `Gonzapereyraa`
- **Contraseña**: `admin123`

## 🎨 Personalización

### Agregar Nuevos Productos
1. Editar `src/data/bestsellers.js`
2. Añadir al array `productos`
3. La actualización es automática

### Modificar Banners
1. Editar `src/data/banners.js`  
2. Cambiar URLs, textos o configuración
3. El carousel se actualiza automáticamente

### Añadir Categorías
1. Editar `src/data/categories.js`
2. Definir icono, color y descripción
3. La sección se regenera automáticamente

## 🚀 Deploy

El proyecto está listo para deploy en cualquier plataforma que soporte Astro:
- Netlify
- Vercel 
- GitHub Pages
- Railway
- Digital Ocean

---

**Desarrollado con ❤️ usando Astro**