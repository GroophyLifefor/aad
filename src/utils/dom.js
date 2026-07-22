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

/**
 * Require a GitHub DOM element; toast + issue link when missing.
 *
 * @param {string} selector
 * @param {Element|Document} [context=document]
 * @param {string} [errorContext='']
 * @returns {Element|null}
 */
function requireGitHubElement(selector, context = document, errorContext = '') {
  const element = context.querySelector(selector);

  if (element) {
    return element;
  }

  const manifest = chrome.runtime.getManifest();
  const stackTrace = new Error('GitHub UI element not found').stack || 'unavailable';
  const issueBody = [
    '## GitHub UI change',
    '',
    `Selector: \`${selector}\``,
    `Context: ${errorContext}`,
    `URL: ${window.location.href}`,
    `UA: ${navigator.userAgent}`,
    `AAD: ${manifest.version}`,
    '',
    '### Stack trace',
    '```',
    stackTrace,
    '```',
  ].join('\n');

  sendNewNotification(
    'GitHub UI changes detected. AAD could not find a required page element.',
    {
      type: 'error',
      title: 'GitHub UI Changed',
      timeout: 15000,
      actions: [
        {
          text: 'Open issue',
          type: 'success',
          action: () => {
            const params = new URLSearchParams({
              title: '[Bug] GitHub UI changed',
              body: issueBody,
            });
            window.open(
              `https://github.com/GroophyLifefor/aad/issues/new?${params.toString()}`,
              '_blank'
            );
          },
        },
      ],
    }
  );

  return null;
}

/**
 * Remove GitHub issue/PR list metadata that only hydrates on github.com.
 * Scraped HTML keeps LoadingSkeleton placeholders forever in widgets.
 *
 * @param {Element} root
 */
function stripUnhydratedGitHubListMetadata(root) {
  if (!root) return;

  [
    'list-row-comments',
    'list-row-assigned-agents',
    'list-row-assignees',
  ].forEach((testId) => {
    withElements(`[data-testid="${testId}"]`, (el) => el.remove(), { context: root });
  });

  withElements('[class*="LoadingSkeleton"]', (skeleton) => {
    const rowMeta = skeleton.closest('[data-testid^="list-row-"]');
    if (rowMeta) {
      rowMeta.remove();
      return;
    }
    skeleton.remove();
  }, { context: root });

  withElements('[class*="MetadataContainer-module"]', (container) => {
    if (!container.children.length) {
      container.remove();
    }
  }, { context: root });
}

/**
 * Find GitHub issues/PR list root in scraped HTML (new ListView + legacy).
 * Prefer stable data-* / aria hooks — CSS-module class hashes change.
 *
 * @param {Document|Element} doc
 * @returns {Element|null}
 */
function findGitHubIssuesListElement(doc) {
  const selectors = [
    'ul[data-listview-component="items-list"]',
    '[data-listview-component="items-list"]',
    '[aria-labelledby*="list-view-container-title"]',
  ];

  for (const sel of selectors) {
    const el = doc.querySelector(sel);
    if (el) return el;
  }

  return (
    Array.from(doc.querySelectorAll('[aria-labelledby]')).find((item) =>
      item
        .getAttribute('aria-labelledby')
        ?.includes('list-view-container-title')
    ) || null
  );
}

/**
 * Apply stylesheets/styles from a scraped GitHub document so cloned list markup
 * keeps page look (CSS modules, primer, etc.).
 *
 * @param {Document} doc
 */
function applyScrapedGitHubAssets(doc) {
  doc.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    if (document.querySelector(`link[data-aad-scraped-href="${href}"]`)) {
      return;
    }
    const el = document.createElement('link');
    el.rel = 'stylesheet';
    el.href = href;
    el.setAttribute('crossorigin', 'anonymous');
    el.setAttribute('data-aad-scraped-href', href);
    document.head.appendChild(el);
  });

  doc.querySelectorAll('style').forEach((style) => {
    const css = style.textContent || '';
    if (!css.trim()) return;
    const el = document.createElement('style');
    el.setAttribute('data-aad-scraped-style', 'true');
    el.textContent = css;
    document.head.appendChild(el);
  });
}
