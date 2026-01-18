/**
 * GitHub Preview Service for AAD extension.
 * 
 * Centralized functions for opening GitHub previews in modals.
 * Reduces code duplication across widgets.
 */

/**
 * GitHub element selectors for different preview types.
 * These may need updating when GitHub changes their UI.
 */
const GITHUB_SELECTORS = {
  issue: '[data-testid="issue-viewer-issue-container"]',
  pullRequest: '.js-quote-selection-container',
  repository: '#js-repo-pjax-container',
  user: 'main',
  repositoriesTab: 'main .Layout-main',
  notifications: '.js-check-all-container, .notifications-list',
};

/**
 * Common cleanup operations for repository previews.
 * Removes GitHub UI elements that don't work well in modals.
 * 
 * @param {Element} dom - The modal DOM content
 */
function _cleanupRepositoryPreview(dom) {
  if (!dom) return;
  
  // Remove sticky toggle element
  withElement('.js-toggle-stuck', el => el.remove(), { context: dom });
  
  // Handle skeleton loading placeholders
  withElement('tbody', tbody => {
    withElements('.Skeleton.Skeleton--text', skeleton => {
      const parent = $parent(skeleton);
      if (parent) {
        parent.style.fontSize = '11px';
        parent.style.fontWeight = 'normal';
        parent.style.opacity = '60%';
        skeleton.outerHTML = 'Cannot load data';
      }
    }, { context: tbody });
  }, { context: dom });
  
  // Remove blankslate containers that appear broken in modals
  withElements('.blankslate-container', el => {
    const parent = $parent(el);
    if (parent) {
      parent.removeChild(el);
    }
  }, { context: dom });
}

/**
 * Opens a GitHub issue preview in a modal.
 * 
 * @param {string} url - GitHub issue URL
 * @param {Object} options
 * @param {string} options.uuid - Widget UUID for loading state
 * @param {string|function} options.prefix - Prefix string or prefixer function
 * @param {function} [options.onComplete] - Callback after preview loads
 */
function openIssuePreview(url, { uuid, prefix, onComplete }) {
  const prefixStr = typeof prefix === 'function' ? prefix('modal-issue-preview') : `${prefix}-modal-issue-preview`;
  const { close } = aad_loading(uuid);
  
  createFrameModal({
    title: 'Issue Preview',
    url: url,
    selector: (doc) => $(GITHUB_SELECTORS.issue, { context: doc }),
    prefix: prefixStr,
    onLoaded: (dom) => {
      close();
      onComplete?.(dom);
    },
  });
}

/**
 * Opens a GitHub pull request preview in a modal.
 * 
 * @param {string} url - GitHub PR URL
 * @param {Object} options
 * @param {string} options.uuid - Widget UUID for loading state
 * @param {string|function} options.prefix - Prefix string or prefixer function
 * @param {function} [options.onComplete] - Callback after preview loads
 */
function openPullRequestPreview(url, { uuid, prefix, onComplete }) {
  const prefixStr = typeof prefix === 'function' ? prefix('modal-pr-preview') : `${prefix}-modal-pr-preview`;
  const { close } = aad_loading(uuid);
  
  createFrameModal({
    title: 'Pull Request Preview',
    url: url,
    selector: (doc) => $(GITHUB_SELECTORS.pullRequest, { context: doc }),
    prefix: prefixStr,
    onLoaded: (dom) => {
      close();
      onComplete?.(dom);
    },
  });
}

/**
 * Opens a GitHub repository preview in a modal.
 * Handles common cleanup (removing .js-toggle-stuck, skeleton elements, etc.)
 * 
 * @param {string} url - GitHub repository URL
 * @param {Object} options
 * @param {string} options.uuid - Widget UUID for loading state
 * @param {string|function} options.prefix - Prefix string or prefixer function
 * @param {function} [options.onComplete] - Callback after preview loads
 */
function openRepositoryPreview(url, { uuid, prefix, onComplete }) {
  const prefixStr = typeof prefix === 'function' ? prefix('modal-repository-preview') : `${prefix}-modal-repository-preview`;
  const { close } = aad_loading(uuid);
  
  createFrameModal({
    title: 'Repository Preview',
    url: url,
    selector: (doc) => $(GITHUB_SELECTORS.repository, { context: doc }),
    prefix: prefixStr,
    onLoaded: (dom) => {
      _cleanupRepositoryPreview(dom);
      close();
      onComplete?.(dom);
    },
  });
}

