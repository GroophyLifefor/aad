function getSettingsInputNumber(options) {
  const { min, max, value, onChange } = options;
  const uuid = generateUUID();
  const prefix = prefixer('settings-input-number', uuid, 'component');

  addCustomCSS(`
    .${prefix('container')} {
      display: flex;  
      width: fit-content;
      border: 1px solid rgb(68, 76, 86);
      justify-content: center;
      align-items: center;
      border-radius: 8px;
    }

    .${prefix('minus')}, .${prefix('plus')} {
      cursor: pointer;
      font-size: 20px;
      font-weight: 600;
      color: #9ea1a6;
      padding: 0px 8px;
      user-select: none;
    }

    .${prefix('input')} input {
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
        <div class="${prefix('container')}">
          <div ref="minus" class="${prefix('minus')}">-</div>
          <div class="${prefix('input')}">
            <input 
              ref="input" 
              ${min ? `min="${min}"` : ''} 
              ${max ? `max="${max}"` : ''} 
              type="number" 
              ${value ? `value="${value}"` : ''} 
            />
          </div>
          <div ref="plus" class="${prefix('plus')}">+</div>
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
    if (!!onChange) onChange(newValue);
  };

  refs.minus.addEventListener('click', () =>
    setNumber(parseInt(refs.input.value) - 1)
  );

  refs.plus.addEventListener('click', () =>
    setNumber(parseInt(refs.input.value) + 1)
  );

  refs.input.addEventListener('input', () => saveNumber());

  const getValue = () => parseInt(refs.input.value);

  return {
    node: html,
    refs,
    getValue
  }
}
