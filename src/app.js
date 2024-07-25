const aad_site_url = window.location.href;

function reloadWidgets() {
  const start = Date.now();

  const _feed = document.querySelector('.application-main > div > div');

  _feed.innerHTML = '';

  const widgetContainer = getWidgetContainer();
  const remainingTokens = getRemainingTokens();

  _feed.aadAppendChild(remainingTokens);
  _feed.aadAppendChild(widgetContainer);

  widgetCounter = {};
  loadWidgets();
  const end = Date.now();
  sendNewNotification(`Widgets UI reloaded within ${end - start}ms.`, {
    type: 'info',
    timeout: 5000,
    title: 'Recomended action',
    actions: [
      {
        text: 'Reload page (Reinitializes scripts)',
        type: 'info',
        action: () => {
          window.location.reload();
        },
      },
    ],
  });
}

function loadWidgets() {
  chrome.storage.local.get(['containers'], (items) => {
    for (let i = 0; i < widgetResponsibility.totalWidgetCount; i++) {
      const container = items.containers[i];
      if (!container) {
        const widgetUUID = generateUUID();
        const widgetFunc = widgetReferences['newWidget'].fn;
        const { widget: widgetInstance } = widgetFunc(widgetUUID);
        addWidget(i, widgetInstance);

        // save
        const containers = items.containers;
        containers.push({
          index: i,
          widgets: [
            {
              type: 'newWidget',
              uuid: widgetUUID,
              config: {},
            },
          ],
        });
        setContainers({ containers: containers });
        continue;
      }

      const widgets = container.widgets || [];
      for (let j = 0; j < widgets.length; j++) {
        const widget = widgets[j];
        const widgetUUID = widget.uuid;
        const widgetFunc = widgetReferences[widget.type].fn;

        let widgetResult = null;
        try {
          widgetResult = widgetFunc(widgetUUID, {
            containerIndex: i,
          });
        } catch (e) {
          const widgetInfo = {
            widgetType: widget.type,
            widgetUUID: widgetUUID,
            containerIndex: i,
            widgetIndex: j,
          };

          const error = {
            message: e.message,
            stack: e.stack,
            arguments: e.arguments,
            type: e.type,
            e,
          };

          const user = {
            userAgent: navigator.userAgent,
            deviceMemory: navigator.deviceMemory || -1,
            hardwareConcurrency: navigator.hardwareConcurrency || -1,
            userAgentData: navigator.userAgentData,
            GitHubUsername,
          };

          const system = {
            screenWidth: screen.width,
            screenHeight: screen.height,
            colorDepth: screen.colorDepth,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
          };

          var manifestData = chrome.runtime.getManifest();
          const _widgetCounter = widgetCounter;
          for (let key in _widgetCounter) {
            if (_widgetCounter.hasOwnProperty(key)) {
              _widgetCounter[key]--;
            }
          }
          const _widgetResponsibility = widgetResponsibility;
          _widgetResponsibility.currentCount = widgetResponsibility.currentCount();

          console.error('AAD - There was an error in loadWidgets', {
            widgetInfo,
            error,
            user,
            system,
            app: {
              version: manifestData.version,
              widgetResponsibility,
              widgetCounter,
              tokens,
              aad_containers,
              GitHubRecentActivity,
              notifications,
            },
          });
          continue;
        }
        if (!widgetResult) {
          console.log('Skipping widget reason of caused an error', widgetUUID);
          continue;
        }
        const { widget: widgetInstance } = widgetResult;
        addWidget(i, widgetInstance);
      }

      // add newWidget
      const widgetUUID = generateUUID();
      const widgetFunc = widgetReferences['newWidget'].fn;
      const { widget: widgetInstance } = widgetFunc(widgetUUID, {
        containerIndex: i,
      });
      addWidget(i, widgetInstance);
    }
  });
}

async function main() {
  const _feed = document.querySelector('.application-main > div > div');
  _feed.setAttribute('style', '');

  const widgetContainer = getWidgetContainer();
  const remainingTokens = getRemainingTokens();
  const notificationManager = getNotificationManager();

  _feed.aadAppendChild(remainingTokens);
  document.body.aadAppendChild(notificationManager);
  _feed.aadAppendChild(widgetContainer);

  loadWidgets();
  printContainers();

  // setWidgetLgCount(3);
}

if (aad_site_url === 'https://github.com/' /* Just Homepage */) {
  /* */
  try {
    clearFeed().then((cleared) => {
      if (cleared) {
        try {
          main();
        } catch (e) {
          console.error('AAD - There was an error in Main', e);
          throw e;
        }
      } else {
        console.log('Failed to clear the feed');
      }
    });
  } catch (e) {
    console.error('AAD - There was an error in clearFeed', e);
    throw e;
  }
}
