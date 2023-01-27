<script>
	export let nodes;
	export let iteration = 0;
</script>

{#each nodes as node}
	<div class="suggestion-wrapper">
		<p class="suggestion-item">{node.id} - {node.name} - {iteration}</p>
		<!-- <div class="select-all" /> -->
		<svelte:self nodes={node.childNodes} iteration={iteration + 1} />
	</div>
{/each}

<style>
	.suggestion-wrapper {
		color: var(--figma-color-text);
		font-size: var(--font-size-small);
		background-color: rgb(39, 95, 34);
		padding: 2px;
		margin: 2px;
	}

	.suggestion-item {
		padding: 2px;
		margin: 2px;
		background-color: rgb(41, 133, 85);
	}

	.suggestion-item:hover {
		background-color: var(--figma-color-bg-selected-hover);
	}

	.select-all {
		background-color: palevioletred;
	}
</style>
