function createModal(title, config, modalFactory) {
  const body = document.querySelector('body');

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
    }
  };

  config = Object.assign({}, defaultConfig, config);


  const refs = {};
  const modalContainer = render(
    refs,
    `
    <div ref="container" class="aad-custom-component-create-modal-container">
        <div class="aad-custom-component-create-modal-divider">
            ${
              config.header
                ? `
              <div class="aad-custom-component-create-modal-title-container">
                <h4>${title}</h4>
                ${
                  config?.close
                    ? `
                  <div ref="close" class="aad-custom-component-create-modal-close-button">
                    ${SVG.close('16px', '16px')}
                  </div>`
                    : ''
                }
            </div>`
                : ''
            }
            <div class="aad-custom-component-create-modal-inner" ref="inner"></div>
        </div>
    </div>
    `
  );

  const closeModal = () => {
    refs.container.classList.add(
      'aad-custom-component-create-modal-container-close'
    );
    setTimeout(() => {
      config?.cssUUIDs?.forEach((uuid) => {
        removeCustomCSS(uuid);
      });
      modalContainer.remove();
    }, config.ms);
  };

  refs.close?.addEventListener('click', closeModal);

  const modal = modalFactory({
    closeModal: closeModal,
  });

  addCustomCSS(`
    .aad-custom-component-create-modal-inner {
      overflow-y: auto;
    }

    .aad-custom-component-create-modal-container {
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

    .aad-custom-component-create-modal-divider {
        display: flex;
        flex-direction: column;
        gap: 8px;
        background-color: #282f38;
        border-radius: 4px;
        padding: ${config.padding};
        max-width: 80dvw;
        max-height: 80dvh;
        margin: ${config.globalMargins.top || '0px'} ${config.globalMargins.right || '0px'} ${config.globalMargins.bottom || '0px'} ${config.globalMargins.left || '0px'};
    }

    .aad-custom-component-create-modal-title-container {
        display: flex;
        justify-content: space-between;
        padding: 0px 8px;
        align-items: center;
    }

    .aad-custom-component-create-modal-close-button {
        cursor: pointer;
    }

    .aad-custom-component-create-modal-container-close {
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
    `);

  refs.inner.appendChild(modal);
  refs.container.addEventListener('click', (e) => {
    if (e.target === refs.container && config?.close) {
      closeModal();
    }
  });

  body.prepend(modalContainer);
}
