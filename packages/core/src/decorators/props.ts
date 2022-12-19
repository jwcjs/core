import { defineProps } from "packages/reactively";
import { PropOptions } from "shared";

export function Prop(options: PropOptions): PropertyDecorator {
	return (target, key) => {
		defineProps(target, String(key), options);
	};
}
