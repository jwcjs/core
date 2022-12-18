import { CustomElementProps } from "../types";

export function Component(options: CustomElementProps) {
	return function (_class: any) {
		// set the default value for the isMounted option
		if (options.isMounted === undefined) options.isMounted = true;
		if (customElements.get(options.name)) {
			console.warn(`The component ${options.name} already exists.`);
		}
		_class.$options = options; // add the options to the class
		customElements.define(options.name, _class, options.options || {});
	};
}
