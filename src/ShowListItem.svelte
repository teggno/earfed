<script>
  import { showImageThumbUrl } from "./config";
  import ImgWithFallback from "./ImgWithFallback.svelte";

  export let show;
</script>

<style>
  li {
    --square-size: max(
      calc(
        var(--assumed-normal-lh) * var(--font-size-medium) +
          var(--assumed-normal-lh) * var(--font-size-small) + var(--spacing-1)
      ),
      44px
    );
    display: flex;
    align-items: center;
    padding: var(--spacing-3) 0;
  }

  /* targets ImgWithFallback */
  li > :global(:first-child) {
    border-radius: 4px;
    width: var(--square-size);
    height: var(--square-size);
  }

  .rightOfImage {
    margin-left: var(--spacing-3);
  }
</style>

<li>
  <ImgWithFallback src={showImageThumbUrl(show.showImageUrl)} />
  <div class="rightOfImage">{show.showTitle}</div>
</li>
