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
      width: 5px;
    }

    /* Track */
    .aad-scroll-x::-webkit-scrollbar-track {
      box-shadow: inset 0 0 5px grey; 
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
      height: 5px;
    }

    /* Track */
    .aad-scroll-y::-webkit-scrollbar-track {
      box-shadow: inset 0 0 5px grey; 
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
    `);
}
