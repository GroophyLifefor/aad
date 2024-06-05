/**
 * Widget Factory Start
 */

const widgetCounter = {};

/**
 *
 * @param {HTMLElement} inner
 * @param {*} config
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
      width: fit-content;
      display: flex;
      gap: 8px;
      justify-content: center;
      align-items: center;
      cursor: move;
    }
  
    .aad-custom-widget-${config.type}-auto-container[drop-hover] {
      /* TODO: make smoother */
    }
    `);

  const widgetRefs = {};
  const widgetContainer = render(
    widgetRefs,
    `
      <div id="aad-widget-profile-container-${widgetId}" uuid="${widgetId}" ref="container" class="aad-custom-widget-${
      config.type
    }-auto-container">
        <div ref="dragbox" class="aad-custom-widget-${
          config.type
        }-auto-dragbox">
          ${SVG.draggable('16px', '16px')}
          <span>${config.title} - [${widgetCount}]</span>
        </div>
        <div ref="inner"></div>
      </div>`
  );

  const dragbox = widgetRefs.dragbox;
  const container = widgetRefs.container;
  const _inner = widgetRefs.inner;

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

  return {
    widget: widgetContainer,
    inner: _inner,
  };
}

function prefixer(title, type) {
  if (type !== 'widget') {
    throw new Error('AAD WIDGET HANDLER CUSTOM ERROR: Prefixer not supported for this type. (type: \'' + type + '\')');
  }
  return (subtitle) => `aad-custom-${type}-${title}-${subtitle.toLowerCase().replaceAll(' ', '-')}`;
}

/**
 * Widget Factory End
 */