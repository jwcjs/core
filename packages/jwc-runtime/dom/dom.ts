import { VNode } from "../v-dom";
import { createElement, updateElement } from "./elements";

/**
 * Update the dom tree.
 * 
 * 1. If the node is marked as deleted, then remove it from the dom tree.
 * 2. If the node is marked as new, then create a new dom node.
 * 3. If the node is marked as updated, then 
 *    update the attributes of the dom node.
 * 4. Update the child nodes of the dom node.
 * 
 */
export function updateDOM(oldNode: VNode | undefined, newNode: VNode) {
  // if the node is marked as deleted, then remove it from the dom tree
  if (newNode.isDeleted) {
    newNode.el!.parentNode!.removeChild(newNode.el!);
    return newNode;
  }

  // if the node is marked as new, then create a new dom node
  if (newNode.isNew) {
    console.log('create', newNode);
    newNode.el = createElement(newNode);
    return newNode;
  }

  // if the node is marked as updated, then update the attributes of the dom node
  if (newNode.isUpdated) {
    const updated = updateElement(oldNode, newNode);
    if (updated) {
      newNode.el = updated;
    }
    return newNode;
  }

  // update the child nodes of the dom node
  if (newNode.children) {
    for (const child of Object.values(newNode.children)) {
      updateDOM(undefined, child);
    }
  }

  return newNode;
}