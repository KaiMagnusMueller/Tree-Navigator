<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	let dispatch = createEventDispatcher();
	import { filterDefinitions } from '../stores';

	setTimeout(() => {
		onmessage = (event) => {
			if (event.data.pluginMessage.type == 'selection-changed') {
				if (!event.data.pluginMessage.interestingNodes) {
					interestingNodes = null;
					return;
				}
				selectedNodes = event.data.pluginMessage.data;
				interestingNodes = event.data.pluginMessage.interestingNodes;
				console.log(interestingNodes.ancestorNodes);
				console.log(selectedNodes);
			}

			selectedSameName = selectedNodes.every((elem) => elem.name === selectedNodes[0].name);
			selectedSameType = selectedNodes.every((elem) => elem.type === selectedNodes[0].type);
		};
	}, 50);
	// For some reason the message event is not registered without a slight delay

	let selectedNodes;
	let interestingNodes;

	function handleClick() {
		let search = {
			area_type: 'ROOT_FRAME',
			case_sensitive: true,
			node_types: [selectedNodes[0].type],
			string_match: 'FUZZY',
			// TODO: debug node filtering in results list, somehow all nodes get removed from results, even though there are matching nodes
			query_text: selectedNodes[0].name,
		};

		console.log(search);

		dispatch('searchSuggestion', {
			isNew: true,
			search: search,
		});
	}

	let selectedSameName = true;
	let selectedSameType = true;
</script>

{#if interestingNodes}
	<div class="search-suggestions">
		<h4>Suggested Searches</h4>
		{#if selectedSameName && selectedSameType}
			<div on:click={handleClick}>
				Search for all {$filterDefinitions[0].getTypeName(selectedNodes[0].type)} nodes called
				“{selectedNodes[0].name}” in the current top level {selectedNodes.length > 1
					? 'frames'
					: 'frame'}.
			</div>
		{/if}
	</div>
{/if}

<style>
	.search-suggestions {
		padding: 8px;
		margin: 8px;
		background: var(--figma-color-bg-secondary);
		border: 1px solid var(--figma-color-border);
		border-radius: 6px;
		color: var(--figma-color-text);
		font-size: var(--font-size-small);
		font-weight: var(--font-weight-normal);
	}

	.search-suggestions h4 {
		color: var(--figma-color-text);

		margin: 0;
		font-size: var(--font-size-small);
		font-weight: var(--font-weight-normal);
	}
	.search-suggestions p {
		margin: 0;
		font-size: var(--font-size-small);
		font-weight: var(--font-weight-normal);
		color: var(--figma-color-text);
	}
</style>
