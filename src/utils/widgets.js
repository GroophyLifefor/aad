let widgetReferences = {};

function loadNewWidget(name, fn, editModal) {
  if (!widgetReferences[name]) {
    widgetReferences[name] = {
      fn,
      editModal
    };
  } else {
    console.error('AAD ERROR: Widget already exists');
  }
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
  const containers = [];
  let isItGoingWell = true;
  for (let i = 0; i < 4; i++) {
    const container = document.getElementById('container-' + i);
    if (!container?.children?.length) {
      // aadWARN('Container has no children');
      isItGoingWell = false;
      continue;
    }
    const childs = Array.prototype.slice.call(container.children);
    let widgets = [];
    for (let j = 0; j < childs.length; j++) {
      const child = childs[j];
      const uuid = child.getAttribute('uuid');
      const widget = getWidgetByUUID(uuid);
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
