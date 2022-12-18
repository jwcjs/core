/**
 * Create a style element with the given CSS text.
 * Returns a DOM element.
 *
 * @param {string} css
 */
export function createCSSElement(css: string) {
	const style = document.createElement("style");
	style.appendChild(document.createTextNode(css));
	return style;
}
