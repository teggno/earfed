<script context="module" lang="ts">
  export const registerRouteFn = {};

  export function pushState(innerState: any) {
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

  interface Route {
    path: string;
    getProps: GetProps;
    component: SvelteComponent;
  }

  interface GetProps {
    (innerState: any): any;
  }

  function getPropsFallback() {
    return {};
  }
</script>

<script lang="ts">
  import { onMount, setContext, SvelteComponent } from "svelte";
  import page from "page";
  import { activeRoute } from "./routing";

  export let basePath = "/";

  let routes = [] as Route[];
  let currentRoute: Route | undefined;
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

  function opener(route: Route) {
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

  function doRegisterRoute(
    path: string,
    component: SvelteComponent,
    getProps: GetProps | undefined
  ) {
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
</script>

<slot />
{#if currentRoute}
  <svelte:component this={currentRoute.component} {...currentComponentProps} />
{/if}
