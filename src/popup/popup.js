document.addEventListener('DOMContentLoaded', function () {
  const input = document.querySelector('#aad-pat');

  input.addEventListener('input', function (e) {
    const value = input.value;
    chrome.storage.local.set({ pat: value }, () => {});
  });

  chrome.storage.local.get(['pat'], (items) => {
    input.value = items.pat || '';
  });
});
