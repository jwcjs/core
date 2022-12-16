import { defineProps, defineState } from "@jwcjs/reactively";
import { PropOptions } from "../types";

export function Prop(options: PropOptions): PropertyDecorator {
  return (target, key) => {
    defineProps(target, String(key), options);
  }
}

export function State(options: PropOptions): PropertyDecorator {
  return (target, key) => {
    defineState(target, String(key), options);
  }
}
