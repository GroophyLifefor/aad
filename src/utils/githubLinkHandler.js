/**
 * GitHub Link Handler for AAD extension.
 * 
 * Centralized URL parsing and routing for GitHub links.
 * Reduces code duplication across widgets.
 */

/**
 * Parses a GitHub URL and returns structured information.
 * 
 * @param {string} url - GitHub URL (full URL or path only)
 * @returns {{ 
 *   type: 'issue' | 'pr' | 'repo' | 'user' | 'unknown',
 *   owner: string | null,
 *   repo: string | null,
 *   number: string | null,
 *   fullUrl: string,
 *   path: string,
 *   parts: string[]
 * }}
 * 
 * @example
 * parseGitHubUrl('https://github.com/owner/repo/issues/123')
 * // { type: 'issue', owner: 'owner', repo: 'repo', number: '123', ... }
 * 
 * parseGitHubUrl('/owner/repo/pull/456')
 * // { type: 'pr', owner: 'owner', repo: 'repo', number: '456', ... }
 */
function parseGitHubUrl(url) {
  if (!url || typeof url !== 'string') {
    return {
      type: 'unknown',
      owner: null,
      repo: null,
      number: null,
      fullUrl: '',
      path: '',
      parts: [],
    };
  }
  
  const trimmedUrl = url.trim();
  
  // Extract path from full URL or use as-is if already a path
  let path = trimmedUrl;
  if (trimmedUrl.includes('github.com')) {
    try {
      const urlObj = new URL(trimmedUrl.startsWith('http') ? trimmedUrl : `https://${trimmedUrl}`);
      if (!urlObj.host.includes('github.com')) {
        return {
          type: 'unknown',
          owner: null,
          repo: null,
          number: null,
          fullUrl: trimmedUrl,
          path: '',
          parts: [],
        };
      }
      path = urlObj.pathname;
    } catch (e) {
      // If URL parsing fails, try to extract path manually
      const githubIndex = trimmedUrl.indexOf('github.com');
      if (githubIndex !== -1) {
        path = trimmedUrl.substring(githubIndex + 10); // 'github.com'.length = 10
      }
    }
  }
  
  // Parse path parts
  const parts = path.split('/').filter(Boolean);
  const fullUrl = trimmedUrl.startsWith('http') ? trimmedUrl : `https://github.com${path.startsWith('/') ? path : '/' + path}`;
  
  // Determine type based on path structure
  if (parts.length === 0) {
    return {
      type: 'unknown',
      owner: null,
      repo: null,
      number: null,
      fullUrl,
      path,
      parts,
    };
  }
  
  const owner = parts[0] || null;
  const repo = parts[1] || null;
  const resourceType = parts[2] || null;
  const number = parts[3] || null;
  
  let type = 'unknown';
  
  if (resourceType === 'issues' && number) {
    type = 'issue';
  } else if (resourceType === 'pull' && number) {
    type = 'pr';
  } else if (parts.length >= 2 && !resourceType) {
    // Could be repo or user - will need API check
    type = 'unknown';
  } else if (parts.length === 1) {
    // Single part - likely a user
    type = 'user';
  }
  
  return {
    type,
    owner,
    repo,
    number,
    fullUrl,
    path,
    parts,
  };
}

/**
 * Detects if a GitHub path points to a repository or user using API calls.
 * 
 * @param {string} owner - Repository owner or username
 * @param {string} repo - Repository name (can be null for user check)
 * @returns {Promise<'repo' | 'user' | 'unknown'>}
 */
async function detectGitHubResourceType(owner, repo) {
  if (!owner) return 'unknown';
  
  // If repo is provided, check if it's a valid repository first
  if (repo) {
    try {
      const repoResponse = await APIRequest(`https://api.github.com/repos/${owner}/${repo}`);
      if (repoResponse.status === 200) {
        return 'repo';
      }
    } catch (e) {
      // Continue to user check
    }
  }
  
  // Check if it's a user
  try {
    const userResponse = await APIRequest(`https://api.github.com/users/${owner}`);
    if (userResponse.status === 200) {
      return 'user';
    }
  } catch (e) {
    // Not a user either
  }
  
  return 'unknown';
}

