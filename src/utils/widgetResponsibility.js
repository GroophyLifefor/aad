let widgetResponsibility = {
  uuid: '',
  totalWidgetCount: 4,
  currentCount: () => {
    return window.innerWidth <
      convertToPx(widgetResponsibility.breaks.sm.max_px)
      ? widgetResponsibility.breaks.sm.count
      : window.innerWidth < convertToPx(widgetResponsibility.breaks.md.max_px)
      ? widgetResponsibility.breaks.md.count
      : widgetResponsibility.breaks.lg.count;
  },
  breaks: {
    sm: {
      max_px: '768px',
      count: 1,
    },
    md: {
      max_px: '1280px',
      count: 2,
    },
    lg: {
      min_px: '1280px',
      count: 4,
    },
  },
};

function sm() {
  return `@media (max-width: ${widgetResponsibility.breaks.sm.max_px})`;
}

function md() {
  return `@media (min-width: ${widgetResponsibility.breaks.sm.max_px}) and (max-width: ${widgetResponsibility.breaks.md.max_px})`;
}

function lg() {
  return `@media (min-width: ${widgetResponsibility.breaks.md.max_px})`;
}

function loadWidgetResponsibility() {
  chrome.storage.local.get(null, function (items) {
    if (items.widgetResponsibility) {
      widgetResponsibility = Object.assign(
        {
          currentCount: () => {
            return window.innerWidth <
              convertToPx(widgetResponsibility.breaks.sm.max_px)
              ? widgetResponsibility.breaks.sm.count
              : window.innerWidth <
                convertToPx(widgetResponsibility.breaks.md.max_px)
              ? widgetResponsibility.breaks.md.count
              : widgetResponsibility.breaks.lg.count;
          },
        },
        items.widgetResponsibility
      );
      // widgetResponsibility.count max of size counts
      widgetResponsibility.totalWidgetCount = Math.max(
        widgetResponsibility.breaks.sm.count,
        widgetResponsibility.breaks.md.count,
        widgetResponsibility.breaks.lg.count
      );
    } else {
      saveWidgetResponsibility({
        uuid: '',
        totalWidgetCount: 4,
        breaks: {
          sm: {
            max_px: '768px',
            count: 1,
          },
          md: {
            max_px: '1280px',
            count: 2,
          },
          lg: {
            min_px: '1280px',
            count: 4,
          },
        },
      });
    }
  });
}

function saveWidgetResponsibility() {
  chrome.storage.local.set(
    {
      widgetResponsibility: widgetResponsibility,
    },
    () => {}
  );
}

loadWidgetResponsibility();
