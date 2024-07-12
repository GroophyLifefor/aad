function GitHubCard(child, config) {
  const uuid = generateUUID();
  const prefix = prefixer('github-card', uuid, 'component');

  addCustomCSS(`
    .${prefix('wrapper-first')} {
      padding-top: 0px !important;
      padding-bottom: 0px !important;
      width: 100%;
    }

    .${prefix('fit')} {
    }

    .${prefix('sameHeight')} {
      height: 100%;
    }

    .${prefix('sameHeightWithMinDVH')} {
      height: 100%;
      min-height: calc(100vh - 86px);
    }

    .${prefix('container')} {
      width: 100%;
      border-radius: 6px;
      padding: ${config['customPadding'] || '16px'};
      background-color: #22272e;
      border: 1px solid #444c56;
    }
  
    .${prefix('i-fit')} {}
    .${prefix('i-sameHeight')}, .${prefix('i-sameHeightWithMinDVH')} {
      height: 100%;
    }
    `);

  const refs = {};
  const parent = render(
    refs,
    `
      <div ref="wrapper" class="${
        config['isFirst'] ? prefix('wrapper-first') : ''
      }">
        <div ref="container" class="${prefix('container')}">
          <div ref="inner" class="${prefix('inner')}">
          </div>
        </div>
      </div>
    `
  );

  function applyHeightType() {
    /* Container settings */
    const heightType = containerSettings.heightType;
    refs.container.classList.remove(prefix('fit'));
    refs.container.classList.remove(prefix('sameHeight'));
    refs.container.classList.remove(prefix('sameHeightWithMinDVH'));

    refs.container.classList.add(prefix(heightType));

    /* Inner settings */
    refs.inner.classList.remove(prefix('i-fit'));
    refs.inner.classList.remove(prefix('i-sameHeight'));
    refs.inner.classList.remove(prefix('i-sameHeightWithMinDVH'));

    refs.inner.classList.add(prefix(`i-${heightType}`));
  }

  applyHeightType();

  document.addEventListener('onContainerSettingsUpdated', applyHeightType);


  refs.inner.aadAppendChild(child);
  return { refs, node: parent };
}
