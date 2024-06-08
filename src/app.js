const aad_site_url = window.location.href;

function loadWidgets() {
  chrome.storage.local.get(['containers'], (items) => {
    // for (let i = 0; i < items.containers.length; i++) {
    //   document.getElementById('container-' + id).innerHTML = '';
    // }

    for (let i = 0; i < items.containers.length; i++) {
      const container = items.containers[i];
      const widgets = container.widgets || [];
      for (let j = 0; j < widgets.length; j++) {
        const widget = widgets[j];
        const widgetUUID = widget.uuid;
        const widgetFunc = widgetReferences[widget.type];

        const widgetInstance = widgetFunc(widgetUUID);
        addWidget(i, widgetInstance);
      }
    }
  });
}

async function main() {
  const _feed = document.querySelector('.application-main > div > div');
  _feed.setAttribute('style', '');

  const widgetContainer = getWidgetContainer();
  const remainingTokens = getRemainingTokens();

  _feed.aadAppendChild(remainingTokens);
  _feed.aadAppendChild(widgetContainer);

  loadWidgets();
  printContainers();
}

if (aad_site_url === 'https://github.com/' /* Just Homepage */) {
  /* */
  clearFeed().then((cleared) => {
    if (cleared) {
      loadWidgetReferences();
      main();
    } else {
      console.log('Failed to clear the feed');
    }
  });
}
