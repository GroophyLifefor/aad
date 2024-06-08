/**
 * AAD Component Memory
 * @returns {function} - A function that returns a component with a unique memory id
 */
function acm() {
  const m = generateUUID();

  return (component) => {
    const c = generateUUID();
    Cache.set(m + c, component);

    return {
      anchor: `<div anchor="true" anchor-data="${m + c}"></div>`,
      node: component.node,
      refs: component.refs,
    };
  };
}

function settingsCard() {
  const m = acm();

  const html = /*html*/ `
  <div class="container">
  
    <h1>Settings</h1>
    ${m(getLoadMoreButton()).anchor}
  </div>
  `;

  const card = aadRender(html);
}
