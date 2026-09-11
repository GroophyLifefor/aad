function getEntriesWidget(uuid) {
  const defaultConfig = {
    author: GitHubUsername,
    openType: 'open',
    entryType: 'issues & pull-requests',
    isArchived: false,
    visibilityType: 'public & private',
    onOrganization: '',
    sort: 'recently-updated',

    // WIP
    // Array | 'no-label'
    // OR SYNTAX: label:"bug","wip"
    // AND SYNTAX: label:"bug" label:"wip"
    // use space-separated for multiple, empty string means no query
    labels: '',
    assignee: GitHubUsername,
    // 'all' | 'success' | 'failure' | 'pending'
    CIStatus: 'all',
    /**
      'all' 
      | 'no review' -> 'review:none'
      | 'review required' -> 'review:required'
      | 'approved review' -> 'review:approved'
      | 'changes requested review' -> 'review:changes-requested'
      | 'reviewed by specific user' -> 'reviewed-by:@me'
      | 'not reviewed to specific user' -> '-reviewed-by:@me'
      | 'Awaiting review from specific user' -> 'review-requested:@me'
      | 'Awaiting review from specific user that someone has asked you directly to review' -> 'user-review-requested:@me'
      | Disabled 'Awaiting review from your team' -> 'team-review-requested:github/docs'
    **/
    reviewType: 'all',
    reviewedByAccount: GitHubUsername,
    notReviewedByAccount: GitHubUsername,
    awaitingReviewFromAccount: GitHubUsername,
    awaitingReviewFromAccountThatSomeoneHasAskedYouDirectlyToReview:
      GitHubUsername,
  };

  const widgetData = getWidgetByUUID(uuid);
  let headerTitle =
    widgetData.config.public.headerTitle || 'AAD - Entries [Issues & PRs]';
  let headerDescription =
    widgetData.config.public.headerDescription ||
    'I wanted to do a project, it was going to have a good purpose, it lost its purpose, now it only has a good audience.';
  let renderCount = widgetData.config.public.initialRenderCount || 3;

  let { widget, inner } = createWidget(CONST_IWillAddLater, {
    title: 'Entries',
    type: 'entries',
    widgetId: uuid,
    onConfigChanged: () => {
      const widgetData = getWidgetByUUID(uuid);
      Object.keys(defaultConfig).forEach((key) => {
        config[key] =
          widgetData.config.public[key] === ''
            ? ''
            : widgetData.config.public[key] || defaultConfig[key];
      });
      headerTitle =
        widgetData.config.public.headerTitle || 'AAD - Entries [Issues & PRs]';
      headerDescription =
        widgetData.config.public.headerDescription ||
        'I wanted to do a project, it was going to have a good purpose, it lost its purpose, now it only has a good audience.';
      renderCount = widgetData.config.public.initialRenderCount || 3;
      execute(renderCount);
    },
  });
  const prefix = prefixer('entries', uuid, 'widget');
  let refs = {};
  let config = {};
  let url = () => '';
  let entries = [];

  Object.keys(defaultConfig).forEach((key) => {
    config[key] =
      widgetData.config.public[key] === ''
        ? ''
        : widgetData.config.public[key] || defaultConfig[key];
  });

  config.headerTitle = headerTitle;
  config.headerDescription = headerDescription;
  config.initialRenderCount = renderCount;

  function persistGeneratedSearchUrl(searchUrl) {
    config.generatedSearchUrl = searchUrl;
    // Settings reads aad_containers synchronously; setConfigByUUID is async —
    // patch memory now so the field is visible on next open.
    const stored = getWidgetByUUID(uuid);
    if (stored?.config?.public) {
      stored.config.public.generatedSearchUrl = searchUrl;
    }
    setConfigByUUID(uuid, { public: config });
  }

  function buildUrl() {
    const {
      author,
      openType,
      entryType,
      isArchived,
      visibilityType,
      onOrganization,
      sort,

      labels,
      assignee,
      CIStatus,
      reviewType,
      reviewedByAccount,
      notReviewedByAccount,
      awaitingReviewFromAccount,
      awaitingReviewFromAccountThatSomeoneHasAskedYouDirectlyToReview,
    } = config;

    const authorConfig = () => (author ? `author:${author}` : '');
    const openTypeConfig = {
      open: 'is:open',
      closed: 'is:closed',
      merged: 'is:merged',
      openClosed: 'is:open is:closed',
      openMerged: 'is:open is:merged',
      closedMerged: 'is:closed is:merged',
      all: '',
    };
    const entryTypeConfig = {
      'issues & pull-requests': '',
      issues: 'is:issue',
      'pull-requests': 'is:pr',
    };
    const isArchivedConfig = isArchived ? 'archived:true' : 'archived:false';
    const visibilityTypeConfig = {
      'public & private': '',
      public: 'is:public',
      private: 'is:private',
    };
    const onOrganizationConfig = () => {
      if (typeof onOrganization === 'string' && onOrganization.trim().length !== 0) {
        const value = onOrganization.trim();
        // If contains "/", treat as repository (owner/repo)
        if (value.includes('/')) {
          return `repo:${value}`;
        }
        // Otherwise, treat as organization/user
        return `user:${value}`;
      }
      return '';
    };
    const sortConfig = {
      newest: '',
      oldest: 'sort:created-asc',
      'most-commented': 'sort:comments-desc',
      'least-commented': 'sort:comments-asc',
      'recently-updated': 'sort:updated-desc',
      'least-recently-updated': 'sort:updated-asc',
      'best-match': 'sort:relevance-desc',
    };

    const labelsConfig = () => {
      if ((labels || '').trim() === '') {
        return '';
      } else {
        let final = '';
        const labelList = labels.split(' ');
        let temp = '';
        labelList.forEach((label) => {
          if (label.startsWith('"')) {
            temp = label.substring(1, label.length) + ' ';
          } else if (label.endsWith('"')) {
            temp += label.substring(0, label.length - 1);
            final += ` label:"${temp}"`;
            temp = '';
          } else {
            final += ` label:${label}`;
          }
        });
        return final;
      }
    };

    const assigneeConfig = () => {
      if ((assignee || '').trim() === '') {
        return '';
      } else {
        return `assignee:${assignee}`;
      }
    };

    const CIStatusConfig = {
      all: '',
      success: 'status:success',
      failure: 'status:failure',
      pending: 'status:pending',
    };

    const reviewTypeConfig = {
      all: '',
      'no review': 'review:none',
      'review required': 'review:required',
      'approved review': 'review:approved',
      'changes requested review': 'review:changes-requested',
      'reviewed by specific user': `reviewed-by:@${reviewedByAccount}`,
      'not reviewed to specific user': `-reviewed-by:@${notReviewedByAccount}`,
      'Awaiting review from specific user': `review-requested:@${awaitingReviewFromAccount}`,
      'Awaiting review from specific user that someone has asked you directly to review': `user-review-requested:@${awaitingReviewFromAccountThatSomeoneHasAskedYouDirectlyToReview}`,
    };

    url = (page) => {
      const q = [
        authorConfig(),
        openTypeConfig[openType],
        entryTypeConfig[entryType],
        isArchivedConfig,
        visibilityTypeConfig[visibilityType],
        onOrganizationConfig(),
        sortConfig[sort],
        labelsConfig(),
        assigneeConfig(),
        CIStatusConfig[CIStatus],
        reviewTypeConfig[reviewType],
      ]
        .filter((part) => !!(part || '').toString().trim())
        .join(' ');

      const params = new URLSearchParams();
      params.set('page', String(page || 1));
      if (entryType === 'pull-requests') {
        params.set('type', 'pr');
      } else if (entryType === 'issues') {
        params.set('type', 'issue');
      }
      params.set('q', q);
      return `https://github.com/issues?${params.toString()}`;
    };

    persistGeneratedSearchUrl(url(1));
    console.log('[AAD entries] Search URL built', {
      uuid,
      url: url(1),
      config: {
        author,
        openType,
        entryType,
        isArchived,
        visibilityType,
        onOrganization,
        sort,
        labels,
        assignee,
        CIStatus,
        reviewType,
      },
    });
  }

  function startLoadingScreen() {
    refs.container.innerHTML = `<div class="${prefix(
      'loader-container'
    )}"><div class="${prefix('loader')}"></div></div>`;
  }

  function endLoadingScreen() {
    refs.container.innerHTML = '';
  }

  function buildTemplate() {
    addCustomCSS(`
      .Box-row--focus-gray.navigation-focus {
        background-color: transparent !important;
      }

      .${prefix('container')} {
        overflow-x: auto;
      }
  
      .${prefix('width-mobile')} {
        width: fit-content;
      }
  
      .${prefix('width-desktop')} {
        width: max-content;
        width: -webkit-fill-available;
      }
  
      .${prefix('loader-container')} {
        width: 100%;
        height: 240px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
  
      .${prefix('loader')} {
        width: 70px;
        height: 50px;
        box-sizing: border-box;
        background:
          conic-gradient(from 135deg at top,#0000, #fff 1deg 90deg,#0000 91deg) right -20px bottom 8px/18px 9px,
          linear-gradient(#fff 0 0) bottom/100% 8px,
          #000;
        background-repeat: no-repeat;
        border-bottom: 8px solid #000;
        position: relative;
        animation: ${prefix('l7-0')} 2s infinite linear;
      }
      .${prefix('loader')}::before {
        content: "";
        position: absolute;
        width: 10px;
        height: 14px;
        background: lightblue;
        left: 10px;
        animation: ${prefix('l7-1')} 2s infinite cubic-bezier(0,200,1,200);
      }
      @keyframes ${prefix('l7-0')}{
        100% { background-position: left -20px bottom 8px,bottom}
      }
      @keyframes ${prefix('l7-1')}{
        0%,50%   {bottom: 8px}
        90%,100% {bottom: 8.1px}
      }
      `);

    // Remove existing container if present
    $remove(`.${prefix('container')}`);

    refs = {};
    const html = render(
      refs,
      `
        <div ref="container" class="${prefix('container')} aad-scroll-x">
        </div>
        `
    );
    inner.aadAppendChild(html);
  }

  function applyJS(renderCount) {
    startLoadingScreen();

    checkEntries(renderCount);
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function buildApiSearchUrl(page, typeQualifier = '') {
    const webUrl = new URL(url(page));
    let query = webUrl.searchParams.get('q') || '';

    // The REST API receives sorting separately from the search query.
    query = query.replace(/\bsort:[^\s]+/g, '').replace(/\s+/g, ' ').trim();

    // onOrganization represents an organization in the widget config.
    if (
      typeof config.onOrganization === 'string' &&
      config.onOrganization.trim() &&
      !config.onOrganization.includes('/')
    ) {
      const owner = config.onOrganization.trim();
      query = query.replace(`user:${owner}`, `org:${owner}`);
    }
    if (typeQualifier && !query.includes(typeQualifier)) {
      query = `${query} ${typeQualifier}`.trim();
    }

    const params = new URLSearchParams();
    params.set('q', query);
    params.set('page', String(page || 1));
    params.set('per_page', '100');

    const sortConfig = {
      newest: ['created', 'desc'],
      oldest: ['created', 'asc'],
      'most-commented': ['comments', 'desc'],
      'least-commented': ['comments', 'asc'],
      'recently-updated': ['updated', 'desc'],
      'least-recently-updated': ['updated', 'asc'],
    };
    const sort = sortConfig[config.sort];
    if (sort) {
      params.set('sort', sort[0]);
      params.set('order', sort[1]);
    }

    return `https://api.github.com/search/issues?${params.toString()}`;
  }

  async function fetchApiSearchResults(apiUrls) {
    const results = await Promise.allSettled(
      apiUrls.map(async (apiUrl) => {
        console.log('[AAD entries] API subquery started', {
          uuid,
          apiUrl,
          queryType: new URL(apiUrl).searchParams.get('q'),
        });

        const response = await APIRequest(apiUrl, {
          headers: {
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
          },
        });

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(
            `GitHub API returned ${response.status}: ${errorBody.slice(0, 300)}`
          );
        }

        const payload = await response.json();
        if (!Array.isArray(payload.items)) {
          throw new Error('GitHub API response does not contain items');
        }

        console.log('[AAD entries] API subquery succeeded', {
          uuid,
          apiUrl,
          totalCount: payload.total_count,
          itemCount: payload.items.length,
        });

        return payload;
      })
    );

    const fulfilled = results.filter((result) => result.status === 'fulfilled');
    const rejected = results.filter((result) => result.status === 'rejected');

    console.log('[AAD entries] API subqueries settled', {
      uuid,
      total: results.length,
      succeeded: fulfilled.length,
      failed: rejected.length,
      failures: results
        .map((result, index) => ({ result, apiUrl: apiUrls[index] }))
        .filter(({ result }) => result.status === 'rejected')
        .map(({ result, apiUrl }) => ({
          apiUrl,
          error: result.reason?.message || String(result.reason),
        })),
    });

    if (!fulfilled.length) {
      throw new Error('All GitHub API entry subqueries failed');
    }

    const payloads = fulfilled.map((result) => result.value);

    return {
      totalCount: payloads.reduce(
        (total, payload) => total + (payload.total_count || 0),
        0
      ),
      items: payloads
        .flatMap((payload) => payload.items || [])
        .sort(
          (left, right) =>
            new Date(right.updated_at || right.created_at) -
            new Date(left.updated_at || left.created_at)
        ),
    };
  }

  function getApiEntryState(item) {
    if (item.pull_request) {
      if (item.draft) return 'draft-pr';
      if (item.pull_request.merged_at) return 'merged-pr';
      if (item.state === 'closed') return 'closed-pr';
      return 'open-pr';
    }

    if (item.state === 'closed' && item.state_reason === 'completed') {
      return 'completed-issue';
    }
    if (item.state === 'closed') return 'closed-issue';
    return 'open-issue';
  }

  function getApiEntryStateLabel(state) {
    return {
      'open-pr': 'Open pull request',
      'draft-pr': 'Draft pull request',
      'closed-pr': 'Closed pull request',
      'merged-pr': 'Merged pull request',
      'open-issue': 'Open issue',
      'closed-issue': 'Closed issue',
      'completed-issue': 'Closed issue as completed',
    }[state];
  }

  function getApiEntryIcon(item) {
    const state = getApiEntryState(item);
    const icon = item.pull_request
      ? SVG.prGreen(16, 16).replace('color-fg-open', 'aad-entry-icon-svg')
      : SVG.issueGreen(16, 16).replace(
          'class="octicon octicon-issue-opened open"',
          'class="octicon octicon-issue-opened aad-entry-icon-svg"'
        );

    return icon.replace(
      'aad-entry-icon-svg',
      `aad-entry-icon-svg aad-entry-icon-${state}`
    );
  }

  function getApiRepositoryName(item) {
    if (item.repository?.full_name) {
      return item.repository.full_name;
    }

    const repositoryUrl = item.repository_url || '';
    const match = repositoryUrl.match(/\/repos\/([^/]+\/[^/]+)$/);
    return match?.[1] || '';
  }

  function getLabelTextColor(hexColor) {
    const hex = String(hexColor || '').replace('#', '');
    if (!/^[0-9a-f]{6}$/i.test(hex)) return '#24292f';

    const [red, green, blue] = [0, 2, 4].map((index) =>
      parseInt(hex.slice(index, index + 2), 16)
    );
    return red * 299 + green * 587 + blue * 114 > 150000
      ? '#24292f'
      : '#ffffff';
  }

  function renderApiEntries(items, renderCount) {
    const visibleItems = items.slice(0, renderCount);
    const list = document.createElement('ul');
    list.className = 'Box-list';

    visibleItems.forEach((item) => {
      const entry = document.createElement('li');
      entry.className = 'Box-row';
      const labels = (item.labels || [])
        .map((label) => {
          const backgroundColor = String(label.color || '').replace('#', '');
          const color = getLabelTextColor(backgroundColor);
          const style = /^[0-9a-f]{6}$/i.test(backgroundColor)
            ? ` style="background-color: #${backgroundColor}; color: ${color};"`
            : '';
          return `<span class="aad-entries-api-label"${style}>${escapeHtml(
            label.name
          )}</span>`;
        })
        .join('');
      const repository = escapeHtml(getApiRepositoryName(item));
      const author = escapeHtml(item.user?.login || '');
      const kind = item.pull_request ? 'Pull request' : 'Issue';
      const state = getApiEntryState(item);
      const stateLabel = getApiEntryStateLabel(state);

      entry.innerHTML = `
        <div class="aad-entries-api-row">
          <div class="aad-entries-api-title-row">
            <span class="aad-entries-api-icon" title="${stateLabel}" aria-label="${stateLabel}">
              ${getApiEntryIcon(item)}
            </span>
            <a href="${escapeHtml(item.html_url)}" class="Link--primary text-bold">
              ${escapeHtml(item.title)}
            </a>
          </div>
          <div class="text-small color-fg-muted">
            ${kind} #${escapeHtml(item.number)}
            ${repository ? ` · ${repository}` : ''}
            ${author ? ` · opened by ${author}` : ''}
          </div>
          ${labels ? `<div class="aad-entries-api-labels">${labels}</div>` : ''}
        </div>
      `;
      list.appendChild(entry);
    });

    addCustomCSS(`
      .aad-entries-api-row {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .aad-entries-api-title-row {
        display: flex;
        align-items: flex-start;
        gap: 6px;
      }

      .aad-entries-api-title-row a {
        font-size: 14px;
        line-height: 1.35;
      }

      .aad-entries-api-icon {
        display: inline-flex;
        flex: 0 0 16px;
        margin-top: 2px;
      }

      .aad-entries-api-labels {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-top: 2px;
      }

      .aad-entries-api-label {
        display: inline-flex;
        align-items: center;
        border-radius: 2em;
        padding: 2px 7px;
        font-size: 11px;
        line-height: 1.2;
        font-weight: 600;
      }

      .aad-entry-icon-svg {
        width: 16px;
        height: 16px;
        fill: currentColor;
      }

      .aad-entry-icon-open-pr,
      .aad-entry-icon-open-issue {
        color: #1f883d;
      }

      .aad-entry-icon-draft-pr {
        color: #8250df;
      }

      .aad-entry-icon-closed-pr,
      .aad-entry-icon-closed-issue {
        color: #cf222e;
      }

      .aad-entry-icon-merged-pr,
      .aad-entry-icon-completed-issue {
        color: #8250df;
      }

      .${prefix('vertical')} {
        padding: 8px;
        display: flex;
        gap: 8px;
        align-items: start;
        flex-direction: column;
      }

      .${prefix('horizontal')} {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .${prefix('green-ball')} {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: #1f893e;
      }

      .${prefix('header-title')} {
        font-size: 0.75rem;
        line-height: 1rem;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        font-weight: 600;
      }

      .${prefix('header-desc')} {
        font-size: 0.75rem;
        line-height: 1rem;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        opacity: 0.6;
      }

      .${prefix('not-found-text')} {
        border-bottom: 1px solid #1f893e;
      }

    `);

    endLoadingScreen();
    refs.container.innerHTML = '';

    const header = render(
      null,
      `<div class="${prefix('vertical')}">
        <div class="${prefix('horizontal')}">
          <div class="${prefix('green-ball')}"></div>
          <span class="${prefix('header-title')}">${escapeHtml(headerTitle)}</span>
        </div>
        <span class="${prefix('header-desc')}">${escapeHtml(headerDescription)}</span>
      </div>`
    );
    refs.container.aadAppendChild(header);

    if (visibleItems.length === 0) {
      const notFound = render(
        null,
        `<div class="aad-w-full aad-center">
          <span class="${prefix('header-desc')} ${prefix(
          'not-found-text'
        )}">No entries found with the given parameters</span>
        </div>`
      );
      refs.container.aadAppendChild(notFound);
    } else {
      refs.container.appendChild(list);
      const loadMoreButtonRefs = {};
      const loadMoreButton = render(
        loadMoreButtonRefs,
        `<button ref="button" type="submit" class="ajax-pagination-btn btn color-border-default f6 mt-2 width-full">
          Load more…
        </button>`
      );
      loadMoreButtonRefs.button.addEventListener('click', () => {
        execute(renderCount * 2);
      });
      refs.container.aadAppendChild(loadMoreButton);
    }

    listenEntryClicks();
  }

  async function checkEntries(renderCount) {
    const fetchUrl = url(1);
    console.log('[AAD entries] Fetch started', {
      uuid,
      fetchUrl,
      renderCount,
    });

    let pat = '';
    try {
      pat = await getPatFromStorage();
    } catch (error) {
      console.warn('[AAD entries] Could not read PAT, using HTML fetch', {
        uuid,
        error,
      });
    }

    if (pat && pat !== 'deny-all') {
      const apiUrls =
        config.entryType === 'issues & pull-requests'
          ? [
              buildApiSearchUrl(1, 'is:issue'),
              buildApiSearchUrl(1, 'is:pr'),
            ]
          : [buildApiSearchUrl(1)];
      console.log('[AAD entries] Trying PAT API first', {
        uuid,
        apiUrls,
      });

      try {
        const data = await fetchApiSearchResults(apiUrls);

        console.log('[AAD entries] PAT API succeeded', {
          uuid,
          totalCount: data.totalCount,
          receivedItemCount: data.items.length,
        });
        renderApiEntries(data.items, renderCount);
        return;
      } catch (error) {
        console.warn('[AAD entries] PAT API failed, falling back to HTML fetch', {
          uuid,
          apiUrls,
          error,
        });
      }
    } else {
      console.log('[AAD entries] No PAT available, using HTML fetch', { uuid });
    }

    aad_fetch(fetchUrl, {
      redirect: 'follow',
      credentials: 'include',
    })
      .then((response) => {
        console.log('[AAD entries] Fetch response received', {
          uuid,
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          redirected: response.redirected,
          responseUrl: response.url,
          contentType: response.headers.get('content-type'),
        });
        return response.text();
      })
      .then((html) => {
        const listSelectorMarker = 'data-listview-component="items-list"';
        const listSelectorIndex = html.indexOf(listSelectorMarker);
        console.log('[AAD entries] Raw response HTML', html);
        console.log('[AAD entries] Raw response list marker', {
          uuid,
          marker: listSelectorMarker,
          found: listSelectorIndex !== -1,
          index: listSelectorIndex,
          context:
            listSelectorIndex === -1
              ? null
              : html.slice(
                  Math.max(0, listSelectorIndex - 300),
                  listSelectorIndex + listSelectorMarker.length + 300
                ),
        });
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const listSelectors = [
          'ul[data-listview-component="items-list"]',
          '[data-listview-component="items-list"]',
          '[aria-labelledby*="list-view-container-title"]',
        ];
        const selectorMatches = Object.fromEntries(
          listSelectors.map((selector) => [
            selector,
            doc.querySelectorAll(selector).length,
          ])
        );
        console.log('[AAD entries] Response HTML parsed', {
          uuid,
          htmlLength: html.length,
          title: doc.title,
          selectorMatches,
          hasLoginForm: Boolean(
            doc.querySelector('form[action*="login"], input[name="login"]')
          ),
          bodyTextPreview: (doc.body?.textContent || '')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 200),
        });

        addCustomCSS(`
          .${prefix('hide')} {
            display: none;
          }
            
          .${prefix('show')} {
            display: flex-inline;
          }`);

        applyScrapedGitHubAssets(doc);

        endLoadingScreen();

        const listElement = findGitHubIssuesListElement(doc);
        const list = listElement?.cloneNode(true) || null;
        const childs = Array.from(listElement?.children || []);
        console.log('[AAD entries] GitHub issues list lookup', {
          uuid,
          found: Boolean(listElement),
          tagName: listElement?.tagName || null,
          listChildCount: childs.length,
          listAttributes: listElement
            ? {
                dataListviewComponent: listElement.getAttribute(
                  'data-listview-component'
                ),
                ariaLabelledby: listElement.getAttribute('aria-labelledby'),
              }
            : null,
        });
        if (!!list) list.innerHTML = '';

        for (let i = 0; i < renderCount; i++) {
          if (!childs[i]) break;
          list.appendChild(childs[i].cloneNode(true));
        }

        console.log('[AAD entries] Entries selected for render', {
          uuid,
          requestedRenderCount: renderCount,
          availableEntryCount: childs.length,
          renderedEntryCount: list?.children.length || 0,
          showingEmptyState: !list,
        });
        stripUnhydratedGitHubListMetadata(list);

        refs.container.innerHTML = '';

        const loadMoreButtonRefs = {};
        const loadMoreButton = render(
          loadMoreButtonRefs,
          `<button ref="button" type="submit" class="ajax-pagination-btn btn color-border-default f6 mt-2 width-full" data-disable-with="Loading more…">
            Load more…
          </button>`
        );
        loadMoreButtonRefs.button.addEventListener('click', () => {
          execute(renderCount * 2);
        });

        addCustomCSS(`
          .${prefix('vertical')} {
            padding: 8px;
            display: flex;
            gap: 8px;
            align-items: start;
            flex-direction: column;
          }
      
          .${prefix('horizontal')} {
            width: 100%;
            display: flex;
            align-items: center;
            gap: 8px;
          }
      
          .${prefix('green-ball')} {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: #1f893e;
          }
      
          .${prefix('header-title')} {
            font-size: 0.75rem;
            line-height: 1rem;
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            font-weight: 600;
          }
      
          .${prefix('header-desc')} {
            font-size: 0.75rem;
            line-height: 1rem;
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            opacity: 0.6;
          }
        `);

        const headerRefs = {};
        const header = render(
          headerRefs,
          `<div class="${prefix('vertical')}" ref="header">
            <div class="${prefix('horizontal')}">
              <div class="${prefix('green-ball')}"></div>
              <span class="${prefix('header-title')}">${headerTitle}</span>
            </div>
            <span class="${prefix('header-desc')}">${headerDescription}</span>
          </div>`
        );

        addCustomCSS(`
          .${prefix('not-found-text')} {
            border-bottom: 1px solid #1f893e;
          }
        `);

        if (!!list) {
          refs.container.aadAppendChild(header);
          refs.container.appendChild(list);
          refs.container.aadAppendChild(loadMoreButton);
        } else {
          refs.container.aadAppendChild(header);
          refs.container.appendChild(
            render(
              null,
              `<div class="aad-w-full aad-center">
                <span class="${prefix('header-desc')} ${prefix(
                'not-found-text'
              )}">Veriye erişemedim</span>
              </div>`
            )
          );
        }

        makeDetailsDynamicResponsive();
        listenEntryClicks();
      })
      .catch((error) => {
        console.error('[AAD entries] Fetch or render failed', {
          uuid,
          fetchUrl,
          error,
          stack: error?.stack,
        });
        endLoadingScreen();
        inner.innerHTML = `
        <div class="aad-w-full aad-center">
          <span>Veriye erişemedim</span>
        </div>
        `;
      });
  }

  function makeDetailsDynamicResponsive() {
    const FREAKING_MAGIC_NUMBER = 660;
    let state = 'none';
    let resizeTimeout;

    const handleResize = () => {
      const width = refs.container.offsetWidth;

      if (width < FREAKING_MAGIC_NUMBER && state !== 'hide') {
        state = 'hide';
        withElements('.issue-meta-section', (entry) => {
          const actualElement = $parent(entry);
          if (actualElement) {
            actualElement.classList.remove(prefix('show'));
            actualElement.classList.add(prefix('hide'));
          }
        }, { context: refs.container });
      } else if (width >= FREAKING_MAGIC_NUMBER && state !== 'show') {
        state = 'show';
        withElements('.issue-meta-section', (entry) => {
          const actualElement = $parent(entry);
          if (actualElement) {
            actualElement.classList.remove(prefix('hide'));
            actualElement.classList.add(prefix('show'));
          }
        }, { context: refs.container });
      }
    };

    new ResizeObserver(() => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 100);
    }).observe(refs.container);
  }

  function listenEntryClicks() {
    // Use centralized GitHub link handler
    setupGitHubLinkHandlers(refs.container, { uuid, prefix });
  }

  function execute(renderCount = 3) {
    buildUrl();
    buildTemplate();
    applyJS(renderCount);
  }

  execute(renderCount);
  return {
    widget,
  };
}

