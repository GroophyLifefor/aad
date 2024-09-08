function getSettinsGroup({ GroupTitle }) {
  const uuid = generateUUID();
  const prefix = prefixer('advanced-settings-group', uuid, 'component');

  addCustomCSS(`
    .${prefix('container')} {
      display: flex;
      flex-direction: column;
      gap: 12px;
     
    } 

    .${prefix('area')} {
      gap: 24px;
      width: 100%;
      grid-auto-rows: 1fr;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
    }

    .${prefix('cubuk')} {
      width: 2px;
      height: 100%;
      background-color: ${getColor('modal.border')};
    }

    .${prefix('inner')} {
      padding: 16px 24px 16px 0;
    }
    `);

  const refs = {};
  const html = aadRender(
    refs,
    `
    <div class="${prefix('container')}">
      <h1>${GroupTitle}</h1>
      <div class="${prefix('area')}">
        <div class="${prefix('cubuk')}"></div>
        <div class="${prefix('inner')}">
          asd
        </div>
      </div>
    </div>
    `
  );

  return {
    node: html,
    refs
  };
}