<script>
	//import Global CSS from the svelte boilerplate
	//contains Figma color vars, spacing vars, utility classes and more
	import { GlobalCSS } from 'figma-plugin-ds-svelte';
	import {
		searchQuery,
		UIState,
		activeFilters,
		filterDefinitions,
		settings,
		defaultSettings,
	} from './stores';
	import { recentSearchExamples } from './assets/example-data';
	import { saveRecentSearches, saveFilterRanking, saveSettings } from './lib/helper-functions';

	//import some Svelte Figma UI components
	import {
		Button,
		IconAdjust,
		IconSearch,
		IconButton,
		IconBack,
		IconForward,
		Section,
		Switch,
	} from 'figma-plugin-ds-svelte';

	import InputFlexible from './components/InputFlexible';
	import FilterSection from './components/FilterSection.svelte';
	import RecentSearchList from './components/RecentSearchList.svelte';
	import { onMount } from 'svelte/internal';
	import { slide } from 'svelte/transition';
	import IconInfo from './assets/icons/information.svg';
	import ResultsList from './components/ResultsList.svelte';
	import TestComponent from './components/TestComponent.svelte';

	// Markdown texts
	import About from './assets/text/about.svx';
	import Acknowledgements from './assets/text/licenses.svx';

	//current input of search field
	let searchString = '';
	//value provided by filter list, if there is a specific layer filter set
	let filterChanged = false;

	let querySendTime;

	$: $searchQuery.query_text = searchString;
	$: $activeFilters.query_text = searchString;
	$: $activeFilters.selected_node_ids = [];

	$: disabledSubmit = searchString === '' && filterChanged == false;
	//this is a reactive variable that will return false when a value is selected from
	//the select menu, its value is bound to the primary buttons disabled prop

	let filterList = $filterDefinitions;

	onMount(() => {
		buildSearchQuery();

		onmessage = (event) => {
			if (event.data.pluginMessage.type == 'loaded-plugin-settings') {
				if (event.data.pluginMessage.data) {
					console.log('settings found... loading');
					$settings = event.data.pluginMessage.data;
				} else {
					console.log('no settings... loading defaults');
					$settings = $defaultSettings;
					// TODO: when new settings are added, merge restored settings with new default settings
				}
			}

			if (event.data.pluginMessage.type == 'loaded-plugin-recent-search-list') {
				if (event.data.pluginMessage.data.length > 0) {
					console.log('recent searches found... loading');

					let recentsArray = [];

					// Check if recent search object is empty (and would later cause errors in the recent search component)
					event.data.pluginMessage.data.forEach((element) => {
						if (Object.keys(element).length === 0) {
							console.warn('Empty recent search object discarded');
							return;
						}
						recentsArray.push(element);
					});

					_recentSearches = recentsArray;
				} else {
					// console.log('no data... loading example searches');
					// $recentSearches = recentSearchExamples;
				}
			}

			if (event.data.pluginMessage.type == 'loaded-plugin-filter-counts') {
				// filterList = $filterDefinitions;
				// // TODO: build active filters from default filters here
				// let _activeFilters = new Object();
				// filterList.forEach((filter) => {
				// 	const filterType = filter.filterData.filterType;
				// 	const filterOptions = filter.filterOptions;
				// 	let defaultOption = filterOptions.find((elem) => elem.default === true);
				// 	if (filter.filterData.multiSelect === true) {
				// 		$activeFilters[filterType] = [defaultOption.value];
				// 	} else {
				// 		$activeFilters[filterType] = defaultOption.value;
				// 	}
				// });
				// console.log($activeFilters);
				// if (event.data.pluginMessage.data.length == 0) {
				// 	console.log('no filters used previously');
				// 	return;
				// }
				// //update node type filter with counts
				// // Sort by filter counts if rememberNodeFilterCounts is on
				// if (
				// 	$settings.rememberNodeFilterCounts &&
				// 	filterList[0].filterData.filterType === 'node_type'
				// ) {
				// 	const index = filterList.findIndex((elem) => elem.filterType == 'node_type');
				// 	console.log(index);
				// 	filterList.forEach((filter) => {
				// 		let loadedFilter = event.data.pluginMessage.data.find(
				// 			(elem) => elem.node_type === filter.node_type
				// 		);
				// 		filter.count = loadedFilter.count;
				// 	});
				// 	// filterList.sort((a, b) => {
				// 	// 	return b.count - a.count;
				// 	// });
				// 	// console.log('update node filter list');
				// 	// console.log(filterList);
				// }
			}
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
		// console.log('loading');
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

		// updateNodeTypeFilterCounts($searchQuery.node_types);

		//only add to recentlist if the item is not already on the list
		if (isNew == true) {
			// for some reason we have to clone the $searchQuery object, otherwise if we would do this:
			// $recentSearches = [$searchQuery, ...$recentSearches];
			// all recent queries during the plugin runtime would get reset to the new recent search
			//
			// so if search for "Test Component"
			// and we did a previous search of "Test Instance" while the plugin is running
			// the list would look like "Test Component", "Test Component"

			let queryToAdd = new Object();

			const searchObj = $searchQuery;

			for (const key in searchObj) {
				queryToAdd[key] = searchObj[key];
			}

			_recentSearches = [queryToAdd, ..._recentSearches];
			_recentSearches = _recentSearches.slice(0, $settings.recentSearchLength);

			saveRecentSearches(_recentSearches);
			// saveFilterRanking($filterDefinitions);
		} else {
		}
	}

	let _externalSearchQuery;
	function handleExternallyChangedFilters(event) {
		// Update search field value when a recent search is selected

		const search = event.detail.search;

		$searchQuery = search;

		searchString = search.query_text;

		_externalSearchQuery = search;
		handleQuerySubmit(event.detail.isNew);
	}

	function buildSearchQuery() {
		$searchQuery = {};

		$filterDefinitions.forEach((filter) => {
			const filterType = filter.filterData.filterType;
			const options = filter.filterOptions;

			const isMultiselect = filter.filterData.multiSelect;

			if (isMultiselect) {
				const selectedFilters = options.filter((option) => option.default == true);

				let selectedValues = [];
				selectedFilters.forEach((elem) => {
					selectedValues.push(elem.value);
				});

				$searchQuery[filterType] = selectedValues;
			} else {
				const selectedFilter = options.find((option) => option.default == true);
				$searchQuery[filterType] = selectedFilter.value;
			}
		});
		$activeFilters = $searchQuery;
	}

	function resetSearchQuery() {
		console.log('reset');
		searchString = '';
		buildSearchQuery();
		_externalSearchQuery = $searchQuery;
	}

	function cancel() {
		parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
	}

	function updateNodeTypeFilterCounts(types) {
		types.forEach((type) => {
			let index = $filterDefinitions.findIndex((elem) => elem.node_type == type);

			if (index >= 0) {
				console.log('Update at ' + index);
				$filterDefinitions[index].count++;
			}
		});

		// TODO: sort filterDefinitions by count value (possibly in filter component)
	}

	function resetNodeTypeFilterCounts() {
		$filterDefinitions.forEach((elem) => {
			elem.count = 0;
		});
		// saveFilterRanking($filterDefinitions);
	}

	function toggleFilterReordering() {
		// resetNodeTypeFilterCounts();
		saveSettings($settings);
	}

	// -------------------------
	// RECENT SEARCHES
	// -------------------------
	let _recentSearches = [];

	function deleteRecentSearches() {
		_recentSearches = [];
		saveRecentSearches(_recentSearches);
	}

	// -------------------------
	// UI
	// -------------------------

	function displayResults() {
		$UIState.showMainMenu = false;
		$UIState.showSearchResults = true;
	}

	function navBack(params) {
		$UIState.showMainMenu = true;
		$UIState.showSearchResults = false;
		filterChanged = false;
	}

	function openSettings() {
		$UIState.showSettingsMenu = true;
	}

	function openAboutScreen() {
		$UIState.showAboutScreen = true;
	}
</script>

<div class="wrapper">
	<div class="main-section">
		<!-- <TestComponent /> -->
		<div class="header-group flex column pt-xxsmall pb-xxsmall">
			<InputFlexible
				iconName={IconSearch}
				placeholder="Search"
				bind:value={searchString}
				class="flex-grow mr-xxsmall ml-xxsmall"
				autofocus
				navBackPossible={$UIState.showSearchResults}
			>
				<!-- Slots for buttons to prevent "Error: Function called outside component initialization"  -->
				<IconButton
					slot="back-button"
					on:click={() => {
						navBack();
						resetSearchQuery();
					}}
					iconName={IconBack}
					rounded={true}
				/>
				<IconButton
					slot="submit-button"
					on:click={handleSubmitButton}
					iconName={IconForward}
					bind:disabled={disabledSubmit}
					rounded={true}
				/>
			</InputFlexible>
			{#if filterList.length > 0}
				<FilterSection
					class="flex-no-shrink"
					on:filterChanged={(event) => (filterChanged = event.detail)}
					{filterList}
					bind:_externalSearchQuery
				/>
			{/if}
		</div>
		{#if $UIState.showMainMenu}
			<div class="section--recent flex column flex-grow">
				{#if _recentSearches}
					<RecentSearchList
						class="flex-grow"
						on:recentSearch={handleExternallyChangedFilters}
						bind:recentSearches={_recentSearches}
					/>
				{/if}
			</div>
			<div
				class="section--footer flex row justify-content-end pr-xxsmall pl-xxsmall pb-xxsmall"
			>
				<!-- TODO: make IconButton accept flexible color -->
				<IconButton iconName={IconInfo} color={'black3'} on:click={openAboutScreen} />
				<IconButton iconName={IconAdjust} color={'black3'} on:click={openSettings} />
			</div>
		{:else if $UIState.showSearchResults}
			<ResultsList
				{querySendTime}
				on:resetSearch={navBack}
				on:resetSearch={resetSearchQuery}
			/>
		{/if}
	</div>
	{#if $UIState.showSettingsMenu}
		<div class="menu--settings flex column">
			<div class="settings--header flex p-xxxsmall">
				<IconButton
					on:click={() => {
						$UIState.showSettingsMenu = false;
					}}
					iconName={IconBack}
				/>
				<Section class="">Settings</Section>
			</div>
			<div class="settings--content pt-xxsmall pr-xxsmall pl-xxsmall">
				<div class="settings--section pb-xxsmall">
					<Section class="">Recent Searches</Section>
					<Button variant="secondary" destructive on:click={deleteRecentSearches}
						>Delete Recent Searches</Button
					>
				</div>
				<div class="settings--section pb-xxsmall">
					<Section class="settings--input">Filters</Section>
					<Switch
						bind:checked={$settings.rememberNodeFilterCounts}
						on:change={toggleFilterReordering}>Sort Filters by Usage</Switch
					>
					<Button variant="secondary" destructive on:click={resetNodeTypeFilterCounts}
						>Reset Filter Order</Button
					>
				</div>
			</div>
		</div>
	{/if}
	{#if $UIState.showAboutScreen}
		<div class="menu--settings flex column">
			<div class="settings--header flex p-xxxsmall">
				<IconButton
					on:click={() => {
						$UIState.showAboutScreen = false;
					}}
					iconName={IconBack}
				/>
				<Section class="">About</Section>
			</div>
			<div class="settings--content markdown pt-xxsmall pr-xxsmall pl-xxsmall">
				<div class="pb-medium">
					<About />
				</div>
				<div>
					<Acknowledgements />
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	/* Add additional global or scoped styles here */
	.header-group {
		gap: 8px;
		background-color: #f8f8f8;
		border-bottom: 1px solid var(--border-white-on-light);
	}

	.main-section {
		display: flex;
		flex-direction: column;
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

	/* ------------------------- */
	/* FULLSCREEN VIEWS */
	.menu--settings {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: 1;

		background-color: var(--white);
	}

	.settings--header {
		border-bottom: 1px solid var(--color-border, #e5e5e5);
	}

	.settings--content {
		overflow: auto;
	}

	.license--section h1 {
	}

	.settings--input {
		width: fit-content;
	}

	/* ------------------------- */
	/* GLOBALS */
	:global(:root) {
		--border-white-on-light: #d2d2d2;
		scrollbar-color: #999 #333;
	}

	/* :global(*::-webkit-scrollbar) {
		background-color: transparent;
		width: 8px;
	}

	:global(*::-webkit-scrollbar-thumb) {
		background-color: #9f9f9f;
		border-radius: 4px;
		border: 2px solid white;
	} */
</style>
