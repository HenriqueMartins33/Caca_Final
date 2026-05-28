/**
 * Class responsible for managing the Scroll to Top button.
 */
export class ScrollManager {
  /**
   * Initializes the scroll manager.
   * @param {string} buttonId - ID of the button in the HTML.
   */
  constructor(buttonId) {
    this.button = document.getElementById(buttonId);
    this.handleScrollBound = () => this.handleScroll();
    this.scrollToTopBound = () => this.scrollToTop();
    
    // If the button doesn't exist, stop execution
    if (!this.button) {
      console.warn(`Button with ID "${buttonId}" not found.`);
      return;
    }
    
    this.init();
  }

  /**
   * Sets up event listeners.
   */
  init() {
    // Show/Hide button based on scroll position
    window.addEventListener('scroll', this.handleScrollBound);

    // Smooth scroll to top
    this.button.addEventListener('click', this.scrollToTopBound);
  }

  /**
   * Handles button visibility based on scroll position.
   */
  handleScroll() {
    if (window.scrollY > 300) {
      this.button.classList.add('visible');
    } else {
      this.button.classList.remove('visible');
    }
  }

  /**
   * Executes smooth scroll to the top of the page.
   */
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  /**
   * Removes listeners registered by this manager.
   */
  destroy() {
    window.removeEventListener('scroll', this.handleScrollBound);

    if (this.button) {
      this.button.removeEventListener('click', this.scrollToTopBound);
    }
  }
}
