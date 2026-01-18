function initQuickLookOfGitHubRepositories() {
  // Use safe querySelector - GitHub UI may change
  const RepositoriesButton = $('a[href*="?tab=repositories"]');
  if (!RepositoriesButton) {
    setTimeout(() => {
      initQuickLookOfGitHubRepositories();
    }, 100);
    return;
  }

  const url = RepositoriesButton.href;
  var new_element = RepositoriesButton.cloneNode(true);
  const parent = $parent(RepositoriesButton);
  if (!parent) return; // Gracefully exit if parent not found
  
  parent.replaceChild(new_element, RepositoriesButton);

  async function removeOldOne() {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  
    for (let i = 0; i < 20; i++) {
      const elements = $$('a[href*="?tab=repositories"]');
      const parent = elements[0] ? $parent(elements[0]) : null;
      const child = parent?.childNodes[1];
      if (child) {
        child.outerHTML = '';
      }
  
      await delay(100);
    }
  }
  removeOldOne();

  new_element.addEventListener('click', (e) => {
    e.preventDefault();

    const uuid = generateUUID();
    // Use centralized preview service
    openRepositoriesTabPreview(url, { uuid, prefix: prefixer('repositories-modal', uuid, 'component') });
  });
}

document.addEventListener('onAADLoaded', initQuickLookOfGitHubRepositories);
