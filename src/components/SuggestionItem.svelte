<script>
	import { createEventDispatcher } from 'svelte';
	let dispatch = createEventDispatcher();

	export let parent = null;
	export let iteration = 0;
	export let selectedNode = [];
	export let smallTree = false;

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

<button
	class="suggestion-item horizontal"
	class:small={smallTree}
	on:click={() => handleClick([parent.id])}
	on:keydown={(e) => (e.key === 'Enter' ? handleClick([parent.id]) : null)}
	tabindex="">
	<p class="" title={'Search in: ' + parent.name}>
		{parent.name}
	</p>
</button>

<div
	class="child-node-wrapper"
	class:indent={(!hasChildNodes && iteration != 0) || nodes.length == 1}
	class:small={smallTree}>
	{#if nodes.length > 1}
		<button
			class="suggestion-item vertical"
			title={'Search in: ' + childNodeNames.join(', ')}
			on:click={() => handleClick(childNodeIDs)}
			on:keydown={(e) => (e.key === 'Enter' ? handleClick(childNodeIDs) : null)} />
	{/if}
	<div class="child-container flex-grow">
		{#each nodes as node (node.id)}
			<svelte:self
				on:clickTree
				parent={node}
				iteration={iteration + 1}
				{selectedNode}
				{smallTree} />
		{/each}
	</div>
</div>

<style>
	.suggestion-item {
		margin: 2px;
		display: flex;
		align-items: center;
		border: 1px solid var(--figma-color-border);
		border-radius: 2px;
		background: var(--figma-color-bg-secondary);
		color: var(--figma-color-text);
		font-size: var(--font-size-small);
		width: 100%;
		text-align: unset;
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
		/* This should be 28px (because the vertical button is 24px wide and all SuggestionItems have 2px margin)
        Because of this, child nodes jump a little, when a sibling is selected. It's a small issue, so saving some space on every level instead is acceptable */
		margin-left: 24px;
	}

	/* SMALL VERSION */
	.small .vertical {
		width: 16px;
	}

	.horizontal.small {
		height: 16px;
	}

	.indent.small {
		margin-left: 16px;
	}
</style>
