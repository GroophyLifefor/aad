function initQuickLookOfGitHubRepositories() {
  const RepositoriesButton = document.querySelector(
    'a[href*="?tab=repositories"]'
  );
  if (!RepositoriesButton) {
    // console.warn(
    //   'My Repositories button not found <-- initQuickLookOfGitHubRepositories()'
    // );

    setTimeout(() => {
      initQuickLookOfGitHubRepositories();
    }, 100);
    return;
  }

  // console.log(
  //   'My Repositories button found <-- initQuickLookOfGitHubRepositories()',
  //   RepositoriesButton
  // );
  const url = RepositoriesButton.href;
  var new_element = RepositoriesButton.cloneNode(true);
  const parent = RepositoriesButton.parentNode;
  parent.replaceChild(new_element, RepositoriesButton);

  async function removeOldOne() {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  
    for (let i = 0; i < 20; i++) {
      const elements = document.querySelectorAll('a[href*="?tab=repositories"]');
      const parent = elements[0]?.parentNode;
      const child = parent?.childNodes[1];
      if (child) {
        child.outerHTML = '';
      }
  
      await delay(100); // wait for 100ms before the next iteration
    }
  }
  removeOldOne();

  new_element.addEventListener('click', (e) => {
    e.preventDefault();

    const uuid = generateUUID();
    const prefix = prefixer('repositories-modal', uuid, 'component');

    const { close } = aad_loading(uuid);
    createFrameModal({
      title: 'GitHub Repositories Preview',
      url,
      selector: (doc) => doc.querySelector('main .Layout-main'),
      prefix: prefix('modal-github-repositories-preview'),
      onLoaded: (dom) => {
        close();

        if (!dom) {
          return;
        }

        dom.querySelectorAll('.starring-container').forEach((el) => {
          const buggyVerticalBar = el.nextElementSibling;
          buggyVerticalBar?.remove();
        });
      },
    });
  });
}

document.addEventListener('onAADLoaded', initQuickLookOfGitHubRepositories);