/**
 * Opens a GitHub user profile preview in a modal.
 * 
 * @param {string} url - GitHub user profile URL
 * @param {Object} options
 * @param {string} options.uuid - Widget UUID for loading state
 * @param {string|function} options.prefix - Prefix string or prefixer function
 * @param {function} [options.onComplete] - Callback after preview loads
 */
function openUserPreview(url, { uuid, prefix, onComplete }) {
  const prefixStr = typeof prefix === 'function' ? prefix('modal-user-preview') : `${prefix}-modal-user-preview`;
  const { close } = aad_loading(uuid);
  
  createFrameModal({
    title: 'User Preview',
    url: url,
    selector: (doc) => $(GITHUB_SELECTORS.user, { context: doc }),
    prefix: prefixStr,
    onLoaded: (dom) => {
      close();
      onComplete?.(dom);
    },
  });
}

/**
 * Opens a GitHub repositories tab preview in a modal.
 * 
 * @param {string} url - GitHub user repositories tab URL
 * @param {Object} options
 * @param {string} options.uuid - Widget UUID for loading state
 * @param {string|function} options.prefix - Prefix string or prefixer function
 * @param {function} [options.onComplete] - Callback after preview loads
 */
function openRepositoriesTabPreview(url, { uuid, prefix, onComplete }) {
  const prefixStr = typeof prefix === 'function' ? prefix('modal-repositories-preview') : `${prefix}-modal-repositories-preview`;
  const { close } = aad_loading(uuid);
  
  createFrameModal({
    title: 'GitHub Repositories Preview',
    url: url,
    selector: (doc) => $(GITHUB_SELECTORS.repositoriesTab, { context: doc }),
    prefix: prefixStr,
    onLoaded: (dom) => {
      if (dom) {
        // Remove buggy vertical bars after starring containers
        withElements('.starring-container', el => {
          const buggyVerticalBar = el.nextElementSibling;
          if (buggyVerticalBar) buggyVerticalBar.remove();
        }, { context: dom });
      }
      close();
      onComplete?.(dom);
    },
  });
}

/**
 * Opens a GitHub notifications preview in a modal.
 * 
 * @param {string} url - GitHub notifications URL
 * @param {Object} options
 * @param {string} options.uuid - Widget UUID for loading state
 * @param {string|function} options.prefix - Prefix string or prefixer function
 * @param {function} [options.onComplete] - Callback after preview loads
 */
function openNotificationsPreview(url, { uuid, prefix, onComplete }) {
  const prefixStr = typeof prefix === 'function' ? prefix('modal-notifications-preview') : `${prefix}-modal-notifications-preview`;
  const { close } = aad_loading(uuid);
  
  createFrameModal({
    title: 'GitHub Notifications Preview',
    url: url,
    selector: (doc) => $(GITHUB_SELECTORS.notifications, { context: doc }),
    prefix: prefixStr,
    onLoaded: (dom) => {
      if (dom) {
        // Customize header
        withElement('.Box-header', header => {
          header.innerHTML = `<h3 class="Box-title">
            Notifications Preview - 
            <a target="_blank" href="${url}">Open in new tab</a>
          </h3>`;
        }, { context: dom });
        
        // Remove unstar buttons that don't work in modal context
        withElements('.notification-action-unstar', el => el.remove(), { context: dom });
      }
      close();
      onComplete?.(dom);
    },
  });
}

/**
 * Smart preview opener - automatically opens appropriate preview based on type.
 * 
 * @param {string} url - GitHub URL
 * @param {Object} options
 * @param {string} options.uuid - Widget UUID for loading state
 * @param {string|function} options.prefix - Prefix string or prefixer function
 * @param {'issue'|'pr'|'repo'|'user'} options.type - Type of preview
 * @param {function} [options.onComplete] - Callback after preview loads
 */
function openGitHubPreview(url, { uuid, prefix, type, onComplete }) {
  switch (type) {
    case 'issue':
      return openIssuePreview(url, { uuid, prefix, onComplete });
    case 'pr':
      return openPullRequestPreview(url, { uuid, prefix, onComplete });
    case 'repo':
      return openRepositoryPreview(url, { uuid, prefix, onComplete });
    case 'user':
      return openUserPreview(url, { uuid, prefix, onComplete });
    default:
      console.warn(`AAD - Unknown preview type: ${type}`);
      sendNewNotification('Unknown preview type', {
        type: 'error',
        timeout: 3000,
      });
  }
}
