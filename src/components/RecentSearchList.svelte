<script>
    import { recentSearches } from "../stores.js";
    import RecentSearchItem from "./RecentSearchItem.svelte";

    let _recentSearches = [];

    recentSearches.subscribe((value) => {
        _recentSearches = value;
    });
</script>

<div class="recent-search-wrapper pr-xxsmall pl-xxsmall flex column">
    {#each _recentSearches as search}
        <RecentSearchItem node_type={search.node_type}
            >{search.query_text}
        </RecentSearchItem>
    {/each}
</div>

<style>
    .recent-search-wrapper {
        gap: 2px;
    }
</style>
