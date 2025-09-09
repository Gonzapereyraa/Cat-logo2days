// Banners para el carousel del catálogo digital
export const banners = [
  {
    id: 1,
    titulo: "Ofertas Especiales",
    subtitulo: "Hasta 50% de descuento en productos seleccionados",
    imagen: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    boton: {
      texto: "Ver Ofertas",
      enlace: "#ofertas"
    },
    activo: true,
    orden: 1
  },
  {
    id: 2,
    titulo: "Nueva Colección",
    subtitulo: "Descubre los productos más innovadores del mercado",
    imagen: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    boton: {
      texto: "Explorar",
      enlace: "#productos"
    },
    activo: true,
    orden: 2
  },
  {
    id: 3,
    titulo: "Envío Gratis",
    subtitulo: "En compras superiores a $100. Entrega rápida y segura",
    imagen: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    boton: {
      texto: "Comprar Ahora",
      enlace: "#catalogView"
    },
    activo: true,
    orden: 3
  }
];

// Configuración del carousel
export const carouselConfig = {
  autoplay: true,
  autoplayDelay: 5000,
  showIndicators: true,
  showNavigation: true,
  transition: "slide" // slide, fade
};