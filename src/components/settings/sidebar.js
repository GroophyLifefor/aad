function getSidebar({ outline }) {
  const uuid = generateUUID();
  const prefix = prefixer('advanced-settings-sidebar', uuid, 'component');

  const navigator = (outline) => {
    const uuid = generateUUID();
    const pre = (title) => prefix('navigator' + '-' + uuid + '-' + title);

    addCustomCSS(`
      .${pre('container')} {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 8px;
        gap: 4px;
      }

      .${pre('container')}:hover {
        background-color: ${getColor('modal.hover-bg')};
        border-radius: 8px;
      }
    `);

    const navigatorRefs = {};
    const _navigator = render(
      navigatorRefs,
      `
      <div class="${pre('container')}">
        <span class="aad-small-text">${outline}</span>
      </div>
      `
    );

    return _navigator;
  };

  const details = (title, svg, inner) => {
    const details_uuid = generateUUID();
    const pre = (title) => prefix('details' + '-' + details_uuid + '-' + title);

    const maxHeight =
      inner.length * 29 + // each height
      (inner.length - 1) * 4 + // gap height
      8; // margin-bottom

    addCustomCSS(`
      .${pre('container')} {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 0px 16px;
      }

      .${pre('summary')} {
        display: flex;
        justify-content: space-between;
        cursor: pointer;
        align-items: center;
        gap: 8px;
      }

      .${pre('details')} {
        padding-left: 10px;
        display: flex;
        flex-direction: column;
        gap: 4px;
        max-height: 0px;
        overflow: hidden;
        transition: max-height .5s ease-in-out;
        margin-bottom: 8px;
      }

      .${pre('details')}.open {
        max-height: ${maxHeight}px;
      }

      .${pre('svg')} {
        transition: transform .5s ease-in-out;
      }

      .${pre('svg')}.rotate {
        transform: rotateX(180deg);
      }
    `);

    const detailsRefs = {};
    const _details = render(
      detailsRefs,
      `
      <div class="${pre('container')}">
        <div ref="summary" class="${pre('summary')}" sr-only="summary">
          <div style="display: flex; gap: 8px;">
            ${SVG[svg]('16px', '20px', getColor('text-md.color'))}
            <span class="aad-medium-text">${title}</span>
          </div>
          <svg ref="svg" class="${pre(
            'svg'
          )}" stroke="currentColor" fill="${getColor(
        'text-md.color'
      )}" stroke-width="0" viewBox="0 0 320 512" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg" data-darkreader-inline-fill="" data-darkreader-inline-stroke="" style="--darkreader-inline-fill: currentColor; --darkreader-inline-stroke: currentColor;"><path d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"></path></svg>
        </div>

        <div ref="details" class="${pre('details')}" sr-only="details">
          
        </div>
      </div>
      `
    );

    detailsRefs.summary.addEventListener('click', () => {
      detailsRefs.details.classList.toggle('open');
      detailsRefs.svg.classList.toggle('rotate');
    });

    inner.forEach((element) => {
      const _navigator = navigator(element);
      detailsRefs.details.aadAppendChild(_navigator);
    });

    return _details;
  };

  addCustomCSS(`
    .${prefix('wrapper')} {
      position: relative;
      display: flex;
      flex-direction: column;
  }

    .${prefix('container')} {
      max-width: 320px;
      transition: max-width .5s ease-in-out;
      border-radius: 12px;
      padding: 12px 8px;
      display: flex;
      flex-direction: column;
      gap: 2px;
      overflow: hidden;
      position: relative;
    }

    .${prefix('container')}.collapsed {
      max-width: 0px;
      padding: 0px;
    }

    .${prefix('expand')} {
      position: absolute;
      left: -100%;
      top: 0;
      transition: left .5s ease-in-out;
      padding: 12px 8px;
      cursor: pointer;
    }

    .${prefix('expand')}.collapsed {
      left: 0;
    }

    .${prefix('collapse')} {
      display: flex; 
      justify-content: flex-end;
      border-bottom: 1px solid ${getColor('modal.border')};
      padding-bottom: 8px;
      margin-bottom: 8px;
      cursor: pointer;
    }
    `);

  const refs = {};
  const html = aadRender(
    refs,
    `
    <div class="${prefix('wrapper')}">
      <div ref="expand" class="${prefix('expand')}">
        ${SVG.rightArrow({
          width: '20px',
          height: '20px',
          style: `color: ${getColor('text-md.color')}`,
        })}
      </div>
      <div ref="container" class="aad-w-full aad-h-full ${prefix('container')}">
        <div class="${prefix('collapse')}">
          ${SVG.leftArrow({
            ref: 'collapse',
            width: '20px',
            height: '20px',
            style: `color: ${getColor('text-md.color')}`,
          })}
        </div>
      </div>
    </div>
    `
  );

  function isCollapsed() {
    return refs.container.classList.contains('collapsed');
  }

  let isCollapsedByDeveloper = false;
  const autoCollapse = () => {
    if (window.innerWidth < 768) {
      collapse();
      isCollapsedByDeveloper = true;
    } else {
      if (isCollapsedByDeveloper) {
        expand();
        isCollapsedByDeveloper = false;
      }
    }
  };

  const resize = aad_debounce(() => {
    autoCollapse();
  }, 50);

  window.addEventListener('resize', resize);

  function collapse() {
    if (!refs.container.classList.contains('collapsed')) {
      refs.container.classList.add('collapsed');
    }
    if (!refs.expand.classList.contains('collapsed')) {
      refs.expand.classList.add('collapsed');
    }
  }

  function expand() {
    if (refs.container.classList.contains('collapsed')) {
      refs.container.classList.remove('collapsed');
    }
    if (refs.expand.classList.contains('collapsed')) {
      refs.expand.classList.remove('collapsed');
    }
  }

  refs.collapse.addEventListener('click', collapse);

  refs.expand.addEventListener('click', expand);

  outline.forEach((element) => {
    const subs = element.subTitles.map((sub) => sub.title);
    const parent = details(element.title, element.svg, subs);
    refs.container.aadAppendChild(parent);
  });

  return html;
}
