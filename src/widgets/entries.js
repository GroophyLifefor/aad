function getTrendingWidget(uuid) {
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

  // init cache
  setConfigByUUID(uuid, { public: config });

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
      let temp = `https://github.com/issues?page=${page}&q=`;
      temp += encodeURIComponent(' ' + authorConfig());
      temp += encodeURIComponent(' ' + openTypeConfig[openType]);
      temp += encodeURIComponent(' ' + entryTypeConfig[entryType]);
      temp += encodeURIComponent(' ' + isArchivedConfig);
      temp += encodeURIComponent(' ' + visibilityTypeConfig[visibilityType]);
      temp += encodeURIComponent(' ' + onOrganizationConfig());
      temp += encodeURIComponent(' ' + sortConfig[sort]);
      temp += encodeURIComponent(' ' + labelsConfig());
      temp += encodeURIComponent(' ' + assigneeConfig());
      temp += encodeURIComponent(' ' + CIStatusConfig[CIStatus]);
      temp += encodeURIComponent(' ' + reviewTypeConfig[reviewType]);
      return temp;
    };
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

  function checkEntries(renderCount) {
    const fetchUrl = url(1);
    aad_fetch(fetchUrl, {
      redirect: 'follow',
    })
      .then((response) => {
        return response.text();
      })
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        addCustomCSS(`
          .${prefix('hide')} {
            display: none;
          }
            
          .${prefix('show')} {
            display: flex-inline;
          }`);

        doc.querySelectorAll('[rel="stylesheet"]').forEach((style) => {
          document.head.appendChild(style);
        });

        endLoadingScreen();

        const _list = Array.from(doc.querySelectorAll('*')).filter((item) =>
          item
            .getAttribute('aria-labelledby')
            ?.includes('list-view-container-title')
        );
        const listElement = _list?.[0] || null;
        const list = listElement?.cloneNode(true) || null;
        const childs = listElement?.children || [];
        if (!!list) list.innerHTML = '';

        for (let i = 0; i < renderCount; i++) {
          if (!childs[i]) break;
          list.appendChild(childs[i]);
        }

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

        const notFound = render(
          null,
          `<div class="aad-w-full aad-center" ref="notFound">
            <span class="${prefix('header-desc')} ${prefix(
            'not-found-text'
          )}">No entries found with the given parameters</span>
          </div>`
        );

        if (!!list) {
          refs.container.aadAppendChild(header);
          refs.container.appendChild(list);
          refs.container.aadAppendChild(loadMoreButton);
        } else {
          refs.container.aadAppendChild(header);
          refs.container.appendChild(notFound);
        }

        makeDetailsDynamicResponsive();
        listenEntryClicks();
      })
      .catch((error) => {
        endLoadingScreen();
        inner.innerHTML = `
        <div class="aad-w-full aad-center">
          <span>${error}<span>
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

loadNewWidget('entries', getTrendingWidget, {
  properties: [
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
