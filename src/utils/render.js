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

function aadRender(html) {
  const dictionary = {};
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const parentNodes = Array.from(doc.body.children);

  /*
      REF FEATURE START
  */
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
  /*
      REF FEATURE END
  */

  return {
    refs: dictionary,
    node: parentNodes,
  };
}