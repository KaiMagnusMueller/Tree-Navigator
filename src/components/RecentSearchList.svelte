<script>
    import { Section } from 'figma-plugin-ds-svelte';
    import { recentSearches, nodeTypeFilterList } from '../stores.js';
    import RecentSearchItem from './RecentSearchItem.svelte';
    import { saveRecentSearches } from '../lib/helper-functions';

    export { classList as class };

    let classList = '';

    let nodeTypeList = $nodeTypeFilterList;

    function getNodeName(types) {
        let nodes = [];
        // if (types.constructor != Array) {
        //     throw 'Expected type Array as types';
        // }
        types.forEach((type) => {
            nodes.push(nodeTypeList.find((element) => element.node_type == type).name);
        });
        return nodes;
    }

    function handleRemoveSearch(event) {
        const index = event.detail;
        $recentSearches.splice(index, 1);
        $recentSearches = $recentSearches;
        saveRecentSearches($recentSearches);
    }

    function handleMoveToTop(event) {
        const index = event.detail;
        const cutArray = $recentSearches.splice(index, 1);
        $recentSearches = [...cutArray, ...$recentSearches];
        saveRecentSearches($recentSearches);
    }
</script>

<div class="recent-search-wrapper {classList}">
    <div class="recent-search-list pb-xlarge flex column flex-grow">
        {#each $recentSearches as search, i}
            <RecentSearchItem
                {search}
                {i}
                node_types={getNodeName(search.node_types)}
                on:recentSearch
                on:moveToTop={handleMoveToTop}
                on:removeSearch={handleRemoveSearch}
                >{search.query_text}
            </RecentSearchItem>
        {/each}
        {#if $recentSearches.length == 0}
            <p>Nothing to see...</p>
        {/if}
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
        background: linear-gradient(0deg, rgba(255, 255, 255) 0%, rgb(255, 255, 255, 0) 40%);
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
