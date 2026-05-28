/**
 * Class responsible for the image carousel in the Hero section.
 * Implements Class usage, modularization, and Higher-Order Functions (map).
 */
export class HeroCarousel {
  /**
   * Initializes the carousel.
   * @param {string} containerSelector - CSS selector for the image container.
   * @param {string[]} images - Array containing the base names of the images.
   */
  constructor(containerSelector, images) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;

    this.images = images;
    this.currentIndex = 0;
    this.interval = null;

    this.init();
  }

  /**
   * Initializes rendering and autoplay.
   */
  init() {
    this.renderImages();
    this.startAutoPlay();
  }

  /**
   * Creates image elements in the DOM.
   * Uses MAP to create the array of elements (Higher-Order Function!).
   */
  renderImages() {
    this.container.innerHTML = '';

    // Transform array of names into array of HTML elements using map
    const imgElements = this.images.map((baseName, index) => {
      const img = document.createElement('img');
      img.src = `${baseName}.avif`;
      img.srcset = `
        ${baseName}-sm.avif 640w,
        ${baseName}-md.avif 1024w,
        ${baseName}-lg.avif 1297w,
        ${baseName}.avif 2752w
      `;
      img.sizes = "100vw";
      img.alt = ""; // Decorative image
      
      if (index === 0) img.classList.add('active');
      
      return img;
    });

    // Append all to container
    imgElements.forEach(img => this.container.appendChild(img));
    
    // Save reference for later use in animation
    this.imgElements = this.container.querySelectorAll('img');
  }

  /**
   * Advances to the next image.
   */
  nextImage() {
    if (!this.imgElements || this.imgElements.length === 0) return;

    // Remove active class from current
    this.imgElements[this.currentIndex].classList.remove('active');
    
    // Update index
    this.currentIndex = (this.currentIndex + 1) % this.imgElements.length;
    
    // Add active class to next
    this.imgElements[this.currentIndex].classList.add('active');
  }

  /**
   * Starts automatic image rotation.
   */
  startAutoPlay() {
    // Clear previous interval if it exists
    if (this.interval) clearInterval(this.interval);
    
    this.interval = setInterval(() => this.nextImage(), 5000);
  }

  /**
   * Cleans up the carousel interval when React unmounts the component.
   */
  destroy() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}
