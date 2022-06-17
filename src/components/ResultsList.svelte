<script>
    import { IconButton } from 'figma-plugin-ds-svelte';
    import { element } from 'svelte/internal';
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
            // TODO: add "selected" as property
        }

        if (event.data.pluginMessage.type == 'selection-changed') {
            console.log('selection changed in figma');
        }
    };

    let selection = [];

    function handleClick(e) {
        // TODO: create function that merges selections in figma and selections in the plugin and updates the selected state

        searchResults.forEach((element) => (element.selected = false));

        console.log(e);

        let addToSelection = searchResults.filter(
            (elem) => elem.id === e.detail.resultID
        );

        selection = [...addToSelection];

        console.log(selection);

        sendSelection(selection);

        // TODO: create function for searchResults.filter, that adds the element to selection and updates the selected state at the same time
        addToSelection.forEach((element) => {
            let selectedElemIndex = searchResults.findIndex(
                (el) => el.id === element.id
            );

            searchResults[selectedElemIndex].selected = true;
        });
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

    function updateSelection(newItems) {}
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

        <div class="results-list">
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

    .results-list {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .loading-spinner-container {
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
