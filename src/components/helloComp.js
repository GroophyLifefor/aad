function Hello({ text, _params }) {
  const html = aadRender(null, 
    `
    <div ${_params}>
      Hello, ${text}!
    </div>
    `
  );

  return html;
}

loadComponent('hello', Hello, {
  parameters: [
    {
      type: 'string',
      name: 'text',
      nullable: false,
    }
  ]
});