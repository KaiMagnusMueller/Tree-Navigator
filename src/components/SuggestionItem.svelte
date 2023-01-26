<script>
	export let nodes;
</script>

{#each nodes as node}
	<div class="suggestion-item">
		<p>{node.id} - {node.name}</p>
		<div class="select-all" />
		<svelte:self nodes={node.childNodes} />
	</div>
{/each}

<style>
	.suggestion-item {
		color: var(--figma-color-text);
		font-size: var(--font-size-small);
	}

	.select-all {
		background-color: palevioletred;
	}
</style>
