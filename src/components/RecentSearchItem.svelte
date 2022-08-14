<script>
    import { Icon, IconClose, IconSearch, IconButton, IconForward } from 'figma-plugin-ds-svelte';

    import { createEventDispatcher } from 'svelte';
    let dispatch = createEventDispatcher();

    export let node_types;
    export let i;

    export let search = {};
    // console.log(search);

    // node_types: [],
    // query_text: "",
    // area_type: false,
    // selected_node_ids: [],
    // query_submit_time: "",

    function handleClick() {
        console.log('start recent search');

        //isNew = false
        dispatch('recentSearch', {
            isNew: false,
            search: search,
        });
        dispatch('moveToTop', i);
    }

    function handleRemove() {
        console.log('remove this search');
        dispatch('removeSearch', i);
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
        <IconButton iconName={IconClose} on:click={handleRemove} />
        <IconButton iconName={IconForward} on:click={handleClick} />
    </div>
</div>

<style>
    .recent-search-item {
        gap: var(--size-xsmall);
        border: 1px solid transparent;
        border-radius: 6px;
    }

    .recent-search-item:hover {
        border: 1px solid #e3e3e3;
        box-shadow: 0 1px 6px rgba(194, 194, 194, 0.51);
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
        display: flex;
        gap: 4px;
    }
</style>
