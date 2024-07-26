function getNewWidgetWidget(uuid, config) {
  const widgetId = uuid;
  const { containerIndex } = config;
  const prefix = prefixer('new-widget', widgetId, 'widget');

  addCustomCSS(`
    .${prefix('container')} {
      width: 100%;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .${prefix('fit')} {}
    .${prefix('sameHeight')}, .${prefix('sameHeightWithMinDVH')} {
      margin-top: auto;
    }
    `);

  const refs = {};
  const test = render(
    refs,
    `
      <div  widget-type="newWidget" id="aad-widget-new-widget-container-${widgetId}" uuid="${widgetId}" ref="container"  class="${prefix('container')}">
        <div ref="inner"></div>
      </div>`
  );

  function applyHeightType() {
    const heightType = containerSettings.heightType;
    refs.container.classList.remove(prefix('fit'));
    refs.container.classList.remove(prefix('sameHeight'));
    refs.container.classList.remove(prefix('sameHeightWithMinDVH'));

    refs.container.classList.add(prefix(heightType));
  }
  applyHeightType();

  document.addEventListener('onContainerSettingsUpdated', applyHeightType);

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
    const drawerUUID = generateUUID();
    const pre = (title) => prefix(drawerUUID + '-' + title);
    addCustomCSS(`
      .${pre('container')} {
        display: grid;
        grid-template-columns: repeat(1, minmax(0, 1fr));
        gap: 12px;
        width: 100%;
      }

      @media (min-width: 420px) {
        .${pre('container')} {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (min-width: 768px) {
        .${pre('container')} {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }

      @media (min-width: 1024px) {
        .${pre('container')} {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
      }

      .${pre('item')} {
        min-width: 200px;
        display: flex;
        flex-direction: column;
        padding: 8px;
        background-color: #262c34E6;
        border-radius: 12px;
        transition: all 0.3s;
      }

      .${pre('item')}:hover {
        background-color: #262c34;
        transform: scale(1.02);
      }

      .${pre('item')} img {
        border-radius: 8px;
        height: 150px;
        object-fit: cover;
      }

      .${pre('title')} {
        margin-top: 24px;
        margin-left: 8px;
        font-size: 16px;
        font-weight: 500;
      }

      .${pre('description')} {
        margin-top: 8px;
        margin-left: 8px;
        font-size: 14px;
        font-weight: 300;
        padding-right: 16px;
      }

      .${pre('create-container')} {
        display: flex;
        height: 100%;
        align-items: flex-end;
        justify-content: flex-end;
        margin-top: 12px;
        margin-right: 4px;
        margin-bottom: 4px;
      }

      .${pre('create-container')} button {
        font-size: 11px !important;
        padding: 4px 12px !important;
        height: fit-content !important;
      }
      `);

    const drawerRefs = {};
    const _html = render(
      drawerRefs,
      `
      <div class="${pre('container')}">
        ${addingWidgets
          .map((widget, index) => {
            return `
          <div class="${pre('item')}">
            <img src="${widget.image}" alt="${widget.name}" />
            <span class="${pre('title')}">${widget.name}</span>
            <span class="${pre('description')}">${widget.description}</span>
            <div class="${pre('create-container')}">
              <button ref="create" validName="${
                widget.validName
              }" type="submit" createWidgetNth="${index}" class="btn btn-primary" form="repo_metadata_form">Create Widget</button>
            </div>
          </div>`;
          })
          .join(' ')}
      </div>
      `
    );

    const {closeDrawer} = createDrawer(_html, {});

    function listenCreate(elem) {
      elem.addEventListener('click', () => {
        const validName = elem.getAttribute('validName');
        createNewWidget(containerIndex, validName);
        // window.location.reload();
        closeDrawer();
        setTimeout(() => {
          reloadWidgets();
        }, 400);
      });
    }

    if (Array.isArray(drawerRefs.create)) {
      drawerRefs.create.forEach(listenCreate);
    } else {
      listenCreate(drawerRefs.create);
    }

    
  });

  inner.aadAppendChild(profile);

  return { widget: test };
}

loadNewWidget('newWidget', getNewWidgetWidget);
