function initQuickLookOfGitHubNotifications() {
  const notificationsButton = document.getElementById(
    'AppHeader-notifications-button'
  );
  if (!notificationsButton) {
    console.warn(
      'Notifications button not found <-- initQuickLookOfGitHubNotifications()'
    );
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
        doc.querySelector(
          'main#js-repo-pjax-container .notifications-list.js-notifications-list'
        ),
      prefix: prefix('modal-github-notifications-preview'),
      onLoaded: (dom) => {
        close();

        if (!dom) {
          return;
        }

        const header = dom.querySelector('.Box-header');
        if (header) {
          header.innerHTML =
            '<span class="aad-small-text" style="margin-left: 16px;">AAD Quick Look - GitHub Notifications</span>';
        }

        const eachBox = dom.querySelectorAll('.js-navigation-container > li');
        if (eachBox) {
          eachBox.forEach((el) => {
            el.addEventListener('mouseenter', (e) => {
              const unarchived = e.target.querySelector(
                '.notification-action-mark-unarchived'
              );
              if (unarchived) {
                unarchived.remove();
              }

              const subscribe = e.target.querySelector(
                '.notification-action-subscribe'
              );
              if (subscribe) {
                subscribe.remove();
              }

              const unstar = e.target.querySelector('.notification-action-unstar');
              if (unstar) {
                unstar.remove();
              }
            });
          });
        }
      },
    });
  });
}

document.addEventListener('onAADLoaded', initQuickLookOfGitHubNotifications);
