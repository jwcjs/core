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
    children: VNode[]
  ) {
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
export function diff(oldVNode: any, newVNode: any) {
  markNewVNode(newVNode);
  diffRecursive(oldVNode, newVNode);
  update(newVNode);
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
function diffRecursive(oldVNode: VNode, newVNode: VNode) {
  if (oldVNode?.isDeleted) {
    return;
  }
  if (newVNode.isNew) {
    // if the new vnode is new, then return;
    return;
  }

  if (oldVNode?.tagName !== newVNode.tagName) {
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
  for (const child of Object.values(node.children)) {
    update(child);
  }
}

/**
 * Create a dom node according to the tag name of the vnode.
 * 
 * 1. Create a dom node according to the tag name of the vnode.
 * 2. Set the attributes of the dom node.
 * 3. Create the child nodes of the dom node.
 * 
 * @param node the vnode
 */
function createElement(node: VNode): Node {
  // create a dom node according to the tag name of the vnode
  const el = document.createElement(node.tagName);

  // set the attributes of the dom node
  for (const key in node.attributes) {
    el.setAttribute(key, node.attributes[key]);
  }

  // create the child nodes of the dom node
  if (node.children) {
    for (const child of node.children) {
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