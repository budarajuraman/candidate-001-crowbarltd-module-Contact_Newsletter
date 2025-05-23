document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  const newsletterForm = document.getElementById('newsletterForm');

  const displayMessage = (elementId, message, type) => {
    const element = document.getElementById(elementId);
    if (!element) return;
    element.textContent = message;
    element.className = `form-confirmation ${type}`;
    setTimeout(() => {
      element.textContent = '';
      element.className = 'form-confirmation';
    }, 5000);
  };

  const displayInlineError = (inputId, message) => {
    const errorElement = document.getElementById(`${inputId}-error`);
    if (errorElement) errorElement.textContent = message;
  };

  const clearInlineError = (inputId) => {
    const errorElement = document.getElementById(`${inputId}-error`);
    if (errorElement) errorElement.textContent = '';
  };

  const isValidEmail = (email) =>
    /^[a-zA-Z0-9._%+-]{4,}@[a-zA-Z0-9.-]+\.com$/.test(email);

  const handleFormSubmission = async (formType, url, payload, errorFields) => {
    errorFields.forEach(clearInlineError);
    displayMessage(`${formType}-confirmation`, '', '');

    let isValid = true;

    if (formType === 'contact') {
      if (!payload.name) {
        displayInlineError('contact-name', 'Name is required.');
        isValid = false;
      }
      if (!payload.message) {
        displayInlineError('contact-message', 'Message is required.');
        isValid = false;
      }
    }

    if (!payload.email) {
      displayInlineError(`${formType}-email`, 'Email is required.');
      isValid = false;
    } else if (!isValidEmail(payload.email)) {
      displayInlineError(
        `${formType}-email`,
        'Email must have at least 4 characters before "@" and end with ".com".'
      );
      isValid = false;
    }

    if (!isValid) {
      displayMessage(
        `${formType}-confirmation`,
        'Please correct the errors in the form.',
        'error'
      );
      return;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      const type = response.ok ? 'success' : 'error';
      displayMessage(
        `${formType}-confirmation`,
        result.message || result.error || 'Unexpected error',
        type
      );
      if (response.ok) document.getElementById(`${formType}Form`).reset();
    } catch (err) {
      console.error('Fetch error:', err);
      displayMessage(
        `${formType}-confirmation`,
        'Could not connect to the server. Please try again later.',
        'error'
      );
    }
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const payload = {
        name: document.getElementById('contact-name').value.trim(),
        email: document.getElementById('contact-email').value.trim(),
        message: document.getElementById('contact-message').value.trim(),
      };
      handleFormSubmission(
        'contact',
        'https://candidate-001-crowbarltd-module-contact-newsletter.vercel.app/api/contact',
        payload,
        ['contact-name', 'contact-email', 'contact-message']
      );
    });
  }

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const payload = {
        email: document.getElementById('newsletter-email').value.trim(),
      };
      handleFormSubmission(
        'newsletter',
        'https://candidate-001-crowbarltd-module-contact-newsletter.vercel.app/api/newsletter',
        payload,
        ['newsletter-email']
      );
    });
  }
});
