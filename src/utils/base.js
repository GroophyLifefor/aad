let GitHubUsername = '';
const GitHubRecentActivity = [];
const zIndex = {
  modal: 1000,
  drawer: 1010,
  notification: 1020,
};

/**
 * Constant values start
 */
const CONST_IWillAddLater = null;
const FREAKING_YEAH_PLEASE = true;
const NO_THANK_YOU = false;
/**
 * Constant values end
 */
const aad_debounce = (callback, wait) => {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, wait);
  };
};

const callApplyWidgetResponsibility = aad_debounce(() => {
  applyWidgetResponsibility();
}, 20);

async function onLoad() {
  // after new layout is loaded
  window.addEventListener('resize', () => {
    callApplyWidgetResponsibility();
  });

  initGlobalCSS();
  preloadImages();
}

/**
 * Repeatedly calls a callback function based on the provided options.
 *
 * @param {function} callback - The callback function to be called. Should return a boolean indicating success.
 * @param {Object} options - Configuration options for the repeated calls.
 * @param {number} options.times - The number of times to call the callback.
 * @param {number} options.start_ms - The initial delay in milliseconds before the first call.
 * @param {string} options.type - The type of delay increment. Can be either 'exponentially' or 'linear'.
 *
 * @returns {boolean} Returns `true` if the callback returns `true` during any of the calls, otherwise returns `false`.
 *
 * @example
 * // Example 1: Trying to connect to a server with exponential backoff
 * const options = { times: 5, start_ms: 1000, type: 'exponentially' };
 * const result = aad_repeatlyCall(() => {
 *   console.log('Attempting to connect to server...');
 *   const success = Math.random() > 0.8; // Simulate a 20% chance of success
 *   if (success) {
 *     console.log('Connection successful!');
 *   }
 *   return success;
 * }, options);
 * console.log(result); // Output: true if connection was successful, otherwise false
 *
 * @example
 * // Example 2: Polling a service with linear backoff to check if a task is completed
 * const options = { times: 10, start_ms: 500, type: 'linear' };
 * const result = aad_repeatlyCall(() => {
 *   console.log('Checking if task is completed...');
 *   const taskCompleted = Math.random() > 0.5; // Simulate a 50% chance of task completion
 *   if (taskCompleted) {
 *     console.log('Task completed!');
 *   }
 *   return taskCompleted;
 * }, options);
 * console.log(result); // Output: true if task was completed, otherwise false
 */
function aad_repeatlyCall(callback, options) {
  const { times, start_ms, type } = options;
  let ms = start_ms;
  for (let i = 0; i < times; i++) {
    setTimeout(() => {
      const isOK = callback();
      if (isOK) {
        return true;
      }
    }, ms);
    if (type === 'exponentially') {
      ms *= 2;
    }
    if (type === 'linear') {
      ms += start_ms;
    }
  }
  return false;
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

var sha256 = function sha256(ascii) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }

  var mathPow = Math.pow;
  var maxWord = mathPow(2, 32);
  var lengthProperty = 'length';
  var i, j; // Used as a counter across the whole file
  var result = '';

  var words = [];
  var asciiBitLength = ascii[lengthProperty] * 8;

  //* caching results is optional - remove/add slash from front of this line to toggle
  // Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
  // (we actually calculate the first 64, but extra values are just ignored)
  var hash = (sha256.h = sha256.h || []);
  // Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
  var k = (sha256.k = sha256.k || []);
  var primeCounter = k[lengthProperty];
  /*/
  var hash = [], k = [];
  var primeCounter = 0;
  //*/

  var isComposite = {};
  for (var candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  ascii += '\x80'; // Append Ƈ' bit (plus zero padding)
  while ((ascii[lengthProperty] % 64) - 56) ascii += '\x00'; // More zero padding
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return; // ASCII check: only accept characters in range 0-255
    words[i >> 2] |= j << (((3 - i) % 4) * 8);
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;

  // process each chunk
  for (j = 0; j < words[lengthProperty]; ) {
    var w = words.slice(j, (j += 16)); // The message is expanded into 64 words as part of the iteration
    var oldHash = hash;
    // This is now the undefinedworking hash", often labelled as variables a...g
    // (we have to truncate as well, otherwise extra entries at the end accumulate
    hash = hash.slice(0, 8);

    for (i = 0; i < 64; i++) {
      var i2 = i + j;
      // Expand the message into 64 words
      // Used below if
      var w15 = w[i - 15],
        w2 = w[i - 2];

      // Iterate
      var a = hash[0],
        e = hash[4];
      var temp1 =
        hash[7] +
        (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) + // S1
        ((e & hash[5]) ^ (~e & hash[6])) + // ch
        k[i] +
        // Expand the message schedule if needed
        (w[i] =
          i < 16
            ? w[i]
            : (w[i - 16] +
                (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) + // s0
                w[i - 7] +
                (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) | // s1
              0);
      // This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
      var temp2 =
        (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) + // S0
        ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2])); // maj

      hash = [(temp1 + temp2) | 0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
      hash[4] = (hash[4] + temp1) | 0;
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      var b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? 0 : '') + b.toString(16);
    }
  }
  return result;
};

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
    '[widget-type="newWidget"]'
  );

  e.currentTarget.aadAppendChild(document.getElementById(data));
  e.currentTarget.aadAppendChild(newWidget);
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
  function way1() {
    const _ = document.querySelectorAll(
      '#switch_dashboard_context_left_column-button > span > span > span'
    )[1];
    if (!!_) {
      GitHubUsername = _.innerText.trim();
      return true;
    } else {
      return false;
    }
  }

  function way2() {
    const _ = document.querySelectorAll('meta[name="octolytics-actor-login"]')[0]
    if (!!_) {
      GitHubUsername = _.getAttribute('content').trim();
      return true;
    } else {  
      return false;
    }
  }

  function way3() {
    const _ = document.querySelectorAll('meta[name="user-login"]')[0]
    if (!!_) {
      GitHubUsername = _.getAttribute('content').trim();
      return true;
    } else {  
      return false;
    }
  }

  function way4() {
    const _ = document.querySelectorAll('button[aria-label="Open user navigation menu"]')[0]
    if (!!_) {
      GitHubUsername = _.getAttribute('data-login').trim();
      return true;
    } else {  
      return false;
    }
  }

  const ways = [way1, way2, way3, way4];
  let found = false;
  for (const way of ways) {
    if (way()) {
      found = true;
      break;
    }
  }
  if (!found) {
    throw new Error('Cannot find GitHub username.');
  }

  preloadImage(`https://github.com/${GitHubUsername}.png`);
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

    getGeneralSettingsComp();

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
