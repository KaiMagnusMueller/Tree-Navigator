<script>
	//import Global CSS from the svelte boilerplate
	//contains Figma color vars, spacing vars, utility classes and more
	import { GlobalCSS } from "figma-plugin-ds-svelte";
	import { searchQuery, recentSearches } from "./stores";

	//import some Svelte Figma UI components
	import {
		Button,
		Input,
		Label,
		SelectMenu,
		IconSearch,
		IconButton,
		IconBack,
		IconComponent,
		IconForward,
		Section,
	} from "figma-plugin-ds-svelte";

	import FilterPill from "./components/FilterPill.svelte";
	import FilterList from "./components/FilterList.svelte";
	import RecentSearchList from "./components/RecentSearchList.svelte";
	import { now } from "svelte/internal";

	//current input of search field
	let searchString = "";
	//value provided by filter list, if there is a specific layer filter set
	let filterChanged = false;

	$: $searchQuery.query_text = searchString;

	$: disabled = searchString === "" && filterChanged == false;
	//this is a reactive variable that will return false when a value is selected from
	//the select menu, its value is bound to the primary buttons disabled prop

	function handleQuerySubmit(event) {
		const queryTime = new Date(now);

		$searchQuery.query_submit_time = queryTime;

		console.log($searchQuery);
		parent.postMessage(
			{
				pluginMessage: {
					type: "search-layers",
					parameters: $searchQuery,
				},
			},
			"*"
		);

		let localQuery = {
			node_types: $searchQuery.node_types,
			query_text: $searchQuery.query_text,
			restrict_to_selection: $searchQuery.restrict_to_selection,
			selected_node_ids: $searchQuery.selected_node_ids,
			query_submit_time: $searchQuery.query_submit_time,
		};

		$recentSearches = [...$recentSearches, localQuery];
		console.log($recentSearches);
	}

	function createShapes() {
		parent.postMessage(
			{
				pluginMessage: {
					type: "create-shapes",
					count: count,
					shape: selectedShape.value,
				},
			},
			"*"
		);
	}

	function cancel() {
		parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
	}

	function navBack(params) {}
</script>

<div class="wrapper">
	<div class="main-section">
		<div class="header-group flex pr-xxsmall pl-xxsmall pt-xxsmall">
			<IconButton on:click={navBack} iconName={IconBack} disabled />
			<Input
				iconName={IconSearch}
				placeholder="Search"
				bind:value={searchString}
				class="flex-grow"
			/>
			<IconButton
				on:click={handleQuerySubmit}
				iconName={IconForward}
				bind:disabled
			/>
		</div>
		<FilterList
			class="flex-no-shrink"
			on:filterChanged={(event) => (filterChanged = event.detail)}
		/>
		<Section class="flex-no-shrink">Recent Searches</Section>
		<RecentSearchList />
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
</style>
