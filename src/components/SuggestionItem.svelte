<script>
	import { createEventDispatcher } from 'svelte';
	let dispatch = createEventDispatcher();

	export let parent = null;
	export let iteration = 0;
	export let selectedNode = [];

	let nodes = [];
	let childNodeIDs = [];
	let childNodeNames = [];

	$: {
		nodes = parent.childNodes;

		childNodeIDs = [];
		childNodeNames = [];
		nodes.forEach((element) => {
			childNodeIDs.push(element.id);
			childNodeNames.push(element.name);
		});
	}

	let hasChildNodes;

	$: hasChildNodes = nodes?.length > 0 ? true : false;

	function handleClick(nodes) {
		console.log(nodes);
		let search = {
			area_type: 'SELECTION_PRESET',
			case_sensitive: true,
			node_types: [selectedNode.type],
			string_match: 'FUZZY',
			query_text: selectedNode.name,
			selected_nodes: nodes,
		};

		dispatch('clickTree', {
			addToRecents: true,
			search: search,
		});
	}
</script>

<div class="suggestion-item horizontal" on:click={() => handleClick([parent.id])}>
	<p class="" title={'Search in: ' + parent.name}>
		{parent.name}
	</p>
</div>

<div
	class="child-node-wrapper"
	class:indent={(!hasChildNodes && iteration != 0) || nodes.length == 1}>
	{#if nodes.length > 1}
		<div
			class="suggestion-item vertical"
			title={'Search in: ' + childNodeNames.join(', ')}
			on:click={() => handleClick(childNodeIDs)} />
	{/if}
	<div class="child-container flex-grow">
		{#each nodes as node (node.id)}
			<svelte:self on:clickTree parent={node} iteration={iteration + 1} {selectedNode} />
		{/each}
	</div>
</div>

<style>
	/* nice */
	.suggestion-item {
		margin: 2px;
		display: flex;
		align-items: center;
		border: 1px solid var(--figma-color-border);
		border-radius: 2px;
		background: var(--figma-color-bg-secondary);
	}
	.suggestion-item:hover {
		background-color: var(--figma-color-bg-selected-hover);
	}

	.suggestion-item p {
		margin: 0;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	.horizontal {
		padding: 0 4px;
		height: 24px;
	}

	.child-container {
		min-width: 0;
	}

	.vertical {
		width: 24px;
		flex-shrink: 0;
		border: 1px solid var(--figma-color-border);
		background: var(--figma-color-bg-secondary);
	}

	.vertical:hover {
		background-color: var(--figma-color-bg-selected-hover);
	}
	.child-node-wrapper {
		display: flex;
		flex-direction: row;
	}

	.indent {
		margin-left: 24px;
	}
</style>
