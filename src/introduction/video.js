/**
 * Song | Farazi - Unutulanlar
 * Start Time | 0:14
 */
async function startConference() {
  console.log('Video conference started');
  const {
    updateFrameHeight,
    updateFrameWidth,
    updateWrapperInner,
    comeWrapperFrom,
    goWrapperTo,
    showTitle,
  } = initDOM();

  updateFrameWidth(1408);
  updateFrameHeight(696);
  // updateFrameWidth(1280);
  // updateFrameHeight(633);

  async function showText(textRefs, text, _options) {
    const defaultOptions = {
      underline: false,
      animation: true,
      fontSize: 80,
      waitEachWord: 0,
      waitEachChar: 10,
      addAtEnd: null,
    };

    options = { ...defaultOptions, ..._options };

    textRefs.content.innerHTML = '';

    const splitted = text.split('');
    let isBold = false;
    let isBigger = false;
    for (let i = 0; i < splitted.length; i++) {
      const char = splitted[i];
      const uuid = generateUUID();
      const p = prefixer('coming-char', uuid, 'video-editing');

      if (char === '*') {
        isBold = !isBold;
        continue;
      }

      if (char === '#') {
        isBigger = !isBigger;
        continue;
      }

      const multiplier = isBigger ? 1.2 : 1;
      const fontSize = options.fontSize
        ? options.fontSize * multiplier
        : 80 * multiplier;

      addCustomCSS(`
      .${p('char')} {
        font-size: ${fontSize}px;
        transition: all 0.5s;
        ${isBold ? 'font-weight: bold;' : ''}
        ${options.animation ? `animation: ${p('come-from-top')} 1s;` : ''}
        ${char === ' ' ? 'min-width: 30px;' : ''}
        ${options.underline ? 'text-decoration: underline;' : ''}
      }

      .${p('animEnd')} {
        font-size: 120px;
        color: white;
      }

      @keyframes ${p('come-from-top')} {
        0% {
          opacity: 0;
          transform: translateY(-100%);

          }
        30% {
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `);

      const charRefs = {};
      const charElem = render(
        charRefs,
        `
      <div ref="char" class="${p('char')}">${char}</div>
    `
      );

      if (options.animation) {
        setTimeout(() => {
          charElem.classList.add(p('animEnd'));
        }, 500);
      }

      textRefs.content.appendChild(charElem);

      await aad_sleep(options.waitEachChar);
      if (options.waitEachWord && char === ' ') {
        await aad_sleep(options.waitEachWord);
      }
    }

    if (options.addAtEnd) {
      textRefs.content.aadAppendChild(options.addAtEnd);
    }
  }

  await aad_sleep(200);

  const w1refs = {};
  const w1 = render(
    w1refs,
    `<div class="aad-w-full aad-h-full aad-center"
      width="1408px" height="696px"
      style="min-width: 1408px; min-height: 696px;"
      >
      <div 
        style="font-size: 80px; font-family: Helvetica;text-wrap: nowrap; padding: 40px 0px;" 
        ref="content"
        >

          AAD - Highly Customizable GitHub
        </div>
    </div>`
  );
  updateWrapperInner(w1);
  const w1c = comeWrapperFrom('left');

  // to end animation
  await aad_sleep(1200);

  const w5uuid = generateUUID();
  const w5pre = prefixer('coming-char', w5uuid, 'video-editing');
  addCustomCSS(`
    .${w5pre('char')} {
      transform: translateY(-30%);
      animation: ${w5pre('come-from-bottom')} 1s;
      position: absolute;
      margin-left: 10px;
    }

    @keyframes ${w5pre('come-from-bottom')} {
      0% {
        opacity: 0;
        transform: translateY(100%);
      }
      100% {
        opacity: 1;
        transform: translateY(-30%);
      }
    }
    `);
  const w5 = render(
    null,
    `<span class="${w5pre('char')}">
      ✨
    </span>`
  );
  w1refs.content.aadAppendChild(w5);

  // extra time to show the final state
  await aad_sleep(4000);

  removeCustomCSS(w1c);
  const w1g = goWrapperTo('right');
  await aad_sleep(1100);
  removeCustomCSS(w1g);
  updateWrapperInner(null);
  await aad_sleep(100);

  const w2refs = {};
  const w2 = render(
    w2refs,
    `<div class="aad-w-full aad-h-full aad-center"
      width="1280px" height="633px"
      style="min-width: 1280px; min-height: 633px;"
      >
      <div 
        style="
          font-family: Helvetica;
          text-wrap: nowrap; 
          transition: font-size 0.1s;
          font-size: 80px;
          display: flex;
          align-items: baseline;
          " 
        ref="content"
        >
        </div>
    </div>`
  );
  updateWrapperInner(w2);

  const w2c = comeWrapperFrom('left');
  await aad_sleep(1200);

  const textTime = 1200;

  const w4refs = {};
  const w4uuid = generateUUID();
  const w4pre = prefixer('coloured-text', w4uuid, 'video-editing');

  addCustomCSS(`
    .${w4pre('coloured')} {
      font-size: 100px;
      background: -webkit-linear-gradient(#835bcd, #b44ac4);
      text-shadow: -2px 2 5px #b44ac4, 2px -2 5px #835bcd;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;

      animation: ${w4pre('come-from-bottom')} 1s;
    }
      
     @keyframes ${w4pre('come-from-bottom')} {
      0% {
        opacity: 0;
        transform: translateY(100%);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }`);

  const w4 = render(
    w4refs,
    `
    <span class="${w4pre('coloured')}">
      Home
    </span>`
  );

  showText(w2refs, 'Meet with your new ', {
    animation: false,
    waitEachWord: 300,
    waitEachChar: 50,
    addAtEnd: w4,
  });
  await aad_sleep(textTime + 4 * 300 /* each word */ + 19 * 50 /* each char */);
  showText(w2refs, '- Interface -', {
    underline: true,
  });
  await aad_sleep(textTime * 2);

  removeCustomCSS(w2c);
  const w2g = goWrapperTo('right');
  await aad_sleep(1100);
  removeCustomCSS(w2g);
  updateWrapperInner(null);
  await aad_sleep(100);

  await aad_sleep(1000);

  const c1 = addCustomCSS(`

  :root {
    --angle: 45deg;
    --opacity: 0.5;
    --neon-color1: #835bcd;
    --neon-color2: #b44ac4;
  }

  [widgetContainer="true"] {

      border: .3rem solid transparent;

      padding: 4px;

      /* Paint an image in the border */
      border-image: conic-gradient(
          from var(--angle),
          var(--neon-color1) 0deg 90deg,
          var(--neon-color1) 90deg 180deg,
          var(--neon-color2) 180deg 270deg,
          var(--neon-color2) 270deg 360deg
        ) 1 stretch;

      box-shadow: 0 0 20px var(--neon-color1), /* Outer glow */
              0 0 40px var(--neon-color1), /* Medium glow */
              0 0 60px var(--neon-color2), /* Inner glow */
              0 0 80px var(--neon-color2); /* Deep glow */
    }

    @keyframes neon-glow {
      0%, 100% {
        box-shadow: 0 0 5px var(--neon-color1),
                    0 0 5px var(--neon-color1),
                    0 0 5px var(--neon-color2),
                    0 0 5px var(--neon-color2);
      }
      50% {
        box-shadow: 0 0 5px var(--neon-color1),
                    0 0 5px var(--neon-color1),
                    0 0 5px var(--neon-color2),
                    0 0 5px var(--neon-color2);
      }
    }

    @supports (background: paint(houdini)) {
      @property --opacity {
        syntax: "<number>";
        initial-value: 0.5;
        inherits: false;
      }

      @property --angle {
        syntax: "<angle>";
        initial-value: 0deg;
        inherits: false;
      }

      @keyframes opacityChange {
        to {
          --opacity: 1;
        }
      }

      @keyframes rotate {
        to {
          --angle: 360deg;
        }
      }

      [widgetContainer="true"] {
        animation: 
          rotate 4s linear infinite, opacityChange 3s infinite alternate, 
          neon-glow 1.5s ease-in-out infinite alternate;
      }
    }

    `);

  await aad_sleep(100);

  showTitle('On the UI side, each one is referred to as a widget', 6000);
  await aad_sleep(6300);
  removeCustomCSS(c1);

  const c2 = addCustomCSS(`
      [widgetContainer="true"] {
        transition: opacity 1s;
        opacity: 0;
      }
      `);

  showTitle(
    'Everything else on the UI side is referred to as a component',
    6000
  );
  await aad_sleep(6300);
  removeCustomCSS(c2);

  showTitle('UI is that simple', 2000);
  await aad_sleep(2300);

  //

  const w3refs = {};
  const w3 = render(
    w3refs,
    `<div class="aad-w-full aad-h-full aad-center"
      width="1280px" height="633px"
      style="min-width: 1280px; min-height: 633px;"
      >
      <div 
        style="
          font-family: Helvetica;
          text-wrap: nowrap; 
          transition: font-size 0.1s;
          font-size: 80px;
          display: flex;
          " 
        ref="content"
        >
        </div>
    </div>`
  );
  updateWrapperInner(w3);

  const w3c = comeWrapperFrom('left');
  await aad_sleep(1200);

  const textTime2 = 4800;

  showText(w3refs, '- Layout Customization -', {
    underline: true,
    animation: false,
  });
  await aad_sleep(textTime2);

  removeCustomCSS(w3c);
  const w3g = goWrapperTo('right');
  await aad_sleep(1100);
  removeCustomCSS(w3g);
  updateWrapperInner(null);
  await aad_sleep(100);

  await aad_sleep(1000);

  showTitle('Adding new widgets', 3000);

  async function arrow() {
    const start = Date.now();
    const uuid = generateUUID();
    const p = prefixer('arrow', uuid, 'video-editing');

    const addNew = document.querySelectorAll(
      '.aad-custom-widget-new-widget-inner-container'
    )[1];
    addNew.style.position = 'relative';

    addCustomCSS(`
      .${p('pointer')} {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(13%, -12%);
        animation: ${p('pointer-anim')} 1s;
      }

      @keyframes ${p('pointer-anim')} {
        0% {
          transform: translate(100%, 1500%);
        }
        80% {
          transform: translate(13%, -12%) scale(1);
        }
        100% {
          transform: translate(13%, -12%) scale(.8);
        }
      }

      .${p('pointer-0')} {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, 0);
        animation: ${p('pointer-anim-0')} 1s;
      }

      @keyframes ${p('pointer-anim-0')} {
       0% {
          transform: translate(100%, 1500%);
        }
        80% {
          transform: translate(-50%, 0) scale(1);
        }
        100% {
          transform: translate(-50%, 0) scale(.8);
        }
      }
    `);

    const pointer = render(
      null,
      `
    <div class="${p('pointer')}">
      ${SVG.pointer(24, 24)}
    </div>
    `
    );
    addNew.aadAppendChild(pointer);

    setTimeout(() => {
      addNew.click();
      pointer.remove();

      setTimeout(() => {
        const button = document.querySelector('[createWidgetNth="1"]');

        const pointer2 = render(
          null,
          `
        <div class="${p('pointer')}">
          ${SVG.pointer(24, 24)}
        </div>
        `
        );
        button.aadAppendChild(pointer2);

        setTimeout(async () => {
          button.click();
          pointer2.remove();

          await aad_sleep(2000);

          showTitle('Deleting widgets', 3000);

          const delContainer = document.querySelector('#container-1');
          let totalChildren = delContainer.children.length;
          const actualWidget = delContainer.children[totalChildren - 2];
          const del = actualWidget.querySelectorAll('[ref="close"]')[0];

          const pointer3 = render(
            null,
            `
          <div class="${p('pointer')}">
            ${SVG.pointer(24, 24)}
          </div>
          `
          );
          del.aadAppendChild(pointer3);
          await aad_sleep(1000);

          del.click();
          pointer3.remove();

          await aad_sleep(500);

          const delVerify = document.querySelector(
            '[aad-modal="true"] [ref="delete"]'
          );
          const pointer4 = render(
            null,
            `
          <div class="${p('pointer')}">
            ${SVG.pointer(24, 24)}
          </div>
          `
          );
          delVerify.aadAppendChild(pointer4);
          await aad_sleep(1000);

          delVerify.click();
          pointer4.remove();

          setTimeout(() => {
            showTitle('Configuring widgets', 3000);

            const entriesWidget = document.querySelector(
              '[widget-type="entries"]'
            );
            const settings =
              entriesWidget.querySelectorAll('[ref="settings"]')[0];

            const pointer5 = render(
              null,
              `
            <div class="${p('pointer-0')}">
              ${SVG.pointer(24, 24)}
            </div>
            `
            );
            settings.aadAppendChild(pointer5);

            setTimeout(() => {
              settings.click();
              pointer5.remove();

              setTimeout(async () => {
                const field = document.querySelector(
                  '[aad-modal="true"] [field="author"]'
                );
                field.style.border = '2px solid #835bcd';
                field.style.borderRadius = '4px';
                field.style.padding = '4px';
                const input = document.querySelector(
                  '[aad-modal="true"] [field="author"] input'
                );
                input.focus();
                await aad_sleep(1000);
                const newAuthor =
                  input.value === 'developer-guy'
                    ? 'Groophylifefor'
                    : 'developer-guy';
                input.value = '';
                await aad_sleep(200);
                for (let i = 0; i < newAuthor.length; i++) {
                  input.value += newAuthor[i];
                  input.dispatchEvent(new Event('input'));
                  input.focus();
                  await aad_sleep(100);
                }

                await aad_sleep(500);
                field.style.border = 'none';
                field.style.padding = '0';
                field.style.borderRadius = '0';

                setTimeout(() => {
                  const modal = document.querySelector(
                    '[aad-modal="true"] [ref="inner"]'
                  );
                  modal.scroll({
                    top: modal.scrollHeight,
                    behavior: 'smooth',
                  });

                  setTimeout(() => {
                    const modalSave = document.querySelector(
                      '[aad-modal="true"] [ref="save"]'
                    );

                    const pointer6 = render(
                      null,
                      `
                    <div class="${p('pointer')}">
                      ${SVG.pointer(24, 24)}
                    </div>
                    `
                    );
                    modalSave.aadAppendChild(pointer6);

                    setTimeout(() => {
                      modalSave.click();
                      pointer6.remove();

                      setTimeout(() => {
                        showTitle('Configuring container layout', 3000);

                        setTimeout(() => {
                          const settings = document.querySelector(
                            '[aad-settings="true"]'
                          );

                          const pointer7 = render(
                            null,
                            `
                          <div class="${p('pointer')}">
                            ${SVG.pointer(24, 24)}
                          </div>
                          `
                          );
                          settings.aadAppendChild(pointer7);

                          setTimeout(() => {
                            settings.click();
                            pointer7.remove();

                            setTimeout(() => {
                              const settingsModal = document.querySelector(
                                '[aad-modal="true"] [ref="inner"]'
                              );
                              settingsModal.scroll({
                                top: settingsModal.scrollHeight,
                                behavior: 'smooth',
                              });

                              setTimeout(async () => {
                                const selectArea = document.querySelector(
                                  '[aad-modal="true"] [field="heightType"]'
                                );

                                selectArea.style.border = '2px solid #835bcd';
                                selectArea.style.borderRadius = '4px';
                                selectArea.style.padding = '4px';
                                await aad_sleep(500);
                                const select = document.querySelector(
                                  '[aad-modal="true"] [field="heightType"] select'
                                );
                                select.focus();
                                select.value =
                                  select.value === 'fit' ? 'sameHeight' : 'fit';
                                select.dispatchEvent(new Event('input'));

                                setTimeout(() => {
                                  const saveButton = document.querySelector(
                                    '[aad-modal="true"] [ref="save"]'
                                  );

                                  const pointer8 = render(
                                    null,
                                    `
                                  <div class="${p('pointer')}">
                                    ${SVG.pointer(24, 24)}
                                  </div>
                                  `
                                  );
                                  saveButton.aadAppendChild(pointer8);

                                  setTimeout(() => {
                                    saveButton.click();
                                    pointer8.remove();
                                    const end = Date.now();
                                    // console.log('Time:', end - start);
                                  }, 1000);
                                }, 1000);
                              }, 1000);
                            }, 3000);
                          }, 1000);
                        }, 1000);
                      }, 1000);
                    }, 1000);
                  }, 3000);
                }, 2000);
              }, 500);
            }, 1000);
          }, 3000);
        }, 1000);
      }, 1000);
    }, 1500);
  }

  await arrow();
  // wait for the arrow to finish :')
  await aad_sleep(31427);
  await aad_sleep(1500);

  const w6refs = {};
  const w6 = render(
    w6refs,
    `<div class="aad-w-full aad-h-full aad-center"
      width="1280px" height="633px"
      style="min-width: 1280px; min-height: 633px;"
      >
      <div 
        style="
          font-family: Helvetica;
          text-wrap: nowrap; 
          transition: font-size 0.1s;
          font-size: 80px;
          display: flex;
          " 
        ref="content"
        >
        </div>
    </div>`
  );
  updateWrapperInner(w6);

  const w6c = comeWrapperFrom('left');
  await aad_sleep(1200);

  const textTime3 = 4800;

  showText(w6refs, '- Responsiveness -', {
    underline: true,
    animation: false,
  });
  await aad_sleep(textTime3);

  removeCustomCSS(w6c);
  const w6g = goWrapperTo('right');
  await aad_sleep(1100);
  removeCustomCSS(w6g);
  updateWrapperInner(null);
  await aad_sleep(100);

  await aad_sleep(1000);
  showTitle('3 Each Row (Desktop - 1408px)', 3000);
  setWidgetLgCount(3);
  await aad_sleep(4000);
  showTitle('2 Each Row (Tablet - 800px)', 3000);
  updateBodyWidth(800);
  setWidgetLgCount(2);
  await aad_sleep(4000);
  showTitle('1 Each Row (Mobile - 400px)', 3000);
  updateBodyWidth(400);
  setWidgetLgCount(1);
  await aad_sleep(3000);
  const feed = document.querySelector('.add-custom-feed');
  feed.scroll({
    top: feed.scrollHeight,
    behavior: 'smooth',
  });
  await aad_sleep(4000);
  updateBodyWidth(-1);
  setWidgetLgCount(4);
  await aad_sleep(1000);

  const w9refs = {};
  const w9 = render(
    w9refs,
    `<div class="aad-w-full aad-h-full aad-center"
      width="1280px" height="633px"
      style="min-width: 1280px; min-height: 633px;"
      >
      <div 
        style="
          font-family: Helvetica;
          text-wrap: nowrap; 
          transition: font-size 0.1s;
          font-size: 80px;
          display: flex;
          align-items: baseline;
          " 
        ref="content"
        >
        </div>
    </div>`
  );
  updateWrapperInner(w9);

  const w9c = comeWrapperFrom('left');
  await aad_sleep(1200);

  const textTime5 = 4800;

  showText(w9refs, '- Focus *one* thing with #Preview# -', {
    underline: true,
    animation: false,
  });
  await aad_sleep(textTime5);

  removeCustomCSS(w9c);
  const w9g = goWrapperTo('right');
  await aad_sleep(1100);
  removeCustomCSS(w9g);
  updateWrapperInner(null);
  await aad_sleep(100);

  async function preview() {
    const uuid = generateUUID();
    const p = prefixer('preview', uuid, 'video-editing');

    addCustomCSS(`
      .${p('pointer')} {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(13%, -12%);
        animation: ${p('pointer-anim')} 1s;
      }

      @keyframes ${p('pointer-anim')} {
        0% {
          transform: translate(100%, 1500%);
        }
        80% {
          transform: translate(13%, -12%) scale(1);
        }
        100% {
          transform: translate(13%, -12%) scale(.8);
        }
      }
    `);

    async function showRepositoryPreview() {
      // const repositoresInTrending = document.querySelectorAll('[href="/trending"]')[0];
      // repositoresInTrending.click();

      // await aad_sleep(2000);
      showTitle('Preview repositories', 5000);

      const firstRepo = document.querySelectorAll(
        '[widget-type="trending"] .Box-row'
      )[0];
      const firstRepoLink = firstRepo.querySelectorAll('a')[1];
      if (!firstRepoLink) {
        await aad_sleep(100);
        firstRepoLink = document
          .querySelectorAll('[widget-type="trending"] .Box-row')[1]
          .querySelectorAll('a')[1];
      }
      firstRepoLink.style.position = 'relative';
      const pointer = render(
        null,
        `
      <div class="${p('pointer')}">
        ${SVG.pointer(24, 24)}
      </div>
      `
      );
      firstRepoLink.aadAppendChild(pointer);

      await aad_sleep(1000);
      firstRepoLink.click();
      pointer.remove();
      await aad_sleep(5000);
      const modalInner = document.querySelector(
        '[aad-modal="true"] [ref="inner"]'
      );
      modalInner.scroll({
        top: modalInner.scrollHeight / 2,
        behavior: 'smooth',
      });
      await aad_sleep(2000);
      modalInner.scroll({ top: modalInner.scrollHeight, behavior: 'smooth' });
      await aad_sleep(2000);
      const close = document.querySelector('[aad-modal="true"]');
      close.click();
    }

    async function showProfilePreview() {
      await aad_sleep(1000);
      const developersInTrending = document.querySelectorAll(
        '[href="/trending/developers"]'
      )[0];
      developersInTrending.click();

      await aad_sleep(3000);
      showTitle('Preview profiles', 5000);

      const firstRepo = document.querySelectorAll(
        '[widget-type="trending"] .Box-row'
      )[0];
      const firstRepoLink = firstRepo.querySelectorAll('a')[2];
      firstRepoLink.style.position = 'relative';
      const pointer = render(
        null,
        `
      <div class="${p('pointer')}">
        ${SVG.pointer(24, 24)}
      </div>
      `
      );
      firstRepoLink.aadAppendChild(pointer);

      await aad_sleep(1000);
      firstRepoLink.click();
      pointer.remove();
      await aad_sleep(5000);
      const modalInner = document.querySelector(
        '[aad-modal="true"] [ref="inner"]'
      );
      modalInner.scroll({
        top: modalInner.scrollHeight / 2,
        behavior: 'smooth',
      });
      await aad_sleep(2000);
      modalInner.scroll({ top: modalInner.scrollHeight, behavior: 'smooth' });
      await aad_sleep(2000);
      const close = document.querySelector('[aad-modal="true"]');
      close.click();
    }

    async function showEntryPreview() {
      await aad_sleep(1000);
      showTitle('Preview entries', 5000);

      const firstRepoLink = document.querySelectorAll(
        '[widget-type="entries"] a'
      )[1];
      firstRepoLink.style.position = 'relative';
      const pointer = render(
        null,
        `
      <div class="${p('pointer')}">
        ${SVG.pointer(24, 24)}
      </div>
      `
      );
      firstRepoLink.aadAppendChild(pointer);

      await aad_sleep(1000);
      firstRepoLink.click();
      pointer.remove();
      await aad_sleep(5000);
      const modalInner = document.querySelector(
        '[aad-modal="true"] [ref="inner"]'
      );
      modalInner.scroll({
        top: modalInner.scrollHeight / 2,
        behavior: 'smooth',
      });
      await aad_sleep(2000);
      modalInner.scroll({ top: modalInner.scrollHeight, behavior: 'smooth' });
      await aad_sleep(2000);
      const close = document.querySelector('[aad-modal="true"]');
      close.click();
    }

    await showRepositoryPreview();
    await showProfilePreview();
    await showEntryPreview();
  }

  await preview();

  await aad_sleep(1000);

  const w7refs = {};
  const w7 = render(
    w7refs,
    `<div class="aad-w-full aad-h-full aad-center"
      width="1280px" height="633px"
      style="min-width: 1280px; min-height: 633px;"
      >
      <div 
        style="
          font-family: Helvetica;
          text-wrap: nowrap; 
          transition: font-size 0.1s;
          font-size: 80px;
          display: flex;
          " 
        ref="content"
        >
        </div>
    </div>`
  );
  updateWrapperInner(w7);

  const w7c = comeWrapperFrom('left');
  await aad_sleep(1200);

  const textTime4 = 4800;

  showText(w7refs, '- Sponsorships -', {
    underline: true,
    animation: false,
  });
  await aad_sleep(textTime4);
  w7refs.content.innerHTML = '';

  const w8refs = {};
  const w8 = render(
    w8refs,
    `<img ref="img" style="background-color: #ffbc01;" class="aad-come-from-bottom" src="https://aad-ext.vercel.app/sponsorships/kommunity.jpg" />`
  );
  w7refs.content.aadAppendChild(w8);
  await aad_sleep(4000);
  w8refs.img.classList.add('aad-go-to-top');
  await aad_sleep(1100);
  w7refs.content.innerHTML = '';

  showText(w7refs, 'Thank you for watching', {
    animation: false,
  });
  await aad_sleep(textTime4);
  showText(w7refs, 'Maintainer - Murat Kirazkaya', {
    animation: false,
  });
  await aad_sleep(textTime4);
  w7refs.content.innerHTML = '';

  removeCustomCSS(w7c);
  const w7g = goWrapperTo('right');
  await aad_sleep(1100);
  removeCustomCSS(w7g);

  updateWrapperInner(null);
  await aad_sleep(100);

  updateFrameWidth(-1);
  updateFrameHeight(-1);
}
