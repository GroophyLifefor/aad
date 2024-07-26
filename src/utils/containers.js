let aad_containers = [];
/**
 * heightType: 'fit' | 'sameHeight' | 'sameHeightWithMinDVH'
 */
let containerSettings = {
  heightType: 'fit'
};

function tryLoadContainerSettings() {
  chrome.storage.local.get(['containerSettings'], (items) => {
    if (!!items.containerSettings) {
      updateContainerSettings(items.containerSettings);
    }
  });
}

function updateContainerSettings(settings) {
  containerSettings = settings;
  chrome.storage.local.set({ containerSettings: settings }, () => {});
  const event = new CustomEvent('onContainerSettingsUpdated', {  });
  document.dispatchEvent(event);
}

function setContainers(containers) {
  chrome.storage.local.set(containers, () => {});
  aad_containers = containers.containers;
}

function printContainers() {
  chrome.storage.local.get(['containers'], (items) => {
    const widgetLog = [];

    for (let i = 0; i < items.containers.length; i++) {
      const container = items.containers[i];
      const widgets = container.widgets || [];

      for (let j = 0; j < widgets.length; j++) {
        const widget = widgets[j];
        const widgetUUID = widget.uuid;

        widgetLog.push({
          containerIndex: i,
          widgetIndex: j,
          widgetUUID: widgetUUID,
          widgetType: widget.type,
        });
      }
    }

    console.table(widgetLog);
  });
}

function addToContainer(containerIndex, widget) {
  chrome.storage.local.get(['containers'], (items) => {
    const containers = items.containers;
    containers[containerIndex].widgets.push(widget);
    setContainers({ containers: containers });
  });
}

function removeFromContainer(widgetUUID) {
  chrome.storage.local.get(['containers'], (items) => {
    const containers = items.containers;
    for (let container of containers) {
      for (let i = 0; i < container.widgets.length; i++) {
        if (container.widgets[i].uuid === widgetUUID) {
          container.widgets.splice(i, 1);
          break;
        }
      }
    }
    setContainers({ containers: containers });
  });
}

function initContainers() {
  tryLoadContainerSettings();

  chrome.storage.local.get(['containers'], (items) => {
    console.log('items', items);
    if (!!items.containers) {
      aad_containers = items.containers;
    }

    if (!items.containers) {
      console.log('initContainers');
      setContainers({
        containers: [
          {
            index: 0,
            widgets: [
              {
                type: 'profile',
                uuid: generateUUID(),
                config: {
                  public: {},
                  private: {},
                },
              },
              {
                type: 'todo',
                uuid: generateUUID(),
                config: {
                  public: {},
                  private: {},
                },
              },
            ],
          },
          {
            index: 1,
            widgets: [
              {
                type: 'recentActivity',
                uuid: generateUUID(),
                config: {
                  public: {},
                  private: {},
                },
              },
            ],
          },
          {
            index: 2,
            widgets: [
              {
                type: 'entries',
                uuid: generateUUID(),
                config: {
                  public: {},
                  private: {},
                },
              },
            ],
          },
          {
            index: 3,
            widgets: [
              {
                type: 'trending',
                uuid: generateUUID(),
                config: {
                  public: {},
                  private: {},
                },
              },
            ],
          },
        ],
      });
    }
  });
}
