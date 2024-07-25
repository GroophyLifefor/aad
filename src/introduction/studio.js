const refs = {};
let transform = null;

/**
 * Updates the width of the frame and applies the transformation.
 *
 * @param {number} _width - The new width to be set for the frame.
 */
function updateFrameWidth(_width = -1) {
  transform.width.isChanged = true;
  if (_width === -1) {
    transform.width.changeRatio = 1;
  } else {
    transform.width.changeRatio = _width / transform.width.body;
  }
  transform.width.newWidth = _width;
  applyTransform();
}

/**
 * Updates the height of the frame and applies the transformation.
 *
 * @param {number} _height - The new height to be set for the frame.
 */
function updateFrameHeight(_height = -1) {
  transform.height.isChanged = true;
  if (_height === -1) {
    transform.height.changeRatio = 1;
  } else {
    transform.height.changeRatio = _height / transform.height.body;
  }
  transform.height.newHeight = _height;
  applyTransform();
}

function updateBodyWidth(_width = -1) {
  if (_width === -1) {
    document.body.style.maxWidth = 'none';
    return;
  }
  document.body.style.maxWidth = `${_width}px`;
}

function updateBodyHeight(_height) {
  if (_height === -1) {
    document.body.style.maxHeight = 'none';
    return;   
  }
  document.body.style.maxHeight = `${_height}px`;
}

function applyTransform() {
  let css = 'transform: ';
  if (transform.width.isChanged) {
    css += `scaleX(${transform.width.changeRatio}) `;
  }
  if (transform.height.isChanged) {
    css += `scaleY(${transform.height.changeRatio}) `;
  }
  css += ';';
  document.body.style.cssText = css;
}

/**
 * Changes the inner content of the wrapper element.
 *
 * @param {HTMLElement | HTMLElement[]} inner - The new inner content to be set for the wrapper.
 */
function updateWrapperInner(inner) {
  refs.wrapper.innerHTML = '';
  if (!!inner) refs.wrapper.aadAppendChild(inner);
}

/**
 * Adds an animation to the wrapper element to make it appear from a specified position.
 *
 * @param {string} position - The position from which the wrapper should come.
 *                            Can be 'top', 'bottom', 'left', or 'right'.
 * @returns {string} The UUID of the added custom CSS.
 */
function comeWrapperFrom(position) {
  const uuid = generateUUID();
  const prefix = prefixer('come-from', uuid, 'video-editing');

  const timing = '1.2s';
  const type = 'ease-in-out';

  if (position === 'top') {
    const cssUUID = addCustomCSS(`
      .${prefix('wrapper')} {
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        animation: ${prefix('come-from-top')} ${timing} ${type};
      }

      @keyframes ${prefix('come-from-top')} {
        from {
          height: 0;
        }
        to {
          height: 100%;
        }
      }
    `);
    refs.wrapper.classList.add(prefix('wrapper'));
    return cssUUID;
  }

  if (position === 'bottom') {
    const cssUUID = addCustomCSS(`
      .${prefix('wrapper')} {
        width: 100%;
        height: 100%;
        bottom: 0;
        left: 0;
        animation: ${prefix('come-from-bottom')} ${timing} ${type};
      }

      @keyframes ${prefix('come-from-bottom')} {
        from {
          height: 0;
        }
        to {
          height: 100%;
        }
    }`);
    refs.wrapper.classList.add(prefix('wrapper'));
    return cssUUID;
  }

  if (position === 'left') {
    const cssUUID = addCustomCSS(`
      .${prefix('wrapper')} {
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        animation: ${prefix('come-from-left')} ${timing} ${type};
      }

      @keyframes ${prefix('come-from-left')} {
        from {  
          width: 0;
        }
        to {
          width: 100%;
        }
    }`);
    refs.wrapper.classList.add(prefix('wrapper'));
    return cssUUID;
  }

  if (position === 'right') {
    const cssUUID = addCustomCSS(`
      .${prefix('wrapper')} {
        width: 100%;
        height: 100%;
        top: 0;
        right: 0;
        animation: ${prefix('come-from-right')} ${timing} ${type};
      }

      @keyframes ${prefix('come-from-right')} {
        from {
          width: 0;
        }
        to {
          width: 100%;
        }
    }`);
    refs.wrapper.classList.add(prefix('wrapper'));
    return cssUUID;
  }
}

/**
 * Adds an animation to the wrapper element to make it disappear to a specified position.
 *
 * @param {string} position - The position to which the wrapper should go.
 *                            Can be 'top', 'bottom', 'left', or 'right'.
 * @returns {string} The UUID of the added custom CSS.
 */
