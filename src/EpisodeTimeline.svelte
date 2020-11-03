<script>
  import { secondsToTimeString } from "./time";

  export let durationSeconds = 0;
  export let currentSecond = 0;

  $: current = secondsToTimeString(currentSecond);
  $: remaining = secondsToTimeString(durationSeconds - currentSecond);

  function handleChange() {}
</script>

<style>
  input {
    width: 100%;
    margin: 0;
    padding: 0;
  }

  .currentRemaining {
    display: flex;
    justify-content: space-between;
    font-size: var(--font-size-small);
  }
</style>

<div>
  <div class="currentRemaining">
    <div>{current}</div>
    <div>{remaining}</div>
  </div>
  <input
    type="range"
    min={0}
    max={durationSeconds}
    step="10"
    on:change|stopPropagation={handleChange} />
</div>
