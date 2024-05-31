const GitHubMobileBreakpoint = 768;
const horizontalWidgetCount = 4;
let GitHubUsername = '';
const GitHubRecentActivity = [];
let aad_containers = [];
const tokens = {
  anonymous: {
    remaining: -1,
    limit: 60,
  },
  authenticated: {
    remaining: -1,
    limit: 5000,
  },
};

async function onLoad() {
  window.addEventListener('resize', onResize);
  callWithIncreasingDelay(onResize, 100, 10);
}

function callWithIncreasingDelay(fn, delay, maxCalls) {
  if (maxCalls <= 0) {
    return;
  }
  try {
    fn();
  } catch {}
  setTimeout(() => {
    callWithIncreasingDelay(fn, delay * 2, maxCalls - 1);
  }, delay);
}

let criticalWidth = {
  one: -1,
  two: -1,
};
let splitType = 'four';
function onResize() {
  const parentest = document.querySelector('.add-custom-feed');
  const element = document.querySelector('.add-custom-feed');
  const isWidthOverflown = element.scrollWidth > element.clientWidth;

  if (splitType === 'four') {
    if (isWidthOverflown) {
      parentest.classList.add('add-custom-feed-two-per-row');
      splitType = 'two';
      criticalWidth.two = window.innerWidth;
      return;
    }
  }

  if (splitType === 'two') {
    if (!isWidthOverflown && window.innerWidth > criticalWidth.two) {
      parentest.classList.remove('add-custom-feed-two-per-row');
      splitType = 'four';
      return;
    }

    if (isWidthOverflown) {
      parentest.classList.remove('add-custom-feed-two-per-row');
      parentest.classList.add('add-custom-feed-one-per-row');
      splitType = 'one';
      criticalWidth.one = window.innerWidth;
      return;
    }
  }

  if (splitType === 'one') {
    if (!isWidthOverflown && window.innerWidth > criticalWidth.one) {
      parentest.classList.remove('add-custom-feed-one-per-row');
      parentest.classList.add('add-custom-feed-two-per-row');
      splitType = 'two';
      return;
    }
  }
}
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

/**
 * Widget Factory End
 */

