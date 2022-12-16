export interface WatcherOptions {
  /**
   * Whether the watcher should be called immediately.
   */
  immediate?: boolean;

  /**
   * Callback function.
   */
  callback?: any;

  /**
   * Callback name.
   * if handler is not provided, the callback will be called.
   */
  callbackName?: string;

  /**
   * deep watch
   */
  deep?: boolean;
}