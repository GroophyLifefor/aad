const tokens = {
  anonymous: {
    remaining: -1,
    limit: 60,
  },
  authenticated: {
    remaining: -1,
    limit: 5000,
  },
};

async function APIRequest(url, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const pat = await getPatFromStorage();

  if (pat === 'deny-all') {
    return {
      status: 403,
      json: () => ({ status: 403, data: 'Access denied.' }),
    }; 
  }

  const isValidToken = await checkIsValidToken(pat);

  options.headers = {
    ...defaultHeaders,
    ...options.headers,
  };

  if (pat && isValidToken) {
    options.headers['Authorization'] = `token ${pat}`;
  }

  try {
    const response = await aad_fetch(url, options);
    const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
    const rateLimitLimit = response.headers.get('X-RateLimit-Limit');

    if (rateLimitRemaining && rateLimitLimit) {
      if (pat && isValidToken) {
        tokens.authenticated.remaining = rateLimitRemaining;
        tokens.authenticated.limit = rateLimitLimit;
      } else {
        tokens.anonymous.remaining = rateLimitRemaining;
        tokens.anonymous.limit = rateLimitLimit;
      }
    }

    onRemainingTokenChanged();
    return response;
  } catch (error) {
    console.error('Error making API request:', error);
    throw error;
  }
}

function getPatFromStorage() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['pat'], (items) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(items.pat || '');
      }
    });
  });
}

function getPatFromStorageCB(callback) {
  chrome.storage.local.get(['pat'], (items) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      callback('');
    } else {
      callback(items.pat || '');
    }
  });
}

function setPatToStorage(pat) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ pat }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        sendNewNotification('PAT Token is updated.', {
          type: 'info',
          timeout: 5000,
          title: 'Recomended action',
          actions: [
            {
              text: 'Reload page (Reinitializes scripts)',
              type: 'info',
              action: () => {
                window.location.reload();
              },
            },
          ],
        });
        resolve();
      }
    });
  });
}

async function checkIsValidToken(token) {
  const fetched = await aad_fetch('https://api.github.com/user', {
    headers: {
      Authorization: `token ${token}`,
    },
  });
  return fetched.status === 200;
}

async function onRemainingTokenChanged() {
  const event = new CustomEvent('onRemainingTokenChanged', {
    detail: tokens,
  });
  document.dispatchEvent(event);
}
