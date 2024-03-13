import { readable, writable } from 'svelte/store';

export let filterDefinitionsDefault = writable([]);

export let filterDefinitions = writable([
	{
		getTypeName(value) {
			let filterOption = this.filterOptions.find(
				(element) => element.value.toLowerCase() == value.toLowerCase()
			);

			if (!filterOption) {
				console.warn('unknown node type ' + value);
				return;
			}

			return filterOption.name;
		},
		filterData: {
			filterType: 'node_types',
			multiSelect: true,
		},

		filterOptions: [
			{
				value: 'ALL',
				name: 'All types',
				count: 0,
				sticky: true,
				default: true,
			},
			{
				value: 'BOOLEAN_OPERATION',
				name: 'Boolean Operation',
				count: 0,
				sticky: false,
			},
			{
				value: 'COMPONENT',
				name: 'Component',
				count: 0,
				sticky: false,
			},
			{
				value: 'COMPONENT_SET',
				name: 'Component Set',
				count: 0,
				sticky: false,
			},
			{
				value: 'ELLIPSE',
				name: 'Ellipse',
				count: 0,
				sticky: false,
			},
			{
				value: 'FRAME',
				name: 'Frame',
				count: 0,
				sticky: false,
			},
			{
				value: 'GROUP',
				name: 'Group',
				count: 0,
				sticky: false,
			},
			{
				value: 'INSTANCE',
				name: 'Instance',
				count: 0,
				sticky: false,
			},
			{
				value: 'LINE',
				name: 'Line',
				count: 0,
				sticky: false,
			},
			{
				value: 'POLYGON',
				name: 'Polygon',
				count: 0,
				sticky: false,
			},
			{
				value: 'RECTANGLE',
				name: 'Rectangle',
				count: 0,
				sticky: false,
			},
			{
				value: 'SECTION',
				name: 'Section',
				count: 0,
				sticky: false,
			},
			{
				value: 'SLICE',
				name: 'Slice',
				count: 0,
				sticky: false,
			},
			{
				value: 'STAR',
				name: 'Star',
				count: 0,
				sticky: false,
			},
			{
				value: 'TEXT',
				name: 'Text',
				count: 0,
				sticky: false,
			},
			{
				value: 'VECTOR',
				name: 'Vector',
				count: 0,
				sticky: false,
			},
		],
	},
	{
		getTypeName(value) {
			let filterOption = this.filterOptions.find(
				(element) => element.value.toLowerCase() == value.toLowerCase()
			);

			if (!filterOption) {
				console.warn('unknown area type ' + value);
				return;
			}

			return filterOption.name;
		},
		filterData: {
			filterType: 'area_type',
			multiSelect: false,
		},
		filterOptions: [
			{
				value: 'PAGE',
				name: 'Current page',
				default: true,
			},
			{
				value: 'SELECTION',
				name: 'Current selection',
			},
			{
				value: 'ROOT_FRAME',
				name: 'Top level frame',
			},
			{
				value: 'SELECTION_PRESET',
				name: 'Subtree',
				hidden: true,
			},
		],
	},
	{
		filterData: {
			filterType: 'case_sensitive',
			multiSelect: false,
		},
		filterOptions: [
			{
				value: false,
				name: 'Match case insensitive',
				default: true,
			},
			{
				value: true,
				name: 'Match case sensitive',
			},
		],
	},
	{
		filterData: {
			filterType: 'string_match',
			multiSelect: false,
			filterTooltip: 'More options coming soon',
		},
		filterOptions: [
			{
				value: 'EXACT',
				name: 'Match exact name',
			},
			// {
			//     value: "PART",
			//     name: "Match partial",
			// },
			{
				value: 'FUZZY',
				name: 'Match fuzzy',
				default: true,
			},
		],
	},
]);

// --------------------------------

export let activeFilters = writable({});

export let searchQuery = writable({});

export let UIState = writable({
	showMainMenu: true,
	showSearchResults: false,
	showAboutScreen: false,
});

export let defaultSettings = readable({
	recentSearchLength: 20,
	rememberNodeFilterCounts: true,
	compactMode: false,
});

export let settings = writable({});

export let tutorials = writable([
	{
		id: 1,
		title: 'Tree Select',
		body: 'Quickly select elements with the same name or type in your designs',
		link: {
			title: 'Learn more',
			href: 'https://www.kaimagnus.de/articles/using-the-tree-navigator-plugin',
		},
		image: 'https://res.cloudinary.com/dm3a0qioc/image/upload/v1678665215/Layer%20Tree%20Search%20Plugin/LayerTree_mdly1q.png',
		viewed: false,
	},
	{
		id: 2,
		title: 'Recent Searches',
		body: 'Rerun a search to go back to a previous selection',
		link: {
			title: 'Learn more',
			href: 'https://www.kaimagnus.de/articles/using-the-tree-navigator-plugin#recent-searches',
		},
		image: 'https://res.cloudinary.com/dm3a0qioc/image/upload/v1678738209/Layer%20Tree%20Search%20Plugin/RecentSearches_eprbxa.png',
		viewed: false,
	},
	{
		id: 3,
		title: 'Tip: Narrow down your selection',
		body: "You can search inside your layer tree selection with the 'Current selection' filter",
		// link: {
		// 	title: 'Learn more',
		// 	href: 'https://www.kaimagnus.de/articles/using-the-tree-navigator-plugin#recent-searches',
		// },
		image: 'https://res.cloudinary.com/dm3a0qioc/image/upload/v1709913838/Layer%20Tree%20Search%20Plugin/NarrowSearch_axkfrv.png',
		viewed: false,
	},
	{
		id: 4,
		title: 'New Layer Type Icons',
		body: 'Not sure which layer to select? Each parent now displays its type to help you choose the right one.',
		// link: {
		// 	title: 'Learn more',
		// 	href: 'https://www.kaimagnus.de/articles/using-the-tree-navigator-plugin#recent-searches',
		// },
		image: 'https://res.cloudinary.com/dm3a0qioc/image/upload/v1709916526/Layer%20Tree%20Search%20Plugin/TreeIcons_v1ipto.png',
		viewed: false,
	},
]);
