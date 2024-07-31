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

    body {
      background-color: #1c2128;
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
        transform: translateY(100%);
      }
      100% {
        transform: translateY(0);
      }
    }

    .aad-go-to-top {
      animation: aadGoToTop 1s ease-in-out;
      transform: translateY(-100%);
    }

    @keyframes aadGoToTop {
      0% {
        transform: translateY(0);
      }
      100% {
        transform: translateY(-100%);
      }
    }
    `);
}
