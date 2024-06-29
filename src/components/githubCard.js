function GitHubCard(child, config) {
  addCustomCSS(`
    .aad-custom-info-wrapper {
      /*padding: 8px 0px;*/
    }
  
    .aad-custom-info-wrapper-first {
      padding-top: 0px !important;
      padding-bottom: 0px !important;
      width: 100%;
    }
  
    .aad-custom-info-container {
      width: 100%;
      border-radius: 6px;
      padding: ${config['customPadding'] || '16px'};
      background-color: #22272e;
      border: 1px solid #444c56;
    }
  
    .aad-no-horiz-padding {
      padding-left: 0px !important;
      padding-right: 0px !important;
    }
    `);

  const refs = {};
  const parent = render(
    refs,
    `
      <div ref="wrapper" class="aad-custom-info-wrapper ${
        config['isFirst'] ? 'aad-custom-info-wrapper-first' : ''
      }">
        <div class="aad-custom-info-container">
          <div ref="inner">
          </div>
        </div>
      </div>
    `
  );
  refs.inner.aadAppendChild(child);
  return { refs, node: parent };
}