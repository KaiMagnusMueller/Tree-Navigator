<script>
    import { element } from "svelte/internal";

    import { recentSearches, filterList } from "../stores.js";
    import RecentSearchItem from "./RecentSearchItem.svelte";

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

<div class="recent-search-wrapper pr-xxsmall pl-xxsmall flex column-reverse">
    {#each _recentSearches as search}
        <RecentSearchItem node_types={getNodeName(search.node_types)}
            >{search.query_text}
        </RecentSearchItem>
    {/each}
</div>

<style>
    .recent-search-wrapper {
        gap: 2px;
    }
</style>
