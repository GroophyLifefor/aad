const site = window.location.href;

/// TODOS:
/// - get user info async         | https://api.github.com/users/groophylifefor
/// - get repos async             | https://api.github.com/users/GroophyLifefor/repos
/// - get repo async              | ^^
/// - get commits(events) async   | https://api.github.com/repos/GroophyLifefor/Clee/events

async function main() {
  const _feed = document.querySelector('.application-main > div > div');
  _feed.setAttribute('style', '');

  const widgetReferences = {
    profile: getProfileWidget,
    recentActivity: getRecentActivityWidget,
    newWidget: getNewWidgetWidget,
  };

  const widgetContainer = getWidgetContainer();
  const remainingTokens = getRemainingTokens();

  _feed.aadAppendChild(remainingTokens);
  _feed.aadAppendChild(widgetContainer);

  chrome.storage.local.get(['containers'], (items) => {
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

if (site === 'https://github.com/' /* Just Homepage */) {
  /* */
  clearFeed().then((cleared) => {
    if (cleared) {
      main();
    } else {
      console.log('Failed to clear the feed');
    }
  });
}
