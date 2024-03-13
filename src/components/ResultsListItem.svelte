<script>
	import { createEventDispatcher } from 'svelte';
	import { IconButton, IconResizeToFit, Icon } from 'figma-plugin-ds-svelte';
	import { returnIcon } from '../lib/helper-functions';

	const dispatch = createEventDispatcher();
	export let result;

	function handleResClick(e) {
		dispatch('result-clicked', {
			resultID: result.id,
			shiftKey: e.shiftKey,
		});
	}

	function handleFoClick(e) {
		dispatch('focus-selection', {
			resultID: result.id,
		});
	}
</script>

<!-- The |self modifier prevents the selection from being updated before the handleFoClick() event is fired. -->
<!-- This makes it possible to zoom to unselected elements, if that is neccessary -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div
	class="result-list-elem flex row pl-xxsmall"
	class:selected={result.selected}
	on:click|self={handleResClick}
	role="listitem">
	<div class="result-content flex row">
		<Icon iconName={returnIcon(result.type)} />
		<span class="text--results-title">{result.name}</span>
	</div>
	<div class="result-buttons">
		<IconButton iconName={IconResizeToFit} on:click={handleFoClick} />
	</div>
</div>

<style>
	.result-list-elem {
		position: relative;
		padding-top: 2px;
		padding-bottom: 2px;
		align-items: center;
		justify-content: space-between;
		color: var(--figma-color-text);
	}

	.result-content {
		width: 100%;
		align-items: center;
		gap: var(--size-xxsmall);
		pointer-events: none;
	}

	.result-buttons {
		display: none;
	}

	.result-list-elem:hover .result-buttons {
		display: block;
	}

	.result-list-elem:hover:not(.selected)::after {
		content: '';
		position: absolute;
		top: 0px;
		bottom: 0px;
		left: 0;
		right: 0;
		border: 1px solid var(--figma-color-bg-brand-hover, #0d99ff);
		pointer-events: none;
	}

	.result-list-elem.selected {
		background-color: var(--figma-color-bg-selected, #daebf7);
	}

	.text--results-title {
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		/* -webkit-line-clamp: 2; */
		width: 100%;
	}
</style>
