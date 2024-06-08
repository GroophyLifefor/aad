function getTrendingWidget(uuid) {
  let { widget, inner } = createWidget(CONST_IWillAddLater, {
    title: 'Trending',
    type: 'trending',
    widgetId: uuid,
  });
  const prefix = prefixer('trending', uuid, 'widget');
  let refs = {};
  let url = 'https://github.com/trending';

  function buildHTML() {
    const html = render(
      refs,
      `
        <div ref="container" class="${prefix('container')}">
        </div>
        `
    );
    inner.aadAppendChild(html);
  }

  function buildCSS() {
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
  }

  function onRender(renderCount) {
    function create(data) {
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
        buildJS(renderCount + 3);
      });

      trending.appendChild(node);
      refs.container.innerHTML = '';
      refs.container.appendChild(trending);
    }

    refs.container.innerHTML = `<div class="${prefix('loader-container')}"><div class="${prefix('loader')}"></div></div>`;

    if (Cache.has(url)) {
      create(Cache.get(url));
      return Promise.resolve();
    } else {
      return fetch(url)
        .then((res) => res.text())
        .then((data) => {
          Cache.set(url, data);
          create(data);
        });
    }
  }

  function prevent(renderCount) {
    const containerIndex = getWidgetByUUID(uuid).containerIndex;
    const container = document.querySelector(
      `[data-widget-index="${containerIndex}"]`
    );
    const box = refs.container.querySelector(`.Box`);
    function applyWidth() {
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

    const links = refs.container.querySelectorAll('.Box a');
    links.forEach((link) => {
      link.addEventListener('click', async (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');

        const splitted = href.split('/');
        const firstPathname =
          splitted[0] === 'https:' ? splitted[3] : splitted[1];
        const secondPathname =
          splitted[0] === 'https:' ? splitted[4] : splitted[2];

        url = !!secondPathname
          ? 'https://github.com/' + firstPathname + '/' + secondPathname
          : 'https://github.com/' + firstPathname;

        if (firstPathname.startsWith('trending')) {
          await onRender(3);
          prevent(renderCount);
        } else {
          const { close } = aad_loading(uuid);
          createFrameModal({
            title: 'Repository Preview',
            url: url,
            selector: (doc) => doc.querySelector('#js-repo-pjax-container'),
            prefix: prefix('modal-repository-preview'),
            onLoaded: () => {
              close();
            }
          });
        }
      });
    });
  }

  function buildJS(renderCount = 3) {
    onRender(renderCount)
      .then(() => {
        prevent(renderCount);
      })
      .catch((error) => {
        console.error('Error during buildJS:', error);
      });
  }

  function execute() {
    buildHTML();
    buildCSS();
    buildJS();
  }

  execute();
  return widget;
}
