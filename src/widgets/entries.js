function getTrendingWidget(uuid) {
  let { widget, inner } = createWidget(CONST_IWillAddLater, {
    title: 'Entries',
    type: 'entries',
    widgetId: uuid,
  });
  const prefix = prefixer('entries', uuid, 'widget');
  let refs = {};
  const widgetData = getWidgetByUUID(uuid);
  let config = {};
  let url = () => '';
  let entries = [];
  const defaultConfig = {
    author: GitHubUsername,
    openType: 'open',
    entryType: 'issues & pull-requests',
    isArchived: false,
    visibilityType: 'public & private',
    onOrganization: null,
    sort: 'recently-updated',
  };

  Object.keys(defaultConfig).forEach((key) => {
    config[key] = widgetData.config.public[key] || defaultConfig[key];
  });

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
      all: 'is:open is:closed is:merged',
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
    const onOrganizationConfig = () =>
      onOrganization ? `user:${onOrganization}` : '';
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
    fetch(url(1), {
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

        const list = doc
          .querySelector('.js-navigation-container')
          .cloneNode(true);
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
              )}">AAD - Entries [Issues & PRs]</span>
            </div>
            <span class="${prefix(
              'header-desc'
            )}">I wanted to do a project, it was going to have a good purpose, it lost its purpose, now it only has a good audience.</span>
          </div>`
        );

        refs.container.aadAppendChild(header);
        refs.container.appendChild(list);
        refs.container.aadAppendChild(loadMoreButton);

        makeDetailsDynamicResponsive();
        listenEntryClicks();
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

          console.log('t', href, splitted);

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
                      window.open('https://github.com' + href, '_blank');
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

  execute();
  return widget;
}

loadNewWidget('entries', getTrendingWidget, {
  properties: [],
});