function aad_loading(uuid) {
  let _closeModal = null;
  createModal('Loading', { close: false, ms: 50 }, ({ closeModal }) => {
    const prefix = prefixer('loading', uuid, 'loading');
    _closeModal = closeModal;

    addCustomCSS(`
    .${prefix('container')} {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 4px 8px;
    }
    .${prefix('loader')} {
      width: 70px;
      height: 50px;
      box-sizing: border-box;
      background:
        conic-gradient(from 135deg at top,#0000, #fff 1deg 90deg,#0000 91deg) right -20px bottom 8px/18px 9px,
        linear-gradient(#fff 0 0) bottom/100% 8px,
        #000;
      background-repeat: no-repeat;
      border-bottom: 8px solid #000;
      position: relative;
      animation: l7-0 2s infinite linear;
    }
    .${prefix('loader')}::before {
      content: "";
      position: absolute;
      width: 10px;
      height: 14px;
      background: lightblue;
      left: 10px;
      animation: l7-1 2s infinite cubic-bezier(0,200,1,200);
    }
    @keyframes l7-0{
      100% { background-position: left -20px bottom 8px,bottom}
    }
    @keyframes l7-1{
      0%,50%   {bottom: 8px}
      90%,100% {bottom: 8.1px}
    }
      `);

    const _refs = {};
    const modal = render(
      _refs,
      `
      <div class="${prefix('container')}">
        <div class="${prefix('loader')}"></div>
      </div>
      `
    );
    return modal;
  });
  return {
    close: () => {
      _closeModal();
    },
  };
}
