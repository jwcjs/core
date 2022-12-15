export class VNode {
  tagName: string;
  attributes: {
    [key: string]: any;
  }
  children: VNode[];

  // to assign status to the vnode
  isNew: boolean;
  isUpdated: boolean;
  isDeleted: boolean;

  // to record the dom node
  el: Node | null;

  constructor(
    tagName: string,
    attributes: { [key: string]: any },
    children: VNode[]) {
    this.tagName = tagName;
    this.attributes = attributes;
    this.children = children;
    this.isNew = true;
    this.isUpdated = false;
    this.isDeleted = false;
    this.el = null;
  }

  public static isVNode(vnode: any): vnode is VNode {
    return vnode instanceof VNode;
  }
}

export function diff(oldVNode: VNode, newVNode: VNode): VNode {
  // mark the new vnode
  markNewVNode(newVNode);

  // diff the old vnode and the new vnode
  diffRecursive(oldVNode, newVNode);

  // update the dom tree
  update(newVNode);

  return newVNode;
}

function markNewVNode(node: VNode) {
  if (node.isNew) {
    // For each child node of the node
    for (const child of node.children) {
      markNewVNode(child);
    }
  }
}

function diffRecursive(oldVNode: VNode, newVNode: VNode) {
  if (oldVNode.isDeleted) {
    return;
  }
  if (newVNode.isNew) {
    // if the new vnode is new, then return;
    return;
  }

  if (oldVNode.tagName !== newVNode.tagName) {
    oldVNode.isDeleted = true;
    newVNode.isNew = true;
    return;
  }

  if (JSON.stringify(oldVNode.attributes) !== JSON.stringify(newVNode.attributes)) {
    /**
     * if the attributes of the old vnode and the new vnode are not equal,
     * then the new vnode is updated.
     */
    newVNode.isUpdated = true;
  }
}

function update(node: VNode) {
  // if the node is marked as deleted, then remove it from the dom tree
  if (node.isDeleted) {
    node.el!.parentNode!.removeChild(node.el!);
    return;
  }

  // if the node is marked as new, then create a new dom node
  if (node.isNew) {
    node.el = createElement(node);
    return;
  }

  // if the node is marked as updated, then update the attributes of the dom node
  if (node.isUpdated) {
    updateElement(node);
  }

  // update the child nodes of the dom node
  for (const child of node.children) {
    update(child);
  }
}

function createElement(node: VNode): Node {
  // create a dom node according to the tag name of the vnode
  const el = document.createElement(node.tagName);

  // set the attributes of the dom node
  for (const key in node.attributes) {
    el.setAttribute(key, node.attributes[key]);
  }

  // create the child nodes of the dom node
  for (const child of node.children) {
    el.appendChild(createElement(child));
  }

  return el;
}

function updateElement(node: VNode) {
  // get the dom node of the vnode
  const el = node.el! as HTMLElement;
  // get the attributes of the vnode
  const attributes = node.attributes;

  // update the attributes of the dom node
  for (const key in attributes) {
    el.setAttribute(key, attributes[key]);
  }

  for (const child of node.children) {
    update(child);
  }
}