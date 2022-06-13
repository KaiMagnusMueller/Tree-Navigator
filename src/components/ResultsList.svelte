<script>
    import { IconButton } from 'figma-plugin-ds-svelte';

    export let querySendTime;

    let queryDuration;

    onmessage = (event) => {
        if (event.data.pluginMessage.type == 'search-results') {
            searchResults = event.data.pluginMessage.data;
            // console.log('got results');
            queryDuration = Date.now() - querySendTime;
            console.log('elapsed Time:' + queryDuration);
        }
    };

    let searchResults = [];
</script>

<div class="pr-xxsmall pl-xxsmall">
    {#if queryDuration == undefined}
        <p>Loading...</p>
    {:else}
        <p>
            Found {searchResults.length} nodes in {Math.round(
                queryDuration / 100
            ) / 10}
            seconds.
        </p>
        <!-- 
        {#each searchResults as result}
        <p>{result.name}, {result.id}, {result.type}</p>
        {/each} -->

        <div>
            {#each searchResults as result}
                <p>{result.name}</p>
            {/each}
        </div>
    {/if}
</div>

<style>
    div {
        overflow: auto;
    }
</style>
