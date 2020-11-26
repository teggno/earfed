<script>
  import { getContext, onMount } from "svelte";
  import { registerRouteFn } from "./Router.svelte";

  export let path;
  export let component;
  export let getProps = undefined;

  const registerRoute = getContext(registerRouteFn);
  onMount(() => {
    // making returning explicit instead of just returing/removing curlies
    // so it doesn't become the victim of some refactoring.
    const unregister = registerRoute(path, component, getProps);
    return unregister;
  });
</script>
