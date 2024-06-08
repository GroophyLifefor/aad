function setWidgetContainerManager() {
  addCustomCSS(`
    .widget-container-manager { 
      width: 32px;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #444c56;
      border-radius: 6px;
    }

    .widget-container-manager > input {
      width: 24px;
      height: 24px;
      background-color: transparent;
      border: none;
      align-items: center;
      text-align: center;
      color: #778491;
      font-family: 'Segoe UI', sans-serif;
      font-size: 11px;
    }
  `);

  const refs = {};
  const html = render(
    refs,
    `
    <div class="widget-container-manager" ref="container">
      <input type="number" max="4" min="1" value="4" ref="input" />
    </div>
    `
  );

  const input = refs.input;
  input.addEventListener('change', (e) => {
    widgetResponsibility.horizontalCount = e.target.value;
    widgetResponsibility.breaks.lg.count = e.target.value;
    applyWidgetResponsibility();
  });

  const userProfile = document.querySelector('.AppHeader-user');
  const parent = userProfile.parentNode;
  parent.insertBefore(html, userProfile);
}
