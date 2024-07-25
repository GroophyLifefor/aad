/**
 * 
   sendNewNotification('Hello World' + i, { type: 'info',
    timeout: 3000,
   });
 */

const notifications = {
  showingCount: 0,
  showingLimit: 3,
  data: [],
};

function sendNewNotification(inner, config) {
  const uuid = generateUUID();
  const event = new CustomEvent('onNewNotification', {
    detail: {
      inner,
      config,
      uuid,
    },
  });
  document.dispatchEvent(event);
  return uuid;
}

function removeNotification(uuid) {
  const $notification = document.querySelector(`[data-uuid="${uuid}"]`);
  removeNotificationByElement(
    $notification,
    (title) => 'aad-global-notification-remove-' + title
  );
}

function removeNotificationByElement(element, pre) {
  addCustomCSS(`
    .${pre('unmount')} {
        animation: ${pre('unmountanim')} 0.3s ease;
      }

      @keyframes ${pre('unmountanim')} {
        from {
          max-height: 100%;
          transform: translateX(0);
        }
        to {
          max-height: 0;
          transform: translateX(100%);
        }
      }`);

  element.classList.add(pre('unmount'));
  setTimeout(() => {
    element.remove();
  }, 250);
}

function getNotificationManager() {
  const uuid = generateUUID();
  const prefix = prefixer('notification-manager', uuid, 'component');

  addCustomCSS(`
    .${prefix('container')} {
      position: absolute;
      bottom: 24px;
      right: 24px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      z-index: ${zIndex.notification};
      overflow: hidden;
    }

    @media (max-width: 420px) {
      .${prefix('container')} {
        width: calc(100dvw - 48px);
      } 
    }
    `);

  const refs = {};
  const container = render(
    refs,
    `
      <div ref="container" class="${prefix('container')}">
      </div>
      `
  );

  document.addEventListener('onNewNotification', (e) => {
    const defaultConfig = {
      type: 'default',
      timeout: null,
      actions: [],
      title: 'Notification',
    };

    const config = { ...defaultConfig, ...e.detail.config };

    const notiUUID = e.detail.uuid;
    const pre = (title) => prefix(notiUUID + '-' + title);

    const colorsByType = {
      info: '#2C4F86',
      success: '#225F39',
      warning: '#B07C13',
      error: '#B0373A',
      default: '#262c34',
    };

    const brightnessColorsByType = {
      info: '#457cd2',
      success: '#2c7f4e',
      warning: '#e6a21c',
      error: '#e64d4d',
      default: '#3a414a',
    };

    const color = colorsByType[config.type] || colorsByType.default;

    addCustomCSS(`
      .${pre('notification')} {
        min-width: 360px;
        padding: 16px;
        border-radius: 8px;
        box-sizing: border-box;
        border: 1px solid #3a414a;
        position: relative;
        background-color: ${color}E6;
        transition: all 0.3s;
        animation: ${pre('fade-in')} 0.3s ease;
      }

      @media (max-width: 420px) {
      .${pre('notification')} {
        min-width: auto;
        width: 100%;
      } 
    }

      .${pre('notification')}:hover {
        background-color: ${color};
        transform: translateY(-4px) translateX(4px) scale(1.05);
      }

      @keyframes ${pre('fade-in')} {
        from {
          transform: translateX(100%);
        }
        to {
          transform: translateX(0);
        }
      }

      .${pre('close')} {
        position: absolute;
        top: 8px;
        right: 8px;
        cursor: pointer;
        user-select: none;
        transition: all 0.3s;
      }

      .${pre('close')}:hover {
        filter: brightness(0.8);
        transform: scale(1.5);
      }

      .${pre('inner')} {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .${pre('title')} {
        font-weight: 500;
        font-size: 14px;
        line-height: 1;
      }

      .${pre('innerText')} {
        font-size: 14px;
        line-height: 1;
      }

      .${pre('actions')} {  
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }      
      `);

    const notiRefs = {};
    const notification = render(
      notiRefs,
      `
        <div ref="notification" class="${pre(
          'notification'
        )}" data-uuid="${notiUUID}">
          <div ref="close" class="${pre('close')}">
            ${SVG.close('16px', '16px')}
          </div>
          <div class="${pre('inner')}">
            <span class="${pre('title')}">${config.title}</span>
            <span class="${pre('innerText')}">${e.detail.inner}</span>
            <div ref="actions" class="${pre('actions')}"></div>
          </div>
        </div>
        `
    );

    config.actions.forEach((action) => {
      const actionUUID = generateUUID();
      const p = (title) => pre('action-' + actionUUID + '-' + title); 

      addCustomCSS(`
        .${p('action')} {
          background-color: ${colorsByType[action.type]};
          border: 1px solid ${brightnessColorsByType[action.type]};
        }

        .${p('action')}:hover {
          background-color: ${brightnessColorsByType[action.type]};
        }
        `);

      const actionRefs = {};
      const actionElement = render(
        actionRefs,
        `
          <button ref="action" type="submit" class="btn btn-primary ${p('action')}" form="repo_metadata_form">${action.text}</button>
          `
      );

      actionRefs.action.addEventListener('click', () => action.action());

      notiRefs.actions.aadAppendChild(actionElement);
    });

    notiRefs.close.addEventListener('click', () =>
      removeNotificationByElement(notiRefs.notification, pre)
    );

    if (!!e.detail.config.timeout) {
      setTimeout(() => {
        // if hovered wait mouseleave
        if (notiRefs.notification.matches(':hover')) {
          notiRefs.notification.addEventListener('mouseleave', () => {
            removeNotificationByElement(notiRefs.notification, pre);
          });
        } else removeNotificationByElement(notiRefs.notification, pre);
      }, e.detail.config.timeout);
    }

    refs.container.aadAppendChild(notification);
  });

  return container;
}
