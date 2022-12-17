/**
 * We use getter and setter to make sure that the value is always
 * up to date. This is important because we want to be able to
 * use the value in a template.
 * 
 * We use Reflect.get and Reflect.set to make sure that we can
 * use the value in a template.
 */
export function reactive<T extends Object>(target: T): T {
  // console.log(target);
  
  return new Proxy<T>(target, {
    get(target, key) {
      return Reflect.get(target, key);
    },
    set(target, key, value) {
      Reflect.set(target, key, value);
      return true;
    }
  });
}