<script context="module">
  import { writable } from "svelte/store";

  export const registerRouteFn = {};
  export const activeRoute = writable({ activePath: "/" });
</script>

<script>
  import { onMount, setContext } from "svelte";
  import page from "page";

  export let basePath = "/";

  let routes = [];
  let currentRoute;

  $: currentComponentProps = currentRoute ? currentRoute.getProps() : {};

  setContext(registerRouteFn, doRegisterRoute);

  onMount(() => {
    page.base(basePath);
    routes.forEach((route) => {
      page("*", (context, next) => {
        activeRoute.update((old) => ({ ...old, activePath: context.path }));
        next();
      });
      page(route.path, opener(route));
    });
    page();
  });

  function opener(route) {
    return (context) => {
      currentRoute = route;
    };
  }

  function doRegisterRoute(path, component, getProps) {
    const newItem = {
      path,
      component,
      getProps: typeof getProps === "function" ? getProps : getPropsFallback,
    };
    routes = [...routes, newItem];
    // return the unregister function
    return () => {
      routes = routes.filter((r) => r !== newItem);
    };
  }

  function getPropsFallback() {
    return {};
  }
</script>

<slot />
{#if currentRoute}
  <svelte:component this={currentRoute.component} {...currentComponentProps} />
{/if}
