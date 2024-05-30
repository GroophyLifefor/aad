function getProfileWidget(uuid) {
  const widgetId = uuid;
  const { widget, inner } = createWidget(
    null /* Means I'll add a node later */,
    {
      title: 'Yourself',
      type: 'profile',
      widgetId,
    }
  );

  const prefix = 'aad-custom-widget-profile'

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
        `);

      const profile = render(
        null,
        `
          <div class="${prefix}-inner-container">
            <div class="${prefix}-inner-image-wrapper">
              <img class="${prefix}-inner-image" src="${data.avatar_url}" alt="profile" width="100%" />
            </div>
            <div class="${prefix}-inner-namevbio">
              <h3>
                <a class="no-underline no-wrap aad-custom-smoothie-color-transition" href="https://github.com/GroophyLifefor?tab=following">
                  ${data.name}
                </a>
              </h3>
              <p>${data.bio}</p>
            </div>
            <div class="">
              <a class="Link--secondary aad-custom-smoothie-color-transition no-underline no-wrap" href="https://github.com/GroophyLifefor?tab=followers">
                ${SVG.friends}
                <span class="text-bold color-fg-default">${data.followers}</span>
                followers
              </a>
              · 
              <a class="Link--secondary aad-custom-smoothie-color-transition no-underline no-wrap" href="https://github.com/GroophyLifefor?tab=following">
                <span class="text-bold color-fg-default">${data.following}</span>
                following
              </a>        
            </div>
          </div>
          `
      );

      inner.aadAppendChild(profile);
    });

  return widget;
}
