function createModal(title, config, modalFactory) {
  const body = document.querySelector('body');

  if (typeof config.close === 'undefined') {
    config.close = true;
  }

  if (typeof config.ms === 'undefined') {
    config.ms = 300;
  }

  const refs = {};
  const modalContainer = render(
    refs,
    `
    <div ref="container" class="aad-custom-component-create-modal-container">
        <div class="aad-custom-component-create-modal-divider">
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
            </div>
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
        let $_ = null;
        try {
          $_ = document.querySelector(`[data-uuid="${uuid}"]`);
        } catch {}
        $_?.remove();
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
        justify-content: center;
        align-items: center;
        z-index: 1000;
        animation: fadeIn ${config.ms}ms ease-in-out forwards;
    }

    .aad-custom-component-create-modal-divider {
        display: flex;
        flex-direction: column;
        gap: 8px;
        background-color: #282f38;
        border-radius: 4px;
        padding: 8px;
        max-width: 80dvw;
        max-height: 80dvh;
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
