import { VNode } from "../v-dom";

export function removeAttrs(vnode: VNode, attrs: string[] = ["isNew"]) {
	for (const attr of attrs) {
		vnode[attr] ? (vnode[attr] = false) : null;
	}
	if (vnode.children) {
		for (const child of Object.values(vnode.children)) {
			removeAttrs(child, attrs);
		}
	}
	return vnode;
}
