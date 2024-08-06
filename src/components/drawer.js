function createDrawer(inner, config) {
  const uuid = generateUUID();
  const prefix = prefixer('drawer', uuid, 'component');

  addCustomCSS(`
    .${prefix('wrapper')} {
      position: absolute;
      top: 0;
      left: 0;
      width: 100dvw;
      height: 100dvh;
      z-index: ${zIndex.drawer - 1};
      backdrop-filter: blur(1px);
    }      

    .${prefix('container')} {
      position: absolute;
      bottom: 0px;
      width: 100dvw;
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
      padding: 16px;
      z-index: ${zIndex.drawer};
      overflow: hidden;
      height: 9999px;
      max-height: 0px;
      transition: height 0.3s;
      background-color: ${getColor('drawer.bg')};
      overflow-y: auto;
    }

    .${prefix('open')} {
      animation: aadopening .3s forwards;
    }

    .${prefix('close')} {
      animation: aadclosing .3s forwards;
    }

    .${prefix('page-transition')} {
      transition: all 0.3s;
    }

    .${prefix('page-scale')} {
      transform: scale(.9) translateY(-10px);
    }

    @keyframes aadopening {
      from {
        max-height: 0px;
      }
      to {
        max-height: 70dvh;
      }
    }

    @keyframes aadclosing {
      from {
        max-height: 70dvh;
      }
      to {
        max-height: 0px;
      }
    }
    `);

  const refs = {};
  const container = render(
    refs,
    `
      <div ref="container" class="${prefix('container')} ${prefix('open')}">
        <div class="aad-center">
        </div>
      </div>
      `
  );

  const wrapperRefs = {};
  const wrapper = render(
    wrapperRefs,
    `
      <div ref="wrapper" class="${prefix('wrapper')}">
      </div>`
  );

  const page = document.querySelector(`body > .page-responsive`);

  function closeDrawer() {
    wrapperRefs.wrapper.remove();
    refs.container.classList.add(prefix('close'));
    page.classList.remove(prefix('page-scale'));
    setTimeout(() => {
      refs.container.remove();
      page.classList.remove(prefix('page-transition'));
    }, 300);
  }

  wrapperRefs.wrapper.addEventListener('click', closeDrawer);

  refs.container.aadAppendChild(inner);
  document.body.aadAppendChild(wrapper);
  document.body.aadAppendChild(container);
  page.classList.add(prefix('page-transition'));
  page.classList.add(prefix('page-scale'));

  return {
    closeDrawer,
  };
}
