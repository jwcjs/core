import { CustomElementProps, COMPONENT_EVENT_METADATA_KEY } from "@jwcjs/core";
import { reactive } from "./reactive";

/**
 * There are two types of reactive functions:
 * 1. data
 * 2. event
 */
export type ReactiveData = CustomElementProps & {
  attr: "Prop" | "State";
}

export type ReactiveEvent = {
  name: any;
  handler: any;
}

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
    },
  });
}

export function reactiveData(data: ReactiveData) {
  return function (target: any, propertyKey: string) {
    const { attr } = data;
    const { $data } = target;
    const { [propertyKey]: value } = $data;
    const reactiveValue = reactive(value);
    $data[propertyKey] = reactiveValue;
    defineProxy(target, propertyKey, value);
    target[`$${attr}`][propertyKey] = reactiveValue;
  };
}

export function reactiveEvent() {
  const getevents = this.getMetaList(COMPONENT_EVENT_METADATA_KEY) ?? [];
  getevents.forEach((event: ReactiveEvent) => {
    Object.defineProperty(this, event.name, {
      get() {
        return function (...args: any[]) {
          const res = event.handler.call(this, ...args);
          this.customEvent(event.name, res);
        }
      },    
    })
  })
}