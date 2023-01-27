<script>
	import uniqBy from 'lodash/uniqBy';
	import { createEventDispatcher, onMount } from 'svelte';
	let dispatch = createEventDispatcher();
	import { filterDefinitions } from '../stores';

	import { Icon } from 'figma-plugin-ds-svelte';
	import ArrowUpLeftCurved from '../assets/icons/ArrowUpLeftCurved.svg';
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

	setTimeout(() => {
		onmessage = (event) => {
			if (event.data.pluginMessage.type == 'selection-changed') {
				if (!event.data.pluginMessage.interestingNodes) {
					interestingNodes = null;
					return;
				}
				selectedNodes = event.data.pluginMessage.data;
				interestingNodes = event.data.pluginMessage.interestingNodes;

				ancestorNodes = uniqBy(interestingNodes.ancestorNodes, 'id');

				ancestorTree = interestingNodes.ancestorTree;
			}

			selectedSameName = selectedNodes.every((elem) => elem.name === selectedNodes[0].name);
			selectedSameType = selectedNodes.every((elem) => elem.type === selectedNodes[0].type);
		};
	}, 50);
	// For some reason the message event is not registered without a slight delay

	let selectedNodes;
	let interestingNodes;
	let ancestorNodes;

	let ancestorTree;

	function handleClick() {
		let search = {
			area_type: 'ROOT_FRAME',
			case_sensitive: true,
			node_types: [selectedNodes[0].type],
			string_match: 'FUZZY',
			query_text: selectedNodes[0].name,
		};

		dispatch('searchSuggestion', {
			isNew: true,
			search: search,
		});
	}
</script>

{#if interestingNodes}
	<div class="search-suggestions flex column">
		<h4 class="heading">Suggested Search</h4>
		<div class="suggestion-list">
			<SuggestionItem nodes={ancestorTree} />

			{#if selectedSameName && selectedSameType}
				<div class="suggestion-item flex align-items-center pr-xxsmall">
					<Icon iconName={ArrowUpLeftCurved} />
					<div on:click={handleClick}>
						Search for all {$filterDefinitions[0].getTypeName(selectedNodes[0].type)} nodes
						called '{selectedNodes[0].name}' in top level {ancestorNodes.length > 1
							? 'frames'
							: 'frame'}.
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.search-suggestions {
		padding-top: 8px;
		margin: 8px;
		background: var(--figma-color-bg-secondary);
		border: 1px solid var(--figma-color-border);
		border-radius: 6px;
		color: var(--figma-color-text);
		font-size: var(--font-size-small);
		gap: 8px;
		user-select: none;
	}

	.search-suggestions h4 {
		color: var(--figma-color-text);
		padding: 0 8px;
		margin: 0;
		font-size: var(--font-size-small);
		font-weight: var(--font-weight-medium);
	}
	.search-suggestions p {
		margin: 0;
		font-size: var(--font-size-small);
		font-weight: var(--font-weight-normal);
		color: var(--figma-color-text);
	}

	.suggestion-item {
		gap: 8px;
		padding-top: 6px;
		padding-bottom: 6px;
	}

	.suggestion-item:hover {
		background-color: #424242;
	}
</style>
