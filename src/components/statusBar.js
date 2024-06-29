function getStatusBar() {
  const uuid = generateUUID();
  const prefix = prefixer('status-bar', uuid, 'component');

  addCustomCSS(`
    .${prefix('container')} {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 10px 0px;
      gap: 8px;
      min-height: calc(100dvh - 64.55px);
      height: 100%;
      width: 24px;
      min-width: 24px;
      background-color: #2d333b;
    }

    .${prefix('inner-top')} {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .${prefix('inner-top')} > * {
      color: #c5d1de;
      cursor: pointer;
      padding: 2px 4px;
    }

    .${prefix('vertical-text')} {
      writing-mode: vertical-rl;
      text-orientation: mixed;
    }
    
  `);

  const comp = aadRender(`
    <div class="${prefix('container')}">
      <div class="${prefix('inner-top')}">
        <a title="test" class="${prefix('remainingTokens')}">
          ${SVG.key(12, 12)}
        </a>
        <a title="test" class="${prefix('remainingTokens')}">
          ${SVG.key(12, 12)}
        </a>
        <a title="test" class="${prefix('remainingTokens')}">
          ${SVG.key(12, 12)}
        </a>
      </div>
      <div class="${prefix('inner-bottom')}">
        <div class="${prefix('vertical-text')}">
          <span>Made by <a href="https://github.com/GroophyLifefor">Murat</a></span>
        </div>
      </div>
    </div>
    `);

  return comp;
}
