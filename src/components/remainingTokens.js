function getRemainingTokens() {
  addCustomCSS(`
    .add-custom-remaining-tokens-container {
      position: absolute;
      bottom: 16px;
      right: 16px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .add-custom-remaining-tokens-container > span {
      text-align: right;
    }
    `);

  const refs = {};
  const container = render(
    refs,
    `
      <div class="add-custom-remaining-tokens-container">
        <span ref="anonymous">
        anonymous (waiting data)
        </span>
        <span ref="authenticated">
        authenticated (waiting data)
        </span>
      </div>
      `
  );

  document.addEventListener('onRemainingTokenChanged', (event) => {
    if (event.detail.anonymous.remaining !== -1) {
      refs.anonymous.innerText = `${event.detail.anonymous.remaining} / ${event.detail.anonymous.limit}`;
    }
    if (event.detail.authenticated.remaining !== -1) {
      refs.authenticated.innerText = `${event.detail.authenticated.remaining} / ${event.detail.authenticated.limit}`;
    }
  });

  return container;
}
