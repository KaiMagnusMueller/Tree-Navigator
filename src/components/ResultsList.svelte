<script>
    import { IconButton } from 'figma-plugin-ds-svelte';
    import ResultsListItem from './ResultsListItem.svelte';

    export let querySendTime;
    let queryDuration;
    let searchResults = [];

    onmessage = (event) => {
        if (event.data.pluginMessage.type == 'search-results') {
            searchResults = event.data.pluginMessage.data;
            // console.log('got results');
            queryDuration = Date.now() - querySendTime;

            //  result:
            // ---------
            //  id,
            // 	name,
            // 	parent,
            // 	children,
            // 	type
        }
    };

    let selection = [];

    function handleClick(e) {
        console.log(e);

        let addToSelection = searchResults.filter(
            (elem) => elem.id === e.detail.resultID
        );

        selection = [...addToSelection];

        console.log(selection);

        sendSelection(selection);
    }

    function sendSelection(params) {
        parent.postMessage(
            {
                pluginMessage: {
                    type: 'select-layers',
                    parameters: params,
                },
            },
            '*'
        );
    }
</script>

<div class="results-container pr-xxsmall pl-xxsmall">
    {#if searchResults.length > 0}
        <p class="text--results-info">
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
                <ResultsListItem {result} on:result-clicked={handleClick} />
            {/each}
            <!-- TODO: select layer on click -->
        </div>
    {:else}
        <div class="loading-spinner-container">
            <div class="loading-spinner-wrapper">
                <span class="loading-spinner">Loading...</span>
            </div>
        </div>
    {/if}
</div>

<style>
    .results-container {
        overflow: auto;
        height: 100%;
        font-size: var(--font-size-xsmall);
        font-weight: var(--font-weight-medium);
        letter-spacing: var(--font-letter-spacing-neg-small);
        line-height: var(--font-line-height);
    }

    .text--results-info {
        color: var(--black8-opaque);
    }

    .loading-spinner-container {
        display: flex;
    }

    .loading-spinner-wrapper {
    }

    .loading-spinner {
        animation: loading 1.5s infinite alternate steps(4, end);
        overflow: hidden;
        font-weight: var(--font-weight-bold);
    }

    @keyframes loading {
        from {
            width: 100%;
        }
        to {
            width: 75%;
        }
    }
</style>
