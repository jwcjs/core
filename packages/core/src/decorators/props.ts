import { defineProps } from "@jwcjs/reactively";
import { PropOptions } from "@jwcjs/shared";

export function Prop(options: PropOptions): PropertyDecorator {
	return (target, key) => {
		defineProps(target, String(key), options);
	};
}
