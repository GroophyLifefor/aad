function getTrendingWidget(uuid) {
  const defaultConfig = {
    author: GitHubUsername,
    openType: 'open',
    entryType: 'issues & pull-requests',
    isArchived: false,
    visibilityType: 'public & private',
    onOrganization: '',
    sort: 'recently-updated',
  };

  const widgetData = getWidgetByUUID(uuid);
  let headerTitle = widgetData.config.public.headerTitle || 'AAD - Entries [Issues & PRs]';
  let headerDescription = widgetData.config.public.headerDescription || 'I wanted to do a project, it was going to have a good purpose, it lost its purpose, now it only has a good audience.';
  let renderCount = widgetData.config.public.initialRenderCount || 3;

  let { widget, inner } = createWidget(CONST_IWillAddLater, {
    title: 'Entries',
    type: 'entries',
    widgetId: uuid,
    onConfigChanged: () => {
      const widgetData = getWidgetByUUID(uuid);
      Object.keys(defaultConfig).forEach((key) => {
        config[key] = widgetData.config.public[key] || defaultConfig[key];
      });
      headerTitle = widgetData.config.public.headerTitle || 'AAD - Entries [Issues & PRs]';
      headerDescription = widgetData.config.public.headerDescription || 'I wanted to do a project, it was going to have a good purpose, it lost its purpose, now it only has a good audience.';
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
    config[key] = widgetData.config.public[key] || defaultConfig[key];
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
      if (typeof onOrganization === 'string' && onOrganization.length !== 0) {
        return `user:${onOrganization}`
      } else {
        return '';
      }
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

    url = (page) => {
      let temp = `https://github.com/issues?page=${page}&q=`;
      temp += encodeURIComponent(' ' + authorConfig());
      temp += encodeURIComponent(' ' + openTypeConfig[openType]);
      temp += encodeURIComponent(' ' + entryTypeConfig[entryType]);
      temp += encodeURIComponent(' ' + isArchivedConfig);
      temp += encodeURIComponent(' ' + visibilityTypeConfig[visibilityType]);
      temp += encodeURIComponent(' ' + onOrganizationConfig());
      temp += encodeURIComponent(' ' + sortConfig[sort]);
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

    const isExist = document.querySelector(`.${prefix('container')}`);
    if (!!isExist) {
      isExist.remove();
    }

    refs = {};
    const html = render(
      refs,
      `
        <div ref="container" class="${prefix('container')}">
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
    aad_fetch(url(1), {
      redirect: 'follow',
    })
      .then((response) => response.text())
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

        const _list = doc.querySelector('.js-navigation-container');
        if (!_list) {
          sendNewNotification('No entries found<br />url: ' + url(1), {
            type: 'error',
            timeout: 3000,
          });
          return;
        }
        const list = _list.cloneNode(true);
        const childs = doc.querySelector('.js-navigation-container').children;
        list.innerHTML = '';

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
              <span class="${prefix(
                'header-title'
              )}">${headerTitle}</span>
            </div>
            <span class="${prefix(
              'header-desc'
            )}">${headerDescription}</span>
          </div>`
        );

        refs.container.aadAppendChild(header);
        refs.container.appendChild(list);
        refs.container.aadAppendChild(loadMoreButton);

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
    refs.container.querySelectorAll('.issue-meta-section').forEach((entry) => {
      const actualElement = entry.parentElement;
      actualElement.classList.remove('d-none');
      actualElement.classList.remove('d-md-inline-flex');
    });

    let state = 'none';
    new ResizeObserver(() => {
      const width = refs.container.offsetWidth;
      const FREAKING_MAGIC_NUMBER = 660;

      if (width < FREAKING_MAGIC_NUMBER && state !== 'hide') {
        state = 'hide';
        refs.container
          .querySelectorAll('.issue-meta-section')
          .forEach((entry) => {
            const actualElement = entry.parentElement;
            actualElement.classList.remove(prefix('show'));
            actualElement.classList.add(prefix('hide'));
          });
      } else if (width >= FREAKING_MAGIC_NUMBER && state !== 'show') {
        state = 'show';
        refs.container
          .querySelectorAll('.issue-meta-section')
          .forEach((entry) => {
            const actualElement = entry.parentElement;
            actualElement.classList.remove(prefix('hide'));
            actualElement.classList.add(prefix('show'));
          });
      }
    }).observe(refs.container);
  }

  function listenEntryClicks() {
    const loadRepositoryPreview = (url) => {
      const { close } = aad_loading(uuid);
      createFrameModal({
        title: 'Repository Preview',
        url: url,
        selector: (doc) => doc.querySelector('#js-repo-pjax-container'),
        prefix: prefix('modal-repository-preview'),
        onLoaded: () => {
          close();
        },
      });
    };

    const links = refs.container.querySelectorAll('a');
    links.forEach((link) => {
      link.addEventListener(
        'click',
        (e) => {
          e.preventDefault();
          let href = link.getAttribute('href')?.trim();
          if (href.includes('http')) {
            href = href.substring(18);
          }
          const splitted = href.split('/');

          if (splitted[3] || '' === 'issues') {
            const url = 'https://github.com' + href;
            const { close } = aad_loading(uuid);
            createFrameModal({
              title: 'Preview',
              url: url,
              selector: (doc) =>
                doc.querySelector('.js-quote-selection-container'),
              prefix: prefix('modal-repository-preview'),
              onLoaded: () => {
                close();
              },
            });
          } else {
            // check is repository
            APIRequest(
              'https://api.github.com/repos/' + splitted[1] + '/' + splitted[2]
            ).then((res) => {
              if (res.status === 200) {
                loadRepositoryPreview('https://github.com' + href);
              } else {
                // check is user
                APIRequest('https://api.github.com/users/' + splitted[1]).then(
                  (res) => {
                    if (res.status === 200) {
                      loadUserPreview('https://github.com' + href);
                    } else {
                      sendNewNotification('Unvalid action', {
                        type: 'error',
                        timeout: 3000,
                      });
                    }
                  }
                );
              }
            });
          }
        },
        { passive: false }
      );
    });
  }

  function execute(renderCount = 3) {
    buildUrl();
    buildTemplate();
    applyJS(renderCount);
  }

  execute(renderCount);
  return {
    widget
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
          placeholder: 'I wanted to do a project, it was going to have a good purpose, it lost its purpose, now it only has a good audience.',
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
      type: 'github_user',
      label: 'Entries on this organization',
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
