<script>
	//import Global CSS from the svelte boilerplate
	//contains Figma color vars, spacing vars, utility classes and more
	import { GlobalCSS } from 'figma-plugin-ds-svelte';
	import { searchQuery, recentSearches, UIState } from './stores';

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

	//current input of search field
	let searchString = '';
	//value provided by filter list, if there is a specific layer filter set
	let filterChanged = false;

	let querySendTime = Date.now();
	let queryDuration;

	console.log(querySendTime);

	$: $searchQuery.query_text = searchString;

	$: disabled = searchString === '' && filterChanged == false;
	//this is a reactive variable that will return false when a value is selected from
	//the select menu, its value is bound to the primary buttons disabled prop

	function handleQuerySubmit(event) {
		//true because event comes from recent list item
		// console.log(event.detail);
		const isNew = event.detail;

		$searchQuery.query_submit_time = querySendTime;

		// console.log($searchQuery);

		const queryToSend = $searchQuery;

		parent.postMessage(
			{
				pluginMessage: {
					type: 'search-layers',
					parameters: queryToSend,
				},
			},
			'*'
		);

		//only add to recentlist if the item is not already on the list
		if (isNew == true) {
			let localQuery = {
				node_types: $searchQuery.node_types,
				query_text: $searchQuery.query_text,
				restrict_to_selection: $searchQuery.restrict_to_selection,
				selected_node_ids: $searchQuery.selected_node_ids,
				query_submit_time: $searchQuery.query_submit_time,
			};

			$recentSearches = [localQuery, ...$recentSearches];
			// console.log($recentSearches);
		}
	}

	onMount(() => {
		onmessage = (event) => {
			if (event.data.pluginMessage.type == 'search-results') {
				searchResults = event.data.pluginMessage.data;
				// console.log('got results');
				displayResults();
				queryDuration = Date.now() - querySendTime;
				console.log('elapsed Time:' + queryDuration);
			}
		};
	});

	let searchResults = [];

	function displayResults() {
		$UIState.showMainMenu = false;
		$UIState.showSearchResults = true;
	}

	function cancel() {
		parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
	}

	function navBack(params) {}
</script>

<div class="wrapper">
	<div class="main-section">
		<div class="header-group flex pr-xxsmall pl-xxsmall pt-xxsmall">
			<IconButton on:click={navBack} iconName={IconBack} disabled />
			<InputFlexible
				iconName={IconSearch}
				placeholder="Search"
				bind:value={searchString}
				class="flex-grow"
				autofocus
			/>
			<IconButton
				on:click={handleQuerySubmit}
				iconName={IconForward}
				bind:disabled
			/>
		</div>
		{#if $UIState.showMainMenu}
			<FilterList
				class="flex-no-shrink"
				on:filterChanged={(event) => (filterChanged = event.detail)}
			/>
			<div class="section--recent flex column flex-grow">
				<Section class="flex-no-shrink">Recent Searches</Section>
				<RecentSearchList
					class="flex-grow"
					on:recentSearch={handleQuerySubmit}
				/>
			</div>
			<div
				class="section--footer flex row justify-content-end pr-xxsmall pl-xxsmall pb-xxsmall"
			>
				<!-- TODO: make IconButton accept flexible color -->
				<IconButton iconName={IconInfo} color={'black3'} />
				<IconButton iconName={IconAdjust} color={'black3'} />
			</div>
		{:else if $UIState.showSearchResults}
			<ResultsList {queryDuration} {searchResults} />
		{/if}
	</div>
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
		background: radial-gradient(
			ellipse farthest-corner at bottom right,
			#fff,
			#fff0
		);
	}
</style>
