function getTodoWidget(uuid) {
  let { widget, inner, updateTitle } = createWidget(CONST_IWillAddLater, {
    title: 'Todo',
    type: 'todo',
    widgetId: uuid,
  });
  const prefix = prefixer('todo', uuid, 'widget');
  let refs = {};
  let isApplyingJS = false;

  // Start Widget Data
  const widgetData = getWidgetByUUID(uuid);
  let todos = widgetData.config.public.todos || [];
  setConfigByUUID(uuid, { public: { todos } });
  // End   Widget Data

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function getContrastYIQ(hexcolor) {
    hexcolor = hexcolor.replace('#', '');
    const r = parseInt(hexcolor.substr(0, 2), 16);
    const g = parseInt(hexcolor.substr(2, 2), 16);
    const b = parseInt(hexcolor.substr(4, 2), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? 'black' : 'white';
  }

  function convertUrlsToLinks(text) {
    if (!text) return text;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" class="${prefix('description-link')}">${url}</a>`;
    });
  }

  function buildTemplate() {
    const old = document.querySelector(`.${prefix('group')}`);
    if (old) {
      refs = {};
      old.remove();
    }

    addCustomCSS(`
      .${prefix('group')} {
        padding-left: 8px;
        position: relative;
      }

      .${prefix('container')} {
        display: flex;
        flex-direction: column;
        border-top: 1px solid #3a414a80;
      }

      .${prefix('container')} > div {
        border-bottom: 1px solid #3a414a80;
        padding: 16px;
        display: flex;
        gap: 16px;
      }

      .checkbox-wrapper-12 {
    position: relative;
  }
  .checkbox-wrapper-12 > svg {
    position: absolute;
    top: -130%;
    left: -170%;
    width: 110px;
    pointer-events: none;
  }
  .checkbox-wrapper-12 * {
    box-sizing: border-box;
  }
  .checkbox-wrapper-12 input[type="checkbox"] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    -webkit-tap-highlight-color: transparent;
    cursor: pointer;
    margin: 0;
  }
  .checkbox-wrapper-12 input[type="checkbox"]:focus {
    outline: 0;
  }
  .checkbox-wrapper-12 .cbx {
    width: 24px;
    height: 24px;
    top: calc(50vh - 12px);
    left: calc(50vw - 12px);
  }
  .checkbox-wrapper-12 .cbx input {
    position: absolute;
    top: 0;
    left: 0;
    width: 24px;
    height: 24px;
    border: 2px solid #bfbfc0;
    border-radius: 50%;
  }
  .checkbox-wrapper-12 .cbx label {
    width: 24px;
    height: 24px;
    background: none;
    border-radius: 50%;
    position: absolute;
    top: 0;
    left: 0;
    -webkit-filter: url("#goo-12");
    filter: url("#goo-12");
    transform: translate3d(0, 0, 0);
    pointer-events: none;
  }
  .checkbox-wrapper-12 .cbx svg {
    position: absolute;
    top: 5px;
    left: 4px;
    z-index: 1;
    pointer-events: none;
  }
  .checkbox-wrapper-12 .cbx svg path {
    stroke: #fff;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 19;
    stroke-dashoffset: 19;
    transition: stroke-dashoffset 0.3s ease;
    transition-delay: 0.2s;
  }
  .checkbox-wrapper-12 .cbx input:checked + label {
    animation: splash-12 0.6s ease forwards;
  }
  .checkbox-wrapper-12 .cbx input:checked + label + svg path {
    stroke-dashoffset: 0;
  }
  @-moz-keyframes splash-12 {
    40% {
      background: #316dca;
      box-shadow: 0 -18px 0 -8px #316dca, 16px -8px 0 -8px #316dca, 16px 8px 0 -8px #316dca, 0 18px 0 -8px #316dca, -16px 8px 0 -8px #316dca, -16px -8px 0 -8px #316dca;
    }
    100% {
      background: #316dca;
      box-shadow: 0 -36px 0 -10px transparent, 32px -16px 0 -10px transparent, 32px 16px 0 -10px transparent, 0 36px 0 -10px transparent, -32px 16px 0 -10px transparent, -32px -16px 0 -10px transparent;
    }
  }
  @-webkit-keyframes splash-12 {
    40% {
      background: #316dca;
      box-shadow: 0 -18px 0 -8px #316dca, 16px -8px 0 -8px #316dca, 16px 8px 0 -8px #316dca, 0 18px 0 -8px #316dca, -16px 8px 0 -8px #316dca, -16px -8px 0 -8px #316dca;
    }
    100% {
      background: #316dca;
      box-shadow: 0 -36px 0 -10px transparent, 32px -16px 0 -10px transparent, 32px 16px 0 -10px transparent, 0 36px 0 -10px transparent, -32px 16px 0 -10px transparent, -32px -16px 0 -10px transparent;
    }
  }
  @-o-keyframes splash-12 {
    40% {
      background: #316dca;
      box-shadow: 0 -18px 0 -8px #316dca, 16px -8px 0 -8px #316dca, 16px 8px 0 -8px #316dca, 0 18px 0 -8px #316dca, -16px 8px 0 -8px #316dca, -16px -8px 0 -8px #316dca;
    }
    100% {
      background: #316dca;
      box-shadow: 0 -36px 0 -10px transparent, 32px -16px 0 -10px transparent, 32px 16px 0 -10px transparent, 0 36px 0 -10px transparent, -32px 16px 0 -10px transparent, -32px -16px 0 -10px transparent;
    }
  }
  @keyframes splash-12 {
    40% {
      background: #316dca;
      box-shadow: 0 -18px 0 -8px #316dca, 16px -8px 0 -8px #316dca, 16px 8px 0 -8px #316dca, 0 18px 0 -8px #316dca, -16px 8px 0 -8px #316dca, -16px -8px 0 -8px #316dca;
    }
    100% {
      background: #316dca;
      box-shadow: 0 -36px 0 -10px transparent, 32px -16px 0 -10px transparent, 32px 16px 0 -10px transparent, 0 36px 0 -10px transparent, -32px 16px 0 -10px transparent, -32px -16px 0 -10px transparent;
    }
  }

      .${prefix('checkbox')} {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        margin-top: 4px;
    }

      .${prefix('content')} {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

      .${prefix('details')} {
        display: flex;
        gap: 8px;
        align-items: center;
    }

      .${prefix('details-date')} {
        display: flex;
        gap: 4px;
        align-items: center;
    }

      .${prefix('details-date')} svg {
        margin-bottom: 2px;
    }

      .${prefix('title')} {
        font-size: 20px;
        font-weight: 500;
    }

      .${prefix('description')} {
        font-size: 12px;
        font-weight: 400;
        color: #778491CC;
    }

      .${prefix('description-link')} {
        color: ${getColor('globalLinkColor') || '#58a6ff'};
        text-decoration: none;
        cursor: pointer;
      }

      .${prefix('description-link')}:hover {
        text-decoration: underline;
      }

      .${prefix('badges')} {
        display: flex;
        gap: 8px;
    }

      .${prefix('new-container')} {
        border-bottom: none !important;
        display: flex !important;
        padding-left: 8px !important;
        padding-bottom: 0px !important;
        align-items: flex-start !important;
    }

      .${prefix('expand')} {
        cursor: pointer;
        border-radius: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: background-color 0.3s;
        display: flex;
        flex-direction: column;
        item-align: center;
        gap: 4px;
        padding: 4px 8px;
        user-select: none;
    }

      .${prefix('expand')} span {
        font-size: 11px;
        font-weight: 400;
        color: #778491;
        text-wrap: nowrap;
      }
        
      .${prefix('expand')}:hover {
        background-color: #3a414a80;
    }

      .${prefix('new-todo-container')} {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
        height: fit-content;
        transition: all 0.3s;
    }

      .${prefix('new-todo-contents')} {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
    }

    .${prefix('new-todo-contents')} input {
      width: 100%;
      background-color: #3a414a;
      border: none;
      outline: none;
      padding: 8px;
      font-size: 16px;
      font-weight: 600;
      border-radius: 8px;
    }

    .${prefix('new-todo-contents')} textarea {
      width: 100%;
      background-color: #3a414a;
      resize: none;
      border: none;
      outline: none;
      padding: 4px 8px;
      border-radius: 8px;
      height: 80px;
    }

    .${prefix('close')} {
      height: 0;
      overflow: hidden;
    }

    .${prefix('new-todo-footer')} {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .${prefix('new-todo-details')} {
      display: flex;
      gap: 8px;
      align-items: center;
      position: relative;
    }

    .${prefix('new-todo-details')} input[type="date"] {
      background-color: #3a414a;
      border: none;
      padding: 6px 8px;
      border-radius: 8px;
      outline: none;
      color: #778491;
    }

    .${prefix('new-todo-details')} input[type="text"] {
      background-color: #3a414a;
      border: none;
      padding: 6px 8px;
      border-radius: 8px;
      outline: none;
      width: 100px;
    }

      .${prefix('new-todo-end-date-text')} {
        position: absolute;
        top: 9px;
        left: 0;
        transform: translateX(-60px);
        font-size: 12px;
        color: #778491;
        font-weight: 500;

    }

      .${prefix('refresh-container')} {
        position: absolute; 
        top: 0;
        right: 0;
        padding: 8px;
        cursor: pointer;
    }

    .${prefix('refresh-container')}:hover {
      filter: brightness(0.8);
    }

      .${prefix('new-todo-color')} {
        position: absolute;
        right: 0;
        margin-right: 8px;
      }

      .${prefix('new-todo-color')} input {
        width: 24px;
        height: 24px;
        background-color: transparent;
        cursor: pointer;
        outline: none;
        border: none;
      }
      
      `);

    const checkbox = (isChecked, todoUuid) => {
      const checkboxId = `cbx-${todoUuid}`;
      return `<div class="checkbox-wrapper-12">
                  <div class="cbx">
                    <input id="${checkboxId}" type="checkbox" ${
                      isChecked ? 'checked' : ''
                    }/>
                    <label for="${checkboxId}"></label>
                    <svg width="15" height="14" viewbox="0 0 15 14" fill="none">
                      <path d="M2 8.36364L6.23077 12L13 2"></path>
                    </svg>
                  </div>
                  <!-- Gooey-->
                  <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                    <defs>
                      <filter id="goo-12">
                        <fegaussianblur in="SourceGraphic" stddeviation="4" result="blur"></fegaussianblur>
                        <fecolormatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -7" result="goo-12"></fecolormatrix>
                        <feblend in="SourceGraphic" in2="goo-12"></feblend>
                      </filter>
                    </defs>
                  </svg>
                </div>`;
    };

    const html = render(
      refs,
      `
        <div class="${prefix('group')}">
          <div ref="refresh" class="${prefix('refresh-container')}">
            ${SVG.refresh('20px', '20px')}
          </div>
          <div ref="container" class="${prefix('container')}">
            ${todos
              .map((todo, index) => {
                if (todo.isCompleted) return '';

                let dateObject = new Date(todo.endDate);
                let currentDate = new Date();
                let farAsDays = isNaN(dateObject.getTime()) ? 0 : Math.floor(
                  (dateObject - currentDate) / (1000 * 60 * 60 * 24)
                );
                let isExpired = !isNaN(dateObject.getTime()) && dateObject < currentDate;
                const colorData = {
                  expired: '#a74b47',
                  upcoming: '#f1e05aE6',
                  default: '#66727d',
                }

                const state =
                  farAsDays === -1
                    ? 'upcoming'
                    : isExpired
                    ? 'expired'
                    : 'default';

                const color = colorData[state];

                return `
                <div todo-uuid="${todo.uuid}">
              <div class="${prefix('checkbox')}">
                ${checkbox(todo.isCompleted, todo.uuid)}
              </div>
              <div class="${prefix('content')}">
                <span class="${prefix('title')}">${todo.title}</span>
                <span class="${prefix('description')}">${
                  todo.description ? convertUrlsToLinks(todo.description) : 'No description'
                }</span>
                <div class="${prefix('details')}">
                  <div class="${prefix('details-date')}">
                    ${SVG.calendar('16px', '16px', color)}
                    <span style="color: ${color};">${todo.endDate}${state === 'upcoming' ? ' (upcoming)' : ''}${state === 'expired' ? ' (expired)' : ''}</span>
                  </div>
                  ${(Array.isArray(todo.badges) && todo.badges.length > 0) ? '<span>·</span>' : ''}
                  <div class="${prefix('badges')}">
                    ${(Array.isArray(todo.badges) ? todo.badges : [])
                      .map((badge) => {
                        let color = badge.backgroundColor || getRandomColor();
                        color = color.replace('#', '');
                        const innerColor = getContrastYIQ(color);

                        addCustomCSS(`
                        .${prefix(`badge-${color}-${innerColor}`)} {
                          background-color: #${color};
                          padding: 2px 8px;
                          border-radius: 16px;
                          color: ${innerColor};
                          font-size: 11px;
                          font-weight: 500;
                        }
                      `);

                        return `<div class="${prefix(
                          `badge-${color}-${innerColor}`
                        )}">
                      <span>${badge.text}</span>
                    </div>`;
                      })
                      .join('')}
                  </div>
                </div>
              </div>
            </div>`;
              })
              .join('')}
            <div ref="newContainer" class="${prefix('new-container')}">
              <div ref="expand" class="${prefix('expand')}">
                ${SVG.sidebarCollapse('16px', '16px')}
                <span>New todo</span>
              </div>
              <div ref="newTodoContainer" class="${prefix(
                'new-todo-container'
              )} ${prefix('close')}">
                <div class="${prefix('new-todo-contents')}">
                  <input ref="title" type="text" placeholder="Title" />
                  <textarea ref="description" placeholder="Description (not required)"></textarea>
                </div>
                <div class="${prefix('new-todo-footer')}">
                  <div class="${prefix('new-todo-details')}">
                    <div class="${prefix('new-todo-end-date-text')}">
                      <span>End date:</span>
                    </div>
                    <div class="${prefix('new-todo-color')}">
                      <input ref="color" value="${getRandomColor()}" type="color" />
                    </div>
                    <input ref="date" type="date" />
                    <input ref="badge" type="text" placeholder="Badge" />
                  </div>
                  <div>
                    <button type="reset" ref="cancel" class="btn aad-custom-component-9b132db1-1ca8-4ecd-ba79-a7ca07fe05f3-settings-cancel" data-close-dialog="" form="repo_metadata_form">Cancel</button>
                    <button ref="submit" type="submit" class="btn btn-primary aad-custom-component-9b132db1-1ca8-4ecd-ba79-a7ca07fe05f3-settings-submit" form="repo_metadata_form">Add task</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        `
    );

    function getTomorrowsDate() {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const year = tomorrow.getFullYear();
      const month = (tomorrow.getMonth() + 1).toString().padStart(2, '0');
      const day = tomorrow.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    refs.date.value = getTomorrowsDate();

    refs.refresh.addEventListener('click', () => {
      removeCompletedTodos();
      execute();
    });

    const toggle = () => {
      if (refs.newTodoContainer.classList.contains(prefix('close'))) {
        refs.newTodoContainer.classList.remove(prefix('close'));
        refs.expand.innerHTML = `${SVG.sidebarExpand(
          '16px',
          '16px'
        )}<span>New todo</span>`;
      } else {
        refs.newTodoContainer.classList.add(prefix('close'));
        refs.expand.innerHTML = `${SVG.sidebarCollapse(
          '16px',
          '16px'
        )}<span>New todo</span>`;
      }
    };

    refs.expand.addEventListener('click', toggle);
    refs.cancel.addEventListener('click', toggle);
    refs.submit.addEventListener('click', () => {
      const title = refs.title.value;
      const description = refs.description.value || null;
      const date = refs.date.value;
      const badge = refs.badge.value || null;

      if (!title) {
        refs.title.style.border = '4px solid #4e3534';
        setTimeout(() => {
          refs.title.style.border = 'none';
        }, 3000);
      }

      if (!date) {
        refs.date.style.border = '4px solid #4e3534';
        setTimeout(() => {
          refs.date.style.border = 'none';
        }, 3000);
      }

      if (!title || !date) return;

      let badges = [];
      if (badge) {
        badges.push({
          text: badge,
          backgroundColor: refs.color.value,
        });
      }

      const formatter = new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      const formattedDate = formatter.format(new Date(date));

      todos.push({
        uuid: generateUUID(),
        title,
        description,
        endDate: formattedDate,
        isCompleted: false,
        badges,
      });
      setConfigByUUID(uuid, { public: { todos } });
      execute();
    });

    inner.aadAppendChild(html);
  }

  function removeCompletedTodos() {
    // Reload todos from storage to get latest state
    const widgetData = getWidgetByUUID(uuid);
    todos = widgetData.config.public.todos || [];
    const newTodos = todos.filter((todo) => !todo.isCompleted);
    todos = newTodos;
    setConfigByUUID(uuid, { public: { todos: newTodos } });
  }

  function applyJS() {
    if (isApplyingJS) return;
    isApplyingJS = true;

    aad_repeatlyCall(
      () => {
        const container = refs.container || document.querySelector(
          `.${prefix('container')}`
        );
        if (!container) return false;

        todos.forEach((todo) => {
          const todoUuid = todo.uuid;
          if (todo.isCompleted) return;
          const $parent = container.querySelector(`div[todo-uuid="${todoUuid}"]`);
          if (!$parent) return;
          const $checkbox = $parent.querySelector('input[type="checkbox"]');
          if (!$checkbox || $checkbox.dataset.listenerAdded) return;
          $checkbox.dataset.listenerAdded = 'true';

          $checkbox.addEventListener('change', (e) => {
            const updatedTodos = todos.map((t) => {
              if (t.uuid === todoUuid) {
                return { ...t, isCompleted: $checkbox.checked };
              }
              return t;
            });
            todos = updatedTodos;
            setConfigByUUID(uuid, { public: { todos: updatedTodos } });
          });

          // Handle description links
          const $description = $parent.querySelector(`.${prefix('description')}`);
          if ($description) {
            const links = $description.querySelectorAll('a');
            links.forEach((link) => {
              if (link.dataset.listenerAdded) return;
              link.dataset.listenerAdded = 'true';
              link.addEventListener('click', (e) => {
                e.preventDefault();
                let href = link.getAttribute('href')?.trim();
                if (!href) return;

                // Check if it's a GitHub URL
                if (href.includes('github.com')) {
                  let githubPath = href;
                  if (href.includes('http')) {
                    githubPath = href.substring(href.indexOf('github.com') + 10);
                  }
                  const splitted = githubPath.split('/').filter(p => p);

                  // Check if it's an issue or pull request
                  if (splitted.length >= 3 && (splitted[2] === 'issues' || splitted[2] === 'pull')) {
                    const entryType = splitted[2] === 'issues' ? 'issue' : 'pr';
                    const url = href.startsWith('http') ? href : 'https://github.com' + githubPath;
                    const { close } = aad_loading(uuid);
                    createFrameModal({
                      title: 'Preview',
                      url: url,
                      selector: (doc) => {
                        if (entryType === 'issue')
                          return doc.querySelector('[data-testid="issue-viewer-issue-container"]');
                        return doc.querySelector('.js-quote-selection-container');
                      },
                      prefix: prefix('modal-preview'),
                      onLoaded: () => {
                        close();
                      },
                    });
                  } else if (splitted.length >= 2) {
                    // Check if it's a repository
                    let closeLoading = null;
                    closeLoading = aad_loading(uuid).close;
                    APIRequest(`https://api.github.com/repos/${splitted[0]}/${splitted[1]}`).then((res) => {
                      if (res.status === 200) {
                        const url = href.startsWith('http') ? href : 'https://github.com' + githubPath;
                        createFrameModal({
                          title: 'Repository Preview',
                          url: url,
                          selector: (doc) => doc.querySelector('#js-repo-pjax-container'),
                          prefix: prefix('modal-repository-preview'),
                          onLoaded: (dom, close) => {
                            closeLoading();

                            // Remove js-toggle-stuck element
                            const jsToggleStuck = dom?.querySelector('.js-toggle-stuck');
                            if (jsToggleStuck) {
                              jsToggleStuck.remove();
                            }

                            const tbody = dom?.querySelector('tbody');
                            const skeletons = tbody?.querySelectorAll(
                              '.Skeleton.Skeleton--text'
                            );
                            skeletons?.forEach((skeleton) => {
                              const parent = skeleton.parentElement;
                              parent.style.fontSize = '11px';
                              parent.style.fontWeight = 'normal';
                              parent.style.opacity = '60%';
                              skeleton.outerHTML = 'Cannot loaded data';
                            });

                            function removeBuggyPart(i) {
                              const nodes = Array.from(
                                dom.querySelectorAll('.blankslate-container')
                              );
                              if (!nodes) return false;
                              nodes?.forEach((node) => {
                                node.parentElement.removeChild(node);
                              });
                              return true;
                            }

                            async function tryRemoveBuggyPart() {
                              for (let i = 0; i < 30; i++) {
                                if (removeBuggyPart(i)) return;
                                await new Promise((resolve) => setTimeout(resolve, 100));
                              }
                            }

                            tryRemoveBuggyPart();
                          },
                        });
                      } else {
                        closeLoading();
                        window.open(href, '_blank');
                      }
                    });
                  } else {
                    window.open(href, '_blank');
                  }
                } else {
                  // Not a GitHub URL, open in new tab
                  window.open(href, '_blank');
                }
              }, { passive: false });
            });
          }
        });
        isApplyingJS = false;
        return true;
      },
      {
        times: 10,  
        start_ms: 100,
        type: 'exponentially',
      }
    );
  }

  function execute() {
    buildTemplate();
    applyJS();
  }

  removeCompletedTodos();
  execute();
  return {
    widget
  };
}

loadNewWidget('todo', getTodoWidget);
