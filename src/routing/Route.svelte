<script>
  import { getContext, onMount } from "svelte";
  import { registerRouteFn } from "./Router.svelte";

  export let path;
  export let component;

  const registerRoute = getContext(registerRouteFn);
  onMount(() => {
    // making this explicit instead of just returing/removing curlies
    // so it doesn't become the victim of some refactoring.
    const unregister = registerRoute(path, component);
    return unregister;
  });
</script>