loadNewWidget('entries', getEntriesWidget, {
  properties: [
    {
      field: 'generatedSearchUrl',
      type: 'text',
      readonly: true,
      label: 'Generated search URL (updates after save)',
      placeholder: 'Save config to generate',
    },
    {
      type: 'group',
      label: 'Header Content',
      subfields: [
        {
          field: 'headerTitle',
          type: 'text',
          placeholder: 'AAD - Entries [Issues & PRs]',
          label: 'Title of the header',
        },
        {
          field: 'headerDescription',
          type: 'text',
          placeholder:
            'I wanted to do a project, it was going to have a good purpose, it lost its purpose, now it only has a good audience.',
          label: 'Description of the header',
        },
        {
          field: 'initialRenderCount',
          type: 'number',
          placeholder: '3',
          label: 'Initial render count of entries',
          min: 1,
          max: 20,
        },
      ],
    },
    {
      field: 'author',
      type: 'github_user',
      label: 'Entries by this author',
    },
    {
      field: 'assignee',
      type: 'github_user',
      label: 'Entries by this assignee',
    },
    {
      field: 'openType',
      type: 'select',
      label: 'Type(s) of entries',
      options: [
        {
          label: 'Open',
          value: 'open',
        },
        {
          label: 'Closed',
          value: 'closed',
        },
        {
          label: 'Merged',
          value: 'merged',
        },
        {
          label: 'Open & Closed',
          value: 'openClosed',
        },
        {
          label: 'Open & Merged',
          value: 'openMerged',
        },
        {
          label: 'Closed & Merged',
          value: 'closedMerged',
        },
        {
          label: 'All (Open, Closed, Merged)',
          value: 'all',
        },
      ],
    },
    {
      field: 'entryType',
      type: 'select',
      label: 'Type(s) of entries',
      options: [
        {
          label: 'Just Issues',
          value: 'issues',
        },
        {
          label: 'Just Pull-Requests',
          value: 'pull-requests',
        },
        {
          label: 'Issues & Pull-Requests (Both)',
          value: 'issues & pull-requests',
        },
      ],
    },
    {
      field: 'reviewType',
      type: 'select',
      label: 'review status of entries',
      options: [
        {
          label: 'Any',
          value: 'all',
        },
        {
          label: 'No review',
          value: 'no review',
        },
        {
          label: 'Review Required',
          value: 'review required',
        },
        {
          label: 'Approved Review',
          value: 'approved review',
        },
        {
          label: 'Changes Requested Review',
          value: 'changes requested review',
        },
        {
          label: 'Reviewed by specific user',
          value: 'reviewed by specific user',
        },
        {
          label: 'Not reviewed to specific user',
          value: 'not reviewed to specific user',
        },
        {
          label: 'Awaiting review from specific user',
          value: 'Awaiting review from specific user',
        },
        {
          label:
            'Awaiting review from specific user that someone has asked you directly to review',
          value:
            'Awaiting review from specific user that someone has asked you directly to review',
        },
      ],
    },
    {
      if: {
        field: 'reviewType',
        operator: 'EQUAL',
        value: 'reviewed by specific user',
      },
      type: 'group',
      label: 'Review options',
      subfields: [
        {
          field: 'reviewedByAccount',
          type: 'github_user',
          label: 'Reviewed by this account',
        },
      ],
    },
    {
      if: {
        field: 'reviewType',
        operator: 'EQUAL',
        value: 'not reviewed to specific user',
      },
      type: 'group',
      label: 'Review options',
      subfields: [
        {
          field: 'notReviewedByAccount',
          type: 'github_user',
          label: 'not Reviewed by this account',
        },
      ],
    },
    {
      if: {
        field: 'reviewType',
        operator: 'EQUAL',
        value: 'Awaiting review from specific user',
      },
      type: 'group',
      label: 'Review options',
      subfields: [
        {
          field: 'awaitingReviewFromAccount',
          type: 'github_user',
          label: 'Awaiting review from this account',
        },
      ],
    },
    {
      if: {
        field: 'reviewType',
        operator: 'EQUAL',
        value:
          'Awaiting review from specific user that someone has asked you directly to review',
      },
      type: 'group',
      label: 'Review options',
      subfields: [
        {
          field:
            'awaitingReviewFromAccountThatSomeoneHasAskedYouDirectlyToReview',
          type: 'github_user',
          label:
            'Awaiting review from this account that someone has asked you directly to review',
        },
      ],
    },
    {
      field: 'CIStatus',
      type: 'select',
      label: 'CI/CD status of entries',
      options: [
        {
          label: 'Any',
          value: 'all',
        },
        {
          label: 'Success',
          value: 'success',
        },
        {
          label: 'Failure',
          value: 'failure',
        },
        {
          label: 'Pending',
          value: 'pending',
        },
      ],
    },
    {
      field: 'isArchived',
      type: 'select',
      label: 'Show Archived entries',
      options: [
        {
          label: 'Yes',
          value: true,
        },
        {
          label: 'No',
          value: false,
        },
      ],
    },
    {
      field: 'labels',
      type: 'text',
      placeholder: 'Any label',
      label:
        'Entries with this label (use spaces between labels to include multiple)',
    },
    {
      field: 'visibilityType',
      type: 'select',
      label: 'Visibility of entries',
      options: [
        {
          label: 'Public & Private',
          value: 'public & private',
        },
        {
          label: 'Public',
          value: 'public',
        },
        {
          label: 'Private',
          value: 'private',
        },
      ],
    },
    {
      field: 'onOrganization',
      type: 'text',
      placeholder: 'organization or owner/repo',
      label: 'Entries on this organization or repository (e.g., "openjs-foundation" or "GroophyLifefor/aad")',
    },
    {
      field: 'sort',
      type: 'select',
      label: 'Sort by',
      options: [
        {
          label: 'Newest',
          value: 'newest',
        },
        {
          label: 'Oldest',
          value: 'oldest',
        },
        {
          label: 'Most Commented',
          value: 'most-commented',
        },
        {
          label: 'Least Commented',
          value: 'least-commented',
        },
        {
          label: 'Recently Updated',
          value: 'recently-updated',
        },
        {
          label: 'Least Recently Updated',
          value: 'least-recently-updated',
        },
        {
          label: 'Best Match',
          value: 'best-match',
        },
      ],
    },
  ],
});
