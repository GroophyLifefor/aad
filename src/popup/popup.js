document.addEventListener('DOMContentLoaded', function () {
  const input = document.querySelector('#aad-pat');

  input.addEventListener('input', function (e) {
    const value = input.value;
    chrome.storage.local.set({ pat: value }, () => {
      console.log('new PAT token saved.');
    });
  });

  chrome.storage.local.get(['pat'], (items) => {
    input.value = items.pat || '';
    console.log('PAT token embedded.');
  });
});

function reset() {
  chrome.storage.local.remove(['containers'], () => {
    console.log('container config reset.');
  });
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.reload(tabs[0].id);
  });
}

function resetwrc() {
  chrome.storage.local.remove(['widgetResponsibility'], () => {
    console.log('container config reset.');
  });
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.reload(tabs[0].id);
  });
}

document.querySelector('#reset').addEventListener('click', reset);
