function initGlobalCSS() {
  addCustomCSS(`
    .aad-center {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .aad-w-full {
      width: 100%;
    }

    .aad-h-full {
      height: 100%;
    }

    .aad-hard-hidden {
      display: none !important;
    }

    body {
      background-color: var(--bgColor-default, var(--color-canvas-default));
      color: var(--fgColor-default, var(--color-fg-default));
    }

    html {
      overflow: hidden;
    }

    .AppHeader {
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
    }

    .aad-come-from-bottom {
      animation: aadComeFromBottom 1s ease-in-out;
      transform: translateY(0);
    }

    @keyframes aadComeFromBottom {
      0% {
        transform: translateY(120%);
      }
      100% {
        transform: translateY(0);
      }
    }

    .aad-go-to-top {
      animation: aadGoToTop 1s ease-in-out;
      transform: translateY(-120%);
    }

    @keyframes aadGoToTop {
      0% {
        transform: translateY(0);
      }
      100% {
        transform: translateY(-120%);
      }
    }

    /* width */
    .aad-scroll-x::-webkit-scrollbar {
      height: 8px;
    }

    /* Track */
    .aad-scroll-x::-webkit-scrollbar-track {
      border-radius: 10px;
    }
    
    /* Handle */
    .aad-scroll-x::-webkit-scrollbar-thumb {
      background: #2d333b; 
      border-radius: 2.5px;
    }

    /* Handle on hover */
    .aad-scroll-x::-webkit-scrollbar-thumb:hover {
      background: #3a4049; 
    }

    /* width */
    .aad-scroll-y::-webkit-scrollbar {
      width: 8px;
    }

    /* Track */
    .aad-scroll-y::-webkit-scrollbar-track {
      border-radius: 10px;
    }
    
    /* Handle */
    .aad-scroll-y::-webkit-scrollbar-thumb {
      background: #2d333b; 
      border-radius: 2.5px;
    }

    /* Handle on hover */
    .aad-scroll-y::-webkit-scrollbar-thumb:hover {
      background: #3a4049; 
    }

    .aad-medium-text {
      color: ${getColor('text-md.color')};
      font-size: ${getColor('text-md.font-size')};
      font-weight: ${getColor('text-md.font-weight')};
      line-height: ${getColor('text-md.line-height')};
    }

    .aad-small-text {
      color: ${getColor('text-sm.color')};
      font-size: ${getColor('text-sm.font-size')};
      font-weight: ${getColor('text-sm.font-weight')};
      line-height: ${getColor('text-sm.line-height')};
    }

    .aad-m-0-hard {
      margin: 0 !important;
    }
    `);
}
