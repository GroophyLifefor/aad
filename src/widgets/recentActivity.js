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
          <span>${data.body}</span>
        </div>
      </div>
      `
    );

    refs.title.addEventListener('click', () => {
      const url = data.html_url;
      fetch(url)
        .then((res) => res.text())
        .then((data) => {
          const parser = new DOMParser();
          const htmlDocument = parser.parseFromString(data, 'text/html');
          // const conversation = htmlDocument.querySelector(
          //   '.js-quote-selection-container > .js-discussion'
          // );
          const conversation = htmlDocument.querySelector(
            '.js-quote-selection-container'
          );

          const addAComment = htmlDocument.querySelector('.discussion-timeline-actions');
          addAComment.setAttribute('style', 'background-color: transparent;');

          createModal('Preview', ({ closeModal }) => {
            addCustomCSS(`
              .${prefix}-iframe {
                width: 100%;
                height: 100%;
                border-radius: 8px;
              }

              .${prefix}-preview {
                display: flex;
                flex-direction: column;
                gap: 8px;
                padding: 8px;
                border-radius: 8px;
              }
    
              .${prefix}-preview-external-link-container {
                display: flex;
                gap: 4px;
                align-items: center;
              }
    
              .${prefix}-preview-external-link {
                font-weight: 500;
                font-size: 0.75rem;
                line-height: 1rem;
                overflow: hidden;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
              }
    
              .${prefix}-preview-external-link:hover {
                text-decoration: underline;
              }
            `);

            const _refs = {};
            const modal = render(
              _refs,
              `
              <div class="${prefix}-preview">
                <a target="_blank" href="${url}" class="${prefix}-preview-external-link-container">
                  ${SVG.externalLink(16, 16)}
                  <span class="${prefix}-preview-external-link">
                    Open in new tab
                  </span>
                </a>
                <div ref="inner">

                </div>
              </div>
              `
            );

            _refs.inner.aadAppendChild(conversation);
            return modal;
          });
        });
    });

    return card;
  }

  const widgetId = uuid;
  const { widget, inner } = createWidget(
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
    const tempGitHubRecentActivity = [...GitHubRecentActivity];

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
          if (card) list.aadAppendChild(card);
        });
    }
  })();

  return widget;
}
