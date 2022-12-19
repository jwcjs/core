import { defineWatcher } from "packages/reactively";
import { WatcherOptions } from "../types";

export * from "./props";
export * from "./event";
export * from "./component";

export function Watcher(options: WatcherOptions): MethodDecorator {
	return (target, key, descriptor) => {
		defineWatcher(target, {
			...options,
			callback: descriptor.value,
			callbackName: String(key),
		});
	};
}
