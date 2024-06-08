const GitHubMobileBreakpoint = 768;
const widgetResponsibility = {
  uuid: '',
  horizontalCount: 4,
  breaks: {
    sm: {
      min_px: '768px',
      count: 1,
    },
    md: {
      max_px: '1280px',
      count: 2,
    },
    lg: {
      min_px: '1280px',
      count: 4,
    },
  },
};
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
let widgetReferences = {};
function loadWidgetReferences() {
  widgetReferences = {
    profile: getProfileWidget,
    recentActivity: getRecentActivityWidget,
    newWidget: getNewWidgetWidget,
    trending: getTrendingWidget,
  };
}

/**
 * Constant values start
 */
const CONST_IWillAddLater = null;
/**
 * Constant values end
 */

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
  return;
  const parentest = document.querySelector('.add-custom-feed');
  const element = document.querySelector('.add-custom-feed');
  const isWidthOverflown = element.scrollWidth > element.clientWidth;

  if (splitType === 'four') {
    if (isWidthOverflown) {
      parentest.classList.add('add-custom-feed-rows');
      splitType = 'two';
      criticalWidth.two = window.innerWidth;
      return;
    }
  }

  if (splitType === 'two') {
    if (!isWidthOverflown && window.innerWidth > criticalWidth.two) {
      parentest.classList.remove('add-custom-feed-rows');
      splitType = 'four';
      return;
    }

    if (isWidthOverflown) {
      parentest.classList.remove('add-custom-feed-rows');
      parentest.classList.add('add-custom-feed-rows');
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

    if (!conversation) {
      console.error('Conversation not found', props.url);
      return;
    }

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

            .${props.prefix}-preview main {
              width: 100%;
              height: 100%;
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
    props.onLoad?.();
    create(Cache.get(props.url));
    props.onLoaded?.();
  } else {
    let headers = props.headers || {};
    fetch(props.url, headers)
      .then((res) => res.text())
      .then((data) => {
        Cache.set(props.url, data);
        if (!!props.onLoad) {
          props.onLoad.then(() => {
            create(data);
            props.onLoaded?.();
          });
        } else {
          create(data);
          props.onLoaded?.();
        }
      });
  }
}

function addCustomCSS(css) {
  const style = document.createElement('style');
  style.innerHTML = css;
  const uuid = generateUUID();
  style.setAttribute('data-uuid', uuid);
  document.head.appendChild(style);
  return uuid;
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

function aadRender(html) {
  const dictionary = {};
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const parentNodes = Array.from(doc.body.children);

  /*
      REF FEATURE START
  */
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
  /*
      REF FEATURE END
  */

  return {
    refs: dictionary,
    node: parentNodes,
  };
}

function GitHubCard(child, config) {
  addCustomCSS(`
    .aad-custom-info-wrapper {
      /*padding: 8px 0px;*/
    }
  
    .aad-custom-info-wrapper-first {
      padding-top: 0px !important;
      padding-bottom: 0px !important;
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
      <div ref="wrapper" class="aad-custom-info-wrapper ${
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
  return { refs, node: parent };
}

function addWidget(id, widget) {
  const container = document.getElementById('container-' + id);
  container?.aadAppendChild(widget);
}

function boxStartDrag(e) {
  e.dataTransfer.setData('dragged_id', e.currentTarget.id);
}

function getWidgetByUUID(uuid) {
  for (let i = 0; i < aad_containers.length; i++) {
    const container = aad_containers[i];
    for (let j = 0; j < container.widgets.length; j++) {
      const widget = container.widgets[j];
      if (widget.uuid === uuid) {
        return Object.assign(widget, {
          containerIndex: i,
          widgetIndex: j,
        });
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
      widgets.push({
        type: widget.type,
        uuid: widget.uuid,
      });
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

function printContainers() {
  chrome.storage.local.get(['containers'], (items) => {
    const widgetLog = [];

    for (let i = 0; i < items.containers.length; i++) {
      const container = items.containers[i];
      const widgets = container.widgets || [];

      for (let j = 0; j < widgets.length; j++) {
        const widget = widgets[j];
        const widgetUUID = widget.uuid;

        widgetLog.push({
          containerIndex: i,
          widgetIndex: j,
          widgetUUID: widgetUUID,
          widgetType: widget.type,
        });
      }
    }

    console.table(widgetLog);
  });
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
                type: 'trending',
                uuid: generateUUID(),
              },
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

function addToContainer(containerIndex, widget) {
  chrome.storage.local.get(['containers'], (items) => {
    const containers = items.containers;
    containers[containerIndex].widgets.push(widget);
    setContainers({ containers: containers });
  });
}

function removeFromContainer(widgetUUID) {
  chrome.storage.local.get(['containers'], (items) => {
    const containers = items.containers;
    for (let container of containers) {
      for (let i = 0; i < container.widgets.length; i++) {
        if (container.widgets[i].uuid === widgetUUID) {
          container.widgets.splice(i, 1);
          break;
        }
      }
    }
    setContainers({ containers: containers });
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

    setWidgetContainerManager();

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
