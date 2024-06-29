function getTrendingWidget(uuid) {
  let { widget, inner } = createWidget(CONST_IWillAddLater, {
    title: 'Trending',
    type: 'trending',
    widgetId: uuid,
  });
  const prefix = prefixer('trending', uuid, 'widget');
  let refs = {};
  const widgetData = getWidgetByUUID(uuid);
  let url = widgetData.config.public.url || 'https://github.com/trending';
  let containerQuery =
    widgetData.config.public.containerQuery || 'main > .container-lg > .Box';
  let itemQuery = widgetData.config.public.itemQuery || '.Box-row';

  // init cache
  setConfigByUUID(uuid, { public: { url, containerQuery, itemQuery } });

  function buildTemplate() {
    addCustomCSS(`
      .${prefix('container')} {
        overflow-x: auto;
      }
  
      .${prefix('container')} .Box {
      /*
        width: max-content;
        width: -webkit-fill-available;
      */
      }
  
      .${prefix('width-mobile')} {
        width: fit-content;
      }
  
      .${prefix('width-desktop')} {
        width: max-content;
        width: -webkit-fill-available;
      }
  
      .${prefix('container')} .Box [aria-label="Trending"] {
        display: flex;
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
    const renderTrendings = (data) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, 'text/html');
      const trending = doc.querySelector(containerQuery);

      if (!trending) {
        console.error('Failed to find trending');
        return;
      }

      const trendingCards = trending.querySelectorAll(itemQuery);

      trendingCards.forEach((card) => {
        card.remove();
      });

      for (let i = 0; i < renderCount; i++) {
        const card = trendingCards[i];
        if (!!card) trending.appendChild(card);
      }

      const { refs: buttonRefs, node } = getLoadMoreButton();
      buttonRefs.button.addEventListener('click', () => {
        applyJS(renderCount + 3);
      });

      trending.appendChild(node);
      refs.container.innerHTML = '';
      refs.container.aadAppendChild(trending);
    };

    const keepResponsive = () => {
      const containerIndex = getWidgetByUUID(uuid).containerIndex;
      const container = document.querySelector(
        `[data-widget-index="${containerIndex}"]`
      );
      let box = refs.container.querySelector(`.Box`);
      function applyWidth() {
        if (!box) {
          box = refs.container.querySelector(`.Box`);
        }

        const width = container.offsetWidth;
        if (width < 600) {
          if (box.classList.contains(prefix('width-mobile'))) return;
          box.classList.add(prefix('width-mobile'));
          box.classList.remove(prefix('width-desktop'));
        } else {
          if (box.classList.contains(prefix('width-desktop'))) return;
          box.classList.add(prefix('width-desktop'));
          box.classList.remove(prefix('width-mobile'));
        }
      }
      window.addEventListener('resize', applyWidth);
      document.addEventListener('onWidgetsStyled', applyWidth);
      applyWidth();
    };

    const changeUrl = () => {
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

      const loadUserPreview = (url) => {
        const { close } = aad_loading(uuid);
        createFrameModal({
          title: 'User Preview',
          url: url,
          selector: (doc) => doc.querySelector('main'),
          prefix: prefix('modal-user-preview'),
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
            let href = link.getAttribute('href');
            if (href.includes('http')) {
              href = href.substring(18);
            }
            const splitted = href.split('/');

            // check is developers
            if (splitted[1] === 'trending' && splitted[2] === 'developers') {
              url = 'https://github.com/trending/developers';
              setConfigByUUID(uuid, { public: { url } });
              execute();
              return;
            }

            // check is trending
            if (href === '/trending') {
              url = 'https://github.com/trending';
              setConfigByUUID(uuid, { public: { url } });
              execute();
              return;
            }

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
                      url = 'https://github.com' + href;
                      setConfigByUUID(uuid, { public: { url } });
                      execute();
                    }
                  }
                );
              }
            });
          },
          { passive: false }
        );
      });
    };

    refs.container.innerHTML = `<div class="${prefix(
      'loader-container'
    )}"><div class="${prefix('loader')}"></div></div>`;

    if (Cache.has(url)) {
      renderTrendings(Cache.get(url));
      keepResponsive();
      changeUrl();
      return Promise.resolve();
    } else {
      return fetch(url)
        .then((res) => res.text())
        .then((data) => {
          Cache.set(url, data);
          renderTrendings(data);
          keepResponsive();
          changeUrl();
        });
    }
  }

  function execute() {
    buildTemplate();
    applyJS(3);
  }

  execute();
  return widget;
}

loadNewWidget('trending', getTrendingWidget, {
  properties: [
    {
      field: 'url',
      type: 'text',
      label: 'URL',
      subfields: [
        {
          field: 'containerQuery',
          type: 'text',
          label: 'Container Query',
          readonly: true,
        },
        {
          field: 'itemQuery',
          type: 'text',
          label: 'Item Query',
          readonly: true,
        },
      ],
    },
  ],
});
