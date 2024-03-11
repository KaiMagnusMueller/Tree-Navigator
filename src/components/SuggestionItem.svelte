<script>
	import { createEventDispatcher } from 'svelte';
	import { Icon } from 'figma-plugin-ds-svelte';
	import { returnIcon } from '../lib/helper-functions';
	import ChevronRight from '../assets/icons/ChevronRight.svg';

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
			string_match: 'EXACT',
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
	<Icon iconName={returnIcon(parent.type)} size={smallTree ? '12' : '16'} />
	<p class="" title={'Search in parent: ' + parent.name}>
		{parent.name}
	</p>
	<div class="search-button">
		<Icon iconName={ChevronRight} size={smallTree ? '12' : '16'} />
	</div>
</button>

<div
	class="child-node-wrapper"
	class:indent={(!hasChildNodes && iteration != 0) || nodes.length == 1}
	class:small={smallTree}>
	{#if nodes.length > 1}
		<button
			class="suggestion-item vertical"
			title={'Search in parents: ' + childNodeNames.join(', ')}
			on:click={() => handleClick(childNodeIDs)}
			on:keydown={(e) => (e.key === 'Enter' ? handleClick(childNodeIDs) : null)}></button>
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
		margin: 2px 0;
		display: flex;
		align-items: center;
		border: 1px solid var(--figma-color-border);
		border-radius: 2px;
		background: var(--figma-color-bg-secondary);
		color: var(--figma-color-text);
		font-size: var(--font-size-small);
		width: 100%;
		text-align: unset;
		gap: 4px;
	}
	.suggestion-item:hover {
		background-color: var(--figma-color-bg-selected-hover);
		border-color: var(--figma-color-border-selected);
	}

	.suggestion-item p {
		margin: 0;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		flex-grow: 1;
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
		margin-right: 4px;
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
		width: 20px;
	}

	.horizontal.small {
		height: 20px;
	}

	.indent.small {
		margin-left: 20px;
	}

	.search-button {
		display: none;
	}
	.suggestion-item:hover .search-button {
		display: block;
	}
</style>
