import navigate from "./navigate";
import { activeRoute } from "./Router.svelte";

export default function link(node, { path, active, isActive }) {
  isActive =
    typeof isActive === "function"
      ? isActive
      : (activePath) => path === activePath;

  node.addEventListener("click", handleClick);
  const unsubscribeActiveRoute = activeRoute.subscribe(({ activePath }) => {
    setActive(activePath);
  });

  return {
    destroy() {
      node.removeEventListener("click", handleClick);
      unsubscribeActiveRoute();
    },
  };
  function handleClick() {
    navigate(path);
  }

  function setActive(activePath) {
    if (active) {
      if (typeof active.set !== "function") {
        console.error("use:link active must have a `set` function");
        return;
      }
      active.set(isActive(activePath));
    }
  }
}
