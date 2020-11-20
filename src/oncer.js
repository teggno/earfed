export function oncer() {
  let executed = false;
  return (fn) => {
    if (executed) return;
    executed = true;
    fn();
  };
}
