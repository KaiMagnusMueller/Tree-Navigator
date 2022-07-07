<script>
	//import Global CSS from the svelte boilerplate
	//contains Figma color vars, spacing vars, utility classes and more
	import { GlobalCSS } from 'figma-plugin-ds-svelte';
	import { searchQuery, recentSearches, UIState, activeFilters, nodeTypeFilterList, nodeTypeFilterListDefault } from './stores';
	import { recentSearchExamples } from './assets/example-data';
	import { saveRecentSearches, saveFilterRanking } from './lib/helper-functions';

	//import some Svelte Figma UI components
	import {
		Button,
		Input,
		Label,
		SelectMenu,
		IconAdjust,
		IconSearch,
		IconButton,
		IconBack,
		IconComponent,
		IconForward,
		Section,
	} from 'figma-plugin-ds-svelte';

	import InputFlexible from './components/InputFlexible';
	import FilterList from './components/FilterList.svelte';
	import RecentSearchList from './components/RecentSearchList.svelte';
	import { each, now, onMount } from 'svelte/internal';
	import IconInfo from './assets/icons/information.svg';
	import ResultsList from './components/ResultsList.svelte';
	import TestComponent from './components/TestComponent.svelte';

	//current input of search field
	let searchString = '';
	//value provided by filter list, if there is a specific layer filter set
	let filterChanged = false;

	let querySendTime;

	$: $searchQuery.query_text = searchString;
	$: $activeFilters.query_text = searchString;

	$: disabled = searchString === '' && filterChanged == false;
	//this is a reactive variable that will return false when a value is selected from
	//the select menu, its value is bound to the primary buttons disabled prop

	let filterList = [];

	onMount(() => {
		onmessage = (event) => {
			if (event.data.pluginMessage.type == 'loaded-plugin-recent-search-list') {
				if (event.data.pluginMessage.data.length > 0) {
					// console.log('data found... loading');
					$recentSearches = event.data.pluginMessage.data;
				} else {
					console.log('no data... loading example');
					$recentSearches = recentSearchExamples;
				}
			}

			if (event.data.pluginMessage.type == 'loaded-plugin-filter-counts') {
				filterList = $nodeTypeFilterList;
				if (event.data.pluginMessage.data.length == 0) {
					console.log('no filters used previously');
					return;
				}

				filterList.forEach((filter) => {
					let loadedFilter = event.data.pluginMessage.data.find((elem) => elem.node_type === filter.node_type);
					filter.count = loadedFilter.count;
				});

				filterList.sort((a, b) => {
					return b.count - a.count;
				});

				// console.log('update node filter list');
				// console.log(filterList);
			}

			// TODO: save filter list without checked state
			// update filter list with new count values
			// Send filter list to filter list component from here
		};
	});

	onmessage = (event) => {};

	function handleSubmitButton(event) {
		$searchQuery = $activeFilters;
		handleQuerySubmit(event);
	}

	function handleQuerySubmit(event) {
		//true if event comes from recent list item
		// console.log(event.detail);
		const isNew = event.detail;

		querySendTime = Date.now();
		$searchQuery.query_submit_time = querySendTime;

		// console.log($searchQuery);

		const queryToSend = $searchQuery;
		console.log('loading');
		displayResults();

		setTimeout(() => {
			parent.postMessage(
				{
					pluginMessage: {
						type: 'search-layers',
						parameters: queryToSend,
					},
				},
				'*'
			);
			//prevent the postMessage function from locking up the main plugin by delaying it a few milliseconds
		}, 50);

		updateNodeTypeFilterCounts($searchQuery.node_types);

		//only add to recentlist if the item is not already on the list
		if (isNew == true) {
			let queryToAdd = {
				node_types: $searchQuery.node_types,
				query_text: $searchQuery.query_text,
				restrict_to_selection: $searchQuery.restrict_to_selection,
				selected_node_ids: $searchQuery.selected_node_ids,
				query_submit_time: $searchQuery.query_submit_time,
			};

			$recentSearches = [queryToAdd, ...$recentSearches];
			$recentSearches = $recentSearches.slice(0, 20);
			// console.log($recentSearches);

			saveRecentSearches($recentSearches);
			saveFilterRanking($nodeTypeFilterList);
		} else {
		}
	}

	function displayResults() {
		$UIState.showMainMenu = false;
		$UIState.showSearchResults = true;
	}

	function cancel() {
		parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
	}

	function navBack(params) {
		$UIState.showMainMenu = true;
		$UIState.showSearchResults = false;
	}

	function updateNodeTypeFilterCounts(types) {
		types.forEach((type) => {
			let index = $nodeTypeFilterList.findIndex((elem) => elem.node_type == type);

			if (index >= 0) {
				console.log('Update at ' + index);
				$nodeTypeFilterList[index].count++;
			}
		});

		// TODO: sort nodeTypeFilterList by count value (possibly in filter component)
	}

	function deleteRecentSearches() {
		$recentSearches = [];
		saveRecentSearches($recentSearches);
	}

	// -------------------------
	// UI
	// -------------------------

	function openSettings() {
		$UIState.showSettingsMenu = true;
	}
