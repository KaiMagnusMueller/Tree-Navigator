<script>
	export let node = null;
	export let iteration = 0;

	let children = [];

	$: {
		children = node.childNodes;

		// let log = [];
		// children.forEach((element) => {
		// 	log.push(element.name);
		// });

		// if (log.length > 0) {
		// 	console.log(log.join(', '));
		// } else {
		// 	console.log('no children');
		// }
	}

	let hasChildNodes;

	$: hasChildNodes = children?.length > 0 ? true : false;

	let childNodes = 'Search in:';

	if (hasChildNodes) {
		children.forEach((element) => {
			childNodes = childNodes + ' ' + element.id;
		});
	}
</script>

<!-- <div class="suggestion-wrapper"> -->
<p class="suggestion-item">{node.id} - {node.name} - {iteration} - {hasChildNodes}</p>

<!-- <div class="select-all" /> -->
<div
	class="select-siblings-helper"
	class:indent={(!hasChildNodes && iteration != 0) || children.length == 1}>
	{#if children.length > 1}
		<div class="select-siblings" title={childNodes} />
	{/if}
	<div class="flex-grow">
		{#each children as child (child.id)}
			<svelte:self node={child} iteration={iteration + 1} />
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
