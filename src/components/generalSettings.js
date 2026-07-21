function setWidgetLgCount(c) {
  widgetResponsibility.breaks.lg.count = c;
  applyWidgetResponsibility();
}

let settingsButtonEl = null;
let settingsCssAdded = false;
let settingsDomWatcher = null;
let settingsRemounting = false;

function ensureSettingsCss() {
  if (settingsCssAdded) {
    return;
  }
  settingsCssAdded = true;

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
}

function createSettingsButtonEl() {
  if (settingsButtonEl) {
    return settingsButtonEl;
  }

  ensureSettingsCss();

  const refs = {};
  settingsButtonEl = render(
    refs,
    `
    <div ref="settings" aad-settings="true" class="widget-container-manager" ref="container">
      <div class="widget-container-manager-settings-button">
        ${SVG.settings('16px', '16px')}
      </div>
    </div>
    `,
  );

  refs.settings.addEventListener('click', () => {
    createModal(
      'Advanced Settings',
      {},
      () => getNewSettings().node,
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
        border: 'none',
      },
      [
        {
          type: 'wide-button',
          text: 'Open advanced settings (Work In Progress)',
          onClick: (props) => {
            props.closeModal();

            createModal(
              'Advanced Settings',
              {},
              () => getNewSettings().node,
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
      },
    );
  });

  return settingsButtonEl;
}

async function remountSettingsButtonIfMissing() {
  if (!settingsButtonEl || document.body.contains(settingsButtonEl)) {
    return true;
  }
  if (settingsRemounting) {
    return false;
  }

  settingsRemounting = true;
  // console.log('[AAD settings] button missing from DOM, re-mounting');

  try {
    const remounted = await waitUntil(
      () => mountGeneralSettingsButton(settingsButtonEl),
      { tries: 30, delay: 100 },
    );

    // if (remounted) {
    //   console.log('[AAD settings] re-mount succeeded');
    // } else {
    //   console.log('[AAD settings] re-mount failed after retries');
    // }

    return remounted;
  } finally {
    settingsRemounting = false;
  }
}

const scheduleSettingsRemount = aad_debounce(() => {
  void remountSettingsButtonIfMissing();
}, 100);

function ensureSettingsDomWatcher() {
  if (settingsDomWatcher || !document.body) {
    return true;
  }

  settingsDomWatcher = new MutationObserver(() => {
    if (!settingsButtonEl || document.body.contains(settingsButtonEl)) {
      return;
    }
    // console.log('[AAD settings] dom watcher detected missing button');
    scheduleSettingsRemount();
  });
  settingsDomWatcher.observe(document.body, { childList: true, subtree: true });
  // console.log('[AAD settings] dom watcher started on body');
  return true;
}

function mountGeneralSettingsButton(html) {
  if (document.querySelector('[aad-settings="true"]')) {
    // console.log('[AAD settings] already mounted, skipping');
    return true;
  }

  const userProfileImage = document.querySelector('header [data-component="Avatar"]');
  const userProfile = userProfileImage?.parentNode;
  const userProfileParent = userProfile?.parentNode;
  const profileBars = userProfileParent?.parentNode;

  if (userProfileParent && profileBars) {
    profileBars.insertBefore(html, userProfileParent);
    // console.log('[AAD settings] mounted via avatar-chain');
    return true;
  }

  const actions = document.querySelector('.AppHeader-actions');
  if (actions) {
    actions.insertBefore(html, actions.firstChild);
    // console.log('[AAD settings] mounted via app-header-actions');
    return true;
  }

  const notificationsButton = document.getElementById('AppHeader-notifications-button');
  if (notificationsButton?.parentNode) {
    notificationsButton.parentNode.insertBefore(html, notificationsButton);
    // console.log('[AAD settings] mounted via before-notifications');
    return true;
  }

  // console.log('[AAD settings] mount attempt failed', {
  //   hasAvatar: !!userProfileImage,
  //   hasActions: !!actions,
  //   hasNotificationsButton: !!notificationsButton,
  // });
  return false;
}

async function getGeneralSettingsComp() {
  // console.log('[AAD settings] getGeneralSettingsComp start');

  await waitUntil(() => ensureSettingsDomWatcher(), { tries: 20, delay: 100 });

  if (document.querySelector('[aad-settings="true"]')) {
    // console.log('[AAD settings] button already in DOM, done');
    return true;
  }

  const html = createSettingsButtonEl();

  // console.log('[AAD settings] waiting for header mount point...');
  const mounted = await waitUntil(() => mountGeneralSettingsButton(html), {
    tries: 30,
    delay: 100,
  });

  // if (mounted) {
  //   console.log('[AAD settings] mount succeeded');
  // } else {
  //   console.log('[AAD settings] mount failed after retries, showing UI change toast');
  // }
  if (!mounted) {
    requireGitHubElement(
      'header [data-component="Avatar"]',
      document,
      'generalSettings mount'
    );
  }

  return mounted;
}

async function stabilizeSettingsButton() {
  await getGeneralSettingsComp();

  for (const delay of [400, 900, 1800]) {
    await aad_sleep(delay);
    if (!document.querySelector('[aad-settings="true"]')) {
      // console.log(`[AAD settings] missing after +${delay}ms, re-checking`);
      await remountSettingsButtonIfMissing();
    }
  }
}