function generateUUID() {
  var d = new Date().getTime();
  var d2 =
    (typeof performance !== 'undefined' &&
      performance.now &&
      performance.now() * 1000) ||
    0; //Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16;
    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

const SVG = {
  commit: `<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-git-commit">
    <path d="M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5Zm-1.43-.75a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"></path>
    </svg>`,
  branch: `<div data-view-component="true" class="aad-custom-branch-badge TimelineItem-badge"><svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-git-branch">
    <path d="M9.5 3.25a2.25 2.25 0 1 1 3 2.122V6A2.5 2.5 0 0 1 10 8.5H6a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.5 0v1.836A2.493 2.493 0 0 1 6 7h4a1 1 0 0 0 1-1v-.628A2.25 2.25 0 0 1 9.5 3.25Zm-6 0a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Zm8.25-.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM4.25 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z"></path>
  </svg></div>`,
  repository: `<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-repo">
    <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path>
  </svg>`,
  move: (width, height) =>
    `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="${height}" width="${width}" xmlns="http://www.w3.org/2000/svg" data-darkreader-inline-fill="" data-darkreader-inline-stroke="" style="--darkreader-inline-fill: currentColor; --darkreader-inline-stroke: currentColor;"><path d="M475.9 246.2l-79.4-79.4c-5.4-5.4-14.2-5.4-19.6 0l-.2.2c-5.4 5.4-5.4 14.2 0 19.6l54.9 54.9-161.8.5.5-161.8 54.9 54.9c5.4 5.4 14.2 5.4 19.6 0l.2-.2c5.4-5.4 5.4-14.2 0-19.6l-79.4-79.4c-5.4-5.4-14.2-5.4-19.6 0l-79.4 79.4c-5.4 5.4-5.4 14.2 0 19.6l.2.2c5.4 5.4 14.2 5.4 19.6 0l54.9-54.9.5 161.8-161.8-.5 54.9-54.9c5.4-5.4 5.4-14.2 0-19.6l-.2-.2c-5.4-5.4-14.2-5.4-19.6 0l-79.4 79.4c-5.4 5.4-5.4 14.2 0 19.6l79.4 79.4c5.4 5.4 14.2 5.4 19.6 0l.2-.2c5.4-5.4 5.4-14.2 0-19.6L80 270.5l161.8-.5-.5 161.8-54.9-54.9c-5.4-5.4-14.2-5.4-19.6 0l-.2.2c-5.4 5.4-5.4 14.2 0 19.6l79.4 79.4c5.4 5.4 14.2 5.4 19.6 0l79.4-79.4c5.4-5.4 5.4-14.2 0-19.6l-.2-.2c-5.4-5.4-14.2-5.4-19.6 0l-54.9 54.9-.5-161.8 161.8.5-54.9 54.9c-5.4 5.4-5.4 14.2 0 19.6l.2.2c5.4 5.4 14.2 5.4 19.6 0l79.4-79.4c5.5-5.4 5.5-14.2 0-19.6z"></path></svg>`,
  friends: `<svg text="muted" aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-people">
    <path d="M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4 4 0 0 0-7.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.493 3.493 0 0 1 2 5.5ZM11 4a3.001 3.001 0 0 1 2.22 5.018 5.01 5.01 0 0 1 2.56 3.012.749.749 0 0 1-.885.954.752.752 0 0 1-.549-.514 3.507 3.507 0 0 0-2.522-2.372.75.75 0 0 1-.574-.73v-.352a.75.75 0 0 1 .416-.672A1.5 1.5 0 0 0 11 5.5.75.75 0 0 1 11 4Zm-5.5-.5a2 2 0 1 0-.001 3.999A2 2 0 0 0 5.5 3.5Z"></path>
      </svg>`,
  close: `<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-x">
  <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"></path>
</svg>`,
  draggable: (width, height) =>
    `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="${height}" width="${width}" xmlns="http://www.w3.org/2000/svg" data-darkreader-inline-fill="" data-darkreader-inline-stroke="" style="--darkreader-inline-fill: currentColor; --darkreader-inline-stroke: currentColor;"><path d="M8.5 7C9.32843 7 10 6.32843 10 5.5C10 4.67157 9.32843 4 8.5 4C7.67157 4 7 4.67157 7 5.5C7 6.32843 7.67157 7 8.5 7ZM8.5 13.5C9.32843 13.5 10 12.8284 10 12C10 11.1716 9.32843 10.5 8.5 10.5C7.67157 10.5 7 11.1716 7 12C7 12.8284 7.67157 13.5 8.5 13.5ZM10 18.5C10 19.3284 9.32843 20 8.5 20C7.67157 20 7 19.3284 7 18.5C7 17.6716 7.67157 17 8.5 17C9.32843 17 10 17.6716 10 18.5ZM15.5 7C16.3284 7 17 6.32843 17 5.5C17 4.67157 16.3284 4 15.5 4C14.6716 4 14 4.67157 14 5.5C14 6.32843 14.6716 7 15.5 7ZM17 12C17 12.8284 16.3284 13.5 15.5 13.5C14.6716 13.5 14 12.8284 14 12C14 11.1716 14.6716 10.5 15.5 10.5C16.3284 10.5 17 11.1716 17 12ZM15.5 20C16.3284 20 17 19.3284 17 18.5C17 17.6716 16.3284 17 15.5 17C14.6716 17 14 17.6716 14 18.5C14 19.3284 14.6716 20 15.5 20Z"></path></svg>`,
  issueGreen: (width, height) =>
    `<svg class="octicon octicon-issue-opened open" viewBox="0 0 16 16" version="1.1" height="${height}" width="${width}" aria-hidden="true"><path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path></svg>`,
  prGreen: (width, height) =>
    `<svg class="octicon octicon-git-pull-request color-fg-open" viewBox="0 0 16 16" version="1.1" height="${height}" width="${width}" aria-hidden="true"><path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z"></path></svg>`,
  externalLink: (width, height) =>
    `<svg stroke="blue" fill="blue" stroke-width="0" viewBox="0 0 24 24" height="${height}" width="${width}" xmlns="http://www.w3.org/2000/svg">
  <path d="M15.5 2.25a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V4.06l-6.22 6.22a.75.75 0 1 1-1.06-1.06L19.94 3h-3.69a.75.75 0 0 1-.75-.75Z"></path>
  <path d="M2.5 4.25c0-.966.784-1.75 1.75-1.75h8.5a.75.75 0 0 1 0 1.5h-8.5a.25.25 0 0 0-.25.25v15.5c0 .138.112.25.25.25h15.5a.25.25 0 0 0 .25-.25v-8.5a.75.75 0 0 1 1.5 0v8.5a1.75 1.75 0 0 1-1.75 1.75H4.25a1.75 1.75 0 0 1-1.75-1.75V4.25Z"></path>
</svg>`,
};

const cache = {};
const cacheDEBUG = false;
const Cache = {
  set: function (key, value) {
    if (cacheDEBUG) console.log('Cache set', key, value);
    cache[key] = value;
  },
  get: function (key) {
    if (cacheDEBUG) console.log('Cache get', key);
    return cache.hasOwnProperty(key) ? cache[key] : null;
  },
  has: function (key) {
    if (cacheDEBUG) console.log('Cache has', key);
    return cache.hasOwnProperty(key);
  },
  remove: function (key) {
    if (cacheDEBUG) console.log('Cache remove', key);
    if (this.has(key)) {
      delete cache[key];
    }
  },
  clear: function () {
    if (cacheDEBUG) console.log('Cache clear');
    for (let key in cache) {
      if (cache.hasOwnProperty(key)) {
        delete cache[key];
      }
    }
  },
};

const aad_sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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
function createFrameModal(props) {
  async function create(data) {
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
      console.log('waiting for conversation', props.url);
      conversation = props.selector(htmlDocument);
      count++;
    }
    // To guarantee the search results are ready
    aad_sleep(100);

    createModal(props.title, { cssUUIDs: cssUUIDs }, ({ closeModal }) => {
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
    });
  }

  if (Cache.has(props.url)) {
    create(Cache.get(props.url));
  } else {
    let headers = props.headers || {};
    fetch(props.url, headers)
      .then((res) => res.text())
      .then((data) => {
        Cache.set(props.url, data);
        create(data);
      });
  }
}

