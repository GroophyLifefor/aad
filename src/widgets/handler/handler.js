/**
 * Widget Factory Start
 */

let widgetCounter = {};

/**
 *
 * @param {*} inner
 * @param {*} config
 * @returns
 */
function createWidget(inner, config) {
  const widgetId = config.widgetId || generateUUID();
  const widgetCount = widgetCounter[config.type] || 1;
  widgetCounter[config.type] = widgetCount + 1;

  addCustomCSS(`
    .aad-custom-widget-${config.type}-auto-container {
      width: 100%;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  
    .aad-custom-widget-${config.type}-auto-dragbox {
      width: 100%;
      display: flex;
      gap: 8px;
      justify-content: space-between;
      align-items: center;
      cursor: move;
      position: relative;
    }

    .aad-custom-widget-${config.type}-top-line {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      margin-top: -2px;
      margin-left: -2px;
      border-radius: 4px 0px 0px 0px;
      /* background-color: #3a414a; */
      border-top:   1px solid  #3a414a;
      border-left:  1px solid  #3a414a;
      opacity: 0.7;
    }

    .aad-custom-align-center {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
    }

    .aad-custom-widget-${config.type}-right svg {
      cursor: pointer;
    }

    .aad-custom-widget-${config.type}-right {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      position: absolute;
      right: 0;
    }
  
    .aad-custom-widget-${config.type}-auto-container[drop-hover] {
      /* TODO: make smoother */
    }

    .aad-custom-widget-${config.type}-settings {
      margin-top: 2px;
      transition: transform 0.3s;
      cursor: pointer;
    }

    .aad-custom-widget-${config.type}-close {
      transition: transform 0.3s;
      cursor: pointer;
    }

    .aad-custom-widget-${config.type}-settings:hover {
      transform: scale(1.2);
    } 

    .aad-custom-widget-${config.type}-close:hover {
      transform: scale(1.2);
    }
    `);

  const widgetRefs = {};
  const widgetContainer = render(
    widgetRefs,
    `
      <div id="aad-widget-profile-container-${widgetId}" uuid="${widgetId}" ref="container" class="aad-custom-widget-${
      config.type
    }-auto-container" widgetContainer="true" widget-type="${config.type}">
        <div ref="dragbox" class="aad-custom-widget-${
          config.type
        }-auto-dragbox">
          <div class="aad-custom-widget-${config.type}-top-line">
          </div>
          <div class="aad-custom-align-center">
            ${SVG.draggable('16px', '16px')}
            <span ref="title">${config.title} - [${widgetCount}]</span>
          </div>
          <div class="aad-custom-widget-${config.type}-right">
            <div class="aad-custom-widget-${
              config.type
            }-settings" ref="settings">
              ${SVG.settings('12px', '12px')}
            </div>
            <div class="aad-custom-widget-${config.type}-close" ref="close">
              ${SVG.close('16px', '16px')}
            </div>  
          </div>
        </div>
        <div ref="inner"></div>
      </div>`
  );

  const dragbox = widgetRefs.dragbox;
  const container = widgetRefs.container;
  const _inner = widgetRefs.inner;

  widgetRefs.settings.addEventListener('click', () => {
    const widget = getWidgetByUUID(widgetId);
    settingsCard(
      {
        title: 'Edit widget config',
      },
      widgetReferences[config.type].editModal?.properties || [],
      structuredClone(widget?.config?.public || {}),
      (newConfig) => {
        const properties = widgetReferences[config.type].editModal?.properties;
        function proc(property) {
          if (
            ['text', 'github_user', 'select', 'number'].includes(property.type)
          ) {
            widget.config.public[property.field] = newConfig[property.field];
          }
          if (property.type === 'group') {
            property.subfields.forEach((subfield) => {
              proc(subfield);
            });
          }
        }

        properties?.forEach((property) => {
          proc(property);
        });
        setConfigByUUID(widgetId, widget.config);
        sendNewNotification('Widget config has been saved.', {
          type: 'success',
          timeout: 5000,
          title: 'Widget Handler',
          actions: [
            {
              text: 'Reload page',
              type: 'default',
              action: () => {
                window.location.reload();
              },
            },
          ],
        });
        config.onConfigChanged?.();
      }
    );
  });

  widgetRefs.close.addEventListener('click', () => {
    createModal('Are you sure?', {}, ({ closeModal }) => {
      const uuid = generateUUID();
      const prefix = prefixer('deleteWidget', uuid, 'component');
      addCustomCSS(`
        .${prefix('container')} {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 8px;
        }
        `);

      const _refs = {};
      const modal = render(
        _refs,
        `
        <div class="${prefix('container')}">
          <span>
            You are about to completely destroy the current widget, are you sure you want to do that?
          </span>
          <button ref="delete" id="dialog-show-repo-delete-menu-dialog" data-show-dialog-id="repo-delete-menu-dialog" type="button" data-view-component="true" class="js-repo-delete-button Button--danger Button--medium Button float-none float-sm-right ml-0 mt-2 mt-md-0">  <span class="Button-content">
            <span class="Button-label">Delete this widget</span>
            </span>
          </button>
        </div>
        `
      );

      _refs.delete.addEventListener('click', () => {
        removeFromContainer(widgetId);
        closeModal();
        setTimeout(() => {
          reloadWidgets();
        }, 200);
      });

      return modal;
    });
  });

  if (!inner && inner !== null) {
    _inner.aadAppendChild(inner);
  }

  dragbox.addEventListener('mousedown', (e) => {
    e.target.parentNode.setAttribute('draggable', 'true');
  });
  dragbox.addEventListener('mouseup', (e) => {
    e.target.parentNode.setAttribute('draggable', 'false');
  });

  container.addEventListener('dragstart', boxStartDrag);
  container.addEventListener('dragend', boxEndDrag);

  function updateTitle(newTitle) {
    widgetRefs.title.innerHTML = `${newTitle} - [${widgetCount}]`;
  }

  function getTitle() {
    const title = widgetRefs.title.innerHTML;
    const parts = title.split(' - ');
    parts.pop();
    return parts.join(' - ');
  }

  return {
    widget: widgetContainer,
    inner: _inner,
    updateTitle,
    getTitle,
  };
}

function prefixer(title, uuid, type) {
  const allowed = ['widget', 'loading', 'component', 'video-editing'];
  if (allowed.indexOf(type) === -1) {
    throw new Error(
      "AAD WIDGET HANDLER CUSTOM ERROR: Prefixer not supported for this type. (type: '" +
        type +
        "')"
    );
  }
  return (subtitle) =>
    `aad-custom-${type}-${uuid}-${title}-${subtitle
      .toLowerCase()
      .replaceAll(' ', '-')}`;
}

/**
 * Widget Factory End
 */
