<script>
    import { Section } from 'figma-plugin-ds-svelte';
    import { filterDefinitions } from '../stores.js';
    import RecentSearchItem from './RecentSearchItem.svelte';
    import { saveRecentSearches } from '../lib/helper-functions';

    export { classList as class };

    export let recentSearches;

    let classList = '';

    //node types are in the first array (might be necessary to make this dynamic in the future)
    let filterList = $filterDefinitions[0].filterOptions;

    function getNodeName(types) {
        let nodes = [];
        // if (types.constructor != Array) {
        //     throw 'Expected type Array as types';
        // }
        // console.log(types);
        if (types == undefined) {
            console.warn('No recent searches');
            return null;
        }

        types.forEach((type) => {
            if (type == undefined) {
                console.warn('Invalid recent search item');
                return undefined;
            }
            nodes.push(
                filterList.find((element) => element.value.toLowerCase() == type.toLowerCase()).name
            );
        });
        return nodes;
    }

    function handleRemoveSearch(event) {
        const index = event.detail;
        recentSearches.splice(index, 1);
        recentSearches = recentSearches;
        saveRecentSearches(recentSearches);
    }

    function handleMoveToTop(event) {
        const index = event.detail;
        const cutArray = recentSearches.splice(index, 1);

        // console.log('--------move to top');
        // console.log(recentSearches);
        // console.log(cutArray);
        // console.log(recentSearches);

        recentSearches = [...cutArray, ...recentSearches];
        saveRecentSearches(recentSearches);
    }
</script>

<div class="recent-search-wrapper {classList}">
    <div class="recent-search-list pb-xlarge flex column flex-grow">
        {#each recentSearches as search, i (search.query_submit_time)}
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
        {#if recentSearches.length == 0}
            <p>Nothing to see...</p>
        {/if}
    </div>
</div>

<style>
    .recent-search-list {
        gap: 2px;
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
