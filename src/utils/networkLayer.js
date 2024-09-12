const validFetchHosts = [
  'api.github.com',
  'github.com',
  'http://localhost:3000',
  'aad-ext.vercel.app',
  '*', // Allow all requests in waitlist timeline
];

function parseUrl(url) {
  var l = document.createElement('a');
  l.href = url;
  return {
    hostName: l.hostname,
    pathName: l.pathname,
    search: l.search,
  };
}

const aad_fetch = async (url, config) => {
  const isValidHost = validFetchHosts.some(
    (host) => url.includes(host) || host === '*'
  );
  let status = isValidHost ? 'approved' : 'waiting';

  if (!isValidHost) {
    const userResponse = new Promise((resolve) => {
      sendNewNotification(
        `Network Layer detected a request to <strong style="font-size: 16px;color: ${getColor(
          'globalLinkColor'
        )}">${url}</strong>, but it's not allowed, do you want to still proceed?`,
        {
          type: 'warning',
          timeout: 8000,
          title: 'Network Layer',
          onTimeout: () => resolve('denied'),
          actions: [
            {
              text: 'No, thanks',
              type: 'default',
              action: () => resolve('denied'),
            },
            {
              text: 'Send it',
              type: 'success',
              action: () => resolve('approved'),
            },
          ],
        }
      );
    });

    // Wait for the user response
    status = await userResponse;
  }

  if (status === 'denied') {
    return Promise.reject('Request denied by Network Layer');
  }

  return fetch(url, config);
};
