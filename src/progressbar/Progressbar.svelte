<div class="progressBarContainer">
  <div class="bar" />
</div>

<style>
  .progressBarContainer {
    --bar-divisor: 2;
  }

  .bar {
    height: 100%;
    width: calc(100% / var(--bar-divisor));
    background-color: var(--color-accent);
    animation: progress 1s ease-in-out infinite alternate;
  }

  @keyframes progress {
    from {
      transform: translateX(0);
    }

    to {
      transform: translateX(calc((var(--bar-divisor) - 1) * 100%));
    }
  }
</style>
