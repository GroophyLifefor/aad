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

const addingWidgets = [
  {
    name: 'Trending',
    validName: 'trending',
    image: 'https://github.githubassets.com/assets/social-2deb6d7d43e7.jpg',
    description: 'Shows Trending repositories on GitHub',
  },
  {
    name: 'Profile',
    validName: 'profile',
    image: 'https://blog.boot.dev/img/800/github.webp',
    description: "It's very satisfying to see yourself, isn't it?",
  },
  {
    name: 'Entries',
    validName: 'entries',
    image:
      'https://pspdfkit.com/assets/images/blog/2021/how-to-handle-stacked-pull-requests-on-github/article-header-4d509162.png',
    description:
      "If you're too busy with work, this is for you, freely manage and track issues and pull-requests.",
  },
  {
    name: 'ToDo List',
    validName: 'todo',
    image:
      'https://png.pngtree.com/thumb_back/fw800/background/20221206/pngtree-minimalist-todo-list-on-blue-with-coffee-and-notebook-photo-image_42011582.jpg',
    description:
      "You're not the only one with forgetfulness, we can make some sacrifices.",
  },
  {
    name: 'Recent Activities',
    validName: 'recentActivity',
    image:
      'https://www.laurencegellert.com/content/uploads/2015/05/github_contributions.png',
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
  const widget = getWidgetByUUID(uuid);
  if (widget) {
    aad_containers[widget.containerIndex].widgets[widget.widgetIndex].config =
      Object.assign(
        aad_containers[widget.containerIndex].widgets[widget.widgetIndex]
          .config,
        config
      );
  }
  setContainers({ containers: aad_containers });
}

function saveWidgetPosition() {
  function save() {
    const containers = [];
    let isItGoingWell = true;
    for (let i = 0; i < widgetResponsibility.totalWidgetCount; i++) {
      const container = document.getElementById('container-' + i);
      if (!container) {
        isItGoingWell = false;
        continue;
      }
      const childs = Array.prototype.slice.call(container.children);
      let widgets = [];
      for (let j = 0; j < childs.length; j++) {
        const child = childs[j];
        const uuid = child.getAttribute('uuid');
        const widget = getWidgetByUUID(uuid);
        if (!widget) {
          // may newWidget widget but if it will be null
          continue;
        }
        widgets.push({
          type: widget.type,
          uuid: widget.uuid,
          config: widget.config,
        });
      }
      containers.push({
        index: i,
        widgets: widgets,
      });
    }
    if (isItGoingWell) setContainers({ containers: containers });
  }

  save();
  setTimeout(() => {
    save();
  }, 300);
}

function createNewWidget(containerIndex, type) {
  const widgetUUID = generateUUID();
  const containers = aad_containers;
  containers[containerIndex].widgets.push({
    type,
    uuid: widgetUUID,
    config: {
      public: {},
      private: {},
      editModal: {},
    },
  });
  setContainers({ containers });
}
