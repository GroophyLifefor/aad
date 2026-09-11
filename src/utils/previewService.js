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
  notificationsList: [
    'main#js-repo-pjax-container .notifications-list.js-notifications-list',
    '.notifications-list.js-notifications-list',
    '.js-notifications-list',
    '.notifications-list',
  ],
};

/**
 * GitHub issue/PR preview HTML layouts.
 * gh_v1 — legacy page HTML (SSR timeline/comments, .js-quote-selection-container).
 * gh_v2 — IssueViewer layout (body SSR; comments/merge box hydrate client-side).
 */
const GH_PREVIEW_LAYOUT = {
  V1: 'gh_v1',
  V2: 'gh_v2',
};

function isGhV1IssueOrPrDocument(doc) {
  if (doc.querySelector('.js-quote-selection-container')) {
    return true;
  }
  if (doc.querySelector('.timeline-comment')) {
    return true;
  }
  return false;
}

function detectIssueOrPrPreviewLayout(doc) {
  return isGhV1IssueOrPrDocument(doc) ? GH_PREVIEW_LAYOUT.V1 : GH_PREVIEW_LAYOUT.V2;
}

function selectIssueOrPrPreviewRoot(doc) {
  if (isGhV1IssueOrPrDocument(doc)) {
    return (
      doc.querySelector('.js-quote-selection-container') ||
      doc.querySelector('.js-discussion') ||
      doc.querySelector('.timeline-comment')?.closest('.js-quote-selection-container') ||
      doc.querySelector('[data-testid="issue-viewer-issue-container"]')
    );
  }

  return doc.querySelector('[data-testid="issue-viewer-issue-container"]');
}

function stripIssueViewerSkeletonComments(root) {
  if (!root) return;

  withElements('[class*="LoadingSkeleton"]', (skeleton) => {
    skeleton.remove();
  }, { context: root });

  withElements('[data-testid*="timeline"], [data-testid*="comment"]', (el) => {
    if (el.querySelector('[class*="LoadingSkeleton"]')) {
      el.remove();
    }
  }, { context: root });
}

function isPullRequestPreviewUrl(url) {
  const parsed = parseGitHubUrl(url);
  return parsed.type === 'pr' || /\/pull\/\d+(?:\/|$)/.test(parsed.path || url || '');
}

function stripUnhydratedPrPreviewSections(root, url) {
  if (!root || !isPullRequestPreviewUrl(url)) {
    return;
  }

  root.querySelectorAll('[data-testid="mergebox-partial"]').forEach((mergeBox) => {
    mergeBox.remove();
  });

  root.querySelectorAll('[class*="MergeBox-module__mergeboxLoading"]').forEach((loader) => {
    loader.closest('[data-testid="mergebox-partial"]')?.remove();
    loader.remove();
  });
}

