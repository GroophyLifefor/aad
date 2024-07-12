function getRecentActivityWidget(uuid) {
  function createCard(prefix, data, activity) {
    if (data.message === 'Not Found') {
      return null;
    }

    addCustomCSS(`
      .${prefix}-card {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 8px;
        border-radius: 8px;
        background-color: rgb(40, 47, 56, 0.6);
      }

      .${prefix}-card-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .${prefix}-card-top-left {
        display: flex;
        align-items: center;
        gap: 4px;
        padding-right: 16px;
      }

      .${prefix}-card-title {
        display: flex;
        gap: 4px;
        cursor: pointer;
      }

      .${prefix}-card-top-left > div > span {
        font-weight: 400;
        font-size: 0.75rem;
        line-height: 1rem;
        opacity: 0.8;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        transition: opacity 0.3s ease;
      }

      .${prefix}-card-top-left > div > span:hover {
        text-decoration: underline;
        opacity: 1;
      }

      .${prefix}-card-body > span {
        font-size: 0.75rem;
        line-height: 1rem;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
      }

      .${prefix}-card-avatar {
        border-radius: 50%;
      }
    `);

    const refs = {};
    const card = render(
      refs,
      `
      <div class="${prefix}-card">
        <div class="${prefix}-card-top">
          <div class="${prefix}-card-top-left">
            ${activity.type === 'pull-request' ? SVG.prGreen(20, 20) : ''}
            ${activity.type === 'issue' ? SVG.issueGreen(20, 20) : ''}
            <div class="${prefix}-card-title" ref="title">
              <span>${data.title}</span>
              <span>#${data.number}</span>
            </div>
          </div>
          <img src="${
            data.user.avatar_url
          }" class="${prefix}-card-avatar" width="20px" height="20px" alt="card owner avatar" />
        </div>
        <div class="${prefix}-card-body">
          ${
            data.body
              ? `<span>${data.body}</span>`
              : `<span style="color: #778491;">This ${activity.type} does not have a description.</span>`
          }
        </div>
      </div>
      `
    );

    refs.title.addEventListener('click', () => {
      const url = data.html_url;
      const { close } = aad_loading(uuid);
      createFrameModal({
        title: 'Preview',
        url: url,
        selector: (doc) => doc.querySelector('.js-quote-selection-container'),
        prefix: prefix + '-modal-preview',
        //onLoad: aad_sleep(5000),
        onLoaded: () => {
          close();
        },
      });
    });

    const arr = ['pull_request', 'issue', 'issue', 'test'];
    const uniques = [];
    arr.forEach((item) => {
      if (!uniques.includes(item)) uniques.push(item);
    });

    return card;
  }

  const widgetId = uuid;
  const { widget, inner, getTitle, updateTitle } = createWidget(
    null /* Means I'll add a node later */,
    {
      title: 'Recent Activity',
      type: 'recentActivity',
      widgetId,
    }
  );

  const prefix = 'aad-custom-widget-recent-activity';

  addCustomCSS(`
    .${prefix}-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      border-radius: 8px;
    }
  `);

  const refs = {};
  const recentActivityList = render(
    refs,
    `
    <div class="${prefix}-list" ref="list">
    </div>
    `
  );
  const list = refs.list;
  inner.aadAppendChild(recentActivityList);

  addCustomCSS(`
    .${prefix}-vertical {
      padding: 8px;
      display: flex;
      gap: 8px;
      align-items: start;
      flex-direction: column;
    }

    .${prefix}-horizontal {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .${prefix}-green-ball {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: #1f893e;
    }

    .${prefix}-header-title {
      font-size: 0.75rem;
      line-height: 1rem;
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      font-weight: 600;
    }

    .${prefix}-header-desc {
      font-size: 0.75rem;
      line-height: 1rem;
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      opacity: 0.6;
    }
  `);

  const headerRefs = {};
  const header = render(
    headerRefs,
    `<div class="${prefix}-vertical" ref="header">
      <div class="${prefix}-horizontal">
        <div class="${prefix}-green-ball"></div>
        <span class="${prefix}-header-title">My work</span>
      </div>
      <span class="${prefix}-header-desc">Life doesn’t require that we be the best, only that we try our best.</span>
    </div>`
  );

  list.aadAppendChild(header);

  (async () => {
    const title = getTitle();
    const tempGitHubRecentActivity = [...GitHubRecentActivity];
    updateTitle(`${title} - 0/${tempGitHubRecentActivity.length}`);

    for (let i = 0; i < tempGitHubRecentActivity.length; i++) {
      const activity = tempGitHubRecentActivity[i];

      let url = '';
      if (activity.type === 'pull-request') {
        url = `https://api.github.com/repos/${activity.owner}/${activity.repo}/pulls/${activity.number}`;
      } else if (activity.type === 'issue') {
        url = `https://api.github.com/repos/${activity.owner}/${activity.repo}/issues/${activity.number}`;
      }

      await APIRequest(url)
        .then((res) => res.json())
        .then((data) => {
          const card = createCard(prefix, data, activity);
          if (card) {
            list.aadAppendChild(card);
            updateTitle(`${title} - ${i+1}/${tempGitHubRecentActivity.length}`);
          }
        });
    }
    setTimeout(() => {
      updateTitle(title)
    }, 500);
  })();

  return { widget };
}

loadNewWidget('recentActivity', getRecentActivityWidget);
