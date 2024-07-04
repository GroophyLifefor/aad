function addCustomCSS(css) {
  const hash = sha256(css);
  if (Cache.get('css-' + hash)) {
    return Cache.get('css-' + hash).uuid;
  } else {
    const style = document.createElement('style');
    style.innerHTML = css;
    const uuid = generateUUID();
    style.setAttribute('data-uuid', uuid);
    document.head.appendChild(style);
    Cache.set('css-' + hash, { uuid: uuid });
    return uuid;
  }
}

function removeCustomCSS(uuid) {
  const style = document.querySelector(`style[data-uuid="${uuid}"]`);
  if (style) {
    style.remove();
    const hash = sha256(style.innerHTML);
    Cache.remove('css-' + hash);
  }
}