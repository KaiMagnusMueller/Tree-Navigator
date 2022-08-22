<script>
    import { Button } from 'figma-plugin-ds-svelte';

    import { fade } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';
    let dispatch = createEventDispatcher();

    import LoadingSpinner from './LoadingSpinner.svelte';
    import ResultsListItem from './ResultsListItem.svelte';

    export let querySendTime;
    let queryDuration;
    let searchResults = [];

    let resultsListElem;

    // Set to true so the plugin ignores the first time the selection change event is fired
    // Otherwise when parents and children are matched, the children would immediately get deselected
    let ignoreSelection = true;

    onmessage = (event) => {
        if (event.data.pluginMessage.type == 'search-results') {
            searchResults = event.data.pluginMessage.data;
            queryDuration = Date.now() - querySendTime;

            // console.log('got results');
            // console.log(searchResults);

            //  result:
            // ---------
            //  id,
            // 	name,
            // 	parent,
            // 	children,
            // 	type,
            //  selected
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
        console.log('new selection');

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

    function handleFocSelection(e) {
        console.log('focus selection');

        // Possible to focus a node without updating the selection by leaving out this call to updateSelection()
        updateSelection([e.detail.resultID]);

        parent.postMessage(
            {
                pluginMessage: {
                    type: 'focus-selection',
                    parameters: [e.detail.resultID],
                },
            },
            '*'
        );
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

    function resetSearch() {
        dispatch('resetSearch', 'reset');
    }
</script>

<div class="results-container">
    <!-- --------------------------------- -->
    <!-- Display RESULTS LIST and METADATA -->
    <!-- Results exist (.length > 0) and the query was returned (duration != undefined) -->
    {#if searchResults.length > 0 && queryDuration != undefined}
        <!-- RESULTS LIST -->
        <div class="results-list flex column" bind:this={resultsListElem}>
            {#each searchResults as result (result.id)}
                <ResultsListItem
                    {result}
                    on:result-clicked={handleClick}
                    on:focus-selection={handleFocSelection}
                />
            {/each}
        </div>
        <!-- METADATA -->
        <p class="text--results-info">
            Found {searchResults.length} node{#if searchResults.length > 1}s{/if}
            in {Math.round(queryDuration / 100) / 10} seconds.
        </p>

        <!-- ------------------- -->
        <!-- Display EMPTY STATE -->
        <!-- No results (.length == 0) and the query was returned (duration != undefined) -->
    {:else if searchResults.length === 0 && queryDuration != undefined}
        <div class="empty-state-container">
            <svg
                id="icon"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 32 32"
            >
                <defs>
                    <style>
                        .cls-1 {
                            fill: none;
                        }
                    </style>
                </defs>
                <path
                    d="M30,28.5859l-4.6885-4.6884a8.028,8.028,0,1,0-1.414,1.414L28.5859,30ZM19,25a6,6,0,1,1,6-6A6.0066,6.0066,0,0,1,19,25Z"
                />
                <rect x="2" y="12" width="8" height="2" />
                <rect x="2" y="2" width="16" height="2" />
                <rect x="2" y="7" width="16" height="2" />
                <rect
                    id="_Transparent_Rectangle_"
                    data-name="&lt;Transparent Rectangle&gt;"
                    class="cls-1"
                    width="32"
                    height="32"
                />
            </svg>
            <p class="text--results-info">No matching elements found.</p>
            <Button variant="primary" on:click={resetSearch}>Clear search</Button>
            <!-- ----------------------- -->
            <!-- Display LOADING SPINNER -->
            <!-- No results (.length == 0) and the query not returned (duration = undefined) -->
        </div>
    {:else if searchResults.length === 0}
        <div class="empty-state-container">
            <LoadingSpinner />
        </div>
    {/if}
</div>

<style>
    .results-container {
        overflow: auto;
        height: 100%;
        font-size: var(--font-size-xsmall);
        font-weight: var(--font-weight-normal);
        letter-spacing: var(--font-letter-spacing-neg-small);
        line-height: var(--font-line-height);
        position: relative;
    }

    .text--results-info {
        color: rgba(0, 0, 0, 0.5);
        text-align: center;
    }

    .results-list {
        display: flex;
        flex-direction: column;
    }

    .empty-state-container {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: absolute;
    }

    svg {
        fill: rgba(0, 0, 0, 0.5);
    }
</style>
