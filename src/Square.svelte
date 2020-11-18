<style>
  .square {
    --size: var(--square-size, var(--min-touchable-size));
    width: var(--size);
    padding-bottom: var(--size);
    height: 0;
    position: relative;
  }

  .square > :global(*) {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    position: absolute;
  }
</style>

<div class="square">
  <slot />
</div>
