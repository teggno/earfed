<style>
    .root {
        display: flex;
        flex-direction: column;
    }

    .title {
        margin-bottom: var(--spacing-1);
        /* overflow: hidden;
        font-weight: 500; */
    }

    .subtitle {
        /* color: var(--color-text-muted); */
        margin-top: var(--spacing-1);
    }
</style>

<div class="root">
    <div class="title">
        <slot name="title" />
    </div>
    <div class="subtitle">
        <slot name="subtitle" />
    </div>
</div>
