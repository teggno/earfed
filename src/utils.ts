export function arrayToMap<T, K extends string | number>(
  array: T[],
  keyFn: (item: T) => K
) {
  return array.reduce((prev, current) => {
    prev[keyFn(current)] = current;
    return prev;
  }, {} as { [k in K]: T });
}

export function arrayOfLength<T>(
  length: number,
  itemFactory: (index: number) => T
) {
  const arr = new Array(length);
  for (var i = 0; i < length; i++) {
    arr[i] = itemFactory(i);
  }
  return arr;
}

export function isPromise(maybePromise) {
  return maybePromise && typeof maybePromise.then === "function";
}

/**
 * Creates an object that has an `insert()` method that adds the items passed as
 * the second argument in the order according to the `keysSorted` argument.
 * @param {Array} keysSorted the items added by calling `insert()` will be
 * returned in the order their keys appear in this array.
 */
export function sortedInsert<T>(keysSorted: string[]) {
  const keysSortedMap = keysSorted.reduce((obj, key, index) => {
    obj[key] = index;
    return obj;
  }, {} as { [key: string]: number });
  const known = new Array<T>(keysSorted.length);
  const unknown = [] as T[];
  function insert(key: string, item: T) {
    const index = keysSortedMap[key];
    if (typeof index === "undefined") {
      unknown.push(item);
    } else {
      known[index] = item;
    }
  }
  function get() {
    return [...known.filter((x) => typeof x !== undefined), ...unknown];
  }
  return { insert, get };
}

export function debounce(func: Function, wait: number = 100) {
  let timeout: number | undefined;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}
