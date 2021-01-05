<script>
    export let items;
</script>

<style>
    ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    li:first-child {
        border-top: var(--spacing-4) solid transparent;
    }

    li {
        border-bottom: var(--spacing-3) solid transparent;
    }
</style>

<ul>
    {#each items as item}
        <li>
            <slot {item} />
        </li>
    {/each}
</ul>
