<script>
    import { Section } from 'figma-plugin-ds-svelte';
    import { recentSearches, filterList } from '../stores.js';
    import RecentSearchItem from './RecentSearchItem.svelte';

    export { classList as class };

    let classList = '';

    //TODO: delete .subscribe and add $ notation
    let _recentSearches = [];

    recentSearches.subscribe((value) => {
        _recentSearches = value;
    });

    let nodeTypeList;

    filterList.subscribe((value) => {
        nodeTypeList = value;
    });

    function getNodeName(types) {
        let nodes = [];
        types.forEach((type) => {
            nodes.push(
                nodeTypeList.find((element) => element.node_type == type).name
            );
        });
        return nodes;
    }
</script>

<div class="recent-search-wrapper {classList}">
    <div
        class="recent-search-list pb-xlarge pr-xxsmall pl-xxsmall flex column flex-grow"
    >
        {#each _recentSearches as search}
            <RecentSearchItem
                {search}
                node_types={getNodeName(search.node_types)}
                on:recentSearch
                >{search.query_text}
            </RecentSearchItem>
        {/each}
    </div>
</div>

<style>
    .recent-search-list {
        gap: 2px;
        overflow: hidden scroll;
        height: 100%;
    }

    .recent-search-wrapper {
        position: relative;
        overflow: auto;
    }

    .recent-search-wrapper:after {
        content: '';
        background: linear-gradient(
            0deg,
            rgba(255, 255, 255) 0%,
            rgb(255, 255, 255, 0) 40%
        );
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        pointer-events: none;
        transition: 0.15s all ease-out;
    }

    .recent-search-wrapper:hover:after {
        opacity: 0;
        visibility: hidden;
    }
</style>