function addCustomCSS(css) {
  document.head.appendChild(document.createElement('style')).innerHTML = css;
}

Node.prototype.aadAppendChild = function (newChild) {
  if (Array.isArray(newChild)) {
    newChild.forEach((child) => {
      this.appendChild(child);
    });
    return;
  }

  this.appendChild(newChild);
};

function render(dictionary, html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const parentNodes = Array.from(doc.body.children);

  function findRefs(elements) {
    elements.forEach((element) => {
      const ref = element.getAttribute('ref');
      if (ref) {
        if (!!dictionary) {
          if (dictionary.hasOwnProperty(ref)) {
            let oldVal = dictionary[ref];
            if (!Array.isArray(oldVal)) {
              oldVal = [oldVal];
            }
            dictionary[ref] = [...oldVal, element];
          } else {
            dictionary[ref] = element;
          }
        }
      }
      const children = element.childNodes;
      for (let i = 0; i < children.length; i++) {
        if (children[i].nodeType === 1) {
          findRefs([children[i]]);
        }
      }
    });
  }

  findRefs(parentNodes);
  if (parentNodes.length === 1) {
    return parentNodes[0];
  }
  return parentNodes;
}

function GitHubCard(child, config) {
  addCustomCSS(`
    .aad-custom-info-wrapper {
      padding: 8px 0px;
    }
  
    .aad-custom-info-wrapper-first {
      padding-top: 0px !important;
      width: 100%;
    }
  
    .aad-custom-info-container {
      width: 100%;
      border-radius: 6px;
      padding: ${config['customPadding'] || '16px'};
      background-color: #22272e;
      border: 1px solid #444c56;
    }
  
    .aad-no-horiz-padding {
      padding-left: 0px !important;
      padding-right: 0px !important;
    }
    `);

  const refs = {};
  const parent = render(
    refs,
    `
      <div class="aad-custom-info-wrapper ${
        config['isFirst'] ? 'aad-custom-info-wrapper-first' : ''
      }">
        <div class="aad-custom-info-container">
          <div ref="inner">
          </div>
        </div>
      </div>
    `
  );
  refs.inner.aadAppendChild(child);
  return parent;
}

