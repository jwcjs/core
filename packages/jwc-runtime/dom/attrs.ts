export function updateAttributes(el: Node, attributes: { [key: string]: any }) {
  for (const key in attributes) {
    if (key === 'style') {
      for (const styleKey in attributes[key]) {
        (el as HTMLElement).style[styleKey] = attributes[key][styleKey];
      }
    } else {
      (el as HTMLElement).setAttribute(key, attributes[key]);
    }
  }
}
