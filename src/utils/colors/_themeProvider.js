const defaultThemeName = 'dark-dimmed';
let currentThemeName = 'Not loaded';
let currentTheme = 'Not loaded';
const aadThemes = {
  'dark-dimmed': aadTheme_DarkDimmed,
}

function getColor(_keys) {
  const keys = _keys.split('.');
  let theme = currentTheme;
  for (let key of keys) {
    theme = theme[key];

    if (!theme) {
      fireError('AAD - getColor - Theme key not found', {
        extra: {
          ThemeProviderInfo: {
            currentThemeName,
            currentTheme,
            keyFromParameter: _keys,
            keyWhichParsed: key,
          }
        },
      });
      return '#000000' /* default return color as Black */;
    }
  }

  return theme;
}

function loadTheme(themeName) {
  if (!themeName) {
    themeName = defaultThemeName;
  } else {
    themeName = themeName.toLowerCase();
  }

  if (!aadThemes[themeName]) {
    console.log(`Theme not found: ${themeName}`);
    return;
  }

  currentThemeName = themeName;
  currentTheme = aadThemes[themeName];
  console.log(`Theme loaded: ${themeName}`, currentTheme);
}

loadTheme();