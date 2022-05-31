<script>
	//import Global CSS from the svelte boilerplate
	//contains Figma color vars, spacing vars, utility classes and more
	import { GlobalCSS } from "figma-plugin-ds-svelte";

	//import some Svelte Figma UI components
	import {
		Button,
		Input,
		Label,
		SelectMenu,
		IconSearch,
		IconButton,
		IconBack,
		IconComponent,
		IconForward,
	} from "figma-plugin-ds-svelte";

	import FilterPill from "./components/FilterPill.svelte";
	import FilterList from "./components/FilterList.svelte";

	//menu items, this is an array of objects to populate to our select menus
	let menuItems = [
		{
			value: "rectangle",
			label: "Rectangle",
			group: null,
			selected: false,
		},
		{ value: "triangle", label: "Triangle ", group: null, selected: false },
		{ value: "circle", label: "Circle", group: null, selected: false },
	];

	var disabled = true;
	var selectedShape;
	var count = 5;

	let searchString = "";

	//this is a reactive variable that will return false when a value is selected from
	//the select menu, its value is bound to the primary buttons disabled prop
	$: disabled = selectedShape === null;

	function createShapes() {
		parent.postMessage(
			{
				pluginMessage: {
					type: "create-shapes",
					count: count,
					shape: selectedShape.value,
				},
			},
			"*"
		);
	}

	function cancel() {
		parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
	}

	function navBack(params) {}
</script>

<div class="wrapper p-xxsmall">
	<div class="main-section">
		<div class="header-group flex">
			<IconButton on:click={navBack} iconName={IconBack} disabled />
			<Input
				iconName={IconSearch}
				placeholder="Search"
				bind:value={searchString}
				class="flex-grow"
			/>
			<IconButton on:click iconName={IconForward} disabled />
		</div>

		<FilterList />
	</div>

	<Label>Shape</Label>
	<SelectMenu bind:menuItems bind:value={selectedShape} class="mb-xxsmall" />

	<Label>Count</Label>
	<Input iconText="#" bind:value={count} class="mb-xxsmall" />

	<div class="flex p-xxsmall mb-xsmall">
		<Button on:click={cancel} variant="secondary" class="mr-xsmall"
			>Cancel</Button
		>
		<Button on:click={createShapes} bind:disabled>Create shapes</Button>
	</div>
</div>

<style>
	/* Add additional global or scoped styles here */
	.header-group {
		gap: 12px;
	}

	.main-section {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	/* Variable for svg fill in flexible icon */
	:global(:root) {
		--transparent: transparent;
	}
</style>
