<script context="module">
  import { writable } from "svelte/store";
  //   const basePath = "/";

  export const registerRouteFn = {};
  export const activeRoute = writable({ activePath: "/" });
</script>

<script>
  import { onMount, setContext } from "svelte";
  import page from "page";

  export let basePath = "/";

  let routes = [];
  let currentComponent;

  setContext(registerRouteFn, doRegisterRoute);

  onMount(() => {
    page.base(basePath);
    routes.forEach((route) => {
      page("*", (context, next) => {
        activeRoute.update((old) => ({ ...old, activePath: context.path }));
        next();
      });
      page(route.path, opener(route.component));
    });
    page();
  });

  function opener(component) {
    return (context) => {
      currentComponent = component;
    };
  }

  function doRegisterRoute(path, component) {
    const newItem = { path, component };
    routes = [...routes, newItem];
    // return the unregister function
    return () => {
      routes = routes.filter((r) => r !== newItem);
    };
  }
</script>

<slot />
{#if currentComponent}
  <svelte:component this={currentComponent} />
{/if}
