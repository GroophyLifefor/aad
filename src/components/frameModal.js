/**
 *
 * @param {
 * * url: string,
 * * selector: function,
 * * title: string,
 * * prefix: string,
 * * headers?: object
 * } props
 */
async function createFrameModal(props) {
  async function create(data, config) {
    const parser = new DOMParser();
    const htmlDocument = parser.parseFromString(data, 'text/html');

    const cssLinks = htmlDocument.querySelectorAll('link[rel="stylesheet"]');
    const cssUUIDs = [];
    cssLinks.forEach((link) => {
      const cssLink = document.createElement('link');
      cssLink.type = 'text/css';
      cssLink.setAttribute('crossorigin', 'anonymous');
      cssLink.rel = 'stylesheet';
      cssLink.setAttribute('href', link.getAttribute('href'));
      const uuid = generateUUID();
      cssLink.setAttribute('data-uuid', uuid);
      document.head.appendChild(cssLink);
      cssUUIDs.push(uuid);
    });

    let conversation = props.selector(htmlDocument);
    let count = 0;
    while (!conversation && count < 20) {
      await aad_sleep(100);
      conversation = props.selector(htmlDocument);
      count++;
    }
    // To guarantee the search results are ready
    aad_sleep(100);

    if (!conversation) {
      console.error('Conversation not found', props.url);
      return { node: null, close: () => {}, error: true };
    }

    let _closeModal = () => {};
    const { inner } = createModal(
      `${props.title}`,
      {
        cssUUIDs: cssUUIDs,
        cacheInfo: {
          isCached: config.isCached,
          showIsCached: true,
          onRenewCache: () => {
            Cache.remove(props.url);
            _closeModal();
            setTimeout(() => {
              createFrameModal(props);
            }, 300);
          },
        },
      },
      ({ closeModal }) => {
        _closeModal = closeModal;
        addCustomCSS(`
           .${props.prefix}-iframe {
             width: 100%;
             height: 100%;
             border-radius: 8px;
           }

           .${props.prefix}-preview {
             display: flex;
             flex-direction: column;
             gap: 8px;
             padding: 8px;
             border-radius: 8px;
           }

           .${props.prefix}-preview main {
             width: 100%;
             height: 100%;
           }
 
           .${props.prefix}-preview-external-link-container {
             display: flex;
             gap: 4px;
             align-items: center;
           }
 
           .${props.prefix}-preview-external-link {
             font-weight: 500;
             font-size: 0.75rem;
             line-height: 1rem;
             overflow: hidden;
             display: -webkit-box;
             -webkit-box-orient: vertical;
             -webkit-line-clamp: 1;
           }
 
           .${props.prefix}-preview-external-link:hover {
             text-decoration: underline;
           }
         `);

        const _refs = {};
        const modal = render(
          _refs,
          `
           <div class="${props.prefix}-preview">
             <a target="_blank" href="${props.url}" class="${
            props.prefix
          }-preview-external-link-container">
               ${SVG.externalLink(16, 16)}
               <span class="${props.prefix}-preview-external-link">
                 Open in new tab
               </span>
             </a>
             <div ref="inner">

             </div>
           </div>
           `
        );

        _refs.inner.aadAppendChild(conversation);
        return modal;
      }
    );

    return {
      node: inner,
      close: _closeModal,
      error: false
    };
  }

  if (Cache.has(props.url)) {
    props.onLoad?.();
    const { node, close } = await create(Cache.get(props.url), {
      isCached: true,
    });
    props.onLoaded?.(node, close);
  } else {
    let headers = props.headers || {};
    await aad_fetch(props.url, headers)
      .then((res) => res.text())
      .then(async (data) => {
        Cache.set(props.url, data);
        if (!!props.onLoad) {
          props.onLoad.then(async () => {
            const { node, close } = await create(data, {
              isCached: false,
            });
            props.onLoaded?.(node, close);
          });
        } else {
          const { node, close } = await create(data, {
            isCached: false,
          });
          props.onLoaded?.(node, close);
        }
      });
  }
}
