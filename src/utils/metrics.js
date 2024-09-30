let isMetricsEnabled = false;

function disableMetrics() {
  isMetricsEnabled = false;
  saveMetricsStatus();
}

function enableMetrics() {
  isMetricsEnabled = true;
  saveMetricsStatus();
}

function saveMetricsStatus() {
  chrome.storage.local.set({ isMetricsEnabled });
}

function getMetricsStatus() {
  return isMetricsEnabled;
}

function loadMetricsStatus() {
  chrome.storage.local.get(['isMetricsEnabled'], (items) => {
    if (items.isMetricsEnabled === false) {
      disableMetrics();
    } else if (items.isMetricsEnabled === true) {
      enableMetrics();
    } else {
      // Disable metrics by default
      disableMetrics();
    }
  });
}

loadMetricsStatus();

const metricPaths = {
  pageLoad: '/api/metrics/pageLoad',
};

function sendMetrics(type, data) {
  return getClientId()
    .then((clientId) => {
      if (!isMetricsEnabled) {
        // if you don't want as client, that's okay :)
        return Promise.reject({
          isError: false,
          error: 'Metrics are disabled',
        });
      }

      if (!metricPaths[type]) {
        fireError('AAD - Invalid metric type', {
          extra: {
            metricPaths,
            type,
          },
        });
        return Promise.reject({
          isError: true,
          error: 'Invalid metric type',
        });
      }

      const url = metricPaths[type];

      return aad_fetch(serverDomain + url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: clientId,
          ...data,
        }),
      });
    })
    .then((response) => {
      if (!response || !response.ok) {
        console.warn('Failed to process metrics', response);
      }
      return response.json();
    })
    .then((data) => {
      return Promise.resolve(data);
    })
    .catch((error) => {
      console.error('Failed to send metrics', error);
      return Promise.reject({
        isError: true,
        error,
      });
    });
}

async function onPageLoad() {
  const response = await sendMetrics('pageLoad', {
    appVersion: chrome.runtime.getManifest().version || 'Unknown',
  });

  if (response?.isNeedUpgrade === 'force') {
    createModal(
      'Hard Min Version',
      { close: false, ms: 50, header: false, padding: '0px' },
      ({ closeModal }) => {
        const uuid = generateUUID();
        const prefix = prefixer('loading', uuid, 'loading');

        addCustomCSS(`

      .${prefix('container')} {
        display: flex;  
        flex-direction: column;
        width: 640px;
      }

      @media (max-width: 800px) { 
        .${prefix('container')} {
          width: 100%;
        } 
      }

      .${prefix('header')} {
        padding: 16px;
        border-radius: 8px 8px 0px 0px;
        border: 1.11px solid rgb(68, 76, 86);
        display: flex;
        justify-content: space-between;
        item-align: center;
        gap: 8px;
      }

      .${prefix('header')} span {
        font-size: 14px; 
        font-weight: 600;
        line-height: 21px;
        font-family: -apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
      }

      .${prefix('footer')} {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        padding: 16px;
        border-radius: 0px 0px 8px 8px;
        border: 1.11px solid rgb(68, 76, 86);
      }

      .${prefix('close')} {
        cursor: pointer;
      } 

      .${prefix('inner')} {
        padding: 16px;
        border: 1.11px solid rgb(68, 76, 86);
        border-top: none;
        border-bottom: none;
        display: flex;
        flex-direction: column;
        gap: 16px;
        position: relative;
      } 
        `);

        const _refs = {};
        const modal = render(
          _refs,
          `
            <div class="${prefix('container')}">
              <div class="${prefix('header')}">
                <span>Hard Min Version</span>
              </div>
              <div class="${prefix('inner')}" ref="inner">
                You've reached the Hard Minimum version. You'll need to update the extension to continue using it. If you absolutely have to do something important, you can turn it off for now, but it will reappear every time you open it.
              </div>
              <div class="${prefix('footer')}">
                <button type="reset" ref="cancel" class="btn ${prefix(
                  'cancel'
                )}" data-close-dialog="" form="repo_metadata_form">Skip it this time</button>
                <a target="_blank" href="${response.extensionStoreUrl}">
                  <button ref="save" type="submit" class="btn btn-primary ${prefix(
                    'submit'
                  )}" form="repo_metadata_form">Update now!</button>
                </a>
              </div>
            </div>
          </div>
        `
        );

        _refs.cancel.addEventListener('click', () => {
          closeModal();
        });
        return modal;
      }
    );
  }

  if (response?.isNeedUpgrade === 'warn') {
    sendNewNotification(
      `You are behind in version, we recommend you to update the extension to the latest version. You can do this by clicking the button below.`,
      {
        type: 'warning',
        timeout: 12000,
        title: 'New versions are live',
        actions: [
          {
            text: 'Update now!',
            type: 'info',
            action: () => {
              window.open(response.extensionStoreUrl, '_blank');
            },
          },
        ],
      }
    );
  }
}
