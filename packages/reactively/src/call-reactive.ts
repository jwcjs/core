import { CustomElementProps } from "@jwcjs/shared";
import { reactive } from "./reactive";

/**
 * There are two types of reactive functions:
 * 1. data
 * 2. event
 */
export type ReactiveData = CustomElementProps;

export type ReactiveEvent = {
	name: any;
	handler: any;
};

export function defineProxy(target: any, propertyKey: string, value: any) {
	const reactiveValue = reactive(value);
	Object.defineProperty(target, propertyKey, {
		get() {
			return reactiveValue.value;
		},
		set(newValue) {
			reactiveValue.value = newValue;
			this.shouldUpdate = true;
			// callback the new value to the watcher
			this.watchersMap.get(propertyKey)?.forEach((watcher: any) => {
				watcher.callback.call(this, newValue, value);
			});
			this.updateDiff();
		},
	});
}
