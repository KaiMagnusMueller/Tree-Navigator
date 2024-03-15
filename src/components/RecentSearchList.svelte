<script>
	import { filterDefinitions } from '../stores.js';
	import RecentSearchItem from './RecentSearchItem.svelte';
	import { saveRecentSearches } from '../lib/helper-functions';
	import LoadingSpinner from './LoadingSpinner.svelte';
	import { fade } from 'svelte/transition';

	export let recentSearches;

	//node types are in the first array (might be necessary to make this dynamic in the future)
	let filterList = $filterDefinitions[0].filterOptions;

	function getNodeName(types) {
		let nodes = [];
		// if (types.constructor != Array) {
		//     throw 'Expected type Array as types';
		// }
		// console.log(types);
		if (types == undefined) {
			console.warn('No recent searches');
			return null;
		}

		types.forEach((type) => {
			if (type == undefined) {
				console.warn('Invalid recent search item');
				return undefined;
			}
			nodes.push(
				filterList.find((element) => element.value.toLowerCase() == type.toLowerCase())
					.name,
			);
		});
		return nodes;
	}

	function handleRemoveSearch(event) {
		const index = event.detail;
		recentSearches.splice(index, 1);
		recentSearches = recentSearches;
		saveRecentSearches(recentSearches);
	}

	function handleMoveToTop(event) {
		const index = event.detail;
		const cutArray = recentSearches.splice(index, 1);

		recentSearches = [...cutArray, ...recentSearches];
		saveRecentSearches(recentSearches);
	}
</script>

{#if recentSearches.length > 0}
	<div class="recent-search-list flex column flex-grow">
		{#each recentSearches as search, i (search.query_submit_time)}
			<RecentSearchItem
				{search}
				{i}
				node_types={getNodeName(search.node_types)}
				on:recentSearch
				on:moveToTop={handleMoveToTop}
				on:removeSearch={handleRemoveSearch}
				>{search.query_text}
			</RecentSearchItem>
		{/each}
	</div>
{:else if recentSearches.length === 0}
	<div class="empty-state-container">
		<div class="empty-state" transition:fade={{ duration: 100, delay: 100 }}>
			<svg
				id="icon"
				xmlns="http://www.w3.org/2000/svg"
				width="32"
				height="32"
				viewBox="0 0 32 32"
				><defs
					><style>
						.cls-1 {
							fill: none;
						}
					</style></defs
				><title>recently-viewed</title><polygon
					points="20.59 22 15 16.41 15 7 17 7 17 15.58 22 20.59 20.59 22" /><path
					d="M16,2A13.94,13.94,0,0,0,6,6.23V2H4v8h8V8H7.08A12,12,0,1,1,4,16H2A14,14,0,1,0,16,2Z" /><rect
					id="_Transparent_Rectangle_"
					data-name="&lt;Transparent Rectangle&gt;"
					class="cls-1"
					width="32"
					height="32" /></svg>
			<p class="text--results-info">Manual searches are saved here</p>
		</div>
		{#if !recentSearches}
			<div class="empty-state">
				<LoadingSpinner />
			</div>
		{/if}
	</div>
{/if}

<style>
	.recent-search-list {
		gap: 2px;
		height: 100%;
		position: relative;
		min-height: 100px;
		border-top: 1px solid var(--figma-color-border);
	}

	.empty-state-container {
		margin: auto 0;

		font-size: var(--font-size-xsmall);
		font-weight: var(--font-weight-normal);
		letter-spacing: var(--font-letter-spacing-neg-small);
		line-height: var(--font-line-height);
	}

	.empty-state {
		max-width: 140px;
		margin-inline: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 8px;
	}

	svg {
		fill: var(--figma-color-text-disabled);
	}

	.text--results-info {
		color: var(--figma-color-text-disabled);
		text-align: center;
		margin: 0;
	}
</style>
