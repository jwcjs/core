import { defineEvent } from "@jwcjs/reactively";


export function Event(event: string): MethodDecorator {
  return (target, key, descriptor) => {
    defineEvent(target, {
      name: event,
      handler: descriptor.value,
    });
  }
}