function addWidget(id, widget) {
  const container = document.getElementById('container-' + id);
  container?.aadAppendChild(widget);
}

function boxStartDrag(e) {
  e.dataTransfer.setData('dragged_id', e.currentTarget.id);
}

function getWidgetByUUID(uuid) {
  for (let container of aad_containers) {
    for (let widget of container.widgets) {
      if (widget.uuid === uuid) {
        return widget;
      }
    }
  }
  return null;
}

function boxEndDrag(e) {
  const containers = [];
  for (let i = 0; i < 4; i++) {
    const container = document.getElementById('container-' + i);
    const childs = Array.prototype.slice.call(container.children);
    let widgets = [];
    for (let j = 0; j < childs.length; j++) {
      const child = childs[j];
      const uuid = child.getAttribute('uuid');
      const widget = getWidgetByUUID(uuid);
      widgets.push(widget);
    }
    containers.push({
      index: i,
      widgets: widgets,
    });
  }
  setContainers({ containers: containers });
  e.currentTarget.setAttribute('draggable', 'false');
}

function containerAllowDrop(e) {
  e.preventDefault();
  this.setAttribute('drop-hover', 'true');

  const elems = Array.prototype.slice.call(
    document.getElementsByClassName('aad-widget-container-wrapper')
  );
  elems.forEach((elem) => {
    if (!elem.classList.contains('drop-shadow')) {
      elem.classList.add('drop-shadow');
    }
  });
}

function containerDragLeave(e) {
  e.preventDefault();
  this.removeAttribute('drop-hover');
}

function containerDrop(e) {
  e.preventDefault();
  this.removeAttribute('drop-hover');
  const elems = Array.prototype.slice.call(
    document.getElementsByClassName('aad-widget-container-wrapper')
  );
  elems.forEach((elem) => {
    if (elem.classList.contains('drop-shadow')) {
      elem.classList.remove('drop-shadow');
    }
  });
  var data = e.dataTransfer.getData('dragged_id');
  let newWidget = e.currentTarget.querySelector(
    '.aad-custom-widget-new-widget-container'
  );
  e.currentTarget.appendChild(document.getElementById(data));
  e.currentTarget.appendChild(newWidget);
}

function setContainers(containers) {
  chrome.storage.local.set(containers, () => {});
  aad_containers = containers;
}

function initContainers() {
  chrome.storage.local.get(['containers'], (items) => {
    console.log('items', items);
    if (!!items.containers) {
      aad_containers = items.containers;
    }

    if (!items.containers) {
      setContainers({
        containers: [
          {
            index: 0,
            widgets: [
              {
                type: 'profile',
                uuid: generateUUID(),
              },
              {
                type: 'newWidget',
                uuid: generateUUID(),
              },
            ],
          },
          {
            index: 1,
            widgets: [
              {
                type: 'recentActivity',
                uuid: generateUUID(),
              },
              {
                type: 'newWidget',
                uuid: generateUUID(),
              },
            ],
          },
          {
            index: 2,
            widgets: [
              {
                type: 'newWidget',
                uuid: generateUUID(),
              },
            ],
          },
          {
            index: 3,
            widgets: [
              {
                type: 'newWidget',
                uuid: generateUUID(),
              },
            ],
          },
        ],
      });
    }
  });
}

function getPatFromStorage() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['pat'], (items) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(items.pat || '');
      }
    });
  });
}

async function onRemainingTokenChanged() {
  const event = new CustomEvent('onRemainingTokenChanged', {
    detail: tokens,
  });
  document.dispatchEvent(event);
}

