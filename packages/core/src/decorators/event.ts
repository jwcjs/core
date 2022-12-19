import { defineEvent } from "packages/reactively";

export function Event(event: string): MethodDecorator {
	return (target, key, descriptor) => {
		defineEvent(target, {
			name: event,
			handler: descriptor.value,
		});
	};
}
