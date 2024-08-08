const htmlTags = [
  'a',
  'abbr',
  'address',
  'area',
  'article',
  'aside',
  'audio',
  'b',
  'base',
  'bdi',
  'bdo',
  'blockquote',
  'body',
  'br',
  'button',
  'canvas',
  'caption',
  'cite',
  'code',
  'col',
  'colgroup',
  'data',
  'datalist',
  'dd',
  'del',
  'details',
  'dfn',
  'dialog',
  'div',
  'dl',
  'dt',
  'em',
  'embed',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'head',
  'header',
  'hgroup',
  'hr',
  'html',
  'i',
  'iframe',
  'img',
  'input',
  'ins',
  'kbd',
  'label',
  'legend',
  'li',
  'link',
  'main',
  'map',
  'mark',
  'meta',
  'meter',
  'nav',
  'noscript',
  'object',
  'ol',
  'optgroup',
  'option',
  'output',
  'p',
  'param',
  'picture',
  'pre',
  'progress',
  'q',
  'rp',
  'rt',
  'ruby',
  's',
  'samp',
  'script',
  'section',
  'select',
  'small',
  'source',
  'span',
  'strong',
  'style',
  'sub',
  'summary',
  'sup',
  'table',
  'tbody',
  'td',
  'template',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'time',
  'title',
  'tr',
  'track',
  'u',
  'ul',
  'var',
  'video',
  'wbr',
];
const aad_components = [];

function loadComponent(componentName, componentFunction, componentConfig) {
  aad_components.push({
    componentName,
    componentFunction,
    componentConfig,
  });
}

Node.prototype.aadAppendChild = function (newChild) {
  if (Array.isArray(newChild)) {
    newChild.forEach((child) => {
      this.appendChild(child);
    });
    return;
  }

  this.appendChild(newChild);
};

function render(dictionary, html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const parentNodes = Array.from(doc.body.children);

  function findRefs(elements) {
    elements.forEach((element) => {
      const ref = element.getAttribute('ref');
      if (ref) {
        if (!!dictionary) {
          if (dictionary.hasOwnProperty(ref)) {
            let oldVal = dictionary[ref];
            if (!Array.isArray(oldVal)) {
              oldVal = [oldVal];
            }
            dictionary[ref] = [...oldVal, element];
          } else {
            dictionary[ref] = element;
          }
        }
      }
      const children = element.childNodes;
      for (let i = 0; i < children.length; i++) {
        if (children[i].nodeType === 1) {
          findRefs([children[i]]);
        }
      }
    });
  }

  findRefs(parentNodes);
  if (parentNodes.length === 1) {
    return parentNodes[0];
  }
  return parentNodes;
}

/*
const noSettings = aadRender(
  null,
  `
  <Hello text="Matt" times="3" class="aad-w-full aad-center" />
  `
);

settingsRefs.inner.aadAppendChild(noSettings);
*/
function aadRender(dictionary, html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const parentNodes = Array.from(doc.body.children);

  function findRefs(elements) {
    for (let i = 0; i < elements.length; i++) {
      let element = elements[i];

      const tagName = element.tagName.toLowerCase();
      if (!htmlTags.includes(tagName)) {
        const component = aad_components.find(
          (component) => component.componentName === tagName
        );
        if (!!component) {
          const componentConfig = component.componentConfig;
          let parameters = {};
          let elementAttributes = element.attributes || [];
          componentConfig.parameters.forEach((param) => {
            const value = element.getAttribute(param.name);
            if (elementAttributes[param.name]) {
              elementAttributes.removeNamedItem(param.name);
            }
            if (value) {
              if (param.type === 'number') {
                parameters[param.name] = Number(value);
              } else if (param.type === 'boolean') {
                parameters[param.name] = value === 'true';
              } else {
                parameters[param.name] = value;
              }
            } else {
              if (!param.nullable) {
                fireError('AAD - Missing parameter (' + param.name + ')', {
                  extra: {
                    element: {
                      tagName,
                      attributes: {
                        ...element.attributes,
                      },
                      children: [...element.children],
                    },
                    component,
                    param,
                  },
                });
                throw new Error(
                  `Parameter ${param.name} is required for ${tagName}`
                );
              }
            }
          });


          let _params = ' ';
          const length = elementAttributes.length;
          for (let i = 0; i < length; i++) {
            const attr = elementAttributes[i];
            _params += `${attr.name}="${attr.value}" `;
          }
          parameters._params = _params;       

          const componentFunction = component.componentFunction;
          const componentElement = componentFunction(parameters);
          element = componentElement;
          elements[i] = element;
        }
      }

      const ref = element.getAttribute('ref');
      if (ref) {
        if (!!dictionary) {
          if (dictionary.hasOwnProperty(ref)) {
            let oldVal = dictionary[ref];
            if (!Array.isArray(oldVal)) {
              oldVal = [oldVal];
            }
            dictionary[ref] = [...oldVal, element];
          } else {
            dictionary[ref] = element;
          }
        }
      }
      const children = element.childNodes;
      for (let i = 0; i < children.length; i++) {
        if (children[i].nodeType === 1) {
          findRefs([children[i]]);
        }
      }
    }
  }

  findRefs(parentNodes);
  if (parentNodes.length === 1) {
    return parentNodes[0];
  }
  return parentNodes;
}
