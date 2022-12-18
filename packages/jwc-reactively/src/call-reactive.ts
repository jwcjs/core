import { CustomElementProps, COMPONENT_EVENT_METADATA_KEY } from "jwcjs";
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
      this.updateDiff();
    },
  });
}

export function reactiveData(data: ReactiveData[]) {
  for(let i = 0; i < Object.keys(data).length; i++) {
    const item = data[i]
    console.log(item, "item");
    defineProxy(this, item.attr, item)
  }
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