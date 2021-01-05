<style>
    .root {
        display: flex;
        overflow: hidden;
        width: 100%;
        align-items: center;
    }

    /* note: must make this some fixed size and not depend on 
        the actual image size to prevent having the document height 
        change while images are loaded. */
    .image {
        width: 60px;
        height: 60px;
        flex-shrink: 0;
    }

    .image :global(img) {
        width: 100%;
    }

    .text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex-grow: 1;
        padding: var(--spacing-2);
        overflow: hidden;
    }

    /* Targets the element passed for the title slot */
    .text > :global(*):first-child {
        margin-bottom: var(--spacing-2);
        max-height: 2em;
        overflow: hidden;
    }

    .actions {
        flex-shrink: 0;
        display: flex;
        align-items: center;
    }
</style>

<div class="root">
    <div class="image">
        <slot name="image" />
    </div>
    <div class="text">
        <slot name="title" />
        <slot name="subtitle" />
    </div>
    {#if $$slots.actions}
        <div class="actions">
            <slot name="actions" />
        </div>
    {/if}
</div>
