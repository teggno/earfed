<script>
    import { createEventDispatcher } from "svelte";

    export let searchText = "";
    const dispatch = createEventDispatcher();

    function handleSubmit(e) {
        e.preventDefault();

        e.target.querySelector("input[type='search']").blur();

        if (searchText && searchText.trim()) {
            dispatch("search", { searchText });
        }
    }

    function handleTouchStart(e) {
        e.target.select();
        e.preventDefault();
    }
</script>

<form on:submit={handleSubmit}>
    <label for="searchField">Search</label>
    <input
        id="searchField"
        type="search"
        on:touchstart={handleTouchStart}
        bind:value={searchText} />
    <button>Go</button>
</form>
