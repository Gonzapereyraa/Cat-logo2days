/**
 * Módulo de Carousel para banners
 */

export class Carousel {
  constructor(containerId, config = {}) {
    this.container = document.getElementById(containerId);
    this.config = {
      autoplay: true,
      autoplayDelay: 5000,
      showIndicators: true,
      showNavigation: true,
      transition: "slide",
      ...config
    };
    
    this.currentIndex = 0;
    this.slides = [];
    this.indicators = [];
    this.isPlaying = false;
    this.intervalId = null;
    
    this.init();
  }

  init() {
    if (!this.container) {
      console.warn('Carousel container not found');
      return;
    }

    this.slides = Array.from(this.container.querySelectorAll('.carousel-slide'));
    this.createIndicators();
    this.createNavigation();
    this.bindEvents();
    
    if (this.slides.length > 0) {
      this.showSlide(0);
      if (this.config.autoplay) {
        this.play();
      }
    }
  }

  createIndicators() {
    if (!this.config.showIndicators || this.slides.length <= 1) return;

    const indicatorsContainer = document.createElement('div');
    indicatorsContainer.className = 'carousel-indicators absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2';
    
    this.slides.forEach((_, index) => {
      const indicator = document.createElement('button');
      indicator.className = 'w-3 h-3 rounded-full bg-white bg-opacity-50 hover:bg-opacity-75 transition-all';
      indicator.addEventListener('click', () => this.goToSlide(index));
      this.indicators.push(indicator);
      indicatorsContainer.appendChild(indicator);
    });

    this.container.appendChild(indicatorsContainer);
  }

  createNavigation() {
    if (!this.config.showNavigation || this.slides.length <= 1) return;

    const prevButton = document.createElement('button');
    prevButton.className = 'carousel-prev absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full transition-all';
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevButton.addEventListener('click', () => this.prevSlide());

    const nextButton = document.createElement('button');
    nextButton.className = 'carousel-next absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full transition-all';
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextButton.addEventListener('click', () => this.nextSlide());

    this.container.appendChild(prevButton);
    this.container.appendChild(nextButton);
  }

  bindEvents() {
    // Pause autoplay on hover
    this.container.addEventListener('mouseenter', () => this.pause());
    this.container.addEventListener('mouseleave', () => {
      if (this.config.autoplay) this.play();
    });
  }

  showSlide(index) {
    this.slides.forEach((slide, i) => {
      slide.style.display = i === index ? 'block' : 'none';
      slide.classList.toggle('active', i === index);
    });

    this.indicators.forEach((indicator, i) => {
      indicator.classList.toggle('bg-opacity-75', i === index);
      indicator.classList.toggle('bg-opacity-50', i !== index);
    });

    this.currentIndex = index;
  }

  nextSlide() {
    const nextIndex = (this.currentIndex + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }

  prevSlide() {
    const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.goToSlide(prevIndex);
  }

  goToSlide(index) {
    if (index >= 0 && index < this.slides.length) {
      this.showSlide(index);
    }
  }

  play() {
    if (this.isPlaying || this.slides.length <= 1) return;
    
    this.isPlaying = true;
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, this.config.autoplayDelay);
  }

  pause() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  destroy() {
    this.pause();
    // Remove event listeners and DOM elements created by carousel
    const indicators = this.container.querySelector('.carousel-indicators');
    const prevBtn = this.container.querySelector('.carousel-prev');
    const nextBtn = this.container.querySelector('.carousel-next');
    
    if (indicators) indicators.remove();
    if (prevBtn) prevBtn.remove();
    if (nextBtn) nextBtn.remove();
  }
}

// Export para uso directo
export function initCarousel(containerId, config) {
  return new Carousel(containerId, config);
}