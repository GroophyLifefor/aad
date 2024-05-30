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
    createModal('Title', ({closeModal}) => {
      const _refs = {};
      const modal = render(
        _refs,
        `
              <div>
                <span>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </span>
              </div>
              `
      );
      return modal;
    });
  });

  inner.aadAppendChild(profile);
  container.addEventListener('dragstart', boxStartDrag);
  container.addEventListener('dragend', boxEndDrag);

  return test;
}
