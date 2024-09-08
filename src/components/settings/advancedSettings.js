function getAdvancedSettings() {

  const AdvSetRefs = {};
  const AdvSet = render(
    AdvSetRefs,
    `
    <div
      style="
        width: calc(100dvw - 48px); 
        height: calc(100dvh - 80px);
        display: flex;
        gap: 40px;
      "
      ref="container"
      >
    </div>
    `
  );

  const AdvSetContentRefs = {};
  const AdvSetContent = render(
    AdvSetContentRefs,
    `
    <div
      style="
        flex: 1 1 0;
        width: 100%;
        height: 100%;
        max-height: calc(100dvh - 80px);
        overflow: auto;
      "
      class="aad-scroll-y"
      ref="inner"
      >
      

    </div>
    `
  );

  const slider = getSidebar({
    outline: [
      {
        title: 'Appearance',
        svg: 'appearance',
        subTitles: [
          {
            title: 'Height Type'
          },
          {
            title: 'Layout'
          }
        ]
      },
      {
        title: 'Privacy',
        svg: 'key',
        subTitles: [
          {
            title: 'Collect'
          }
        ]
      },
      {
        title: 'Authorization',
        svg: 'key',
        subTitles: [
          {
            title: 'Network Layer Access'
          },
          {
            title: 'PAT'
          }
        ]
      }
    ],
  });

  const appearanceGroup = getSettinsGroup({
    GroupTitle: 'Appearance'
  });
  AdvSetContentRefs.inner.aadAppendChild(appearanceGroup.node);

  AdvSetRefs.container.aadAppendChild(slider);
  AdvSetRefs.container.aadAppendChild(AdvSetContent);

  return {
    node: AdvSet,
    refs: AdvSetRefs
  }
}