import { VNode } from "../v-dom";

export function removeAttrs(
	vnode: VNode | VNode[],
	attrs: string[] = ["isNew"]
) {
	if (vnode instanceof Array) {
		for (const node of vnode) {
			removeAttrs(node, attrs);
		}
		return {
			vnode,
		};
	}
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
