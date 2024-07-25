function getProfileWidget(uuid) {
  const widgetId = uuid;
  const { widget, inner } = createWidget(
    CONST_IWillAddLater,
    {
      title: 'Yourself',
      type: 'profile',
      widgetId,
    }
  );

  const prefix = 'aad-custom-widget-profile';

  APIRequest('https://api.github.com/users/' + GitHubUsername)
    .then((res) => res.json())
    .then((data) => {
      addCustomCSS(`
        .${prefix}-inner-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
  
        .${prefix}-inner-image-wrapper {
          display: flex;
          justify-content: start;
          item-align: center;
        }
  
        .${prefix}-inner-image {
          border-radius: 50%;
          max-width: 150px;
        }
  
        .${prefix}-inner-namevbio {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
  
        .aad-custom-smoothie-color-transition {
          transition: color 0.3s ease-out;
        }
  
        .${prefix}-inner-namevbio a {
          color: #c5d1de;
        }
  
        .${prefix}-inner-namevbio a:hover {
          color: #6369ee;
        }

        .${prefix}-inner-population > a {
          cursor: pointer;
        }
        `);

      const refs = {};
      const profile = render(
        refs,
        `
          <div class="${prefix}-inner-container">
            <div class="${prefix}-inner-image-wrapper">
              <img class="${prefix}-inner-image" src="${data.avatar_url}" alt="profile" width="100%" />
            </div>
            <div class="${prefix}-inner-namevbio">
              <h3>
                <span class="no-underline no-wrap aad-custom-smoothie-color-transition">
                  ${data.name || data.login}
                </span>
              </h3>
              <p>${data.bio || `
                <span style="opacity: 0.7; font-style: italic;">
                  No bio provided.
                </span>
                `}</p>
            </div>
            <div class="${prefix}-inner-population">
              <a ref="followers" class="Link--secondary aad-custom-smoothie-color-transition no-underline no-wrap">
                ${SVG.friends}
                <span class="text-bold color-fg-default">${data.followers}</span>
                followers
              </a>
              · 
              <a ref="following"< class="Link--secondary aad-custom-smoothie-color-transition no-underline no-wrap">
                <span class="text-bold color-fg-default">${data.following}</span>
                following
              </a>        
            </div>
          </div>
          `
      );

      refs.followers.addEventListener('click', () => {
        const url = `https://github.com/${GitHubUsername}?tab=followers`;
        createFrameModal({
          title: 'Followers',
          url: url,
          selector: (doc) => doc.querySelector('.Layout-main'),
          prefix: prefix+'-modal-followers',
        })
      });

      refs.following.addEventListener('click', () => {
        const url = `https://github.com/${GitHubUsername}?tab=following`;
        createFrameModal({
          title: 'Following',
          url: url,
          selector: (doc) => doc.querySelector('.Layout-main'),
          prefix: prefix+'-modal-following',
        })
      });

      inner.aadAppendChild(profile);
    });

  return {widget};
}

loadNewWidget('profile', getProfileWidget);