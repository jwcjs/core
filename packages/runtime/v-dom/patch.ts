import { createElement } from "../dom";
import { updateAttributes } from "../dom/attrs";

import { VNode } from "./vnode";

export function patch(host: Node, vnode: VNode, old: VNode, index: number) {
	// console.log("patch", host, vnode, old, index);
	if (vnode.isUpdated) {
		// update the attributes of the dom node
		updateAttributes(vnode.el, vnode.attributes);
		// update the children of the dom node
		// if the children is a string, update the textContent of the dom node
		if (typeof vnode.children === "string") {
			vnode.el.textContent = vnode.children;
		}
		host.parentNode?.replaceChild(createElement(vnode), host);
	} else if (vnode.isNew) {
		host.appendChild(createElement(vnode));
	} else if (vnode.isDeleted) {
		host.removeChild(host.childNodes[index]);
	}

	// update the children of the dom node
	if (vnode.children instanceof Array) {
		for (let index = 0; index < vnode.children.length; index++) {
			// find the dom node in the host node
			const child = host.childNodes[index];
			patch(child, vnode.children[index], old.children[index], index);
			continue;
		}
	}
	return;
}
