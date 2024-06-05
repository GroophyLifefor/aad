function getWidgetContainer() {
  addCustomCSS(`
    .add-custom-feed {
      width: 100%;
      display: grid;
      padding: 10px;
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: 1fr;
      grid-column-gap: 10px;
      grid-row-gap: 10px;
    }

    .add-custom-feed:nth-child(1) {
      grid-area: 1 / 1 / 2 / 2;
    }

    .add-custom-feed-two-per-row:nth-child(1) {
      grid-area: 1 / 1 / 2 / 2;
    }

    .add-custom-feed-one-per-row:nth-child(1) {
      grid-area: 1 / 1 / 2 / 2;
    }

    .add-custom-feed:nth-child(2) {
      grid-area: 1 / 2 / 2 / 3;
    }

    .add-custom-feed-two-per-row:nth-child(2) {
      grid-area: 1 / 2 / 2 / 3;
    }

    .add-custom-feed-one-per-row:nth-child(2) {
      grid-area: 2 / 1 / 3 / 2;
    }

    .add-custom-feed:nth-child(3) {
      grid-area: 1 / 3 / 2 / 4;
    }

    .add-custom-feed-two-per-row:nth-child(3) {
      grid-area: 2 / 1 / 3 / 2
    }

    .add-custom-feed-one-per-row:nth-child(3) {
      grid-area: 3 / 1 / 4 / 2;
    }

    .add-custom-feed:nth-child(4) {
      grid-area: 1 / 4 / 2 / 5;
    }

    .add-custom-feed-two-per-row:nth-child(4) {
      grid-area: 2 / 2 / 3 / 3
    }

    .add-custom-feed-one-per-row:nth-child(4) {
      grid-area: 4 / 1 / 5 / 2;
    }

    .add-custom-feed-two-per-row {
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: auto;

    } 

    .add-custom-feed-one-per-row {
      grid-template-columns: 1fr;
      grid-template-rows: repeat(4, auto);
    } 
  
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
    `);

  const refs = {};
  const container = render(
    refs,
    `
      <div class="add-custom-feed" ref="main">
      </div>
      `
  );

  for (let i = 0; i < horizontalWidgetCount; i++) {
    const feedCardRefs = {};
    const feedCard = GitHubCard(
      render(
        feedCardRefs,
        `<div id="container-${i}" ref="container" class="aad-widget-container-wrapper"></div>`
      ),
      { isFirst: true, customPadding: '12px' }
    );

    const container = feedCardRefs.container;

    container.addEventListener('dragover', containerAllowDrop);
    container.addEventListener('drop', containerDrop);
    container.addEventListener('dragleave', containerDragLeave);

    refs.main.aadAppendChild(feedCard);
  }

  return container;
}
