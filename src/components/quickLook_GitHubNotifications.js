function initQuickLookOfGitHubNotifications() {
  // Use safe querySelector - GitHub UI may change
  const notificationsButton = $('#AppHeader-notifications-button');
  if (!notificationsButton) {
    return;
  }

  notificationsButton.addEventListener('click', (e) => {
    e.preventDefault();

    const uuid = generateUUID();
    const prefix = prefixer('notification-modal', uuid, 'component');

    const { close } = aad_loading(uuid);
    createFrameModal({
      title: 'GitHub Notifications Preview',
      url: e.target.href,
      selector: (doc) =>
        $('main#js-repo-pjax-container .notifications-list.js-notifications-list', { context: doc }),
      prefix: prefix('modal-github-notifications-preview'),
      onLoaded: (dom) => {
        close();

        if (!dom) {
          return;
        }

        // Use safe DOM utilities for cleanup
        withElement('.Box-header', (header) => {
          header.innerHTML =
            '<span class="aad-small-text" style="margin-left: 16px;">AAD Quick Look - GitHub Notifications</span>';
        }, { context: dom });

        withElements('.js-navigation-container > li', (el) => {
          el.addEventListener('mouseenter', (e) => {
            // Remove elements that don't work in modal context
            $remove('.notification-action-mark-unarchived', { context: e.target });
            $remove('.notification-action-subscribe', { context: e.target });
            $remove('.notification-action-unstar', { context: e.target });
          });
        }, { context: dom });
      },
    });
  });
}

document.addEventListener('onAADLoaded', initQuickLookOfGitHubNotifications);
