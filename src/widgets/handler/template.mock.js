function getPullRequestWidget(uuid) {
  const { widget, inner } = createWidget(
    CONST_IWillAddLater,
    {
      title: 'Pull Request Bla bla',
      type: 'pull-request',
      widgetId: uuid,
    }
  );

  const prefix = prefixer('pull-request', 'widget');

  function initialize() {

  }

  function preRender() {

  }

  async function asyncRender() {

  }

  initialize();
  preRender();
  asyncRender();

  return widget;
} 