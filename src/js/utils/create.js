export default function create(tagName, classNames, children, parent, ...dataAttr) {
  let element = null;
  if (tagName) {
    element = document.createElement(tagName);
  } else {
    throw new Error(`Can't create ${tagName}, give a proper tag name!`);
  }

  if (children && Array.isArray(children)) {
    children.forEach((childElement) => childElement && element.append(childElement));
  } else if (children && typeof children === 'object') {
    element.appendChild(children);
  } else if (children && typeof children === 'string') {
    element.innerHTML = children;
  }

  if (parent) {
    parent.append(element);
  }

  if (classNames) element.classList.add(...classNames.split(' '));

  if (dataAttr.length) {
    dataAttr.forEach((attrName, attrValue) => {
      if (attrName === '') {
        element.setAttribute(attrName, '');
      } else if (attrName.match(/value|id|placegolder/)) {
        element.dataset[attrName] = attrValue;
      }
    });
  }

  return element;
}
