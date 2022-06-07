<script>
    import {
        Icon,
        IconSearch,
        IconButton,
        IconForward,
    } from "figma-plugin-ds-svelte";

    import { searchQuery } from "../stores";
    import { createEventDispatcher } from "svelte";
    let dispatch = createEventDispatcher();

    export let node_types;

    export let search = {};
    console.log(search);

    // node_types: [],
    // query_text: "",
    // restrict_to_selection: false,
    // selected_node_ids: [],
    // query_submit_time: "",

    function handleClick() {
        console.log("start recent search");
        $searchQuery = search;

        //isNew = false
        dispatch("recentSearch", false);
    }
</script>

<div class="recent-search-item p-xxsmall flex">
    <Icon iconName={IconSearch} />
    <div class="item-content flex column">
        <h4><slot /></h4>
        <p>
            {#each node_types as type}
                {type}
            {:else}
                All Types
            {/each}
        </p>
    </div>
    <div class="search-button">
        <IconButton iconName={IconForward} on:click={handleClick} />
    </div>
</div>

<style>
    .recent-search-item {
        gap: var(--size-xsmall);
        border: 1px solid transparent;
        border-radius: 4px;
    }

    .recent-search-item:hover {
        border: 1px solid #e3e3e3;
        box-shadow: 0px 0.5px 4px rgba(0, 0, 0, 0.15);
    }

    .item-content {
        gap: 4px;
        pointer-events: none;
        min-width: 0;
    }

    .item-content h4 {
        margin: 0;
        font-size: var(--font-size-small);
        font-weight: var(--font-weight-normal);
    }
    .item-content p {
        display: -webkit-box;
        -webkit-line-clamp: 1; /* number of lines to show */
        line-clamp: 1;
        -webkit-box-orient: vertical;
        margin: 0;
        font-size: var(--font-size-small);
        font-weight: var(--font-weight-normal);
        text-transform: capitalize;
        color: #9e9e9e;
        overflow: hidden;
        text-overflow: ellipsis;
        line-break: anywhere;
    }

    .search-button {
        margin-left: auto;
        display: none;
    }

    .recent-search-item:hover .search-button {
        display: block;
    }
</style>
