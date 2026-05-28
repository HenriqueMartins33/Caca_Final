/**
 * Class responsible for handling newsletter subscription with IndexedDB persistence.
 * Manages form validation, submission, and local data storage.
 */
export class NewsletterManager {
  /**
   * Email validation regex pattern
   * @type {RegExp}
   */
  static EMAIL_PATTERN = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

  /**
   * Name validation regex pattern - only letters, spaces, hyphens and apostrophes
   * Supports Portuguese accented characters and compound surnames
   * @type {RegExp}
   */
  static NAME_PATTERN = /^[a-zA-ZÀ-ÖØ-öø-ÿçñ\s'-]+$/;

  /**
   * IndexedDB configuration
   * @type {Object}
   */
  static DB_CONFIG = {
    name: 'CACAweb',
    version: 1,
    storeName: 'newsletter_subscribers'
  };

  /**
   * Initializes the newsletter form with validation, events, and IndexedDB.
   * @param {string} formSelector - CSS selector for the form.
   */
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    if (!this.form) {
      console.warn(`Newsletter form not found with selector: ${formSelector}`);
      return;
    }

    // Select form fields
    this.fields = {
      nome: this.form.querySelector('#newsletter-nome'),
      email: this.form.querySelector('#newsletter-email')
    };

    // Find message elements
    this.successMessage = document.getElementById('newsletter-success-message');
    this.errorMessage = document.getElementById('newsletter-error-message');
    this.subscribersList = document.getElementById('newsletter-subscribers-list');

    // Initialize database
    this.db = null;
    this.initDatabase();

    // Initialize event listeners
    this.init();
  }

