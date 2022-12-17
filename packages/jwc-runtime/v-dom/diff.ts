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
    this.el = document.createElement(tagName);
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
export function diff(oldVNode: any, newVNode: any, host?: Node) {
  if (!oldVNode) {
    markNewVNode(newVNode);
  }
  newVNode = diffRecursive(oldVNode, newVNode);
  const updated = update(oldVNode, newVNode);
  console.log(updated, 'updated');
  if (host) {
    // transform the vnode to the dom tree
    patch(host, updated, oldVNode);
  }
}

export function patch(host: Node, vnode: VNode, old: VNode) {
  if (vnode.isUpdated) {
    console.log(vnode, 'vnode');
    // update the attributes of the dom node
    updateAttributes(vnode.el, vnode.attributes);
    // update the children of the dom node
    // if the children is a string, update the textContent of the dom node
    if (typeof vnode.children === 'string') {
      vnode.el.textContent = vnode.children;
    }
    host.replaceChild(vnode.el, old.el);
  } else if (vnode.isNew) {
    host.appendChild(vnode.el);
  } else if (vnode.isDeleted) {
    host.removeChild(vnode.el);
  }

  // update the children of the dom node
  if (vnode.children instanceof Array) {
    for (const child of vnode.children) {
      patch(vnode.el, child, old);
    }
  }
  
  return vnode;
}

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
function update(oldNode: VNode | undefined, newNode: VNode) {
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
      update(undefined, child);
    }
  }

  return newNode;
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
function updateElement(oldNode: VNode, newNode: VNode) {
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
      update(undefined, child);
    }
  }

  return el;
}

export function removeIsNew(vnode: VNode) {
  if (vnode.isNew) {
    vnode.isNew = false;
  }
  if (vnode.children) {
    vnode.children.forEach((child: VNode) => {
      removeIsNew(child);
    });
  }
  return vnode;
}