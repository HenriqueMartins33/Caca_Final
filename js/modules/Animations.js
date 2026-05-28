/**
 * Class responsible for site animations using GSAP.
 */
export class AnimationManager {
  constructor() {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP or ScrollTrigger not loaded.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    
    // Initialize animations
    this.init();
  }

  /**
   * Initializes all animations.
   */
  init() {
    this.initSectionAnimations();
    this.initStatCounters();
    this.initCardsAnimation();
  }

  /**
   * Animates section entry (fade in + slide up).
   */
  initSectionAnimations() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(sec => {
      gsap.fromTo(sec, 
        { opacity: 0, y: 50 },
        {
          opacity: 1, 
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sec,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }

  /**
   * Animates statistical counters.
   */
  initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(num => {
      const text = num.innerText;
      // Basic extraction using regex
      const match = text.match(/^([^\d]*)(\d+)([^\d]*)$/);
      
      if (match && match[2]) {
        const prefix = match[1] || '';
        const targetVal = parseInt(match[2], 10);
        const suffix = match[3] || '';

        gsap.fromTo(num, 
          { innerHTML: 0 }, 
          {
            innerHTML: targetVal,
            duration: 2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.stats-grid',
              start: 'top 85%',
            },
            onUpdate: function() {
              // 'this.targets()[0]' is how we access the element in GSAP
              num.innerHTML = prefix + Math.floor(this.targets()[0].innerHTML) + suffix;
            }
          }
        );
      }
    });
  }

  /**
   * Stagger animation for area cards.
   */
  initCardsAnimation() {
    gsap.from('.area-card', {
      scrollTrigger: {
        trigger: '.areas-grid',
        start: 'top 80%'
      },
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15, // Stagger effect
      ease: 'back.out(1.2)'
    });
  }
}
