function setWidgetLgCount(c) {
  widgetResponsibility.breaks.lg.count = c;
  applyWidgetResponsibility();
}

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

    .widget-container-manager-settings-button {
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #778491;
    }
  `);

  const refs = {};
  const html = render(
    refs,
    `
    <div class="widget-container-manager" ref="container">
      <!-- <input id="aad-global-lg-count-input" type="text" max="4" min="1" value="${
        widgetResponsibility.breaks.lg.count
      }" ref="input" ></div> -->
      <div ref="settings" class="widget-container-manager-settings-button">
        ${SVG.settings('16px', '16px')}
      </div>
    </div>
    `
  );

  refs.settings.addEventListener('click', () => {
    settingsCard(
      {
        title: 'Widget Responsibilty Settings',
      },
      [
        {
          type: 'group',
          label: 'Mobile',
          subfields: [
            {
              field: 'sm.max_px',
              type: 'text',
              placeholder: '768px',
              label: 'Mobile maximum width',
            },
            {
              field: 'sm.count',
              type: 'number',
              placeholder: '1',
              label: 'Show widgets count per row',
            },
          ],
        },
        {
          type: 'group',
          label: 'Tablet',
          subfields: [
            {
              field: 'md.max_px',
              type: 'text',
              placeholder: '1280px',
              label: 'Tablet maximum width',
            },
            {
              field: 'md.count',
              type: 'number',
              placeholder: '2',
              label: 'Show widgets count per row',
            },
          ],
        },
        {
          type: 'group',
          label: 'Desktop',
          subfields: [
            {
              field: 'lg.min_px',
              type: 'text',
              placeholder: '1280px',
              label: 'Desktop minimum width',
            },
            {
              field: 'lg.count',
              type: 'number',
              placeholder: '4',
              label: 'Show widgets count per row',
            },
          ],
        },
      ],
      widgetResponsibility.breaks,
      (newConfig) => {
        widgetResponsibility.breaks = newConfig;
        applyWidgetResponsibility();
        saveWidgetResponsibility();
      }
    );
  });

  // const input = refs.input;
  // input.addEventListener('change', (e) => {
  //   setWidgetLgCount(e.target.value);
  // });

  const userProfile = document.querySelector('.AppHeader-user');
  const parent = userProfile.parentNode;
  parent.insertBefore(html, userProfile);
}
