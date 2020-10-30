<script>
  import ArrowLeftIcon from "./icons/ArrowLeftIcon.svelte";

  import ArrowRightIcon from "./icons/ArrowRightIcon.svelte";
  import DeleteIcon from "./icons/DeleteIcon.svelte";
  import PlayPauseButton from "./PlayPauseButton.svelte";

  let playing = true;

  function togglePlayPause() {
    playing = !playing;
  }

  function handleBack20s() {}

  function handleForward20s() {}

  function handleNotInterested() {
    // stop playing, remove from playlist
  }
</script>

<style>
  .container {
    width: calc(var(--app-max-width) / 2);
    min-width: 300px;
    min-height: 160px;
    position: fixed;
    bottom: 150px;
    right: calc(50% - var(--app-max-width) / 2);
    border-radius: 50px 0 0 50px;
    padding: var(--spacing-4);
    background-color: white;
    display: flex;
    flex-direction: column;
    /*copied from material UI dialog*/
    box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.2),
      0px 24px 38px 3px rgba(0, 0, 0, 0.14),
      0px 9px 46px 8px rgba(0, 0, 0, 0.12);
  }

  .text {
    flex-grow: 1;
    text-align: center;
  }

  .showName {
    font-size: var(--font-size-small);
    padding-left: var(--spacing-3);
    color: var(--color-text-muted);
  }

  .episodeTitle {
    margin: var(--spacing-1) 0 0 0;
    padding: 0;
    font-weight: normal;
    font-size: var(--font-size-medium);
  }

  .showName,
  .episodeTitle {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .buttons {
    display: flex;
    align-items: center;
  }

  .buttons > :global(*) {
    flex-shrink: 0;
  }

  .navButtons {
    padding-left: var(--spacing-3);
    display: flex;
    align-items: center;
  }

  .navButton {
    background-color: whitesmoke;
    border-radius: 50%;
    margin: 0 var(--spacing-3);
    border: 0 none;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-size: var(--font-size-small);
    width: 48px;
    height: 48px;
    transition: transform 120ms ease-in-out;
  }

  .navButton:active {
    transform: scale(0.85);
  }
</style>

<div class="container">
  <div class="text">
    <div class="showName">
      A Show with a rather long name. I mean, really long
    </div>
    <h2 class="episodeTitle">
      Episode that also has quite a long name. Totally verbose.
    </h2>
  </div>
  <div class="buttons">
    <PlayPauseButton on:toggle={togglePlayPause} {playing} />
    <div class="navButtons">
      <!--NOTE about ontouchstart="" below: This is a hack because otherwise Safari on
iOS won't make nice with the :active pseudoclass.-->
      <button class="navButton" on:click={handleBack20s} ontouchstart="">
        <span>-20s</span>
        <ArrowLeftIcon />
      </button>
      <button class="navButton" on:click={handleForward20s} ontouchstart="">
        <span>+20s</span>
        <ArrowRightIcon />
      </button>
      <button class="navButton" on:click={handleNotInterested} ontouchstart="">
        <DeleteIcon />
      </button>
    </div>
  </div>
</div>
