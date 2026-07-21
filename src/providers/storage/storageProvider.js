let regularProcesses = [];

async function loadRegularSaveProcess(title, ttlMS, getValueFunction) {
  const regularProcess = {
    title,
    ttlMS,
    expireAt: Date.now() + ttlMS,
    getValueFunction,
  };
  regularProcesses.push(regularProcess);

  const stored = await getRegularProcessFromStorage(title);
  if (stored?.value != null) {
    regularProcess.value = stored.value;
    regularProcess.expireAt = stored.expireDate ?? regularProcess.expireAt;
  } else {
    regularProcess.value = await getValueFunction();
    await globalSave('regular_process-' + title, {
      title,
      value: regularProcess.value,
      expireDate: regularProcess.expireAt,
    });
  }
}

(async () => {
  async function checkExpiredRegularProcesses() {
    const _regularProcesses = await getRegularProcessesFromStorage();
    const now = Date.now();

    for (const storageKey of _regularProcesses) {
      const realTitle = storageKey.replace('regular_process-', '');
      const regularProcess = regularProcesses.find((rp) => rp.title === realTitle);

      if (!regularProcess) {
        regularProcesses = regularProcesses.filter((rp) => rp.title !== realTitle);
        await removeRegularProcessFromStorage(realTitle);
        console.log('Regular process not found, removing from storage:', realTitle);
        continue;
      }

      if (regularProcess.expireAt < now) {
        const value = await regularProcess.getValueFunction();
        regularProcess.value = value;
        regularProcess.expireAt = now + regularProcess.ttlMS;
        console.log('Regular process expired, updating value:', realTitle, value);
        await globalSave('regular_process-' + realTitle, {
          title: realTitle,
          value,
          expireDate: regularProcess.expireAt,
        });
      }
    }
  }

  setInterval(checkExpiredRegularProcesses, 30000);
})();

async function getRegularProcessesFromStorage() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(null, (items) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        const processKeys = Object.keys(items).filter((key) =>
          key.startsWith('regular_process-')
        );
        resolve(processKeys);
      }
    });
  });
}

async function removeRegularProcessFromStorage(title) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.remove(['regular_process-' + title], () => {
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
        resolve(items['regular_process-' + title] ?? null);
      }
    });
  });
}

async function globalSave(title, value) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [title]: value }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}

async function getFromRegularProcessStorage(title) {
  const value = await getRegularProcessFromStorage(title);
  return value?.value ?? null;
}

// loadRegularSaveProcess('timestamp', 1000 /* every second */, Date.now);
