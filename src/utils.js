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
