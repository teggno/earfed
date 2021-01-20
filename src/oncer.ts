export function oncer() {
  let executed = false;
  return (fn: Function) => {
    if (executed) return;
    executed = true;
    fn();
  };
}
