function getNewWidgetWidget(uuid) {
  const widgetId = uuid;

  addCustomCSS(`
    .aad-custom-widget-new-widget-container {
      width: 100%;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  
    .aad-custom-widget-new-widget-container[drop-hover] {
      /* TODO: make smoother */
    }
    `);

  const refs = {};
  const test = render(
    refs,
    `
      <div id="aad-widget-new-widget-container-${widgetId}" uuid="${widgetId}" ref="container"  class="aad-custom-widget-new-widget-container">
        <div ref="inner"></div>
      </div>`
  );

  const container = refs.container;
  const inner = refs.inner;

  addCustomCSS(`
    .aad-custom-widget-new-widget-inner-container {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #282f38;
        transition: background-color 0.2s ease-in-out;
        border-radius: 4px;
        cursor: pointer;
        height: 2rem;
    }

    .aad-custom-widget-new-widget-inner-container:hover {
        background-color: #4e5b6b;
    }
    `);

  const buttonRefs = {};
  const profile = render(
    buttonRefs,
    `
          <div ref="new" class="aad-custom-widget-new-widget-inner-container">
            <span>+</span>
          </div>
          `
  );

  buttonRefs.new.addEventListener('click', () => {
    const { close } = aad_loading(uuid);
    setTimeout(() => {
      close();
      createModal('Loading', {}, ({ closeModal }) => {
        const _refs = {};
        const modal = render(
          _refs,
          `
        <div>
          <span>New Widget Page (WIP)</span>
        </div>
        `
        );
        return modal;
      });
      return {
        close: () => {
          _closeModal();
        },
      };
    }, 4000);
  });

  inner.aadAppendChild(profile);
  container.addEventListener('dragstart', boxStartDrag);
  container.addEventListener('dragend', boxEndDrag);

  return test;
}

loadNewWidget('newWidget', getNewWidgetWidget);