function setWidgetLgCount(c) {
  widgetResponsibility.breaks.lg.count = c;
  applyWidgetResponsibility();
}

function getGeneralSettingsComp() {
  addCustomCSS(`
    .widget-container-manager { 
      width: 32px;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid ${getColor('settings.icon.border')};
      background-color: ${getColor('settings.icon.bg')};
      border-radius: 6px;
      cursor: pointer;
      position: relative;
    }

    .widget-container-manager-settings-button {
      display: flex;
      justify-content: center;
      align-items: center;
      color: ${getColor('settings.icon.iconFill')};
    }
  `);

  const refs = {};
  const html = render(
    refs,
    `
    <div ref="settings" aad-settings="true" class="widget-container-manager" ref="container">
      <div class="widget-container-manager-settings-button">
        ${SVG.settings('16px', '16px')}
      </div>
    </div>
    `
  );

  refs.settings.addEventListener('click', () => {
    createModal(
      'Advanced Settings',
      {
        // maxWidth: 'none',
        // maxHeight: 'none',
      },
      ({ closeModal }) => {
        // const uuid = generateUUID();
        // const prefix = prefixer('advanced-settings', uuid, 'component');

        // const advancedSettingRefs = {};
        // const advancedSettingHTML = render(
        //   advancedSettingRefs,
        //   `
        //   <div ref="${prefix(
        //     'container'
        //   )}" style="width: calc(100dvw - 48px); height: calc(100dvh - 80px);">
        //     Work in progress
        //   </div>
        //   `
        // );
        // return advancedSettingHTML;

        // return getAdvancedSettings().node;
        return getNewSettings().node;
      }
    );
    return;
    let _widgets = widgetResponsibility.breaks;
    let _containers = containerSettings;

    let merged = {
      ..._widgets,
      ..._containers,
    };

    settingsCard(
      {
        title: 'Widget Responsibilty Settings',
        border: 'none'
      },
      [
        {
          type: 'wide-button',
          text: 'Open advanced settings (Work In Progress)',
          onClick: (props) => {
            // /* Video DEMO START */
            // setTimeout(() => {
            //   startConference();
            // }, 1000);
            // return;
            // /* Video DEMO END */


            props.closeModal();

            createModal(
              'Advanced Settings',
              {
                // maxWidth: 'none',
                // maxHeight: 'none',
              },
              ({ closeModal }) => {
                // const uuid = generateUUID();
                // const prefix = prefixer('advanced-settings', uuid, 'component');

                // const advancedSettingRefs = {};
                // const advancedSettingHTML = render(
                //   advancedSettingRefs,
                //   `
                //   <div ref="${prefix(
                //     'container'
                //   )}" style="width: calc(100dvw - 48px); height: calc(100dvh - 80px);">
                //     Work in progress
                //   </div>
                //   `
                // );
                // return advancedSettingHTML;

                // return getAdvancedSettings().node;
                return getNewSettings().node;
              }
            );
          },
        },
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
              min: '1',
              max: '4',
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
              min: '1',
              max: '4',
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
              min: '1',
              max: '4',
            },
          ],
        },
        {
          type: 'group',
          label: 'Overlay',
          subfields: [
            {
              field: 'heightType',
              type: 'select',
              label: 'Height Type',
              options: [
                {
                  label: 'Fit to content',
                  value: 'fit',
                },
                {
                  label: "Fit to other container's height",
                  value: 'sameHeight',
                },
                {
                  label: "Fit to other container's height with min DVH",
                  value: 'sameHeightWithMinDVH',
                },
              ],
            },
          ],
        },
      ],
      merged,
      (newConfig) => {
        const { lg, md, sm, heightType } = newConfig;
        widgetResponsibility.breaks = {
          lg,
          md,
          sm,
        };
        updateContainerSettings({
          heightType,
        });
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
