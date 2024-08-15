function Sidebar({ outline, _params }) {
  const uuid = generateUUID();
  const prefix = prefixer('advanced-settings-sidebar', uuid, 'component');
  
  addCustomCSS(`
    .${prefix('container')} {
      max-width: 200px;
      background-color: ${getColor('widget.secondary')};
    `);

  const html = aadRender(
    null,
    `
    <div ${_params}
      class="aad-w-full aad-h-full ${prefix('container')}" 
      ${outline.nmap((row) => {
        return `
          <div class="row">
            ${row}
          </div>
        `;
      })}
    </div>
    `
  );

  return html;
}

loadComponent('sidebar', Sidebar, {
  parameters: [
    {
      type: 'array',
      name: 'outline',
      nullable: false,
    },
  ],
});
