let regularProcesses = [];

async function loadRegularSaveProcess(title, expirationMS, getValueFunction) {
  const regularProcess = {
    title,
    expireDate: expirationMS,
    getValueFunction,
  };
  regularProcesses.push(regularProcess);

  const value = await getRegularProcessFromStorage(title);
  if (value) {
    regularProcess.value = value.value;
  } else {
    regularProcess.value = await getValueFunction();
    await globalSave('regular_process-' + title, {
      title,
      value: regularProcess.value,
      expireDate: Date.now() + expirationMS,
    });
  }
}

(async () => {
  async function checkExpiredRegularProcesses() {
    const _regularProcesses = await getRegularProcessesFromStorage();
    const now = Date.now();
    for (const title of _regularProcesses) {
      const realTitle = title.replace('regular_process-', '');
      const regularProcess = regularProcesses.filter((rp) => rp.title === realTitle)[0];
  
      if (!regularProcess) {
        regularProcesses = regularProcesses.filter((rp) => rp.title !== realTitle);
        removeRegularProcessFromStorage(realTitle);
        console.log('Regular process not found, removing from storage:', realTitle);
        continue;
      }
  
      if (regularProcess.expireDate < now) {
        const value = await regularProcess.getValueFunction();
        console.log('Regular process expired, updating value:', realTitle, value);
        await globalSave('regular_process-' + realTitle, {
          realTitle,
          value,
          expireDate: now + regularProcess.expirationMS,
        });
      }
    }
  }

  setInterval(checkExpiredRegularProcesses, 1000);
})();

async function getRegularProcessesFromStorage() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(null, (items) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        const regularProcesses = Object.keys(items).filter((key) =>
          key.startsWith('regular_process-')
        );
        resolve(regularProcesses);
      }
    });
  });
}

async function removeRegularProcessFromStorage(title) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.remove(['regular_process-' + title], (items) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}

async function getRegularProcessFromStorage(title) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['regular_process-' + title], (items) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(items[title]);
      }
    });
  });
}

async function globalSave(title, value) {
  chrome.storage.local.set({ [title]: value }, () => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    }
  });
}

async function getFromRegularProcessStorage(title) {
  const value = await getRegularProcessFromStorage(title);
  return value.value;
}

// loadRegularSaveProcess('timestamp', 1000 /* every second */, Date.now);
