import { updateDOM } from "../dom/dom";
import { removeAttrs } from "../utils/attrs";
import { patch } from "./patch";
import { VNode } from "./vnode";

/**
 * Diff the old vnode and the new vnode.
 * 
 * 1. Mark the new vnode,
 *   and mark the child nodes of the new vnode as new.
 * 2. Diff the old vnode and the new vnode.
 * 3. Update the dom tree.
 * 
 * Note:
 * I can't get the type of the old vnode and the new vnode.
 * So I use any to replace the type.
 * 
 * @param oldVNode 
 * @param newVNode
 */
export function diff(oldVNode: any, newVNode: any, host?: Node) {
  if (!oldVNode) {
    markNewVNode(newVNode);
  }
  newVNode = diffRecursive(oldVNode, newVNode);
  const updated = updateDOM(oldVNode, newVNode);

  if (host) {
    const hostel = host.childNodes[0].nodeName === 'STYLE' ? host.childNodes[1] : host.childNodes[0];
    // transform the vnode to the dom tree
    if (updated.children instanceof Array) {
      for (let index = 0; index < updated.children.length; index++) {
        patch(hostel.childNodes[index], updated.children[index], oldVNode.children[index], index);
      }
    }
  }

  return removeAttrs(updated, ["isUpdated", "isNew", "isDeleted"]);
}

/**
 * Mark the new vnode,
 * and mark the child nodes of the new vnode as new.
 * 
 * @param node the new vnode
 */
function markNewVNode(node: VNode) {
  if (node.isNew) {
    // For each child node of the node
    for (const child of node.children) {
      markNewVNode(child);
    }
  }
}

/**
 * Diff the old vnode and the new vnode.
 * 
 * 1. If the old vnode is marked as deleted, then return. 
 * 2. If the new vnode is marked as new, then return.
 * 3. If the **tag name** of the old vnode and the new vnode are not equal,
 *   then mark the old vnode as deleted, and mark the new vnode as new.
 * 4. If the attributes of the old vnode and the new vnode are not equal,
 *  then mark the new vnode as updated.
 * 5. Diff the child nodes of the old vnode and the new vnode.
 * 
 * @param oldVNode 
 * @param newVNode
 */
function diffRecursive(oldVNode: VNode, newVNode: VNode, host?: VNode) {
  if (!oldVNode) return newVNode;
  // just text node
  if (typeof oldVNode === 'string' && typeof newVNode === 'string') {
    if (oldVNode !== newVNode) {
      newVNode = newVNode;
      host!.isUpdated = true;
    }
  }

  if (oldVNode?.isDeleted) {
    return oldVNode;
  }

  // if (newVNode.isNew) {
  //   // if the new vnode is new, then return;
  //   return newVNode;
  // }

  if (oldVNode?.tagName !== newVNode.tagName) {
    oldVNode.isDeleted = true;
    newVNode.isNew = true;

  }

  if (JSON.stringify(oldVNode.attributes) !== JSON.stringify(newVNode.attributes)) {
    /**
     * if the attributes of the old vnode and the new vnode are not equal,
     * then the new vnode is updated.
     */
    newVNode.isUpdated = true;
  }

  // diff the child nodes of the old vnode and the new vnode
  if (oldVNode.children && newVNode.children) {
    const oldChildren = Object.values(oldVNode.children);
    const newChildren = Object.values(newVNode.children);
    if (JSON.stringify(oldChildren) !== JSON.stringify(newChildren)) {
      const maxLength = Math.max(oldChildren.length, newChildren.length);
      for (let i = 0; i < maxLength; i++) {
        newVNode.children[i] = diffRecursive(oldChildren[i], newChildren[i], newVNode);
      }
    }
  }

  return newVNode;
}