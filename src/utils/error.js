function fireError(message, data) {
  if (!!data.error) {
    const e = data.error;
    const error = {
      message: e.message,
      stack: e.stack,
      arguments: e.arguments,
      type: e.type,
      e,
    };

    if (!data) {
      data = {};
    }

    if (!data.extra) {
      data.extra = {};
    }

    data.extra.error = error;
  } else {
    const e = new Error('AAD - Stack trace purposed error');

    const error = {
      message: e.message,
      stack: e.stack,
      arguments: e.arguments,
      type: e.type,
      e,
    };

    data.extra.error = error;
  }

  const user = {
    userAgent: navigator.userAgent,
    deviceMemory: navigator.deviceMemory || -1,
    hardwareConcurrency: navigator.hardwareConcurrency || -1,
    userAgentData: navigator.userAgentData,
  };

  const system = {
    screenWidth: screen.width,
    screenHeight: screen.height,
    colorDepth: screen.colorDepth,
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
  };

  var manifestData = chrome.runtime.getManifest();

  _widgetCounter = { initialized: false };
  try {
    _widgetCounter = JSON.parse(
      JSON.stringify(widgetCounter || { initialized: false })
    );

    for (let key in _widgetCounter) {
      if (_widgetCounter.hasOwnProperty(key)) {
        _widgetCounter[key]--;
      }
    }
  } catch (e) {}

  _widgetResponsibility = { initialized: false };
  try {
    _widgetResponsibility = JSON.parse(JSON.stringify(widgetResponsibility));
  } catch (e) {}

  var tokens = { initialized: false };
  try {
    tokens = JSON.parse(
      JSON.stringify(ratelimitRemaning || { initialized: false })
    );
  } catch (e) {}

  const aad_containers = { initialized: false };
  try {
    aad_containers = JSON.parse(
      JSON.stringify(containers || { initialized: false })
    );
  } catch (e) {}

  const notifications = { initialized: false };
  try {
    notifications = JSON.parse(
      JSON.stringify(notifications || { initialized: false })
    );
  } catch (e) {}

  console.error(message, {
    ...(data.extra || {}),
    user,
    system,
    app: {
      version: manifestData.version,
      widgetResponsibility: _widgetResponsibility,
      widgetCounter: _widgetCounter,
      ratelimitRemaning: tokens,
      aad_containers: aad_containers,
      notifications: notifications,
    },
  });

  setTimeout(() => {
    sendNewNotification(
      "Something went wrong, I'm so sorry for the inconvenience! If it's not too much trouble, could I possibly send the error log to the server so we can work together to find a solution?",
      {
        subData: {
          ...(data.extra || {}),
          appVersion: manifestData.version,
          errorStack: data.extra.error.stack || '',
          errorType: data.extra.error.type || '',
          errorArguments: data.extra.error.arguments || '',
          errorMessage: data.extra.error.message || '',
        },
        type: 'error',
        timeout: 12000,
        title: 'Error Handler',
        actions: [
          {
            text: 'No, thanks',
            type: 'default',
            action: () => {},
          },
          {
            text: 'Send it',
            type: 'success',
            action: () => {
              (async () => {
                aad_fetch(
                  'https://aad.yelix.cloud/api/reportDetailedException',
                  {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      data: {
                        ...(data.extra || {}),
                        appVersion: manifestData.version,
                        errorStack: data.extra.error.stack || '',
                        errorType: data.extra.error.type || '',
                        errorArguments: data.extra.error.arguments || '',
                        errorMessage: data.extra.error.message || '',
                      },
                    }),
                  }
                );
              })();
            },
          },
        ],
      }
    );
  }, 2000);
}

window.onerror = (event, source, lineno, colno, error) => {
  if (!error) {
    fireError('AAD - Uncaught Error', {
      extra: {
        hardHandled: {
          event,
          source,
          lineno,
          colno,
        },
      },
    });
    return false;
  }

  fireError('AAD - Uncaught Error', {
    error,
  });
  return false;
};