</script>

<div class="wrapper">
	<div class="main-section">
		<!-- <TestComponent /> -->
		<div class="header-group flex pr-xxsmall pl-xxsmall pt-xxsmall">
			<IconButton on:click={navBack} iconName={IconBack} disabled={$UIState.showMainMenu} />
			<InputFlexible iconName={IconSearch} placeholder="Search" bind:value={searchString} class="flex-grow" autofocus />
			<IconButton on:click={handleSubmitButton} iconName={IconForward} bind:disabled />
		</div>
		{#if filterList.length > 0}
			<FilterList class="flex-no-shrink" on:filterChanged={(event) => (filterChanged = event.detail)} {filterList} />
		{/if}
		{#if $UIState.showMainMenu}
			<div class="section--recent flex column flex-grow">
				<Section class="flex-no-shrink">Recent Searches</Section>
				<RecentSearchList class="flex-grow" on:recentSearch={handleQuerySubmit} />
			</div>
			<div class="section--footer flex row justify-content-end pr-xxsmall pl-xxsmall pb-xxsmall">
				<!-- TODO: make IconButton accept flexible color -->
				<IconButton iconName={IconInfo} color={'black3'} />
				<IconButton iconName={IconAdjust} color={'black3'} on:click={openSettings} />
			</div>
		{:else if $UIState.showSearchResults}
			<ResultsList {querySendTime} />
		{/if}
	</div>
	{#if $UIState.showSettingsMenu}
		<div class="menu--settings">
			<div class="settings--header flex pr-xxsmall pl-xxsmall pt-xxsmall ">
				<IconButton
					on:click={() => {
						$UIState.showSettingsMenu = false;
					}}
					iconName={IconBack}
				/>
				<Section class="">Settings</Section>
			</div>
			<div class="settings--content pt-xsmall pr-xxsmall pl-xxsmall">
				<Section class="">Recent Searches</Section>
				<Button variant="secondary" destructive on:click={deleteRecentSearches}>Delete Recent Searches</Button>
			</div>
		</div>
	{/if}
</div>

<style>
	/* Add additional global or scoped styles here */
	.header-group {
		gap: 12px;
	}

	.main-section {
		display: flex;
		flex-direction: column;
		gap: 12px;
		height: 100vh;
	}

	/* Variable for svg fill in flexible icon */
	:global(:root) {
		--transparent: transparent;
	}

	.section--recent {
		overflow: hidden;
	}

	.section--footer {
		gap: 8px;
		position: absolute;
		bottom: 0;
		right: 0;
		background: radial-gradient(ellipse farthest-corner at bottom right, #fff, #fff0);
	}

	.menu--settings {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;

		background-color: var(--white);
	}

	:global(html) {
		--scrollbarBG: #cfd8dc;
		--thumbBG: #90a4ae;
	}
	:global(body)::-webkit-scrollbar {
		width: 11px;
	}
	:global(body) {
		scrollbar-width: thin;
		scrollbar-color: var(--thumbBG) var(--scrollbarBG);
	}
	:global(::-webkit-scrollbar-track) {
		background: var(--scrollbarBG);
	}
	:global(::-webkit-scrollbar-thumb) {
		background-color: var(--thumbBG);
		border-radius: 6px;
		border: 3px solid var(--scrollbarBG);
	}
</style>
