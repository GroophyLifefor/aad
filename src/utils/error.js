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
    GitHubUsername,
  };

  const system = {
    screenWidth: screen.width,
    screenHeight: screen.height,
    colorDepth: screen.colorDepth,
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
  };

  var manifestData = chrome.runtime.getManifest();
  const _widgetCounter = widgetCounter;
  for (let key in _widgetCounter) {
    if (_widgetCounter.hasOwnProperty(key)) {
      _widgetCounter[key]--;
    }
  }
  const _widgetResponsibility = JSON.parse(
    JSON.stringify(widgetResponsibility)
  );

  console.error(message, {
    ...(data.extra || {}),
    user,
    system,
    app: {
      version: manifestData.version,
      _widgetResponsibility,
      widgetCounter,
      tokens,
      aad_containers,
      GitHubRecentActivity,
      notifications,
    },
  });

  setTimeout(() => {
    sendNewNotification(
      "Something went wrong, I'm so sorry for the inconvenience! If it's not too much trouble, could I possibly send the error log to the server so we can work together to find a solution?"
      + '\n- Error info'
      + '\n- Limited container info'
      + '\n- Limited widget info'
      + '\n- and some other info which might help us to solve the issue.',
      {
        type: 'error',
        timeout: 8000,
        title: 'Error Handler',
        actions: [
          {
            text: 'No, thanks',
            type: 'default',
            action: () => {
              console.log('AWESOME');
            },
          },
          {
            text: 'Send it',
            type: 'success',
            action: () => {
              console.log('AWESOME');
            },
          },
        ],
      }
    );
  }, 2000);
}
