function openNotificationsQuickLook(url) {
  const uuid = generateUUID();
  const prefix = prefixer('notification-modal', uuid, 'component');

  const { close } = aad_loading(uuid);
  createFrameModal({
    title: 'GitHub Notifications Preview',
    url,
    selector: (doc) =>
      $(
        'main#js-repo-pjax-container .notifications-list.js-notifications-list',
        { context: doc }
      ) ||
      $('.notifications-list.js-notifications-list', { context: doc }) ||
      $('.js-notifications-list', { context: doc }) ||
      $('.notifications-list', { context: doc }),
    prefix: prefix('modal-github-notifications-preview'),
    onLoaded: (dom) => {
      close();

      if (!dom) {
        return;
      }

      withElement('.Box-header', (header) => {
        header.innerHTML =
          '<span class="aad-small-text" style="margin-left: 16px;">AAD Quick Look - GitHub Notifications</span>';
      }, { context: dom });

      withElements('.js-navigation-container > li', (el) => {
        el.addEventListener('mouseenter', (e) => {
          $remove('.notification-action-mark-unarchived', { context: e.target });
          $remove('.notification-action-subscribe', { context: e.target });
          $remove('.notification-action-unstar', { context: e.target });
        });
      }, { context: dom });
    },
  });
}

function initQuickLookOfGitHubNotifications() {
  if (initQuickLookOfGitHubNotifications.bound) {
    return;
  }
  initQuickLookOfGitHubNotifications.bound = true;

  // Capture on document so GitHub header re-renders can't drop our listener
  document.addEventListener(
    'click',
    (e) => {
      const link = e.target.closest?.(
        '#AppHeader-notifications-button, a[href="/notifications"], a[href*="/notifications"]'
      );
      if (!link || !link.closest('header')) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      openNotificationsQuickLook(link.href);
    },
    true
  );
}

document.addEventListener('onAADLoaded', initQuickLookOfGitHubNotifications);
