function getRecentActivityWidget(uuid) {
  const defaultConfig = {
    initialRenderCount: 3,
  };

  const widgetData = getWidgetByUUID(uuid);
  let config = {};

  Object.keys(defaultConfig).forEach((key) => {
    config[key] =
      widgetData.config.public[key] === ''
        ? ''
        : widgetData.config.public[key] || defaultConfig[key];
  });

  let renderCount = config.initialRenderCount;

  const { widget, inner } = createWidget(CONST_IWillAddLater, {
    title: 'Recent Activity',
    type: 'recentActivity',
    widgetId: uuid,
    onConfigChanged: () => {
      const widgetData = getWidgetByUUID(uuid);
      Object.keys(defaultConfig).forEach((key) => {
        config[key] =
          widgetData.config.public[key] === ''
            ? ''
            : widgetData.config.public[key] || defaultConfig[key];
      });
      renderCount = config.initialRenderCount;
      execute(renderCount);
    },
  });

  // init cache
  setConfigByUUID(uuid, { public: config });

  const prefix = prefixer('recentActivity', uuid, 'widget');
  let refs = {};

  const staticUrl =
    'https://github.com/issues/recent?q=is%3Apr%20is%3Aissue%20involves%3A%40me%20updated%3A%3E%40today-1w%20sort%3Aupdated-desc';

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
    checkRecentActivity(renderCount);
  }

  function checkRecentActivity(renderCount) {
    aad_fetch(staticUrl, {
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
        // Convert to array to avoid live collection issues when appending
        const childs = Array.from(listElement?.children || []);
        
        if (!!list) list.innerHTML = '';

        for (let i = 0; i < renderCount; i++) {
          if (!childs[i]) break;
          // Clone the node before appending to avoid moving from original parent
          list.appendChild(childs[i].cloneNode(true));
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
        `);

      

        addCustomCSS(`
          .${prefix('not-found-text')} {
            border-bottom: 1px solid #1f893e;
          }
        `);

        const notFound = render(
          null,
          `<div class="aad-w-full aad-center" ref="notFound">
            <span class="${prefix(
            'not-found-text'
          )}">No recent activity found</span>
          </div>`
        );

        if (!!list) {
          refs.container.appendChild(list);
          refs.container.aadAppendChild(loadMoreButton);
        } else {
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
    buildTemplate();
    applyJS(renderCount);
  }

  execute(renderCount);
  return {
    widget,
  };
}

loadNewWidget('recentActivity', getRecentActivityWidget, {
  properties: [
    {
      field: 'initialRenderCount',
      type: 'number',
      placeholder: '3',
      label: 'Initial render count of entries',
      min: 1,
      max: 20,
    },
  ],
});
