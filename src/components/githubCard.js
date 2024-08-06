function GitHubCard(child, config) {
  const uuid = generateUUID();
  const prefix = prefixer('github-card', uuid, 'component');

  addCustomCSS(`
    .${prefix('wrapper-first')} {
      width: 100%;

      border-radius: 6px;
      padding: 12px;
      background-color: ${getColor('container.bg')};
      border: 1px solid ${getColor('container.border')}; 
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }

    .${prefix('fit')} {
      height: fit-content;
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
    refs.wrapper.classList.remove(prefix('fit'));
    refs.container.classList.remove(prefix('sameHeight'));
    refs.wrapper.classList.remove(prefix('sameHeightWithMinDVH'));

    if (heightType === 'fit') {
      refs.wrapper.classList.add(prefix('fit'));
    } else if (heightType === 'sameHeight') {
      refs.container.classList.add(prefix('sameHeight'));
    } else if (heightType === 'sameHeightWithMinDVH') {
      refs.wrapper.classList.add(prefix('sameHeightWithMinDVH'));
    }

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
