<script>
	//import some Svelte Figma UI components
	import { IconButton, IconBack, Section } from 'figma-plugin-ds-svelte';

	export let title = '';
</script>

<div class="menu--settings flex column">
	<div class="settings--header flex p-xxxsmall">
		<IconButton on:click iconName={IconBack} />
		<Section class="">{title}</Section>
	</div>
	<div class="settings--content pt-xxsmall pr-xxsmall pl-xxsmall">
		<slot />
	</div>
</div>

<style>
	/* ------------------------- */
	/* FULLSCREEN VIEWS */
	.menu--settings {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: 1;
		background-color: var(--figma-color-bg);
	}

	.settings--header {
		border-bottom: 1px solid var(--figma-color-border);
	}

	.settings--content {
		overflow: auto;
	}
</style>
