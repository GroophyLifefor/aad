let aad_containers = [];
/**
 * heightType: 'fit' | 'sameHeight' | 'sameHeightWithMinDVH'
 */
let containerSettings = {
  heightType: 'fit',
};

let containersReadyPromise = null;
let storageChain = Promise.resolve();

function chromeStorageGet(keys) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(keys, (items) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(items);
      }
    });
  });
}

function chromeStorageSet(data) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(data, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}

function enqueueStorage(task) {
  const result = storageChain.then(task);
  storageChain = result.catch((e) => {
    console.error('AAD storage queue error:', e);
  });
  return result;
}

function mutateContainers(mutator) {
  return enqueueStorage(async () => {
    const items = await chromeStorageGet(['containers']);
    const containers = structuredClone(items.containers || aad_containers || []);
    const next = mutator(containers);
    aad_containers = next;
    await chromeStorageSet({ containers: next });
    return next;
  });
}

function createDefaultContainers() {
  return [
    {
      index: 0,
      widgets: [
        {
          type: 'profile',
          uuid: generateUUID(),
          config: { public: {}, private: {} },
        },
        {
          type: 'todo',
          uuid: generateUUID(),
          config: { public: {}, private: {} },
        },
      ],
    },
    {
      index: 1,
      widgets: [
        {
          type: 'recentActivity',
          uuid: generateUUID(),
          config: { public: {}, private: {} },
        },
      ],
    },
    {
      index: 2,
      widgets: [
        {
          type: 'entries',
          uuid: generateUUID(),
          config: { public: {}, private: {} },
        },
      ],
    },
    {
      index: 3,
      widgets: [
        {
          type: 'trending',
          uuid: generateUUID(),
          config: { public: {}, private: {} },
        },
      ],
    },
  ];
}

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

function setContainers(containers, { skipQueue = false } = {}) {
  if (skipQueue) {
    chrome.storage.local.set(containers, () => {});
    aad_containers = containers.containers;
    return Promise.resolve(aad_containers);
  }

  return enqueueStorage(async () => {
    await chromeStorageSet(containers);
    aad_containers = containers.containers;
    return aad_containers;
  });
}

function printContainers() {
  const containers = aad_containers || [];
  const widgetLog = [];

  for (let i = 0; i < containers.length; i++) {
    const container = containers[i];
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
}

function addToContainer(containerIndex, widget) {
  mutateContainers((containers) => {
    if (!containers[containerIndex]) {
      return containers;
    }
    containers[containerIndex].widgets.push(widget);
    return containers;
  });
}

function removeFromContainer(widgetUUID) {
  mutateContainers((containers) => {
    for (const container of containers) {
      for (let i = 0; i < container.widgets.length; i++) {
        if (container.widgets[i].uuid === widgetUUID) {
          container.widgets.splice(i, 1);
          break;
        }
      }
    }
    return containers;
  });
}

function initContainers() {
  if (containersReadyPromise) {
    return containersReadyPromise;
  }

  tryLoadContainerSettings();

  containersReadyPromise = new Promise((resolve) => {
    chrome.storage.local.get(['containers'], (items) => {
      if (items.containers) {
        aad_containers = items.containers;
        resolve(aad_containers);
        return;
      }

      console.log('initContainers');
      const containers = createDefaultContainers();
      aad_containers = containers;
      chrome.storage.local.set({ containers }, () => {
        resolve(aad_containers);
      });
    });
  });

  return containersReadyPromise;
}
