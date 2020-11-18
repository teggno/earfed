<script>
  import ImgWithFallback from "./ImgWithFallback.svelte";

  import Square from "./Square.svelte";

  export let show;
</script>

<style>
  li {
    --square-size: max(
      max(
        calc(
          var(--assumed-normal-lh) * var(--font-size-medium) +
            var(--assumed-normal-lh) * var(--font-size-small) + var(--spacing-1)
        ),
        9%
      ),
      44px
    );
    display: flex;
    align-items: center;
    padding: var(--spacing-3) 0;
  }

  .rightOfImage {
    margin-left: var(--spacing-3);
  }

  /* targets the image or the fallback */
  li > :global(*) > :global(*):first-child {
    border-radius: 4px;
  }
</style>

<li>
  <Square>
    <ImgWithFallback src={show.showImageUrl} />
  </Square>
  <div class="rightOfImage">{show.showTitle}</div>
</li>
