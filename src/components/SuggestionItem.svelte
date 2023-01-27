<script>
	export let nodes = [];
	export let node = null;
	export let iteration = 0;

	let hasChildNodes = false;

	if (node) {
		hasChildNodes = node.childNodes.length > 1 ? true : false;
	}

	let childNodes = 'Search in:';

	if (hasChildNodes) {
		node.childNodes.forEach((element) => {
			childNodes = childNodes + ' ' + element.id;
		});
	}

	console.log(nodes);
</script>

<!-- <div class="suggestion-wrapper"> -->
{#if node}
	<p class="suggestion-item">{node.id} - {node.name} - {iteration}</p>
{/if}
<!-- <div class="select-all" /> -->
<div class="select-siblings-helper" class:indent={!hasChildNodes && iteration != 0}>
	{#if hasChildNodes}
		<div class="select-siblings" title={childNodes} />
	{/if}
	<div class="flex-grow">
		{#each nodes as node}
			<svelte:self {node} nodes={node.childNodes} iteration={iteration + 1} />
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
		padding: 2px 0px 2px 2px;
		margin: 2px 0px 2px 2px;
		background-color: rgb(41, 133, 85);
	}

	.suggestion-item:hover {
		background-color: var(--figma-color-bg-selected-hover);
	}

	.select-siblings {
		background-color: palevioletred;
		margin: 2px;
		width: 16px;
	}

	.select-siblings:hover {
		background-color: var(--figma-color-bg-selected-hover);
	}
	.select-siblings-helper {
		display: flex;
		flex-direction: row;
	}

	.indent {
		margin-left: 16px;
	}
</style>
