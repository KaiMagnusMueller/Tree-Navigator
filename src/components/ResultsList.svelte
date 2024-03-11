<script>
	import { Button } from 'figma-plugin-ds-svelte';
	import fuzzysort from 'fuzzysort';

	import { createEventDispatcher } from 'svelte';
	let dispatch = createEventDispatcher();

	import LoadingSpinner from './LoadingSpinner.svelte';
	import ResultsListItem from './ResultsListItem.svelte';
	import { searchQuery } from '../stores';

	export let querySendTime;
	let queryDuration;
	let searchResults = [];

	let resultsListElem;

	// Set to true so the plugin ignores the first time the selection change event is fired
	// Otherwise when parents and children are matched, the children would immediately get deselected
	let ignoreSelection = true;

	window.addEventListener('message', (event) => {
		if (event.data.pluginMessage.type == 'search-results') {
			const unfilteredSearchResults = event.data.pluginMessage.data;
			queryDuration = Date.now() - querySendTime;

			searchResults = filterNodes(unfilteredSearchResults);

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
			// console.log('selection changed in figma');

			let newSelectionIDs = [];
			//[104:2508], [113:3692]

			event.data.pluginMessage.data.forEach((selection) => {
				newSelectionIDs.push(selection.id);
			});
			updateSelection(newSelectionIDs, true);
		}
	});

	// #####################################
	// #####################################

	let selection = [];

	function handleClick(e) {
		// console.log('new selection');

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
		sendSelection(selectedNodes, false);
	}

	function handleFocSelection(e) {
		// console.log('focus selection');

		// Possible to focus a node without updating the selection by leaving out this call to updateSelection()
		updateSelection([e.detail.resultID]);

		parent.postMessage(
			{
				pluginMessage: {
					type: 'focus-selection',
					parameters: [e.detail.resultID],
				},
			},
			'*',
		);
	}

	// #####################################
	// #####################################

	function sendSelection(nodes, zoomIntoView) {
		parent.postMessage(
			{
				pluginMessage: {
					type: 'select-layers',
					parameters: { nodes: nodes, zoomIntoView: zoomIntoView },
				},
			},
			'*',
		);

		// Ignore the next selectionchange event, which is fired directly after the postmessage above
		// See the "selection-changed" message handler above, where the toggle is reset
		ignoreSelection = true;
	}

	function resetSearch() {
		dispatch('resetSearch', 'reset');
	}

	// ######################################

	function filterNodes(results) {
		let resultList = [];

		let queryText = $searchQuery.query_text;

		const isInQuotes = checkQuotes(queryText);

		// ####################################
		// Return all if there is no query text
		if (queryText === undefined) {
			resultList = results;
			// query_text is now always defined

			// ####################################
			// Match exact query text when the EXACT option is selected, or th etext is in quotes
		} else if ($searchQuery.string_match === 'EXACT' || isInQuotes) {
			// Match exact

			queryText = queryText.trimQuotes();

			resultList = results.filter((elem) => {
				let elemName = elem.name;

				// When case_sensitive is false, compare lowercase names. Only the characters, basically.
				if (!$searchQuery.case_sensitive) {
					elemName = elemName.toLowerCase();
					queryText = queryText.toLowerCase();
				}

				return elemName === queryText;
			});

			//     // ####################################
			//     // Match space-separated query text parts
			// } else if ($searchQuery.string_match === 'PART') {
			//     if (!$searchQuery.case_sensitive) {
			//         queryText = queryText.toLowerCase();
			//     }

			//     let stringsToSearch = queryText.split(' ');

			//     results.forEach((result) => {
			//         let elemName = result.name;

			//         if (!$searchQuery.case_sensitive) {
			//             elemName = elemName.toLowerCase();
			//         }

			//         if (stringsToSearch.some((v) => elemName.includes(v))) {
			//             // There's at least one
			//             resultList.push(result);
			//         }
			//     });

			// ####################################
			// Match fuzzy
		} else if ($searchQuery.string_match === 'FUZZY') {
			const options = {
				threshold: -Infinity, // Don't return matches worse than this (higher is faster)
				limit: Infinity, // Don't return more results than this (lower is faster)
				all: false, // If true, returns all results for an empty search

				key: 'name', // For when targets are objects (see its example usage)
				scoreFn: null, // For use with `keys` (see its example usage)
			};

			const _resultList = fuzzysort.go(queryText, results, options);

			_resultList.forEach((elem) => {
				resultList.push(elem.obj);
			});
		}

		sendSelection(resultList, true);
		return resultList;
	}

	function checkQuotes(string) {
		const quoteCharacters = ['"', "'", '´', '`'];

		if (!string) {
			console.warn('String undefined');
			return undefined;
		}

		return quoteCharacters.some((elem) => {
			return string.startsWith(elem) && string.endsWith(elem);
		});
	}

	String.prototype.trimQuotes = function () {
		let string = this;

		string = string.replace(/["'`´]/, '');

		return string;
	};
</script>

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
				on:focus-selection={handleFocSelection} />
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
			viewBox="0 0 32 32">
			<defs>
				<style>
					.cls-1 {
						fill: none;
					}
				</style>
			</defs>
			<path
				d="M30,28.5859l-4.6885-4.6884a8.028,8.028,0,1,0-1.414,1.414L28.5859,30ZM19,25a6,6,0,1,1,6-6A6.0066,6.0066,0,0,1,19,25Z" />
			<rect x="2" y="12" width="8" height="2" />
			<rect x="2" y="2" width="16" height="2" />
			<rect x="2" y="7" width="16" height="2" />
			<rect
				id="_Transparent_Rectangle_"
				data-name="&lt;Transparent Rectangle&gt;"
				class="cls-1"
				width="32"
				height="32" />
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

<style>
	.text--results-info {
		color: var(--figma-color-text-disabled);
		text-align: center;
		font-size: var(--font-size-xsmall);
		font-weight: var(--font-weight-normal);
		letter-spacing: var(--font-letter-spacing-neg-small);
		line-height: var(--font-line-height);
	}

	.results-list {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		font-size: var(--font-size-xsmall);
		font-weight: var(--font-weight-normal);
		letter-spacing: var(--font-letter-spacing-neg-small);
		line-height: var(--font-line-height);
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
		fill: var(--figma-color-text-disabled);
	}
</style>
