<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import { activeFilters } from '../stores';
	import FilterPill from './FilterPill.svelte';

	// Exported variables
	export let layerTreeSearchQuery;
	let className = '';
	export { className as class };
	let filterListArray = [];
	export { filterListArray as filterList };

	// Local variables
	let scrollPos = 0;
	let filterArray = [];
	let filterDefinitionsElem;
	let scrollMinMax = [];

	// Event dispatcher
	const dispatch = createEventDispatcher();

	// Initialize filter array
	filterArray = sortAndBuildFilter(filterListArray);

	onMount(() => {
		initScrollPosition();
	});

	function sortAndBuildFilter(array) {
		array.forEach((el) => {
			const filters = el.filterOptions;

			let stickyTypes = filters.filter((elem) => elem.sticky == true);
			let regularTypes = filters.filter(
				(elem) => elem.sticky === false || elem.sticky === undefined,
			);

			let _filterOptions = stickyTypes.concat(regularTypes);

			_filterOptions.forEach((element) => {
				const enabled = element?.default ? true : false;
				element.selected = enabled;
				element.label = element.name;

				if (element.sticky == true) {
					element.group = 'group1';
				} else {
					element.group = 'group2';
				}
			});

			el.filterOptions = _filterOptions;
		});
		return array;
	}

	/**
	 * Handles the filter event.
	 *
	 * @param {Event} event - The filter event.
	 */
	function handleFilter(event) {
		// Destructure properties from the event detail
		const { filterType, selection, multiSelect } = event.detail;

		// Create an array of selected values based on the multiSelect flag, otherwise simply select the first value
		let selectedValues = multiSelect ? selection.map((elem) => elem.value) : selection[0].value;

		// Update the activeFilters state with the selected values
		$activeFilters[filterType] = selectedValues;

		initScrollPosition();

		// Display message if the filter options are set to fuzzy and case sensitive
		if ($activeFilters.string_match === 'FUZZY' && $activeFilters.case_sensitive === true) {
			parent.postMessage(
				{
					pluginMessage: {
						type: 'post-message-toast',
						data: `To search with case sensitivity, select 'Match exact name' instead of 'Match fuzzy'.`,
					},
				},
				'*',
			);
		}

		// Dispatch filterChanged event, return  if selectedValues is not 'ALL'
		dispatch('filterChanged', selectedValues !== 'ALL');
	}

	function initScrollPosition() {
		scrollMinMax = [
			0,
			-1 *
				(filterDefinitionsElem.scrollWidth -
					filterDefinitionsElem.parentElement.clientWidth) -
				8,
		];

		//TODO: fix figma not correctly assigning scrolllWidth
		// scrollWidth: 1051
		//         1007
		// VM111974:2852 320
		// VM111974:2853 (2) [0, -695]

		// console.log(filterDefinitionsElem.scrollWidth);
		// console.log(filterDefinitionsElem.parentElement.clientWidth);
		// console.log(scrollMinMax);
	}

	function handleScrollEvt(event) {
		// TODO: there has to be a better way than recalculating the scroll bounds on every scroll
		initScrollPosition();

		let delta;
		if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
			delta = event.deltaX;
		} else {
			delta = event.deltaY;
		}

		if (Math.abs(delta) >= 5) {
			moveFilterList(delta);
		}
	}

	function moveFilterList(delta) {
		scrollPos -= delta;
		scrollPos = Math.max(scrollMinMax[1], Math.min(scrollMinMax[0], scrollPos));
		// console.log(scrollPos, scrollMinMax);
	}

	function handleManualScroll(value) {
		moveFilterList(value);
	}

	$: layerTreeSearchQuery, updateSelectedFilters();

	/**
	 * When the layer tree search query changes, update the selected filters.
	 */
	function updateSelectedFilters() {
		if (!layerTreeSearchQuery) return;

		// Manual fix for unknown node types
		// Search if the node type exists in the current filter option array and of not insert it
		// Right now only works for node type, only if node type is first in the filter array and only if the search query has only one type
		// Since this is only triggered from the layer tree, there is only one node type from the selection anyways
		const nodeType = layerTreeSearchQuery.node_types?.[0];
		if (nodeType && !filterArray[0].filterOptions.some((elem) => elem.value === nodeType)) {
			filterArray[0].filterOptions.push({ value: nodeType, name: nodeType, label: nodeType });
			console.warn(`Add menu option for unknown node type ${nodeType}.`);
		}

		// Mark the filter options from the layer tree query as selected
		filterArray.forEach((filter) => {
			const filterType = filter.filterData.filterType;
			filter.filterOptions.forEach((option) => {
				option.selected = Array.isArray(layerTreeSearchQuery[filterType])
					? layerTreeSearchQuery[filterType].includes(option.value)
					: layerTreeSearchQuery[filterType] == option.value;
			});
		});
	}
</script>

<svelte:window on:resize={initScrollPosition} />
<div class="filter-wrapper">
	<div class="scroll-wrapper {className}">
		<div
			id="filterDefinitions"
			bind:this={filterDefinitionsElem}
			class="filter-pill-group flex pl-xxsmall"
			on:wheel|preventDefault|stopPropagation={handleScrollEvt}
			style="left: {scrollPos}px;">
			{#each filterArray as filter}
				<FilterPill
					on:selectFilter={handleFilter}
					optionList={filter.filterOptions}
					filterData={filter.filterData}
					bind:currentQuery={layerTreeSearchQuery} />
			{/each}
		</div>
	</div>
</div>

<style>
	.filter-pill-group {
		gap: 8px;
		position: absolute;
		transition: left 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
	}

	.scroll-wrapper {
		position: relative;
		overflow-x: clip;
		height: 28px;
	}
</style>
