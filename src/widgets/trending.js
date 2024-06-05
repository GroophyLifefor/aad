function getTrendingWidget(uuid) {
  const { widget, inner } = createWidget(CONST_IWillAddLater, {
    title: 'Trending',
    type: 'trending',
    widgetId: uuid,
  });
  const prefix = prefixer('trending', 'widget');
  const refs = {};

  function buildHTML() {
    const html = render(
      refs,
      `
        <div ref="container" class="${prefix('container')}">
          
        </div>
        `
    );
    inner.aadAppendChild(html);
  }

  function buildCSS() {
    addCustomCSS(`
    .${prefix('container')} {

    }
    `);
  }

  async function onRender() {
    function create(data) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, 'text/html');
      const trending = doc.querySelector('main > .container-lg > .Box');
      refs.container.aadAppendChild(trending);
    }

    const url = 'https://github.com/trending';
    if (Cache.has(url)) {
      create(Cache.get(url));
    } else {
      fetch(url)
        .then((res) => res.text())
        .then((data) => {
          Cache.set(url, data);
          create(data);
        });
    }
  }

  function buildJS() {
    onRender();
  }

  buildHTML();
  buildCSS();
  buildJS();
  return widget;
}
