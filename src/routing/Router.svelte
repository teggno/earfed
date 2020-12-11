<script context="module">
  import { writable } from "svelte/store";

  export const registerRouteFn = {};
  export const activeRoute = writable({ activePath: "/" });

  export function pushState(innerState) {
    history.pushState(
      { ...history.state, innerState: execFnOrGetValue(innerState) },
      ""
    );
  }
  export function replaceState(innerState) {
    history.replaceState(
      { ...history.state, innerState: execFnOrGetValue(innerState) },
      ""
    );
  }

  function execFnOrGetValue(fnOrValue) {
    return typeof fnOrValue === "function"
      ? fnOrValue(history.state.innerState)
      : fnOrValue;
  }
</script>

<script>
  import { onMount, setContext } from "svelte";
  import page from "page";

  export let basePath = "/";

  let routes = [];
  let currentRoute;
  let currentComponentProps = {};

  setContext(registerRouteFn, doRegisterRoute);

  onMount(() => {
    page.base(basePath);
    routes.forEach((route) => {
      page("*", (context, next) => {
        activeRoute.update((old) => ({
          ...old,
          activePath: context.path,
        }));
        next();
      });
      page(route.path, opener(route));
    });
    page();
    return () => {
      page.stop();
    };
  });

  function opener(route) {
    return (context) => {
      currentRoute = route;
      refreshCurrentComponentProps(context.state.innerState);
    };
  }

  function refreshCurrentComponentProps(innerState) {
    currentComponentProps = currentRoute
      ? currentRoute.getProps(innerState)
      : {};
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
