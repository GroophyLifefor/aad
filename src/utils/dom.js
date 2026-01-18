/**
 * Safe DOM utilities for AAD extension.
 * 
 * GitHub's UI changes frequently, so missing elements are expected behavior.
 * These utilities provide graceful handling with optional error reporting.
 */

/**
 * Safe querySelector with optional error reporting.
 * 
 * @param {string} selector - CSS selector
 * @param {Object} [options]
 * @param {Element|Document} [options.context=document] - Search context
 * @param {boolean} [options.required=false] - If true, fires error when not found
 * @param {string} [options.errorContext=''] - Description for error logging
 * @returns {Element|null}
 * 
 * @example
 * // Silent mode - returns null if not found (GitHub UI might have changed)
 * const btn = $('button.star-button');
 * 
 * @example
 * // Required mode - logs error if not found (we expect this element)
 * const container = $('#app-container', { required: true, errorContext: 'Main app init' });
 */
function $(selector, options = {}) {
  const { context = document, required = false, errorContext = '' } = options;
  
  const element = context.querySelector(selector);
  
  if (!element && required) {
    fireError(`AAD - Required element not found: ${selector}`, {
      extra: {
        selector,
        errorContext,
        url: window.location.href,
      }
    });
  }
  
  return element;
}

/**
 * Safe querySelectorAll.
 * 
 * @param {string} selector
 * @param {Object} [options]
 * @param {Element|Document} [options.context=document]
 * @param {boolean} [options.required=false] - If true, fires error when no elements found
 * @param {string} [options.errorContext='']
 * @returns {Element[]} - Always returns array (empty if none found)
 */
function $$(selector, options = {}) {
  const { context = document, required = false, errorContext = '' } = options;
  
  const elements = Array.from(context.querySelectorAll(selector));
  
  if (elements.length === 0 && required) {
    fireError(`AAD - Required elements not found: ${selector}`, {
      extra: {
        selector,
        errorContext,
        url: window.location.href,
      }
    });
  }
  
  return elements;
}

/**
 * Safe parentNode access.
 * 
 * @param {Element} element
 * @param {Object} [options]
 * @param {boolean} [options.required=false]
 * @param {string} [options.errorContext='']
 * @returns {Element|null}
 */
function $parent(element, options = {}) {
  const { required = false, errorContext = '' } = options;
  
  const parent = element?.parentNode;
  
  if (!parent && required) {
    fireError(`AAD - Parent element not found`, {
      extra: {
        element: element?.outerHTML?.slice(0, 200),
        errorContext,
        url: window.location.href,
      }
    });
  }
  
  return parent || null;
}

/**
 * Safe closest ancestor access.
 * 
 * @param {Element} element
 * @param {string} selector - CSS selector for ancestor
 * @param {Object} [options]
 * @param {boolean} [options.required=false]
 * @param {string} [options.errorContext='']
 * @returns {Element|null}
 */
function $closest(element, selector, options = {}) {
  const { required = false, errorContext = '' } = options;
  
  const ancestor = element?.closest(selector);
  
  if (!ancestor && required) {
    fireError(`AAD - Ancestor element not found: ${selector}`, {
      extra: {
        selector,
        element: element?.outerHTML?.slice(0, 200),
        errorContext,
        url: window.location.href,
      }
    });
  }
  
  return ancestor || null;
}

/**
 * Execute callback only if element exists.
 * Clean way to handle optional elements without if-checks everywhere.
 * 
 * @param {string} selector
 * @param {function} callback - Receives the element
 * @param {Object} [options]
 * @param {Element|Document} [options.context=document]
 * @param {boolean} [options.required=false]
 * @param {string} [options.errorContext='']
 * @returns {*} - Returns callback result if element found, undefined otherwise
 * 
 * @example
 * // Remove element if it exists, no error if it doesn't
 * withElement('.js-toggle-stuck', el => el.remove(), { context: dom });
 * 
 * @example
 * // Setup click handler only if button exists
 * withElement('#my-button', btn => {
 *   btn.addEventListener('click', handleClick);
 * });
 */
function withElement(selector, callback, options = {}) {
  const element = $(selector, options);
  if (element) {
    return callback(element);
  }
  return undefined;
}

/**
 * Execute callback for each matching element.
 * 
 * @param {string} selector
 * @param {function} callback - Receives each element and index
 * @param {Object} [options]
 * @param {Element|Document} [options.context=document]
 * @param {boolean} [options.required=false]
 * @param {string} [options.errorContext='']
 */
function withElements(selector, callback, options = {}) {
  const elements = $$(selector, options);
  elements.forEach((el, index) => callback(el, index));
}

/**
 * Execute callback with element if it exists, providing the element reference.
 * Useful for chaining operations on an optional element.
 * 
 * @param {Element|null} element
 * @param {function} callback - Receives the element
 * @param {Object} [options]
 * @param {boolean} [options.required=false]
 * @param {string} [options.errorContext='']
 * @returns {*} - Returns callback result if element exists, undefined otherwise
 * 
 * @example
 * const parent = $parent(button);
 * withNode(parent, p => p.classList.add('active'));
 */
function withNode(element, callback, options = {}) {
  const { required = false, errorContext = '' } = options;
  
  if (!element && required) {
    fireError(`AAD - Required node is null`, {
      extra: {
        errorContext,
        url: window.location.href,
      }
    });
  }
  
  if (element) {
    return callback(element);
  }
  return undefined;
}

/**
 * Safe attribute getter.
 * 
 * @param {Element} element
 * @param {string} attribute
 * @param {Object} [options]
 * @param {boolean} [options.required=false]
 * @param {string} [options.errorContext='']
 * @returns {string|null}
 */
function $attr(element, attribute, options = {}) {
  const { required = false, errorContext = '' } = options;
  
  const value = element?.getAttribute(attribute);
  
  if ((value === null || value === undefined) && required) {
    fireError(`AAD - Required attribute not found: ${attribute}`, {
      extra: {
        attribute,
        element: element?.outerHTML?.slice(0, 200),
        errorContext,
        url: window.location.href,
      }
    });
  }
  
  return value;
}

/**
 * Remove element if it exists (silent operation).
 * Common pattern for cleanup operations.
 * 
 * @param {string} selector
 * @param {Object} [options]
 * @param {Element|Document} [options.context=document]
 */
function $remove(selector, options = {}) {
  withElement(selector, el => el.remove(), options);
}

/**
 * Remove multiple elements matching selector (silent operation).
 * 
 * @param {string} selector
 * @param {Object} [options]
 * @param {Element|Document} [options.context=document]
 */
function $removeAll(selector, options = {}) {
  withElements(selector, el => el.remove(), options);
}
