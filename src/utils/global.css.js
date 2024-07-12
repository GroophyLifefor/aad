function initGlobalCSS() {
  addCustomCSS(`
    aad-center {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    body {
      background-color: #1c2128;
    }

    .AppHeader {
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
    }
    `);
}