function goWrapperTo(position) {
  uuid = generateUUID();
  prefix = prefixer('go-to', uuid, 'video-editing');

  const timing = '1.2s';
  const type = 'ease-in-out';

  if (position === 'top') {
    const cssUUID = addCustomCSS(`
      .${prefix('wrapper')} {
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        animation: ${prefix('go-to-top')} ${timing} ${type};
      }

      @keyframes ${prefix('go-to-top')} {
        from {
          height: 100%;
        }
        to {
          height: 0;
        }
    }`);
    refs.wrapper.classList.add(prefix('wrapper'));
    return cssUUID;
  }

  if (position === 'bottom') {
    const cssUUID = addCustomCSS(`
      .${prefix('wrapper')} {
        width: 100%;
        height: 100%;
        bottom: 0;
        left: 0;
        animation: ${prefix('go-to-bottom')} ${timing} ${type};
      }

      @keyframes ${prefix('go-to-bottom')} {
        from {
          height: 100%;
        }
        to {
          height: 0;
        }
    }`);
    refs.wrapper.classList.add(prefix('wrapper'));
    return cssUUID;
  }

  if (position === 'left') {
    const cssUUID = addCustomCSS(`
      .${prefix('wrapper')} {
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        animation: ${prefix('go-to-left')} ${timing} ${type};
      }

      @keyframes ${prefix('go-to-left')} {
        from {
          width: 100%;
        }
        to {
          width: 0;
        }
    }`);
    refs.wrapper.classList.add(prefix('wrapper'));
    return cssUUID;
  }

  if (position === 'right') {
    const cssUUID = addCustomCSS(`
      .${prefix('wrapper')} {
        width: 100%;
        height: 100%;
        top: 0;
        right: 0;
        animation: ${prefix('go-to-right')} ${timing} ${type};
      }

      @keyframes ${prefix('go-to-right')} {
        from {
          width: 100%;
        }
        to {
          width: 0;
        }
    }`);
    refs.wrapper.classList.add(prefix('wrapper'));
    return cssUUID;
  }
}

function showTitle(title, ms) {
  const uuid = generateUUID();
  const prefix = prefixer('title', uuid, 'video-editing');

  addCustomCSS(`
    .${prefix('title')} {
      font-size: 32px;
      font-weight: bold;
      color: #c1ccd9;
    }
  `);

  const content = render(
    refs,
    `<div ref="title" class="${prefix('title')}">${title}</div>`
  );

  refs['t-wrapper'].aadAppendChild(content);
  refs['t-wrapper'].classList.add('aad-general-title-wrapper-open');

  setTimeout(() => {
    refs['t-wrapper'].classList.remove('aad-general-title-wrapper-open');
    setTimeout(() => {
      refs['t-wrapper'].innerHTML = '';
    }, 300);
  }, ms - 100);
}

function initDOM() {
  const uuid = generateUUID();
  const prefix = prefixer('studio', uuid, 'video-editing');

  /* START - scene wrapper */
  addCustomCSS(`
    .${prefix('wrapper')} {
      position: absolute;
      background-color: #22272e;
      color: #c1ccd9;
      overflow: hidden;
    }
  `);

  const content = render(
    refs,
    `<div ref="wrapper" class="${prefix('wrapper')}"></div>`
  );

  document.body.aadAppendChild(content);
  /* END - scene wrapper */

  /* START - title wrapper */
  addCustomCSS(`
    .${prefix('title-wrapper-container')} {
      position: absolute;
      height: fit-content;
      width: fit-content;
      bottom: 0;
      left: 0;
      overflow: hidden;
    }

    .${prefix('title-wrapper')} {
      background-color: #22272e;
      color: #c1ccd9;
      overflow: hidden;
      bottom: 0;
      margin-bottom: 24px;
      padding: 12px 24px;
      left: 0;
      width: fit-content;
      height: fit-content;
      transition: transform 0.3s ease-in-out;
      transform: translateX(-100%);
      border-radius: 0 8px 8px 0;
    }

    .aad-general-title-wrapper-open {
      transform: translateX(0);
    }
  `);

  const tContent = render(
    refs,
    `<div class="${prefix('title-wrapper-container')}">
      <div ref="t-wrapper" class="${prefix('title-wrapper')}"></div>
    </div>`
  );

  document.body.aadAppendChild(tContent);
  /* END - title wrapper */

  /* START - smoother body */
  addCustomCSS(`
    .${prefix('html')} {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .${prefix('body')} {
      transition: transition 0.3s ease-in-out;
      overflow: hidden;
    }
  `);

  document.documentElement.classList.add(prefix('html'));
  document.body.classList.add(prefix('body'));
  /* END - smoother body */

  transform = {
    width: {
      body: document.body.getBoundingClientRect().width,
      isChanged: false,
      changeRatio: 0,
    },
    height: {
      body: document.body.getBoundingClientRect().height,
      isChanged: false,
      changeRatio: 0,
    },
  };

  return {
    updateFrameWidth,
    updateFrameHeight,
    updateWrapperInner,
    comeWrapperFrom,
    goWrapperTo,
    showTitle,
    updateBodyWidth,
    updateBodyHeight,
  };
}
