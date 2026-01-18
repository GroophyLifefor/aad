let isSearchInModalInitialized = false;

const myHeaders = new Headers();
myHeaders.append(
  'accept',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
);
myHeaders.append('accept-language', 'en-US,en;q=0.9');
myHeaders.append('cache-control', 'no-cache');
myHeaders.append('pragma', 'no-cache');
myHeaders.append('priority', 'u=0, i');
myHeaders.append(
  'sec-ch-ua',
  '"Brave";v="125", "Chromium";v="125", "Not.A/Brand";v="24"'
);
myHeaders.append('sec-ch-ua-mobile', '?0');
myHeaders.append('sec-ch-ua-platform', '"Windows"');
myHeaders.append('sec-fetch-dest', 'document');
myHeaders.append('sec-fetch-mode', 'navigate');
myHeaders.append('sec-fetch-site', 'same-origin');
myHeaders.append('sec-fetch-user', '?1');
myHeaders.append('sec-gpc', '1');
myHeaders.append('upgrade-insecure-requests', '1');
myHeaders.append(
  'user-agent',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
);

const requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow',
};

const searchInModalConfig = {
  search: {
    title: 'Search Preview',
    url: (urlParameter) =>
      `https://github.com/search?q=${urlParameter}&type=repositories`,
    selector: (doc) => $('main', { context: doc }),
    prefix: 'aad-custom-utils-search-in-modal-modal-search-preview',
    headers: requestOptions,
  },
  repository: {
    title: 'Repository Preview',
    url: (urlParameter) => 'https://github.com' + urlParameter,
    selector: (doc) => $('#js-repo-pjax-container', { context: doc }),
    prefix: 'aad-custom-utils-search-in-modal-modal-repository-preview',
  },
};

function _openSearchInModalModal(searchType, parameters) {
  createFrameModal({
    title: searchInModalConfig[searchType].title,
    url: searchInModalConfig[searchType].url(parameters.url),
    selector: searchInModalConfig[searchType].selector,
    prefix: searchInModalConfig[searchType].prefix,
  });
}

const openSearchInModalModal = aad_debounce((searchType, parameters) => {
  _openSearchInModalModal(searchType, parameters);
}, 250);

function oneTimeSearchInModal() {
  const $searchInput = $('[data-target="query-builder.input"]');
  const $giveFeedbackSpan = $('.search-feedback-prompt > button > span > span');
  
  if (!$searchInput || !$giveFeedbackSpan) return;

  $searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      // createFrameModal({
      //   title: 'Search Preview',
      //   url: `https://github.com/search?q=${$searchInput.value}&type=repositories`,
      //   selector: (doc) => doc.querySelector('main'),
      //   prefix: '',
      //   headers: requestOptions,
      // });

      openSearchInModalModal('search', {
        url: searchInput.value,
      });

      return;
    }

    $giveFeedbackSpan.innerHTML = '⌛ Give feedback';
    setTimeout(() => {
      searchInModal();
      $giveFeedbackSpan.innerHTML = '✅ Give feedback';
    }, 400);
  });
}

function searchInModal() {
  if (!isSearchInModalInitialized) {
    oneTimeSearchInModal();
    isSearchInModalInitialized = true;
  }
  const $search = $('.search-suggestions');
  const $searchButton = $('button[type="button"][aria-label^="Search or jump"]');
  const $giveFeedbackSpan = $('.search-feedback-prompt > button > span > span');
  const $resultsList = $('.ActionListWrap[data-target="query-builder.resultsList"]');

  // Gracefully exit if elements not found (GitHub UI may have changed)
  if (!$search || !$giveFeedbackSpan) return;

  $giveFeedbackSpan.innerHTML = '⌛ Give feedback';

  const isHidden = $search.getAttribute('hidden');
  if (typeof isHidden === 'string') {
    $searchButton.addEventListener('click', async (e) => {
      function lookOrWait() {
        if ($resultsList.childElementCount > 1) return true;
        return false;
      }

      let isReady = lookOrWait();
      while (!isReady) {
        await aad_sleep(100);
        isReady = lookOrWait();
      }
      // To guarantee the search results are ready
      aad_sleep(100);

      searchInModal();
      $giveFeedbackSpan.innerHTML = '✅ Give feedback';
    });
    return;
  }

  const $links = $search.querySelectorAll('a');
  for (let i = 0; i < $links.length; i++) {
    const $link = $links[i];
    $link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = $link.getAttribute('href');
      const typeHeader = $closest($link, 'li')?.querySelector('h3');
      const type = typeHeader?.innerText?.trim() || '';
      if (type === 'Repositories') {
        // createFrameModal({
        //   title: 'Repository Preview',
        //   url: 'https://github.com' + href,
        //   selector: (doc) => doc.querySelector('#js-repo-pjax-container'),
        //   prefix: 'aad-custom-utils-search-in-modal-modal-repository-preview',
        // });
        openSearchInModalModal('repository', {
          url: href,
        });
      }
    });
  }
}
