<script>
    import { IconButton } from 'figma-plugin-ds-svelte';
    import ResultsListItem from './ResultsListItem.svelte';

    export let querySendTime;
    let queryDuration;
    let searchResults = [];

    // Set to true so the plugin ignores the first time the selection change event is fired
    // Otherwise when parents and children are matched, the children would immediately get deselected
    let ignoreSelection = true;

    onmessage = (event) => {
        if (event.data.pluginMessage.type == 'search-results') {
            searchResults = event.data.pluginMessage.data;

            // console.log('got results');
            // console.log(searchResults);
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
            // If the event is triggered by a selection change that originated in the plugin (see the select layers postmessage), ignore the event and reset the toggle so that events triggered by the user are not ignored
            if (ignoreSelection) {
                ignoreSelection = false;
                return;
            }
            console.log('selection changed in figma');

            let newSelectionIDs = [];
            //[104:2508], [113:3692]

            event.data.pluginMessage.data.forEach((selection) => {
                newSelectionIDs.push(selection.id);
            });
            updateSelection(newSelectionIDs, true);
        }
    };

    // #####################################
    // #####################################

    let selection = [];

    function handleClick(e) {
        updateSelection([e.detail.resultID]);
    }

    function updateSelection(newItemIDs, fromFigma) {
        // console.log(newItemIDs);
        let selectedNodes = [];

        searchResults.forEach((result, i) => {
            let addToSelection = newItemIDs.filter((newItem) => newItem === result.id);

            if (addToSelection.length > 0) {
                searchResults[i].selected = true;
                selectedNodes.push(result);
            } else if (result.selected === true) {
                searchResults[i].selected = false;
            }
        });

        // If the event came from figma, don't send the selection
        if (fromFigma) {
            return;
        }
        sendSelection(selectedNodes);
    }

    // #####################################
    // #####################################

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

        // Ignore the next selectionchange event, which is fired directly after the postmessage above
        // See the "selection-changed" message handler above, where the toggle is reset
        ignoreSelection = true;
    }
</script>

<div class="results-container pr-xxsmall pl-xxsmall">
    {#if searchResults.length > 0 && queryDuration != undefined}
        <p class="text--results-info">
            Found {searchResults.length} nodes in {Math.round(queryDuration / 100) / 10}
            seconds.
        </p>
        <!-- 
        {#each searchResults as result}
            <p>{result.name}, {result.id}, {result.type}</p>
        {/each} -->

        <div class="results-list">
            {#each searchResults as result (result.id)}
                <ResultsListItem {result} on:result-clicked={handleClick} />
            {/each}
        </div>
    {:else if searchResults.length === 0 && queryDuration != undefined}
        <p>no results</p>
    {:else if searchResults.length === 0}
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
