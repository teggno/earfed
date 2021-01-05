<script>
    export let disabled = false;
    export let title = "";
</script>

<style>
    button {
        background-color: whitesmoke;
        border-radius: 50%;
        border: 0 none;
        padding: 0;
        margin: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-size: var(--font-size-small);
        width: 48px;
        height: 48px;
        transition: transform 120ms ease-in-out;
    }

    button:not(:disabled):active {
        transform: var(--button-press-transform);
    }

    button:disabled {
        color: var(--color-disabled);
        fill: var(--color-disabled);
    }
</style>

<!--NOTE about on:touchstart below: This is a hack because otherwise Safari on
iOS won't make nice with the :active pseudoclass.-->
<button on:click|stopPropagation on:touchstart|passive {title} {disabled}>
    <slot />
</button>
