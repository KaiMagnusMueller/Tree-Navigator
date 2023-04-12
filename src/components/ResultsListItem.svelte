<script>
	import { createEventDispatcher } from 'svelte';

	import { IconButton, IconResizeToFit, Icon } from 'figma-plugin-ds-svelte';

	// Component Icons
	import AppIcon from '../assets/icons/AppIcon.svg';
	import Component from '../assets/icons/NodeTypes/Component.svg';
	import ComponentSet from '../assets/icons/NodeTypes/Component.svg';
	import BooleanOperation from '../assets/icons/NodeTypes/BooleanOperation.svg';
	import Frame from '../assets/icons/NodeTypes/Frame.svg';
	import Group from '../assets/icons/NodeTypes/Group.svg';
	import Instance from '../assets/icons/NodeTypes/Instance.svg';
	import Text from '../assets/icons/NodeTypes/Text.svg';

	const dispatch = createEventDispatcher();
	export let result;

	function returnIcon() {
		switch (result.type) {
			case 'INSTANCE':
				return Instance;
			case 'COMPONENT':
				return Component;
			case 'COMPONENT_SET':
				return ComponentSet;
			case 'BOOLEAN_OPERATION':
				return BooleanOperation;
			case 'FRAME':
				return Frame;
			case 'GROUP':
				return Group;
			case 'TEXT':
				return Text;
			default:
				return AppIcon;
		}
	}

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
<div
	class="result-list-elem flex row pl-xxsmall"
	class:selected={result.selected}
	on:click|self={handleResClick}>
	<div class="result-content flex row">
		<Icon iconName={returnIcon()} />
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
</style>