async function checkIsValidToken(token) {
  const fetched = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `token ${token}`,
    },
  });
  return fetched.status === 200;
}

async function APIRequest(url, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const pat = await getPatFromStorage();
  const isValidToken = await checkIsValidToken(pat);

  options.headers = {
    ...defaultHeaders,
    ...options.headers,
  };

  if (pat && isValidToken) {
    options.headers['Authorization'] = `token ${pat}`;
  }

  try {
    const response = await fetch(url, options);
    const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
    const rateLimitLimit = response.headers.get('X-RateLimit-Limit');

    if (rateLimitRemaining && rateLimitLimit) {
      if (pat && isValidToken) {
        tokens.authenticated.remaining = rateLimitRemaining;
        tokens.authenticated.limit = rateLimitLimit;
      } else {
        tokens.anonymous.remaining = rateLimitRemaining;
        tokens.anonymous.limit = rateLimitLimit;
      }
    }

    onRemainingTokenChanged();
    return response;
  } catch (error) {
    console.error('Error making API request:', error);
    throw error;
  }
}

function prepareRecentActivity(_feed) {
  const recentActivityNode = _feed.querySelectorAll(
    '[data-issue-and-pr-hovercards-enabled][data-repository-hovercards-enabled]'
  )[0];
  Array.from(recentActivityNode?.children || []).forEach((child) => {
    const hrefElement = child.querySelector('a');
    const href = hrefElement.getAttribute('href');
    const splitted = href.split('/');

    let type = 'combat helicopter';
    if (splitted[3] === 'issues') {
      type = 'issue';
    }
    if (splitted[3] === 'pull') {
      type = 'pull-request';
    }

    if (type === 'combat helicopter') {
      throw new Error('Invalid type of recent activity.');
      return; // I don't trust javascript
    }

    const OWNER = splitted[1];
    const REPO = splitted[2];
    const NUMBER = splitted[4];

    GitHubRecentActivity.push({
      type,
      owner: OWNER,
      repo: REPO,
      number: NUMBER,
    });
  });
}

function prepareUsername(_feed) {
  const _ = document.querySelectorAll(
    '[data-target="deferred-side-panel.panel"]'
  )[1];
  const __ = _.querySelectorAll('.Truncate-text');
  GitHubUsername = __[0].innerText.trim();
}

function prepareUtils() {
  searchInModal();
}

function clearFeed() {
  initContainers();
  return new Promise((resolve) => {
    addCustomCSS(`
        .fade-out {
          transition: opacity 0.3s 0.15s ease-out;
          animation: toDown 0.5s 0.15s ease-out;
          opacity: 0;
        }
  
        .fade-in {
          min-height: calc(100dvh - 64.55px);

          animation: toUp 0.5s ease-out;
          opacity: 1;
        }
  
        @keyframes toDown {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(50px);
          }
        }
  
        @keyframes toUp {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
  
        .AppHeader-globalBar {
          z-index: 1000;
        }
      `);

    document.querySelector(
      '.AppHeader-context-item-label'
    ).innerHTML = ` Dashboard <span class="ActionListItem-label color-fg-muted f6">(Click to back default feed)</span>`;

    // Clear the feed (entire homepage without header)
    const aside = document.querySelector('.application-main > div > aside');
    if (aside) {
      aside.style.display = 'none';
    }
    const _feed = document.querySelector('.application-main > div > div');
    _feed.style.width = '100%';
    if (_feed) {
      _feed.classList.remove('fade-out');
      _feed.classList.add('fade-out');

      _feed.addEventListener(
        'transitionend',
        function () {
          prepareUtils();
          prepareRecentActivity(_feed);
          prepareUsername(_feed);

          _feed.innerHTML = '';
          _feed.classList.remove('fade-in');
          _feed.classList.add('fade-in');
          _feed.classList.remove('fade-out');
          onLoad();
          resolve(true);
        },
        { once: true }
      );
    } else {
      onLoad();
      resolve(false);
    }
  });
}
