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