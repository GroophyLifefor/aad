function createModal(title, modalFactory) {
  const body = document.querySelector('body');

  const refs = {};
  const modalContainer = render(
    refs,
    `
    <div ref="container" class="aad-custom-component-create-modal-container">
        <div class="aad-custom-component-create-modal-divider">
            <div class="aad-custom-component-create-modal-title-container">
                <h4>${title}</h4>
                <div ref="close" class="aad-custom-component-create-modal-close-button">
                    ${SVG.close}
                </div>
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
      modalContainer.remove();
    }, 300);
  };

  refs.close.addEventListener('click', closeModal);

  const modal = modalFactory({
    closeModal: closeModal
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
        animation: fadeIn 0.3s ease-in-out forwards;
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
        animation: fadeOut 0.3s ease-in-out forwards;
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
    if (e.target === refs.container) {
      closeModal();
    }
  });

  body.prepend(modalContainer);
}
