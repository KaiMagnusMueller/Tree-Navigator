<script>
	export let nodes = [];
	export let node = null;
	export let iteration = 0;

	console.log(nodes);
</script>

<div class="suggestion-wrapper">
	{#if node}
		<p class="suggestion-item">{node.id} - {node.name} - {iteration}</p>
	{/if}
	<!-- <div class="select-all" /> -->
	<div class="select-all-helper">
		{#if node}
			{#if node.childNodes.length > 1}
				<div class="select-all" />
			{/if}
		{/if}
		<div class="flex-grow">
			{#each nodes as node}
				<svelte:self {node} nodes={node.childNodes} iteration={iteration + 1} />
			{/each}
		</div>
	</div>
</div>

<style>
	.suggestion-wrapper {
		color: var(--figma-color-text);
		font-size: var(--font-size-small);
		background-color: rgb(39, 95, 34);
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

	.select-all {
		background-color: palevioletred;
		margin-left: 16px;
		width: 16px;
	}

	.select-all-helper {
		display: flex;
		flex-direction: row;
	}
</style>
