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

          fireError('AAD - There was an error in loadWidgets', {
            error: e,
            extra: {
              widgetInfo,
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
      addWidget(i, widgetInstance, {
        wrapperLayer: true,
      });
    }

    applyDragAndDrop();
  });
}

function applyDragAndDrop() {
  const draggbles = document.querySelectorAll('[widgetContainer="true"]');
  const containers = document.querySelectorAll('[aad-container="true"]');

  draggbles.forEach((draggble) => {
    //for start dragging costing opacity
    draggble.addEventListener('dragstart', () => {
      draggble.classList.add('aad-dragging');
    });

    //for end the dragging opacity costing
    draggble.addEventListener('dragend', () => {
      draggble.classList.remove('aad-dragging');
      saveWidgetPosition();
    });
  });
  //shit
  containers.forEach((container) => {
    const debouncedDragOver = aad_debounce((args) => {
      const afterElement = dragAfterElement(container, args.clientY);
      const dragging = document.querySelector('.aad-dragging');

      if (!dragging) return;

      if (afterElement == null) {
        container.appendChild(dragging);
      } else {
        container.insertBefore(dragging, afterElement);
      }
    }, 10);

    container.addEventListener('dragover', function (e) {
      e.preventDefault();
      debouncedDragOver({
        clientY: e.clientY,
      });
    });
  });

  function dragAfterElement(container, y) {
    const draggbleElements = [
      ...container.querySelectorAll('[widgetContainer="true"]:not(.dragging)'),
    ];

    return draggbleElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }
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
