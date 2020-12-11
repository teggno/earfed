export function arrayToMap(array, keyFn) {
  return array.reduce((prev, current) => {
    prev[keyFn(current)] = current;
    return prev;
  }, {});
}

export function arrayOfLength(length, itemFactory) {
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
export function sortedInsert(keysSorted) {
  const keysSortedMap = keysSorted.reduce((obj, key, index) => {
    obj[key] = index;
    return obj;
  }, {});
  const known = new Array(keysSorted.length);
  const unknown = [];
  function insert(key, item) {
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

export function debounce(func, wait = 100) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}
