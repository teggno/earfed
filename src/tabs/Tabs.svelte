<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import Tab from "./Tab.svelte";

  export let items: any[];
  export let value: any;

  $: selectedIndex = items.indexOf(value);
  $: tabCount = items.length;

  const dispatch = createEventDispatcher();

  function handleTabClick(item) {
    dispatch("change", { item, selectedIndex: items.indexOf(item) });
  }
</script>

<div
  class="root"
  style={`--selected-index: ${selectedIndex};--tab-count: ${tabCount}`}
>
  <div class="list" role="tablist">
    {#each items as item}
      <Tab
        selected={item === value}
        on:click={() => handleTabClick(item)}
        disabled={item.disabled || false}
      >
        <slot {item} />
      </Tab>
    {/each}
  </div>
  <div class="bar" />
</div>

<style>
  .root {
    position: relative;
    --tab-count: var(--tab-count);
    --selected-index: var(--selected-index);
    --tab-width: calc(100% / var(--tab-count));
    --translate-x: calc(var(--selected-index) * 100%);
    --bar-height: 4px;

    padding-bottom: var(--bar-height);
  }

  .list {
    display: flex;
    justify-content: stretch;
  }

  .bar {
    position: absolute;
    border-bottom: var(--color-accent) var(--spacing-2) solid;
    width: var(--tab-width);
    transform: translateX(var(--translate-x));
    transition: transform 0.4s;
  }
</style>
