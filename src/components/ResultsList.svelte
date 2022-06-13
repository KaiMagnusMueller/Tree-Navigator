<script>
    import { IconButton } from 'figma-plugin-ds-svelte';

    export let queryDuration;
    export let searchResults;
</script>

<p>
    Found {searchResults.length} nodes in {Math.round(queryDuration / 100) / 10}
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