async function fetchIssueCommentsFromApi(owner, repo, number) {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/issues/${number}/comments?per_page=100`;
  const response = await APIRequest(apiUrl, {
    headers: {
      Accept: 'application/vnd.github.html+json',
    },
  });

  if (response.status === 403) {
    throw new Error('GitHub API denied the request. Add a PAT in AAD settings or try again later.');
  }

  if (response.status !== 200) {
    throw new Error(`GitHub API returned ${response.status} while loading comments.`);
  }

  return response.json();
}

function formatAuthorAssociation(association) {
  const labels = {
    OWNER: 'Owner',
    MEMBER: 'Member',
    COLLABORATOR: 'Collaborator',
    CONTRIBUTOR: 'Contributor',
    MANNEQUIN: 'Mannequin',
  };
  return labels[association] || null;
}

function formatCommentTimestamp(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function buildTimelineCommentHtml(comment) {
  const badge = formatAuthorAssociation(comment.author_association);
  const badgeHtml = badge ? `<span class="Label ml-1">${badge}</span>` : '';
  const reactionsHtml =
    comment.reactions?.total_count > 0
      ? `<div class="comment-reactions js-reactions-container mt-2">${comment.reactions.total_count} reaction${comment.reactions.total_count === 1 ? '' : 's'}</div>`
      : '';

  return `
    <div class="TimelineItem js-targetable-element js-comment-container">
      <div class="avatar-parent-child TimelineItem-avatar">
        <a class="d-inline-block" href="${comment.user.html_url}" target="_blank" rel="noopener noreferrer">
          <img class="avatar rounded-2 avatar-user" src="${comment.user.avatar_url}&amp;s=48" width="24" height="24" alt="@${comment.user.login}">
        </a>
      </div>
      <div class="TimelineItem-body">
        <div class="timeline-comment-group js-minimizable-comment-group">
          <div class="timeline-comment unminimized-comment comment previewable-edit js-task-list-container">
            <div class="timeline-comment-header d-flex flex-justify-between flex-items-center">
              <h3 class="timeline-comment-header-text text-normal">
                <a class="author Link--primary text-bold css-truncate-target" href="${comment.user.html_url}" target="_blank" rel="noopener noreferrer">${comment.user.login}</a>
                ${badgeHtml}
                commented
                <a href="${comment.html_url}" class="Link--secondary js-timestamp" target="_blank" rel="noopener noreferrer">
                  <relative-time datetime="${comment.created_at}" class="no-wrap">${formatCommentTimestamp(comment.created_at)}</relative-time>
                </a>
              </h3>
            </div>
            <div class="edit-comment-hide">
              <table class="d-block">
                <tbody class="d-block">
                  <tr class="d-block">
                    <td class="d-block comment-body markdown-body">${comment.body_html}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            ${reactionsHtml}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderApiCommentsList(container, comments, prefixStr) {
  container.innerHTML = '';

  if (!comments.length) {
    container.innerHTML = `
      <div class="blankslate blankslate-spacious">
        <h3 class="blankslate-heading">No comments yet</h3>
        <p class="blankslate-description">Be the first to comment on GitHub.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="js-discussion js-socket-channel width-full ${prefixStr}-discussion-timeline">
      <h2 class="sr-only">Comments</h2>
      <div class="TimelineItem js-targetable-element ${prefixStr}-comment-count">
        <div class="TimelineItem-badge">${comments.length}</div>
        <div class="TimelineItem-body">
          <span class="color-fg-muted text-small text-bold">${comments.length} comment${comments.length === 1 ? '' : 's'}</span>
        </div>
      </div>
      ${comments.map((comment) => buildTimelineCommentHtml(comment)).join('')}
    </div>
  `;
}

function appendModernCommentsPlaceholder(previewRoot, url, prefixStr) {
  if (previewRoot.querySelector(`.${prefixStr}-comments-section`)) {
    return;
  }

  addCustomCSS(`
    .${prefixStr}-comments-section {
      width: 100%;
    }

    .${prefixStr}-comments-notice-box {
      margin-bottom: 16px;
    }

    .${prefixStr}-comments-notice-box p {
      margin: 0 0 12px;
      font-size: 12px;
      line-height: 1.4;
    }

    .${prefixStr}-comments-list {
      width: 100%;
      overflow: visible;
    }

    .${prefixStr}-comments-list .${prefixStr}-discussion-timeline {
      overflow: visible;
    }

    .${prefixStr}-comments-list .TimelineItem.js-comment-container {
      display: flex;
      gap: 8px;
      align-items: flex-start;
      position: relative;
      left: auto;
      margin-left: 0;
      padding-left: 0;
    }

    .${prefixStr}-comments-list .TimelineItem.js-comment-container::before {
      left: 11px;
      z-index: 0;
    }

    .${prefixStr}-comments-list .TimelineItem.js-comment-container > * {
      position: relative;
      z-index: 1;
    }

    .${prefixStr}-comments-list .avatar-parent-child.TimelineItem-avatar {
      margin-top: 4px;
    }

    .${prefixStr}-comments-list .TimelineItem-avatar {
      position: static !important;
      float: none !important;
      left: auto !important;
      margin-left: 0 !important;
      flex-shrink: 0;
      width: 24px;
    }

    .${prefixStr}-comments-list .TimelineItem-avatar .avatar {
      width: 24px;
      height: 24px;
    }

    .${prefixStr}-comments-list .timeline-comment-header-text {
      font-size: 12px;
      line-height: 1.4;
      font-weight: 400;
    }

    .${prefixStr}-comments-list .timeline-comment-header-text .author {
      font-size: 12px;
    }

    .${prefixStr}-comments-list .timeline-comment-header-text .Label {
      font-size: 10px;
      padding: 0 6px;
      line-height: 18px;
    }

    .${prefixStr}-comments-list .comment-body.markdown-body {
      font-size: 13px;
      line-height: 1.5;
    }

    .${prefixStr}-comments-list .comment-body.markdown-body h1,
    .${prefixStr}-comments-list .comment-body.markdown-body h2,
    .${prefixStr}-comments-list .comment-body.markdown-body h3 {
      font-size: 14px;
      margin-top: 12px;
      margin-bottom: 8px;
    }

    .${prefixStr}-comments-list .comment-body.markdown-body p,
    .${prefixStr}-comments-list .comment-body.markdown-body li {
      font-size: 13px;
      margin-bottom: 8px;
    }

    .${prefixStr}-comments-list .comment-reactions {
      font-size: 11px;
    }

    .${prefixStr}-comments-list .${prefixStr}-comment-count .TimelineItem-body {
      font-size: 12px;
    }

    .${prefixStr}-comments-list .${prefixStr}-comment-count .TimelineItem-badge {
      font-size: 11px;
      min-width: 20px;
      height: 20px;
      line-height: 20px;
    }

    .${prefixStr}-comments-list .TimelineItem-body {
      flex: 1;
      min-width: 0;
      overflow: visible;
    }

    .${prefixStr}-comments-list .${prefixStr}-comment-count {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-left: 0;
      padding-left: 0;
    }

    .${prefixStr}-comments-list .${prefixStr}-comment-count::before {
      display: none;
    }

    .${prefixStr}-comments-list .${prefixStr}-comment-count .TimelineItem-badge {
      position: static !important;
      left: auto !important;
      margin: 0 !important;
      float: none !important;
    }
  `);

  const refs = {};
  const section = render(
    refs,
    `
    <div class="${prefixStr}-comments-section">
      <div class="flash flash-warn ${prefixStr}-comments-notice-box">
        <p>
          GitHub does not include comments in the new issue viewer HTML preview.
          Load them with the GitHub API below.
        </p>
        <button ref="loadBtn" type="button" class="btn btn-sm">
          Load comments via API
        </button>
      </div>
      <div ref="commentsList" class="${prefixStr}-comments-list"></div>
    </div>
    `,
  );

  let commentsLoaded = false;
  const loadComments = async () => {
    if (commentsLoaded) return;
    commentsLoaded = true;

    const parsed = parseGitHubUrl(url);
    if (!parsed.owner || !parsed.repo || !parsed.number) {
      commentsLoaded = false;
      sendNewNotification('Could not parse issue URL for API comments.', {
        type: 'error',
        timeout: 4000,
      });
      return;
    }

    refs.loadBtn.disabled = true;
    refs.loadBtn.textContent = 'Loading comments…';

    try {
      const comments = await fetchIssueCommentsFromApi(
        parsed.owner,
        parsed.repo,
        parsed.number,
      );
      renderApiCommentsList(refs.commentsList, comments, prefixStr);
      refs.loadBtn.closest(`.${prefixStr}-comments-notice-box`)?.remove();
    } catch (error) {
      commentsLoaded = false;
      refs.loadBtn.disabled = false;
      refs.loadBtn.textContent = 'Load comments via API';
      sendNewNotification(error.message || 'Failed to load comments via API.', {
        type: 'error',
        timeout: 6000,
        title: 'Comments API',
      });
    }
  };

  refs.loadBtn.addEventListener('click', loadComments);

  getPatFromStorage()
    .then((pat) => {
      if (pat && pat !== 'deny-all') {
        loadComments();
      }
    })
    .catch(() => {
      // Keep the manual button available if PAT storage cannot be read.
    });

  previewRoot.appendChild(section);
}

function finalizeIssueOrPrPreview(url, prefixStr, previewLayout) {
  const previewRoot = document.querySelector(`.${prefixStr}-preview`);
  const content = document.querySelector(`.${prefixStr}-preview-content`);

  if (!previewRoot || !content) {
    return;
  }

  stripUnhydratedPrPreviewSections(content, url);
  stripUnhydratedPrPreviewSections(previewRoot, url);

  if (previewLayout === GH_PREVIEW_LAYOUT.V1) {
    return;
  }

  stripIssueViewerSkeletonComments(content);
  appendModernCommentsPlaceholder(previewRoot, url, prefixStr);
}

function openIssueOrPrPreview(url, { uuid, prefix, onComplete, title, prefixKey = 'modal-issue-preview' }) {
  const prefixStr =
    typeof prefix === 'function'
      ? prefix(prefixKey)
      : `${prefix}-${prefixKey}`;
  const { close } = aad_loading(uuid);
  let previewLayout = GH_PREVIEW_LAYOUT.V2;

  createFrameModal({
    title,
    url,
    selector: (doc) => {
      previewLayout = detectIssueOrPrPreviewLayout(doc);

      if (isPullRequestPreviewUrl(url)) {
        doc.querySelectorAll('[data-testid="mergebox-partial"]').forEach((mergeBox) => {
          mergeBox.remove();
        });
      }

      const root = selectIssueOrPrPreviewRoot(doc);
      if (root) {
        stripUnhydratedPrPreviewSections(root, url);
        if (previewLayout === GH_PREVIEW_LAYOUT.V2) {
          stripIssueViewerSkeletonComments(root);
        }
      }
      return root;
    },
    prefix: prefixStr,
    onLoaded: () => {
      finalizeIssueOrPrPreview(url, prefixStr, previewLayout);
      close();
      onComplete?.();
    },
  });
}

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
  openIssueOrPrPreview(url, {
    uuid,
    prefix,
    onComplete,
    title: 'Issue Preview',
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
  openIssueOrPrPreview(url, {
    uuid,
    prefix,
    onComplete,
    title: 'Pull Request Preview',
    prefixKey: 'modal-pr-preview',
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
    selector: (doc) => {
      for (const sel of GITHUB_SELECTORS.notificationsList) {
        const el = $(sel, { context: doc });
        if (el) return el;
      }
      return null;
    },
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
