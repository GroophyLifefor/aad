function getClientId() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['clientId'], (items) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
      } else if (items.clientId) {
        resolve(items.clientId);
      } else {
        // Generate a new UUID and save it
        const newClientId = generateUUID();
        chrome.storage.local.set({ clientId: newClientId }, () => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            reject(chrome.runtime.lastError);
          } else {
            resolve(newClientId);
          }
        });
      }
    });
  });
}