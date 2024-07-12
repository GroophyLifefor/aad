function settingsCard(config, properties, values, onChangesSaved) {
  const uuid = generateUUID();
  const prefix = prefixer('settingsCard', uuid, 'component');

  const getValue = (q) => {
    const qs = q.split('.');
    let result = values[qs[0]];
    for (let i = 1; i < qs.length; i++) {
      result = result[qs[i]];
    }
    return result;
  };

  const setValue = (q, value) => {
    const qs = q.split('.');
    let current = values;

    for (let i = 0; i < qs.length - 1; i++) {
      if (!current[qs[i]]) {
        current[qs[i]] = {};
      }
      current = current[qs[i]];
    }

    current[qs[qs.length - 1]] = value;
  };

  const typeTEXT = (property) => {
    const refs = {};
    const html = render(
      refs,
      `
      <div class="form-group mt-0 mb-3 ">
        <div class="mb-2">
          <label for="repo_description">${property.label}</label>
        </div>
        <input ref="input" type="text" id="repo_description" class="form-control input-contrast width-full" name="repo_description" placeholder="${
          property.placeholder || ''
        }" autofocus="" value="${
        getValue(property.field) || ''
      }" data-input-max-length="350">
        <div ref="subFields" style="margin-left: 16px;margin-top: 4px;display:flex;flex-direction:column;">
        </div>
        </div>
      `
    );

    refs.input.addEventListener('input', () => {
      setValue(property.field, refs.input.value);
    });

    if (property.subfields) {
      property.subfields.forEach((subField) => {
        const subfield = render(
          null,
          `
          <div style="display: flex; justify-content: space-between; gap: 24px;">
            <span>${subField.label}</span>
            <span class="Link--secondary">${getValue(subField.field)}</span>
          </div>`
        );
        refs.subFields.aadAppendChild(subfield);
      });
    }

    return html;
  };

  const typeNUMBER = (property) => {
    const uuid = generateUUID();
    const pre = (title) => `${prefix('number')}-${uuid}-${title}`;

    addCustomCSS(`
      .${pre('container')} {
        display: flex;  
        width: fit-content;
        border: 1px solid rgb(68, 76, 86);
        justify-content: center;
        align-items: center;
        border-radius: 8px;
      }

      .${pre('minus')}, .${pre('plus')} {
        cursor: pointer;
        font-size: 20px;
        font-weight: 600;
        color: #9ea1a6;
        padding: 0px 8px;
        user-select: none;
      }

      .${pre('input')} input {
        background-color: transparent;
        border: none;
        outline: none;
        text-align: center;
        width: 30px;
      `);

    const refs = {};
    const html = render(
      refs,
      `
      <div class="form-group mt-0 mb-3 js-length-limited-input-container">
        <div class="mb-2">
          <label for="repo_description">${property.label}</label>
        </div>
        <div class="${pre('container')}">
          <div ref="minus" class="${pre('minus')}">-</div>
          <div class="${pre('input')}">
            <input ref="input" ${property.min ? `min="${property.min}"` : ''} ${property.max ? `max="${property.max}"` : ''} type="number" value="${getValue(
              property.field
            )}" />
          </div>
          <div ref="plus" class="${pre('plus')}">+</div>
        </div>
        <div ref="subFields" style="margin-left: 16px;margin-top: 4px;display:flex;flex-direction:column;">
        </div>
        </div>
      `
    );

    const setNumber = (newValue) => {
      const min = parseInt(refs.input.getAttribute('min')) || -2_147_483_647;
      const max = parseInt(refs.input.getAttribute('max')) || 2_147_483_647;

      if (newValue < min) {
        refs.input.value = min;
        return;
      }

      if (newValue > max) {
        refs.input.value = max;
        return;
      }

      refs.input.value = newValue;
      saveNumber();
    };

    const saveNumber = () => {
      setValue(property.field, parseInt(refs.input.value));
    };

    refs.minus.addEventListener('click', () =>
      setNumber(parseInt(refs.input.value) - 1)
    );

    refs.plus.addEventListener('click', () =>
      setNumber(parseInt(refs.input.value) + 1)
    );

    refs.input.addEventListener('input', () => saveNumber());

    if (property.subfields) {
      property.subfields.forEach((subField) => {
        const subfield = render(
          null,
          `
          <div style="display: flex; justify-content: space-between; gap: 24px;">
            <span>${subField.label}</span>
            <span class="Link--secondary">${getValue(subField.field)}</span>
          </div>`
        );
        refs.subFields.aadAppendChild(subfield);
      });
    }

    return html;
  };

  const typeGROUP = (property) => {
    const uuid = generateUUID();
    const pre = (title) => `${prefix('group')}-${uuid}-${title}`;

    addCustomCSS(`
      .${pre('container')} {
        display: flex;  
        flex-direction: column;
        gap: 8px;
        width: 100%;
      }
      
      .${pre('header')} span {
        font-size: 14px; 
        font-weight: 600;
        line-height: 21px;
        text-decoration: underline;
        text-underline-offset: 4px;
        font-family: -apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
      }

      .${pre('body')} {
        display: flex;
        gap: 4px;
      }

      .${pre('before-inner')} {
        width: 12px;
        height: auto;
        border-left: 1px solid rgb(68, 76, 86);
        border-bottom: 1px solid rgb(68, 76, 86);
        border-bottom-left-radius: 8px;
        }

      .${pre('inner')} {
        width: 100%;
    }
      `);

    const refs = {};
    const html = render(
      refs,
      `
      <div class="${pre('container')}">
        <div class="${pre('header')}">
          <span>${property.label}</span>
        </div>
        <div class="${pre('body')}">
          <div class="${pre('before-inner')}">
          </div>
          <div ref="inner" class="${pre('inner')}">
          </div>
        </div>
      </div>
      `
    );

    if (property.subfields) {
      property.subfields.forEach((subField) => {
        const html = typeRouter(subField);
        refs.inner.aadAppendChild(html);
      });
    }

    return html;
  };

  const typeGITHUB_USER = (property) => {
    const uuid = generateUUID();
    const pre = (title) => `${prefix('github-user')}-${uuid}-${title}`;

    addCustomCSS(/*css*/ `
      .${pre('input')} {
        padding-left: 36px;
      }

      .${pre('user-profile-preview-container')} {
        position: absolute;
        height: 32px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 8px;
      }

      .${pre('user-profile-preview')} {
        width: 20px;
        height: 20px;
        border-radius: 50%;
      }

      .${pre('suggestion-container')} {
        position: absolute;
        z-index: ${zIndex.modal + 1};
        width: calc(100% - 32px);
        background-color: #22272e;
        border-radius: 8px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
      }

      .${pre('suggestion-container')}:first-child {
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
      }

      .${pre('suggestion-container')}:last-child {
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
      }

      .${pre('hideable')} {
        transition: max-height 0.3s ease-in-out;
      }

      .${pre('hide')} {
        max-height: 0px;
      }

      .${pre('show')} {
        max-height: 100px;
      }
      `);

    const refs = {};
    const html = render(
      refs,
      `
      <div class="form-group mt-0 mb-3 ">
        <div class="mb-2">
          <label for="repo_description">${property.label}</label>
        </div>
        <div class="${pre('user-profile-preview-container')}">
          <img ref="previewImage" class="${pre(
            'user-profile-preview'
          )}" src="" alt="User Profile" />  
        </div>
        <input autocomplete="one-time-code" ref="input" type="text" id="repo_description" class="${pre(
          'input'
        )} form-control input-contrast width-full" name="repo_description" placeholder="${
        property.placeholder || ''
      }" autofocus="" value="${
        getValue(property.field) || ''
      }" data-input-max-length="350">
        <div ref="suggestionContainer" class="${pre(
          'suggestion-container'
        )} ${pre('hideable')} ${pre('hide')}">
        </div>
        <div ref="subFields" style="margin-left: 16px;margin-top: 4px;display:flex;flex-direction:column;">
        </div>
        </div>
      `
    );

    function loadSuggestions() {
      const keyword = refs.input.value;

      if (keyword.length === 0) {
        refs.suggestionContainer.innerHTML = '';
        refs.previewImage.src = '';
        return;
      }

      const image = `https://github.com/${keyword}.png`;
      refs.previewImage.src = image;

      APIRequest(`https://api.github.com/search/users?q=${keyword}&type=users`)
        .then((response) => response.json())
        .then((data) => {
          refs.suggestionContainer.innerHTML = '';

          const dynamic_uuid = generateUUID();
          const p = (title) => `${pre('suggestion')}-${dynamic_uuid}-${title}`;

          addCustomCSS(/*css*/ `
            .${p('container')} {
              display: flex;
              gap: 8px;
              padding: 5px 12px 5px 5px;
              cursor: pointer;
              align-items: center;
            }

            .${p('container')}:hover {
              background-color: #2d333b;
            }
            `);

          let i = 0;
          data.items.forEach((user) => {
            if (i >= 10) return;
            const userRefs = {};
            const userHTML = render(
              userRefs,
              `
              <div ref="container" class="${p('container')}">
                <img src="${
                  user.avatar_url
                }" alt="User Profile" style="width: 20px; height: 20px; border-radius: 50%;">
                <span>${user.login}</span>
              </div>
              `
            );

            userRefs.container.addEventListener('click', () => {
              refs.input.setAttribute('value', user.login);
              refs.input.value = user.login;
              setValue(property.field, user.login);
              refs.previewImage.src = user.avatar_url;
              refs.suggestionContainer.classList.remove(`${pre('show')}`);
              refs.suggestionContainer.classList.add(`${pre('hide')}`);
              loadSuggestions();
            });

            refs.suggestionContainer.aadAppendChild(userHTML);
            i++;
          });
        });
    }

    const callLoadSuggestions = aad_debounce(() => {
      loadSuggestions();
    }, 400);

    loadSuggestions();

    refs.input.addEventListener('focus', () => {
      refs.suggestionContainer.classList.remove(`${pre('hide')}`);
      refs.suggestionContainer.classList.add(`${pre('show')}`);
    });

    refs.input.addEventListener('blur', () => {
      setTimeout(() => {
        refs.suggestionContainer.classList.remove(`${pre('show')}`);
        refs.suggestionContainer.classList.add(`${pre('hide')}`);
      }, 200);
    });

    refs.input.addEventListener('input', () => {
      setValue(property.field, refs.input.value);
      callLoadSuggestions();
    });

    if (property.subfields) {
      property.subfields.forEach((subField) => {
        const subfield = render(
          null,
          `
          <div style="display: flex; justify-content: space-between; gap: 24px;">
            <span>${subField.label}</span>
            <span class="Link--secondary">${getValue(subField.field)}</span>
          </div>`
        );
        refs.subFields.aadAppendChild(subfield);
      });
    }

    return html;
  };

  const typeSELECT = (property) => {
    const uuid = generateUUID();
    const pre = (title) => `${prefix('select')}-${uuid}-${title}`;

    addCustomCSS(`
      .${pre('input')} {
        padding: 5px 12px;
        background-color: #2d333b;
        border-radius: 8px;
      }
      `);

    const refs = {};
    const html = render(
      refs,
      `
      <div class="form-group mt-0 mb-3 ">
        <div class="mb-2">
          <label >${property.label}</label>
        </div>
        <select ref="input" class="${pre('input')}">
          ${property.options.map(option => {
            let isSelected = false;
            if (option.value === getValue(property.field)) {
              isSelected = true;
            }
            return `<option value="${option.value}" ${isSelected ? 'selected' : ''}>${option.label}</option>`
          })}
        </select>
        <div ref="subFields" style="margin-left: 16px;margin-top: 4px;display:flex;flex-direction:column;">
        </div>
      </div>
      `
    );

    refs.input.addEventListener('input', () => {
      setValue(property.field, refs.input.value);
    });

    if (property.subfields) {
      property.subfields.forEach((subField) => {
        const subfield = render(
          null,
          `
          <div style="display: flex; justify-content: space-between; gap: 24px;">
            <span>${subField.label}</span>
            <span class="Link--secondary">${getValue(subField.field)}</span>
          </div>`
        );
        refs.subFields.aadAppendChild(subfield);
      });
    }

    return html;
  };

  const typeWIDE_BUTTON = (property, config) => {
    const refs = {};
    const html = render(
      refs,
      `
      <div class="" style="width: 100%;">
        <button ref="button" style="width: 100%;" class="btn btn-primary">${property.text}</button>
        <div ref="subFields" style="margin-left: 16px;margin-top: 4px;display:flex;flex-direction:column;">
        </div>
      </div>
      `
    );

    refs.button.addEventListener('click', () => {
      property.onClick({
        closeModal: config.closeModal
      });
    });

    if (property.subfields) {
      property.subfields.forEach((subField) => {
        const subfield = render(
          null,
          `
          <div style="display: flex; justify-content: space-between; gap: 24px;">
            <span>${subField.label}</span>
            <span class="Link--secondary">${getValue(subField.field)}</span>
          </div>`
        );
        refs.subFields.aadAppendChild(subfield);
      });
    }

    return html;
  };

  const typeRouter = (property, config) => {
    if (property.type === 'text') {
      const html = typeTEXT(property);
      return html;
    }

    if (property.type === 'number') {
      const html = typeNUMBER(property);
      return html;
    }

    if (property.type === 'group') {
      const html = typeGROUP(property);
      return html;
    }

    if (property.type === 'github_user') {
      const html = typeGITHUB_USER(property);
      return html;
    }

    if (property.type === 'select') {
      const html = typeSELECT(property);
      return html;
    }

    if (property.type === 'wide-button') {
      const html = typeWIDE_BUTTON(property, config);
      return html;
    }

    sendNewNotification(
      `Unknown property type: ${property.type}, in settings card.`,
      {
        type: 'error',
        timeout: 5000,
      }
    );
    return null;
  };

  createModal(
    'Settings',
    {
      header: false,
      padding: '0px',
    },
    ({ closeModal }) => {
      const uuid = generateUUID();
      const prefix = prefixer('settings', uuid, 'component');

      addCustomCSS(`
      .${prefix('container')} {
        display: flex;  
        flex-direction: column;
        width: 640px;
      }

      @media (max-width: 800px) { 
        .${prefix('container')} {
          width: 100%;
        } 
      }

      .${prefix('header')} {
        padding: 16px;
        border-radius: 8px 8px 0px 0px;
        border: 1.11px solid rgb(68, 76, 86);
        display: flex;
        justify-content: space-between;
        item-align: center;
        gap: 8px;
      }

      .${prefix('header')} span {
        font-size: 14px; 
        font-weight: 600;
        line-height: 21px;
        font-family: -apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
      }

      .${prefix('footer')} {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        padding: 16px;
        border-radius: 0px 0px 8px 8px;
        border: 1.11px solid rgb(68, 76, 86);
      }

      .${prefix('close')} {
        cursor: pointer;
      } 

      .${prefix('inner')} {
        padding: 16px;
        border: 1.11px solid rgb(68, 76, 86);
        border-top: none;
        border-bottom: none;
        display: flex;
        flex-direction: column;
        gap: 16px;
        position: relative;
      } 
        `);

      const settingsRefs = {};
      const settingsContainer = render(
        settingsRefs,
        `
      <div class="${prefix('container')}">
        <div class="${prefix('header')}">
          <span>${
            config.title ||
            '<span style="color: red;">Unnamed Settings Card</span>'
          }</span>
          <div>
            <div class="${prefix('close')}" ref="close">${SVG.close(
          '16px',
          '16px'
        )}</div>
          </div>
        </div>
        <div class="${prefix('inner')}" ref="inner"></div>
        <div class="${prefix('footer')}">
          <button type="reset" ref="cancel" class="btn ${prefix(
            'cancel'
          )}" data-close-dialog="" form="repo_metadata_form">Cancel</button>
          <button ref="save" type="submit" class="btn btn-primary ${prefix(
            'submit'
          )}" form="repo_metadata_form">Save changes</button>
        </div>
      </div>
      `
      );

      settingsRefs.close.addEventListener('click', () => closeModal());
      settingsRefs.cancel.addEventListener('click', () => closeModal());

      settingsRefs.save.addEventListener('click', () => {
        if (!!onChangesSaved) onChangesSaved(values);
        closeModal();
      });

      properties.forEach((property) => {
        const html = typeRouter(property, {
          closeModal: closeModal,
        });
        if (!!html) settingsRefs.inner.aadAppendChild(html);
      });

      if (properties.length === 0) {
        settingsRefs.inner.innerHTML = 'No settings available';
      }

      return settingsContainer;
    }
  );
}
