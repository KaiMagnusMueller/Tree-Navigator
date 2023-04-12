<script>
	import { filterDefinitions } from '../stores.js';
	import { Icon, IconClose, IconSearch, IconButton, IconForward } from 'figma-plugin-ds-svelte';

	import { fade } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	let dispatch = createEventDispatcher();

	export let node_types;
	export let i;

	export let search = {};
	//   console.log(search);

	// node_types: [],
	// query_text: "",
	// area_type: false,
	// selected_node_ids: [],
	// query_submit_time: "",

	function handleClick() {
		console.log('start recent search');

		//addToRecents = false
		dispatch('recentSearch', {
			addToRecents: false,
			search: search,
		});
		dispatch('moveToTop', i);
	}

	function handleRemove() {
		console.log('remove this search');
		dispatch('removeSearch', i);
	}
</script>

<div class="recent-search-item p-xxsmall flex" in:fade={{ delay: 25 * i, duration: 60 }}>
	<Icon iconName={IconSearch} />
	<div class="item-content flex column single-line">
		<h4>'<slot />'</h4>
		<p>
			{#each node_types as type}
				{type}
			{/each} · {$filterDefinitions[1].getTypeName(search.area_type)}
		</p>
	</div>
	<div class="search-button">
		<IconButton iconName={IconClose} on:click={handleRemove} />
		<IconButton iconName={IconForward} on:click={handleClick} />
	</div>
</div>

<style>
	.recent-search-item {
		gap: var(--size-xxsmall);
		position: relative;
	}

	.recent-search-item:first-of-type {
		margin-top: var(--size-xxsmall);
	}

	.recent-search-item:hover {
		background-color: var(--figma-color-bg-hover);
	}

	.item-content {
		gap: 4px;
		pointer-events: none;
		min-width: 0;
	}

	.item-content h4 {
		color: var(--figma-color-text);

		margin: 0;
		font-size: var(--font-size-small);
		font-weight: var(--font-weight-normal);
	}
	.item-content p {
		margin: 0;
		font-size: var(--font-size-small);
		font-weight: var(--font-weight-normal);
		color: var(--figma-color-text-secondary);
	}

	.search-button {
		margin-left: auto;
		display: none;
	}

	.recent-search-item:hover .search-button {
		display: flex;
		gap: 4px;
	}

	.single-line * {
		display: -webkit-box;
		-webkit-line-clamp: 1;
		line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
		line-break: anywhere;
		text-overflow: ellipsis;
	}
</style>
