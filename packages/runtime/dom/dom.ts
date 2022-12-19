import { VNode } from "../v-dom";
import { camelToDash } from "../utils/others";

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
	const el =
		node.tagName === "Fragment"
			? document.createDocumentFragment()
			: document.createElement(node.tagName);

	// set the attributes of the dom node
	const attributes = node.attributes;
	for (const key in attributes) {
		if (key.startsWith("on")) {
			const eventName = key.slice(2).toLowerCase();
			el.addEventListener(eventName, attributes[key]);
		} else {
			node.tagName === "Fragment"
				? null
				: // @ts-ignore
				  el.setAttribute(camelToDash(key), attributes[key]);
		}
	}

	// create the child nodes of the dom node
	if (node.children) {
		for (const child of node.children) {
			if (typeof child === "string") {
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
			if (typeof oldNode?.attributes[key] === "function") {
				const eventName = key.slice(2).toLowerCase();
				el.removeEventListener(eventName, oldNode.attributes[key]);
				el.addEventListener(eventName, attributes[key]);
			}
		} else {
			el.setAttribute(camelToDash(key), attributes[key]);
		}
	}

	for (const child of newNode.children) {
		if (typeof child === "string") {
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
		console.log("create", newNode);
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
