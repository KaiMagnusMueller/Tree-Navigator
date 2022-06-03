<script>
    import {
        Icon,
        IconSearch,
        IconButton,
        IconForward,
    } from "figma-plugin-ds-svelte";

    export let node_type;
</script>

<div class="recent-search-item p-xxsmall flex">
    <Icon iconName={IconSearch} />
    <div class="item-content flex column">
        <h4><slot /></h4>
        <p>{node_type}</p>
    </div>
    <div class="search-button">
        <IconButton iconName={IconForward} />
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
        box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.15);
    }

    .item-content {
        gap: 4px;
        pointer-events: none;
    }

    .item-content h4 {
        margin: 0;
        font-size: var(--font-size-small);
        font-weight: var(--font-weight-normal);
    }
    .item-content p {
        margin: 0;
        font-size: var(--font-size-small);
        font-weight: var(--font-weight-normal);
        text-transform: capitalize;
        color: #9e9e9e;
    }

    .search-button {
        margin-left: auto;
        display: none;
    }

    .recent-search-item:hover .search-button {
        display: block;
    }
</style>
