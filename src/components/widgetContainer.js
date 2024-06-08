function applyWidgetResponsibility() {
  const oldCSS = document.querySelector(`[data-uuid="${widgetResponsibility.uuid}"]`);
  if (oldCSS) oldCSS.remove();

  const dynamicWidth =
    widgetResponsibility.horizontalCount == 3
      ? `.add-custom-feed [data-widget-index="3"] {
        grid-column: span 3 / span 3;
      }`
      : ``;

  const css = /*css*/ `
  main {
    width: 100dvw;
    height: 100dvh;
  }

  .feed-background {
    /* width: 100dvw; */
  }

  .add-custom-feed {
    display: grid;
    padding: 10px;
    grid-template-columns: repeat(${widgetResponsibility.horizontalCount}, 1fr);
    grid-template-rows: min-content;
    grid-column-gap: 10px;
    grid-row-gap: 10px;
    overflow-y: auto;
    width: 100%;
    height: calc(100dvh - 66.5px);
  }

  .add-custom-feed > * > * > * {
    overflow: hidden;
  }
  
  @media (max-width: ${widgetResponsibility.breaks.sm.min_px}) {
    .add-custom-feed {
      grid-template-columns: repeat(1, minmax(0, 1fr));
    }
  }
  
  @media (min-width: ${widgetResponsibility.breaks.sm.min_px}) and (max-width: ${widgetResponsibility.breaks.md.max_px}) {
    .add-custom-feed {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  
  
  @media (min-width: ${widgetResponsibility.breaks.lg.min_px}) {
    .add-custom-feed {
      grid-template-columns: repeat(${widgetResponsibility.horizontalCount}, minmax(0, 1fr));
    }

    ${dynamicWidth}
  }

  /*
      grid-template-columns: repeat(${widgetResponsibility.horizontalCount}, minmax(0, 1fr));
      */
  

  .aad-widget-container-wrapper {
    min-height: 2rem;
    min-width: 2rem;
    height: 100%;
    border-radius: 4px;
    padding: 4px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .aad-widget-container-wrapper[drop-hover] {
    background-color: #5a677a;
  }

  .drop-shadow {
    background-color: #3e4754;
  }
  `;

  const uuid = addCustomCSS(css);
  widgetResponsibility.uuid = uuid;

  const event = new CustomEvent('onWidgetsStyled', {  });
  document.dispatchEvent(event);
}

function getWidgetContainer() {
  applyWidgetResponsibility();

  const refs = {};
  const container = render(
    refs,
    `
      <div class="add-custom-feed" ref="main">
      </div>
      `
  );

  for (let i = 0; i < widgetResponsibility.horizontalCount; i++) {
    const feedCardRefs = {};
    const { refs:cardRefs, node: feedCard } = GitHubCard(
      render(
        feedCardRefs,
        `<div id="container-${i}" ref="container" class="aad-widget-container-wrapper"></div>`
      ),
      { isFirst: true, customPadding: '12px' }
    );

    cardRefs.wrapper.setAttribute('data-widget-index', i);

    const container = feedCardRefs.container;

    container.addEventListener('dragover', containerAllowDrop);
    container.addEventListener('drop', containerDrop);
    container.addEventListener('dragleave', containerDragLeave);

    refs.main.aadAppendChild(feedCard);
  }

  return container;
}
