let GitHubUsername = '';
const GitHubRecentActivity = [];

/**
 * Constant values start
 */
const CONST_IWillAddLater = null;
const FREAKING_YEAH_PLEASE = true;
const NO_THANK_YOU = false;
/**
 * Constant values end
 */

async function onLoad() {
  // after new layout is loaded
}

function convertToPx(value, element = document.documentElement) {
  const parsedValue = parseFloat(value);
  const unit = value.toString().replace(parsedValue, '').trim();

  function getFontSize(el) {
    return parseFloat(getComputedStyle(el).fontSize);
  }

  // Conversion logic
  switch (unit) {
    case 'em':
      return parsedValue * getFontSize(element);
    case 'rem':
      return parsedValue * getFontSize(document.documentElement);
    case 'in':
      return parsedValue * 96;
    case 'px':
      return parsedValue;
    default:
      throw new Error('Unsupported unit: ' + unit);
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

function addCustomCSS(css) {
  const style = document.createElement('style');
  style.innerHTML = css;
  const uuid = generateUUID();
  style.setAttribute('data-uuid', uuid);
  document.head.appendChild(style);
  return uuid;
}

function addWidget(id, widget) {
  const container = document.getElementById('container-' + id);
  container?.aadAppendChild(widget);
}

function boxStartDrag(e) {
  e.dataTransfer.setData('dragged_id', e.currentTarget.id);
}

function boxEndDrag(e) {
  saveWidgetPosition();
  e.currentTarget.setAttribute('draggable', 'false');
}

document.addEventListener('onWidgetsStyled', saveWidgetPosition);

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
  const _ = document.querySelectorAll('.dashboard-sidebar summary span')[0];
  GitHubUsername = _.innerText.trim();
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
    ).innerHTML = ` Dashboard <span class="ActionListItem-label color-fg-muted f6">(Click text to back default feed)</span>`;

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
