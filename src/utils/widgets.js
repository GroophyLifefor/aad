let widgetReferences = {};

function loadNewWidget(name, fn, editModal) {
  if (!widgetReferences[name]) {
    widgetReferences[name] = {
      fn,
      editModal: editModal || {
        properties: [],
      },
    };
  } else {
    console.error('AAD ERROR: Widget already exists');
  }
}

const WIDGET_IMAGE_BASE =
  'https://raw.githubusercontent.com/GroophyLifefor/aad/refs/heads/main/images';

const addingWidgets = [
  {
    name: 'Trending',
    validName: 'trending',
    image: `${WIDGET_IMAGE_BASE}/Trending.png`,
    description: 'Shows Trending repositories on GitHub',
  },
  {
    name: 'Profile',
    validName: 'profile',
    image: `${WIDGET_IMAGE_BASE}/Profile.png`,
    description: "It's very satisfying to see yourself, isn't it?",
  },
  {
    name: 'Entries',
    validName: 'entries',
    image: `${WIDGET_IMAGE_BASE}/Entries.png`,
    description:
      "If you're too busy with work, this is for you, freely manage and track issues and pull-requests.",
  },
  {
    name: 'ToDo List',
    validName: 'todo',
    image: `${WIDGET_IMAGE_BASE}/TODO.png`,
    description:
      "You're not the only one with forgetfulness, we can make some sacrifices.",
  },
  {
    name: 'Recent Activities',
    validName: 'recentActivity',
    image: `${WIDGET_IMAGE_BASE}/Recent%20Activities.png`,
    description:
      'It is always better to live without forgetting what you did one step before.',
  },
];

async function preloadImage(url) {
  const img = new Image();
  img.src = url;
}

async function preloadImages() {
  addingWidgets.forEach(async (widget) => {
    await preloadImage(widget.image);
  });
}

function getWidgetByUUID(uuid) {
  for (let i = 0; i < aad_containers.length; i++) {
    const container = aad_containers[i];
    for (let j = 0; j < container.widgets.length; j++) {
      const widget = container.widgets[j];
      if (widget.uuid === uuid) {
        return Object.assign(widget, {
          containerIndex: i,
          widgetIndex: j,
        });
      }
    }
  }
  return null;
}

function setConfigByUUID(uuid, config) {
  mutateContainers((containers) => {
    for (let i = 0; i < containers.length; i++) {
      const widgets = containers[i].widgets || [];
      for (let j = 0; j < widgets.length; j++) {
        if (widgets[j].uuid === uuid) {
          widgets[j].config = Object.assign(widgets[j].config, config);
          break;
        }
      }
    }
    return containers;
  });
}

let debouncedSaveWidgetPosition = null;

function runSaveWidgetPosition() {
  mutateContainers((containers) => {
    const configByUuid = {};
    for (const container of containers) {
      for (const widget of container.widgets || []) {
        configByUuid[widget.uuid] = widget;
      }
    }

    const nextContainers = [];
    let isItGoingWell = true;

    for (let i = 0; i < widgetResponsibility.totalWidgetCount; i++) {
      const containerEl = document.getElementById('container-' + i);
      if (!containerEl) {
        isItGoingWell = false;
        continue;
      }

      const childs = Array.prototype.slice.call(containerEl.children);
      const widgets = [];

      for (let j = 0; j < childs.length; j++) {
        const child = childs[j];
        const childUuid = child.getAttribute('uuid');
        const widget = configByUuid[childUuid];
        if (!widget) {
          continue;
        }
        widgets.push({
          type: widget.type,
          uuid: widget.uuid,
          config: widget.config,
        });
      }

      nextContainers.push({
        index: i,
        widgets,
      });
    }

    return isItGoingWell ? nextContainers : containers;
  });
}

function saveWidgetPosition() {
  if (!debouncedSaveWidgetPosition) {
    debouncedSaveWidgetPosition = aad_debounce(runSaveWidgetPosition, 300);
  }
  debouncedSaveWidgetPosition();
}

function createNewWidget(containerIndex, type) {
  mutateContainers((containers) => {
    if (!containers[containerIndex]) {
      return containers;
    }
    containers[containerIndex].widgets.push({
      type,
      uuid: generateUUID(),
      config: {
        public: {},
        private: {},
        editModal: {},
      },
    });
    return containers;
  });
}
