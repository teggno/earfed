import type { Writable } from "svelte/store";
import navigate from "./navigate";
import { activeRoute } from "./routing";

export default function link(
  node: Node,
  {
    path,
    active,
    isActive,
  }: {
    path: string;
    active?: Writable<boolean>;
    isActive?: (path: string) => boolean;
  }
) {
  isActive =
    typeof isActive === "function"
      ? isActive
      : (activePath: string) => path === activePath;

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

  function setActive(activePath: string) {
    if (active) {
      if (typeof active.set !== "function") {
        console.error("use:link active must have a `set` function");
        return;
      }
      active.set(isActive!(activePath));
    }
  }
}
