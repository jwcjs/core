import { PropOptions, WatcherOptions, COMPONENT_EVENT_METADATA_KEY, COMPONENT_PROP_METADATA_KEY } from "jwcjs";
import { ReactiveEvent } from "./call-reactive";

/**
 * A universal function for defining props and state
 */
function definePropsOrState(target: any, attr: string, options: PropOptions) {
  const { default: v, required } = options;
  const keys = Reflect
    .getMetadata(
      COMPONENT_PROP_METADATA_KEY,
      target
    ) || [];

  keys.push({
    attr,
    default: v,
    required,
  });
  Reflect.defineMetadata(
    COMPONENT_PROP_METADATA_KEY,
    keys,
    target
  );
}

/**
 * Define props for component
 */
export function defineProps(target: any, attr: string, options: PropOptions) {
  definePropsOrState(target, attr, options);
}

/**
 * Define state for component
 */
export function defineState(target: any, attr: string, options: PropOptions) {
  definePropsOrState(target, attr, options);
}

/**
 * Define event for component
 */
export function defineEvent(target: any, event: ReactiveEvent) {
  const keys = Reflect.getMetadata(COMPONENT_EVENT_METADATA_KEY, target) || [];
  keys.push(event);
  Reflect.defineMetadata(COMPONENT_EVENT_METADATA_KEY, keys, target);
}

/**
 * Define watcher for component
 */
export function defineWatcher(target: any, options: WatcherOptions) {
  const keys = Reflect.getMetadata(COMPONENT_EVENT_METADATA_KEY, target) || [];
  keys.push(options);
  Reflect.defineMetadata(COMPONENT_EVENT_METADATA_KEY, keys, target);
}