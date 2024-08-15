function getTrendingWidget(uuid) {
  const memo = {};
  let onConfigChanged = () => {
    memo.onConfigChanged();
  };
  let { widget, inner } = createWidget(CONST_IWillAddLater, {
    title: 'Trending',
    type: 'trending',
    widgetId: uuid,
    onConfigChanged: onConfigChanged,
  });

  const defaultConfig = {
    // 'repositories' | 'developers'
    trendingType: 'repositories',
    // ?spoken_language_code=ak
    repo_spokenLanguage: 'Any',
    // /trending/c++
    repo_language: 'Any',
    // ?since=daily | weekly | monthly
    repo_since: 'daily',

    // /trending/developers/javascript
    dev_programmingLanguage: 'Any',
    // ?since=daily | weekly | monthly
    dev_since: 'daily',
    // ?sponsorable=1 - 'yes' | 'no'
    dev_sponsorable: 'no',
  };

  const prefix = prefixer('trending', uuid, 'widget');
  let refs = {};
  let topLayerRefs = {};
  let config = {};
  const widgetData = getWidgetByUUID(uuid);

  Object.keys(defaultConfig).forEach((key) => {
    config[key] = widgetData.config.public[key] || defaultConfig[key];
  });

  function saveConfig() {
    widgetData.config.public = config;
    setConfigByUUID(uuid, widgetData);
  }

  // init cache
  setConfigByUUID(uuid, {
    public: config,
  });

  memo.onConfigChanged = () => {
    const widgetData = getWidgetByUUID(uuid);
    Object.keys(defaultConfig).forEach((key) => {
      config[key] = widgetData.config.public[key] || defaultConfig[key];
    });
    saveConfig();
    execute();
  };

  function buildUrl() {
    let url = 'https://github.com/trending';

    if (config.trendingType === 'repositories') {
      // adding programming language
      if (config.repo_language !== 'Any') {
        url += `/${config.repo_language}`;
      }

      // adding spoken language
      if (config.repo_spokenLanguage !== 'Any') {
        url += `?spoken_language_code=${config.repo_spokenLanguage}`;
      }

      // adding since
      url += `?since=${config.repo_since}`;
    } else if (config.trendingType === 'developers') {
      url += '/developers';

      // adding programming language
      if (config.dev_programmingLanguage !== 'Any') {
        url += `/${config.dev_programmingLanguage}`;
      }

      // adding since
      url += `?since=${config.dev_since}`;

      // adding sponsorable
      if (config.dev_sponsorable === 'yes') {
        url += `?sponsorable=1`;
      }
    }

    return url;
  }

  function buildTemplate() {
    addCustomCSS(`
      .${prefix('container')} {
        overflow-x: auto;
        position: relative;
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
        <div ref="container" class="${prefix('container')} aad-scroll-x">
        </div>
        `
    );
    inner.aadAppendChild(html);
  }

  function applyJS(renderCount) {
    const renderTrendings = (data) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, 'text/html');
      const trending = doc.querySelector('main > .container-lg > .Box');

      if (!trending) {
        console.error('Failed to find trending');
        return;
      }

      const trendingCards = trending.querySelectorAll('.Box-row');

      trendingCards.forEach((card) => {
        card.remove();
      });

      for (let i = 0; i < renderCount; i++) {
        const card = trendingCards[i];
        if (!!card) trending.appendChild(card);
      }

      const { refs: buttonRefs, node } = getLoadMoreButton();
      buttonRefs.button.addEventListener('click', () => {
        applyJS(renderCount * 2);
      });

      addCustomCSS(`
        .${prefix('top-layer')} {	
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, .05);
          backdrop-filter: blur(2px);
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-size: 24px;
          font-weight: bold;
          z-index: 100;
        }
      `);

      topLayerRefs = {};
      const topLayer = render(
        topLayerRefs,
        `
        <div ref="layer" class="${prefix('top-layer')} aad-hard-hidden">
        </div>
        `
      );

      trending.appendChild(node);
      refs.container.innerHTML = '';
      refs.container.aadAppendChild(trending);
      refs.container.aadAppendChild(topLayer);
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

        if (!box) return;

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

    function showTextOnTopLayer(text) {
      const topLayer = topLayerRefs.layer;
      topLayer.innerText = text;

      if (topLayer.classList.contains('aad-hard-hidden')) {
        topLayer.classList.remove('aad-hard-hidden');
      }

      const close = () => {
        if (!topLayer.classList.contains('aad-hard-hidden')) {
          topLayer.classList.add('aad-hard-hidden');
        }
      };

      const updateText = (text) => {
        topLayer.innerText = text;
      };

      return { close, updateText };
    }

    const changeUrl = () => {
      const loadRepositoryPreview = (url, config) => {
        let closeLoading = null;
        closeLoading = aad_loading(uuid).close;

        function load(_url) {
          createFrameModal({
            title: 'Repository Preview',
            url: _url,
            selector: (doc) => doc.querySelector('#js-repo-pjax-container'),
            prefix: prefix('modal-repository-preview'),
            onLoaded: (dom, close) => {
              closeLoading();

              const tbody = dom?.querySelector('tbody');
              const skeletons = tbody?.querySelectorAll(
                '.Skeleton.Skeleton--text'
              );
              skeletons?.forEach((skeleton) => {
                const parent = skeleton.parentElement;
                parent.style.fontSize = '11px';
                parent.style.fontWeight = 'normal';
                parent.style.opacity = '60%';
                skeleton.outerHTML = 'Cannot loaded data';
              });

              if (config.freeRedirect === true) {
                const links = dom?.querySelectorAll('a') || [];
                links.forEach((link) => {
                  link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const href = link.getAttribute('href');
                    close();

                    console.log('href', href);
                    if (href.includes('http')) {
                      sendNewNotification('Unvalid action', {
                        type: 'error',
                        timeout: 3000,
                      });
                      return;
                    }

                    closeLoading = aad_loading(uuid).close;
                    load(href);
                  });
                });
              }
            },
          });
        }

        load(url);
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

            function parseHref(href) {
              const __config = {
                trendingType: 'repositories',
                repo_spokenLanguage: 'Any',
                repo_language: 'Any',
                repo_since: 'daily',
                dev_programmingLanguage: 'Any',
                dev_since: 'daily',
                dev_sponsorable: 'no',
              };

              // Check if the href contains 'developers'
              if (href.includes('/trending/developers')) {
                __config.trendingType = 'developers';

                // Extract the programming language
                const devLangMatch = href.match(
                  /\/trending\/developers\/([^?]+)/
                );
                if (devLangMatch && devLangMatch[1]) {
                  __config.dev_programmingLanguage = devLangMatch[1];
                }

                // Extract the 'since' period
                const devSinceMatch = href.match(/since=([^&]+)/);
                if (devSinceMatch && devSinceMatch[1]) {
                  __config.dev_since = devSinceMatch[1];
                }

                // Check if 'sponsorable' is present
                if (href.includes('sponsorable=1')) {
                  __config.dev_sponsorable = 'yes';
                }
              } else {
                __config.trendingType = 'repositories';

                // Extract the programming language
                const repoLangMatch = href.match(/\/trending\/([^?]+)/);
                if (repoLangMatch && repoLangMatch[1]) {
                  __config.repo_language = repoLangMatch[1];
                }

                // Extract the 'since' period
                const repoSinceMatch = href.match(/since=([^&]+)/);
                if (repoSinceMatch && repoSinceMatch[1]) {
                  __config.repo_since = repoSinceMatch[1];
                }

                // Extract the spoken language code, if present
                const spokenLangMatch = href.match(
                  /spoken_language_code=([^&]+)/
                );
                if (spokenLangMatch && spokenLangMatch[1]) {
                  __config.repo_spokenLanguage = spokenLangMatch[1];
                }
              }

              return __config;
            }

            const tryUnderstandValidOperations = () => {
              var __config = parseHref(href);
              config.trendingType = __config.trendingType;
              if (__config.trendingType === 'repositories') {
                config.repo_spokenLanguage = __config.repo_spokenLanguage;
                config.repo_language = __config.repo_language;
                config.repo_since = __config.repo_since;
              } else if (__config.trendingType === 'developers') {
                config.dev_programmingLanguage =
                  __config.dev_programmingLanguage;
                config.dev_since = __config.dev_since;
                config.dev_sponsorable = __config.dev_sponsorable;
              }
              saveConfig();
              execute();
            };

            // check is developers
            if (splitted[1] === 'trending' && splitted[2] === 'developers') {
              config.trendingType = 'developers';
              saveConfig();
              execute();
              return;
            }

            // check is trending
            if (href === '/trending') {
              config.trendingType = 'repositories';
              saveConfig();
              execute();
              return;
            }

            const { close, updateText } = showTextOnTopLayer(
              'Checking is repository...'
            );

            // check is repository
            APIRequest(
              'https://api.github.com/repos/' + splitted[1] + '/' + splitted[2]
            ).then((res) => {
              if (res.status === 200) {
                close();
                loadRepositoryPreview('https://github.com' + href, {
                  freeRedirect: true,
                });
              } else {
                updateText('Checking is user...');

                // check is user
                APIRequest('https://api.github.com/users/' + splitted[1]).then(
                  (res) => {
                    if (res.status === 200) {
                      close();
                      loadUserPreview('https://github.com' + href, {
                        freeRedirect: true,
                      });
                    } else {
                      close();
                      tryUnderstandValidOperations();
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

    const url = buildUrl();
    if (Cache.has(url)) {
      renderTrendings(Cache.get(url));
      keepResponsive();
      changeUrl();
      return Promise.resolve();
    } else {
      return aad_fetch(url)
        .then((res) => res.text())
        .then((data) => {
          Cache.set(url, data);
          renderTrendings(data);
          keepResponsive();
          changeUrl();
        })
        .catch((error) => {
          refs.container.innerHTML = '';
          inner.innerHTML = `
          <div class="aad-w-full aad-center">
            <span>${error}<span>
          </div>
          `;
        });
    }
  }

  function execute() {
    buildTemplate();
    applyJS(3);
  }

  execute();
  return { widget };
}

const trending_spoken_languages = globalLanguagesDataset.map((x) => {
  return {
    label: x.LanguageName,
    value: x['639-1'],
  };
});

const trending_programming_languages = programmingLanguagesDataset.map((x) => {
  return {
    label: x.LanguageName,
    value: x.shortName,
  };
});

loadNewWidget('trending', getTrendingWidget, {
  properties: [
    {
      field: 'trendingType',
      type: 'select',
      label: 'Trending Type',
      options: [
        {
          label: 'Repositories',
          value: 'repositories',
        },
        {
          label: 'Developers',
          value: 'developers',
        },
      ],
    },
    {
      if: {
        field: 'trendingType',
        operator: 'EQUAL',
        value: 'repositories',
      },
      type: 'group',
      label: 'Trending Repositories',
      subfields: [
        {
          field: 'repo_spokenLanguage',
          type: 'select',
          label: 'Spoken Language',
          options: [
            {
              label: 'Any',
              value: 'Any',
            },
            ...trending_spoken_languages,
          ],
        },
        {
          field: 'repo_language',
          type: 'select',
          label: 'Programming Language',
          options: [
            {
              label: 'Any',
              value: 'Any',
            },
            ...trending_programming_languages,
          ],
        },
        {
          field: 'repo_since',
          type: 'select',
          label: 'Since',
          options: [
            {
              label: 'Daily',
              value: 'daily',
            },
            {
              label: 'Weekly',
              value: 'weekly',
            },
            {
              label: 'Monthly',
              value: 'monthly',
            },
          ],
        },
      ],
    },
    {
      if: {
        field: 'trendingType',
        operator: 'EQUAL',
        value: 'developers',
      },
      type: 'group',
      label: 'Trending Developers',
      subfields: [
        {
          field: 'dev_programmingLanguage',
          type: 'select',
          label: 'Programming Language',
          options: [
            {
              label: 'Any',
              value: 'Any',
            },
            ...trending_programming_languages,
          ],
        },
        {
          field: 'repo_since',
          type: 'select',
          label: 'Since',
          options: [
            {
              label: 'Daily',
              value: 'daily',
            },
            {
              label: 'Weekly',
              value: 'weekly',
            },
            {
              label: 'Monthly',
              value: 'monthly',
            },
          ],
        },
        {
          field: 'dev_sponsorable',
          type: 'select',
          label: 'Sponsorable',
          options: [
            {
              label: 'Yes, Sponsorable',
              value: 'yes',
            },
            {
              label: 'No, Not Sponsorable',
              value: 'no',
            },
          ],
        },
      ],
    },
  ],
});
