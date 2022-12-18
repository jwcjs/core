import { VNode } from "../v-dom";
import { updateDOM } from "./dom";

/**
 * Create a dom node according to the tag name of the vnode.
 * 
 * 1. Create a dom node according to the tag name of the vnode.
 * 2. Set the attributes of the dom node.
 * 3. Create the child nodes of the dom node.
 * 
 * @param node the vnode
 */
export function createElement(node: VNode): Node {
  // create a dom node according to the tag name of the vnode
  const el = document.createElement(node.tagName);

  // set the attributes of the dom node
  for (const key in node.attributes) {
    if (key.startsWith("on")) {
      el.addEventListener(key.slice(2).toLowerCase(), node.attributes[key]);
    } else {
      el.setAttribute(key, node.attributes[key]);
    }
  }

  // create the child nodes of the dom node
  if (node.children) {
    for (const child of node.children) {
      if (typeof child === 'string') {
        el.appendChild(document.createTextNode(child));
        continue;
      }
      el.appendChild(createElement(child));
    }
  }
  return el;
}

/**
 * Update the attributes of the dom node.
 * 
 * 1. Get the dom node of the vnode.
 * 2. Get the attributes of the vnode.
 * 3. Update the attributes of the dom node.
 * 4. Update the child nodes of the dom node.
 * 
 * @param node the vnode
 */
export function updateElement(oldNode: VNode, newNode: VNode) {
  // get the dom node of the vnode
  const el = newNode.el! as HTMLElement;

  // get the attributes of the vnode
  const attributes = newNode.attributes;

  // update the attributes of the dom node
  for (const key in attributes) {
    if (key.startsWith("on")) {
      if (typeof oldNode?.attributes[key] === 'function') {
        const eventName = key.slice(2).toLowerCase()
        el.removeEventListener(eventName, oldNode.attributes[key])
        el.addEventListener(eventName, attributes[key])
      }
    } else {
      el.setAttribute(key, attributes[key]);
    }
  }

  for (const child of newNode.children) {
    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
      continue;
    }
    el.appendChild(createElement(child));
  }


  // update the child nodes of the dom node
  if (newNode.children) {
    for (const child of Object.values(newNode.children)) {
      updateDOM(undefined, child);
    }
  }

  return el;
}