/**
 * Handles a GitHub link click with automatic resource detection and preview opening.
 * This is the main entry point for handling GitHub links in widgets.
 * 
 * @param {string} url - The GitHub URL to handle
 * @param {Object} options
 * @param {string} options.uuid - Widget UUID for loading state
 * @param {string|function} options.prefix - Prefix string or prefixer function for CSS classes
 * @param {function} [options.onComplete] - Optional callback after preview opens
 * @param {function} [options.onUnknown] - Optional callback when resource type is unknown
 * @returns {Promise<void>}
 * 
 * @example
 * // In a widget's link click handler:
 * link.addEventListener('click', (e) => {
 *   e.preventDefault();
 *   handleGitHubLink(link.href, { uuid, prefix });
 * });
 */
async function handleGitHubLink(url, { uuid, prefix, onComplete, onUnknown }) {
  const parsed = parseGitHubUrl(url);
  
  if (parsed.parts.length === 0) {
    sendNewNotification('Invalid GitHub URL', {
      type: 'error',
      timeout: 3000,
    });
    onUnknown?.();
    return;
  }
  
  // Handle issues
  if (parsed.type === 'issue') {
    openIssuePreview(parsed.fullUrl, { uuid, prefix, onComplete });
    return;
  }
  
  // Handle pull requests
  if (parsed.type === 'pr') {
    openPullRequestPreview(parsed.fullUrl, { uuid, prefix, onComplete });
    return;
  }
  
  // Handle definite users (single path part like /username)
  if (parsed.type === 'user' && parsed.parts.length === 1) {
    openUserPreview(parsed.fullUrl, { uuid, prefix, onComplete });
    return;
  }
  
  // For ambiguous paths (could be repo or user), use API detection
  if (parsed.owner && parsed.parts.length >= 2) {
    const resourceType = await detectGitHubResourceType(parsed.owner, parsed.repo);
    
    if (resourceType === 'repo') {
      openRepositoryPreview(parsed.fullUrl, { uuid, prefix, onComplete });
      return;
    }
    
    if (resourceType === 'user') {
      openUserPreview(parsed.fullUrl, { uuid, prefix, onComplete });
      return;
    }
  }
  
  // Unknown resource type
  sendNewNotification('Invalid action', {
    type: 'error',
    timeout: 3000,
  });
  onUnknown?.();
}

/**
 * Sets up GitHub link handling for all anchor elements within a container.
 * Prevents default navigation and opens appropriate previews.
 * 
 * @param {Element} container - Container element to search for links
 * @param {Object} options
 * @param {string} options.uuid - Widget UUID for loading state
 * @param {string|function} options.prefix - Prefix string or prefixer function
 * @param {function} [options.onComplete] - Callback after any preview opens
 * @param {function} [options.filter] - Optional filter function to skip certain links
 * 
 * @example
 * // Setup link handling for a widget container
 * setupGitHubLinkHandlers(refs.container, { uuid, prefix });
 * 
 * // With filter to skip external links
 * setupGitHubLinkHandlers(refs.container, {
 *   uuid,
 *   prefix,
 *   filter: (link) => link.href.includes('github.com')
 * });
 */
function setupGitHubLinkHandlers(container, { uuid, prefix, onComplete, filter }) {
  const links = container.querySelectorAll('a');
  
  links.forEach((link) => {
    // Apply optional filter
    if (filter && !filter(link)) {
      return;
    }
    
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const href = link.getAttribute('href')?.trim();
      if (!href) return;
      
      // Skip non-GitHub links
      if (href.startsWith('http') && !href.includes('github.com')) {
        window.open(href, '_blank');
        return;
      }
      
      handleGitHubLink(href, { uuid, prefix, onComplete });
    }, { passive: false });
  });
}
