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
			isNew: true,
			search: search,
		});
	}
</script>

<!-- <div class="suggestion-wrapper"> -->
<p
	class="suggestion-item item-horizontal"
	on:click={() => handleClick([parent.id])}
	title={'Search in: ' + parent.name}>
	{parent.name}
</p>

<!-- <div class="select-all" /> -->
<div
	class="select-siblings-helper"
	class:indent={(!hasChildNodes && iteration != 0) || nodes.length == 1}>
	{#if nodes.length > 1}
		<div
			class="suggestion-item select-siblings"
			title={'Search in: ' + childNodeNames.join(', ')}
			on:click={() => handleClick(childNodeIDs)} />
	{/if}
	<div class="flex-grow">
		{#each nodes as node (node.id)}
			<svelte:self on:clickTree parent={node} iteration={iteration + 1} {selectedNode} />
		{/each}
	</div>
</div>

<!-- </div> -->
<style>
	.suggestion-wrapper {
		color: var(--figma-color-text);
		font-size: var(--font-size-small);
		background-color: rgba(39, 95, 34, 0.279);
		padding: 2px 0px 2px 2px;
		margin: 2px 0px 2px 2px;
	}

	.suggestion-item {
		padding: 4px;
		margin: 2px;
		background: var(--figma-color-bg-secondary);
		border: 1px solid var(--figma-color-border);
		border-radius: 2px;
	}

	.item-horizontal {
		padding-left: 8px;
	}

	.suggestion-item:hover {
		background-color: var(--figma-color-bg-selected-hover);
	}

	.select-siblings {
		background: var(--figma-color-bg-secondary);
		border: 1px solid var(--figma-color-border);

		margin: 2px;
		width: 24px;
	}

	.select-siblings:hover {
		background-color: var(--figma-color-bg-selected-hover);
	}
	.select-siblings-helper {
		display: flex;
		flex-direction: row;
	}

	.indent {
		margin-left: 24px;
	}
</style>
