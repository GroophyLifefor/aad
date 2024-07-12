const aad_site_url = window.location.href;

/* ----
 * DONE       Settings components (UI DONE, INPUTS WIP, LOGIC TODO)
 * DONE       Better customizeable responsibility
 * DONE       New widgets widget
 * DONE       Settings of widgets (config.public)
 * DONE       Global Notification
 * TODO       Entries editModal
 */

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

        const { widget: widgetInstance } = widgetFunc(widgetUUID, {
          containerIndex: i,
        });
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
  clearFeed().then((cleared) => {
    if (cleared) {
      main();
    } else {
      console.log('Failed to clear the feed');
    }
  });
}
