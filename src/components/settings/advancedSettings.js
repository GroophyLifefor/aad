function getAdvancedSettings() {

  const noSettings = aadRender(
    null,
    `
    <div
      style="
        width: calc(100dvw - 48px); 
        height: calc(100dvh - 80px);
      ">
      <Sidebar 
        outline="${o([
          'Mobile',
          'Tablet',
          'Desktop'])}" 
      />
    </div>
    `
  );

  return {
    node: noSettings,
    refs: null
  }
}