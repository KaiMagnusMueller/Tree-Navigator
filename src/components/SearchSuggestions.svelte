<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import { filterDefinitions } from '../stores';
	import SuggestionItem from './SuggestionItem.svelte';

	// const searchSuggestions = [
	// 	{
	// 		type: 'ROOT_FRAME',
	// 		search: {
	// 			area_type: 'ROOT_FRAME',
	// 			case_sensitive: true,
	// 			node_types: [selectedNodes[0].type],
	// 			string_match: 'FUZZY',
	// 			query_text: selectedNodes[0].name,
	// 		},
	// 		suggestionLabel: `Search for all ${$filterDefinitions[0].getTypeName(
	// 			selectedNodes[0].type
	// 		)} nodes called ${selectedNodes[0].name} in top level ${
	// 			ancestorNodes.length > 1 ? 'frames' : 'frame'
	// 		}.`,
	// 	},
	// 	{
	// 		type: 'ROOT_SECTION',
	// 		search: {
	// 			area_type: 'ROOT_SECTION',
	// 			case_sensitive: true,
	// 			node_types: [selectedNodes[0].type],
	// 			string_match: 'FUZZY',
	// 			query_text: selectedNodes[0].name,
	// 		},
	// 		suggestionLabel: `Search for all ${$filterDefinitions[0].getTypeName(
	// 			selectedNodes[0].type
	// 		)} nodes called ${selectedNodes[0].name} in top level ${
	// 			ancestorNodes.length > 1 ? 'sections' : 'section'
	// 		}.`,
	// 	},
	// ];

	onMount(() => {
		setTimeout(() => {
			parent.postMessage(
				{
					pluginMessage: {
						type: 'ui-loaded',
					},
				},
				'*'
			);
		}, 50);
	});

	let selectedSameName = true;
	let selectedSameType = true;
	// The first node of the selection, type and name are guarranteed to be the same across the selection when we do a search, since the suggestions are hidden if there are different types and names in the selection
	let selectedNode = {};
	window.addEventListener('message', (event) => {
		if (event.data.pluginMessage.type == 'selection-changed') {
			if (!event.data.pluginMessage.interestingNodes) {
				interestingNodes = null;
				return;
			}
			selectedNodes = event.data.pluginMessage.data;
			interestingNodes = event.data.pluginMessage.interestingNodes;

			ancestorTree = interestingNodes.ancestorTree;
			ancestorTree = ancestorTree;

			selectedSameName = selectedNodes.every((elem) => elem.name === selectedNodes[0].name);
			selectedSameType = selectedNodes.every((elem) => elem.type === selectedNodes[0].type);

			selectedNode = {
				name: selectedNodes[0].name,
				type: selectedNodes[0].type,
			};

			treeDepth = getDepth(ancestorTree);
		}
	});

	let selectedNodes;
	let interestingNodes;
	// let ancestorNodes;
	let treeDepth;

	// $: ancestorTree = [];  --- changed because of https://github.com/sveltejs/svelte/issues/8374, maybe has some side effects, but seems to be working fine without
	let ancestorTree = [];

	function getDepth(array) {
		return 1 + Math.max(0, ...array.map(({ childNodes = [] }) => getDepth(childNodes)));
	}
</script>

{#if interestingNodes}
	<div class="search-suggestions flex column">
		<div>
			<!-- <h4 class="heading">Suggested Search</h4> -->
			{#if selectedSameName && selectedSameType}
				<p>
					Search for all {$filterDefinitions[0].getTypeName(selectedNode.type)} nodes called
					<i>'{selectedNode.name}'</i> in:
				</p>
			{:else}
				<p>Select nodes of the same type and name to display the layer tree.</p>
			{/if}
		</div>
		{#if selectedSameName && selectedSameType}
			<div class="suggestion-list" class:small-tree={treeDepth >= 8}>
				{#each ancestorTree as parent (parent.id)}
					<SuggestionItem
						{parent}
						on:clickTree
						{selectedNode}
						smallTree={treeDepth >= 8} />
				{/each}

				<!-- <div class="suggestion-item flex align-items-center pr-xxsmall">
					<Icon iconName={ArrowUpLeftCurved} />
					<div on:click={handleClick}>
						Search for all {$filterDefinitions[0].getTypeName(selectedNodes[0].type)} nodes
						called '{selectedNodes[0].name}' in top level {ancestorNodes.length > 1
							? 'frames'
							: 'frame'}.
					</div>
				</div> -->
			</div>
		{/if}
	</div>
{:else}
	<div class="search-suggestions flex column">
		<div>
			<!-- <h4 class="heading">Layer Tree</h4> -->
			<p>Select a layer, or multiple of the same type and name, to display the layer tree.</p>
		</div>
	</div>
{/if}

<style>
	.search-suggestions {
		padding: 8px;
		/* margin: 8px; */
		/* background: var(--figma-color-bg-secondary); */
		border-bottom: 1px solid var(--figma-color-border);
		/* border-radius: 6px; */
		color: var(--figma-color-text);
		font-size: var(--font-size-small);
		gap: 8px;
		user-select: none;
	}

	/* .search-suggestions h4 {
		color: var(--figma-color-text);
		margin: 0;
		font-size: var(--font-size-small);
		font-weight: var(--font-weight-normal);
	} */
	.search-suggestions p {
		margin: 6px 0 0 0;
		font-size: var(--font-size-small);
		font-weight: var(--font-weight-normal);
		color: var(--figma-color-text-secondary);
	}

	p:first-child {
		margin: 0;
	}

	.search-suggestions p i {
		color: var(--figma-color-text);
	}
</style>
