function createModal(title, config, modalFactory) {
  const body = document.querySelector('body');
  const prefix = prefixer('modal', generateUUID(), 'component');

  const positions = {
    topLeft: {
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    topCenter: {
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    topRight: {
      justifyContent: 'flex-end',
      alignItems: 'flex-start',
    },
    centerLeft: {
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    center: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    centerRight: {
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    bottomLeft: {
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
    },
    bottomCenter: {
      justifyContent: 'center',
      alignItems: 'flex-end',
    },
    bottomRight: {
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
    },
  };

  const defaultConfig = {
    close: true,
    header: true,
    ms: 300,
    padding: '8px',
    position: 'center',
    globalMargins: {
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px',
    },
    border: undefined,
    maxWidth: '80dvw',
    maxHeight: '80dvh',
    cacheInfo: {
      isCached: false,
      showIsCached: false,
      onRenewCache: () => {},
    },
  };

  config = Object.assign({}, defaultConfig, config);

  const modal_CSS_UUID = addCustomCSS(`
    .${prefix('inner')} {
      overflow-y: auto;
      overflow-x: clip;
    }

    .${prefix('container')} {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100dvh;
        display: flex;
        justify-content: ${positions[config.position].justifyContent};
        align-items: ${positions[config.position].alignItems};
        z-index: ${zIndex.modal};
        animation: fadeIn ${config.ms}ms ease-in-out forwards;
    }

    .${prefix('divider')} {
        display: flex;
        flex-direction: column;
        gap: 8px;
        background-color: ${getColor('modal.bg')};
        border: 1px solid ${config.border || getColor('modal.border')}; 
        border-radius: 8px;
        padding: ${config.padding};
        max-width: ${config.maxWidth};
        max-height: ${config.maxHeight};
        margin: ${config.globalMargins.top || '0px'} ${
    config.globalMargins.right || '0px'
  } ${config.globalMargins.bottom || '0px'} ${
    config.globalMargins.left || '0px'
  };
    }

    .${prefix('title-container')} {
        display: flex;
        justify-content: space-between;
        padding: 0px 8px;
        align-items: center;
    }

    .${prefix('close-button')} {
        cursor: pointer;
    }

    .${prefix('container-close')} {
        animation: fadeOut ${config.ms}ms ease-in-out forwards;
    }

    @keyframes fadeIn {
        from {
            backdrop-filter: blur(0px);
            transform: scale(.9);
            opacity: 0;
        }
        to {
            backdrop-filter: blur(1px);
            transform: scale(1);
            opacity: 1;
        }
    }

    @keyframes fadeOut {
        from {
            backdrop-filter: blur(1px);
            transform: scale(1);
            opacity: 1;
        }
        to {
            backdrop-filter: blur(0px);
            transform: scale(.9);
            opacity: 0;
        }
    }

    .${prefix('cache-content')}:hover {
      text-decoration: underline;
      cursor: pointer;
      color: ${getColor('globalLinkColor')};
      transition: color 0.3s ease-in-out;
    }
    `);

  const refs = {};
  const modalContainer = render(
    refs,
    `
    <div ref="container" aad-modal="true" class="${prefix('container')}">
        <div class="${prefix('divider')}">
            ${
              config.header
                ? `
              <div class="${prefix('title-container')}">
                <h4>${title} ${
                    config.cacheInfo.showIsCached && config.cacheInfo.isCached
                      ? `[<span ref="cachecontent" class="${prefix('cache-content')}">Previously cached</span>]`
                      : ''
                  }</h4>
                ${
                  config?.close
                    ? `
                  <div ref="close" class="${prefix('close-button')}">
                    ${SVG.close('16px', '16px')}
                  </div>`
                    : ''
                }
            </div>`
                : ''
            }
            <div class="${prefix('inner')} aad-scroll-y" ref="inner"></div>
        </div>
    </div>
    `
  );

  refs.cachecontent?.addEventListener('mouseover', () => {
    refs.cachecontent.textContent = 'Renew modal cache';
  });

  refs.cachecontent?.addEventListener('mouseout', () => {
    refs.cachecontent.textContent = 'Previously cached';
  });

  refs.cachecontent?.addEventListener('click', () => {
    config.cacheInfo.onRenewCache();
  });

  const closeModal = () => {
    refs.container.classList.add(prefix('container-close'));
    setTimeout(() => {
      config?.cssUUIDs?.forEach((uuid) => {
        removeCustomCSS(uuid);
      });
      removeCustomCSS(modal_CSS_UUID);
      modalContainer.remove();
    }, config.ms);
  };

  refs.close?.addEventListener('click', closeModal);

  const modal = modalFactory({
    closeModal: closeModal,
  });

  refs.inner.aadAppendChild(modal);
  refs.container.addEventListener('click', (e) => {
    if (e.target === refs.container && config?.close) {
      closeModal();
    }
  });

  body.prepend(modalContainer);

  return {
    node: modalContainer,
    inner: refs.inner,
  }
}
