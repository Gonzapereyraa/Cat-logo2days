// Categorías disponibles en el catálogo digital
export const categories = [
  {
    id: 1,
    nombre: "Electrónicos",
    descripcion: "Smartphones, auriculares, smartwatches y más tecnología",
    icono: "fas fa-mobile-alt",
    imagen: "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    color: "from-blue-500 to-purple-600"
  },
  {
    id: 2,
    nombre: "Deportes",
    descripcion: "Zapatillas, equipamiento deportivo y accesorios fitness",
    icono: "fas fa-dumbbell",
    imagen: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    color: "from-green-500 to-teal-600"
  },
  {
    id: 3,
    nombre: "Hogar",
    descripcion: "Electrodomésticos, muebles y artículos para el hogar",
    icono: "fas fa-home",
    imagen: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    color: "from-yellow-500 to-orange-600"
  },
  {
    id: 4,
    nombre: "Ropa",
    descripcion: "Camisetas, pantalones, vestidos y moda en general",
    icono: "fas fa-tshirt",
    imagen: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    color: "from-pink-500 to-rose-600"
  },
  {
    id: 5,
    nombre: "Accesorios",
    descripcion: "Mochilas, bolsos, relojes y complementos diversos",
    icono: "fas fa-shopping-bag",
    imagen: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    color: "from-indigo-500 to-purple-600"
  }
];

// Función para obtener categorías únicas de los productos
export const getCategoriesFromProducts = (productos) => {
  return [...new Set(productos.map(p => p.categoria))];
};