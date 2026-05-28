/**
 * Class responsible for handling and validating the contact form.
 * Provides real-time validation, error handling, and form submission management.
 */
export class ContactForm {
  /**
   * Email validation regex pattern
   * @type {RegExp}
   */
  static EMAIL_PATTERN = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

  /**
   * Predefined messages for each subject option
   * @type {Object}
   */
  static PREDEFINED_MESSAGES = {
    'investigacao-clinica': 'Gostaria de obter informações sobre oportunidades de envolvimento em investigação clínica. Por favor, forneça detalhes sobre os projetos em curso, requisitos para participação e próximas datas de início.',
    'formacao-saude': 'Tenho interesse em programas de formação em saúde oferecidos pelo CACA. Gostaria de conhecer os cursos disponíveis, durações, horários e procedimentos de inscrição.',
    'suporte-investigadores': 'Preciso de suporte como investigador. Gostaria de saber mais sobre os recursos disponíveis, mentoria, financiamento e outros apoios que o CACA oferece aos investigadores.',
    'plataformas-digitais': 'Tenho dúvidas sobre as plataformas digitais e sistemas de informação do CACA. Por favor, forneça informações sobre acesso, funcionalidades e suporte técnico.',
    'parcerias': 'Estou interessado em estabelecer parcerias e colaborações com o CACA. Gostaria de discutir oportunidades de cooperação e como podemos trabalhar em conjunto.',
    'informacoes-gerais': 'Tenho perguntas gerais sobre o CACA. Gostaria de obter mais informações sobre a organização, missão, localização e como entrar em contacto.',
    'outro': 'Por favor, descreva o seu assunto ou dúvida em detalhe.'
  };

  /**
   * Initializes the form with validation and event listeners.
   * @param {string} formSelector - CSS selector for the form.
   */
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    if (!this.form) {
      console.warn(`Form not found with selector: ${formSelector}`);
      return;
    }

    // Select form fields
    this.fields = {
      nome: this.form.querySelector('#nome'),
      email: this.form.querySelector('#email'),
      assunto: this.form.querySelector('#assunto'),
      mensagem: this.form.querySelector('#mensagem')
    };

    // Find success message element
    this.successMessage = document.getElementById('success-message');

    // Initialize predefined messages as instance property
    this.predefinedMessages = ContactForm.PREDEFINED_MESSAGES;

    // Initialize event listeners
    this.init();
  }

  /**
   * Sets up all event listeners for the form fields.
   * Attaches blur, input, and change listeners to handle real-time validation.
   * Uses array methods (filter, forEach) for functional programming.
   * @returns {void}
   */
  init() {
    // Attach blur and input listeners to all fields that exist using filter and forEach
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

    // Special listener for subject changes (populate message)
    if (this.fields.assunto) {
      this.fields.assunto.addEventListener('change', (e) => this.handleSubjectChange(e));
    }

    // Form submission listener
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  /**
   * Validates a single form field.
   * @param {HTMLElement} field - The input or textarea element.
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
    if (fieldId === 'email') {
      if (!ContactForm.EMAIL_PATTERN.test(value)) {
        this.showError(field, fieldId, 'format');
        return false;
      }
    }

    // Name validation (minimum 3 characters)
    if (fieldId === 'nome') {
      if (value.length < 3) {
        this.showError(field, fieldId, 'length');
        return false;
      }
    }

    // Clear error if validation passes
    this.clearError(field, fieldId);
    return true;
  }

  /**
   * Validates all form fields using array method every().
   * Checks if all fields are valid by applying validateField to each.
   * @returns {boolean} - True if all fields are valid, false otherwise.
   */
  validateForm() {
    return Object.values(this.fields).every(field => this.validateField(field));
  }

  /**
   * Shows an error message for a specific field based on error type.
   * Hides other error messages and displays the appropriate error element.
   * @param {HTMLElement} field - The form field element.
   * @param {string} fieldId - The field identifier (e.g., 'nome', 'email').
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
    }

    if (errorElement) {
      errorElement.style.display = 'block';
    }

    formGroup.classList.add('has-error');
  }

  /**
   * Clears all error messages and styling for a field.
   * Hides all error elements and removes the 'has-error' CSS class.
   * @param {HTMLElement} field - The form field element.
   * @param {string} fieldId - The field identifier (e.g., 'nome', 'email').
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
   * Displays the success message, scrolls to it, and auto-hides after 5 seconds.
   * @returns {void}
   */
  showSuccessMessage() {
    if (!this.successMessage) return;

    this.successMessage.style.display = 'flex';

    // Scroll to success message smoothly
    this.successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Hide success message after 5 seconds
    setTimeout(() => {
      this.successMessage.style.display = 'none';
    }, 5000);
  }

  /**
   * Resets the form and clears all error messages and styling.
   * Resets input values and removes error states from all fields.
   * Uses filter to handle only valid fields before clearing errors.
   * @returns {void}
   */
  resetForm() {
    this.form.reset();

    // Clear all error messages using filter and forEach
    Object.values(this.fields)
      .filter(field => field !== null && field !== undefined)
      .forEach(field => this.clearError(field, field.id));
  }

  /**
   * Handles subject change event to populate message field with predefined text.
   * When a subject is selected, fills the message field with template text and validates it.
   * @param {Event} event - The change event from the subject dropdown.
   * @returns {void}
   */
  handleSubjectChange(event) {
    this.validateField(event.target);

    // Populate message field with predefined text
    const selectedValue = event.target.value;
    if (selectedValue && this.predefinedMessages[selectedValue]) {
      this.fields.mensagem.value = this.predefinedMessages[selectedValue];
      // Validate message field to clear error state after populating
      this.validateField(this.fields.mensagem);
    } else {
      this.fields.mensagem.value = '';
    }
  }

  /**
   * Handles form submission and processes validated form data.
   * Validates all fields, displays success message, logs data, and resets form.
   * Uses array methods (map, reduce) to build form data object functionally.
   * @param {Event} event - The submit event from the form.
   * @returns {void}
   */
  handleSubmit(event) {
    event.preventDefault();

    // Validate all fields
    if (this.validateForm()) {
      // Display success message
      this.showSuccessMessage();

      // Build form data using map and reduce (functional approach)
      const formData = Object.entries(this.fields)
        .map(([key, field]) => [key, field.value.trim()])
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

      // Log form data
      console.log('Form submitted successfully with data:', formData);

      // Reset form
      this.resetForm();
    }
  }
}
