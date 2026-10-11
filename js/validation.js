/**
 * SkillBridge - Form Validation & HTML Sanitization Helpers
 */

export const Validation = {
  /**
   * Safe HTML escaping to prevent XSS
   */
  escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  /**
   * Validates standard email address format
   */
  isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
  },

  /**
   * Validates URL string format (http/https)
   */
  isValidUrl(url) {
    if (!url || typeof url !== 'string') return false;
    try {
      const parsed = new URL(url.trim());
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  },

  /**
   * Validates non-empty string
   */
  isNonEmpty(value) {
    if (value === null || value === undefined) return false;
    return String(value).trim().length > 0;
  },

  /**
   * Validates demo password (minimum 6 characters)
   */
  isValidPassword(password) {
    return typeof password === 'string' && password.trim().length >= 6;
  },

  /**
   * Helper to display field error in DOM
   */
  showFieldError(inputEl, message) {
    inputEl.classList.add('error');
    let errorEl = inputEl.parentElement.querySelector('.field-error');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'field-error';
      inputEl.parentElement.appendChild(errorEl);
    }
    errorEl.textContent = message;
  },

  /**
   * Helper to clear field error in DOM
   */
  clearFieldError(inputEl) {
    inputEl.classList.remove('error');
    const errorEl = inputEl.parentElement.querySelector('.field-error');
    if (errorEl) {
      errorEl.remove();
    }
  }
};