  /**
   * Initializes IndexedDB database.
   * Creates object store for newsletter subscribers if it doesn't exist.
   * @returns {void}
   */
  initDatabase() {
    const request = indexedDB.open(NewsletterManager.DB_CONFIG.name, NewsletterManager.DB_CONFIG.version);

    request.onerror = () => {
      console.error('Database failed to open:', request.error);
    };

    request.onsuccess = () => {
      this.db = request.result;
      console.log('Newsletter database initialized successfully');
      // Load and display existing subscribers
      this.displaySubscribers();
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains(NewsletterManager.DB_CONFIG.storeName)) {
        const objectStore = db.createObjectStore(NewsletterManager.DB_CONFIG.storeName, { keyPath: 'id', autoIncrement: true });
        
        // Create indexes for efficient querying
        objectStore.createIndex('email', 'email', { unique: true });
        objectStore.createIndex('createdAt', 'createdAt', { unique: false });
        
        console.log('Object store created successfully');
      }
    };
  }

  /**
   * Sets up all event listeners for the form fields.
   * Attaches blur, input, and submit listeners.
   * @returns {void}
   */
  init() {
    // Attach blur and input listeners to all fields
    Object.values(this.fields)
      .filter(field => field !== null && field !== undefined)
      .forEach(field => {
        // Blur event: always validate
        field.addEventListener('blur', () => this.validateField(field));

        // Input event: validate only if field has error
        field.addEventListener('input', () => {
          if (field.parentElement.classList.contains('has-error')) {
            this.validateField(field);
          }
        });
      });

    // Form submission listener
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  /**
   * Validates a single form field.
   * @param {HTMLElement} field - The input element.
   * @returns {boolean} - True if valid, false otherwise.
   */
  validateField(field) {
    const fieldId = field.id;
    const value = field.value.trim();

    // Check if field is empty
    if (value === '') {
      this.showError(field, fieldId, 'required');
      return false;
    }

    // Email-specific validation
    if (fieldId === 'newsletter-email') {
      if (!NewsletterManager.EMAIL_PATTERN.test(value)) {
        this.showError(field, fieldId, 'format');
        return false;
      }
    }

    // Name validation (minimum 2 characters and only letters)
    if (fieldId === 'newsletter-nome') {
      // Check if contains invalid characters (numbers or special characters)
      if (!NewsletterManager.NAME_PATTERN.test(value)) {
        this.showError(field, fieldId, 'invalid');
        return false;
      }
      // Check minimum length
      if (value.length < 2) {
        this.showError(field, fieldId, 'length');
        return false;
      }
    }

    // Clear error if validation passes
    this.clearError(field, fieldId);
    return true;
  }

  /**
   * Validates all form fields.
   * Checks if all fields are valid.
   * @returns {boolean} - True if all fields are valid, false otherwise.
   */
  validateForm() {
    return Object.values(this.fields).every(field => this.validateField(field));
  }

  /**
   * Shows an error message for a specific field based on error type.
   * @param {HTMLElement} field - The form field element.
   * @param {string} fieldId - The field identifier.
   * @param {string} errorType - The error type ('required', 'format', 'length').
   * @returns {void}
   */
  showError(field, fieldId, errorType) {
    const formGroup = field.parentElement;

    // Hide all error messages first
    const errorMessages = formGroup.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.style.display = 'none');

    // Determine which error element to show
    let errorElement = document.getElementById(`error-${fieldId}`);
    if (errorType === 'length') {
      errorElement = document.getElementById(`error-${fieldId}-length`);
    } else if (errorType === 'format') {
      errorElement = document.getElementById(`error-${fieldId}-format`);
    } else if (errorType === 'invalid') {
      errorElement = document.getElementById(`error-${fieldId}-invalid`);
    }

    if (errorElement) {
      errorElement.style.display = 'block';
    }

    formGroup.classList.add('has-error');
  }

  /**
   * Clears all error messages and styling for a field.
   * @param {HTMLElement} field - The form field element.
   * @param {string} fieldId - The field identifier.
   * @returns {void}
   */
  clearError(field, fieldId) {
    const formGroup = field.parentElement;

    // Hide all error messages
    const errorMessages = formGroup.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.style.display = 'none');

    formGroup.classList.remove('has-error');
  }

  /**
   * Shows success message with auto-hide after 5 seconds.
   * @returns {void}
   */
  showSuccessMessage(message = 'Obrigado pela sua subscrição!') {
    if (!this.successMessage) return;

    this.successMessage.textContent = message;
    this.successMessage.style.display = 'flex';

    // Scroll to success message smoothly
    this.successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Hide success message after 5 seconds
    setTimeout(() => {
      this.successMessage.style.display = 'none';
    }, 5000);
  }

  /**
   * Shows error message with auto-hide after 5 seconds.
   * @param {string} message - Error message to display.
   * @returns {void}
   */
  showErrorAlert(message = 'Ocorreu um erro. Por favor, tente novamente.') {
    if (!this.errorMessage) return;

    this.errorMessage.textContent = message;
    this.errorMessage.style.display = 'flex';

    // Scroll to error message smoothly
    this.errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Hide error message after 5 seconds
    setTimeout(() => {
      this.errorMessage.style.display = 'none';
    }, 5000);
  }

  /**
   * Resets the form and clears all error messages.
   * @returns {void}
   */
  resetForm() {
    this.form.reset();

    // Clear all error states
    Object.values(this.fields)
      .filter(field => field !== null && field !== undefined)
      .forEach(field => {
        this.clearError(field, field.id);
      });
  }

  /**
   * Handles form submission - validates, saves to IndexedDB, and provides feedback.
   * @param {Event} e - The submit event.
   * @returns {void}
   */
  handleSubmit(e) {
    e.preventDefault();

    // Validate form
    if (!this.validateForm()) {
      console.log('Form validation failed');
      return;
    }

    // Collect form data
    const subscriberData = {
      nome: this.fields.nome.value.trim(),
      email: this.fields.email.value.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to IndexedDB
    this.saveSubscriber(subscriberData);
  }

  /**
   * Saves subscriber data to IndexedDB.
   * @param {Object} subscriberData - The subscriber object with nome and email.
   * @returns {void}
   */
  saveSubscriber(subscriberData) {
    if (!this.db) {
      this.showErrorAlert('Banco de dados não disponível. Por favor, tente mais tarde.');
      return;
    }

    const transaction = this.db.transaction([NewsletterManager.DB_CONFIG.storeName], 'readwrite');
    const objectStore = transaction.objectStore(NewsletterManager.DB_CONFIG.storeName);

    // Try to add the subscriber
    const request = objectStore.add(subscriberData);

    request.onsuccess = () => {
      console.log('Subscriber added successfully:', subscriberData);
      this.showSuccessMessage('Subscrição confirmada! Obrigado pelo seu interesse.');
      this.resetForm();
      // Refresh subscribers list
      this.displaySubscribers();
    };

    request.onerror = () => {
      if (request.error.name === 'ConstraintError') {
        this.showErrorAlert('Este email já está registado. Obrigado!');
      } else {
        this.showErrorAlert('Erro ao gravar subscrição. Por favor, tente novamente.');
      }
      console.error('Error adding subscriber:', request.error);
    };
  }

  /**
   * Retrieves all subscribers from IndexedDB and displays them.
   * @returns {void}
   */
  displaySubscribers() {
    if (!this.db || !this.subscribersList) return;

    const transaction = this.db.transaction([NewsletterManager.DB_CONFIG.storeName], 'readonly');
    const objectStore = transaction.objectStore(NewsletterManager.DB_CONFIG.storeName);
    const request = objectStore.getAll();

    request.onsuccess = () => {
      const subscribers = request.result;
      console.log('Loaded subscribers:', subscribers);

      // Update subscriber count
      const count = subscribers.length;
      this.subscribersList.textContent = `${count} ${count === 1 ? 'subscritor' : 'subscritores'} registado(s)`;
    };

    request.onerror = () => {
      console.error('Error retrieving subscribers:', request.error);
    };
  }

  /**
   * Deletes a subscriber from IndexedDB by ID.
   * @param {number} id - The subscriber ID.
   * @returns {void}
   */
  deleteSubscriber(id) {
    if (!this.db) return;

    const transaction = this.db.transaction([NewsletterManager.DB_CONFIG.storeName], 'readwrite');
    const objectStore = transaction.objectStore(NewsletterManager.DB_CONFIG.storeName);
    const request = objectStore.delete(id);

    request.onsuccess = () => {
      console.log('Subscriber deleted successfully');
      this.displaySubscribers();
    };

    request.onerror = () => {
      console.error('Error deleting subscriber:', request.error);
    };
  }

  /**
   * Exports all subscribers data as JSON.
   * Useful for backup or admin purposes.
   * @returns {Promise<Array>} - Array of subscribers
   */
  async exportSubscribers() {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not available'));
        return;
      }

      const transaction = this.db.transaction([NewsletterManager.DB_CONFIG.storeName], 'readonly');
      const objectStore = transaction.objectStore(NewsletterManager.DB_CONFIG.storeName);
      const request = objectStore.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }
}
