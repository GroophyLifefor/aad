const currentTheme = aadTheme_GitHub;

function getColor(_keys) {
  const keys = _keys.split('.');
  let theme = currentTheme;
  for (let key of keys) {
    theme = theme[key];

    if (!theme) {
      fireError('AAD - getColor - Theme key not found', {
        extra: {
          ThemeProviderInfo: {
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