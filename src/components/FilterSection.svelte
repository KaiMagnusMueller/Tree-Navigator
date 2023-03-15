<script>
	import { afterUpdate, onMount, createEventDispatcher } from 'svelte';

	import { activeFilters, searchQuery, settings } from '../stores';
	import FilterPill from './FilterPill.svelte';
	import FilterScrollButton from './FilterScrollButton.svelte';
	import { Checkbox } from 'figma-plugin-ds-svelte';

	export { className as class };
	let className = '';

	let filterListArray = [];
	export { filterListArray as filterList };

	// $: console.log($activeFilters);

	let filterArray = [];

	filterArray = sortAndBuildFilter(filterListArray);

	function sortAndBuildFilter(array) {
		let _filterArray;
		array.forEach((el) => {
			const filterType = el.filterType;
			const filters = el.filterOptions;

			let stickyTypes = filters.filter((elem) => elem.sticky == true);
			let regularTypes = filters.filter(
				(elem) => elem.sticky === false || elem.sticky === undefined
			);

			// Sort by filter counts if rememberNodeFilterCounts is on
			if ($settings.rememberNodeFilterCounts && filterType === 'node_type') {
				stickyTypes.sort((a, b) => {
					return b.count - a.count;
				});
				regularTypes.sort((a, b) => {
					return b.count - a.count;
				});
			}

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

	let _activeFilters = [];

	// array with checked filters excluding ALL
	let checkedLayerFilters;

	const dispatch = createEventDispatcher();

	function handleFilter(event) {
		const filterType = event.detail.filterType;
		const evtSelection = event.detail.selection;

		let selection = [];

		if (event.detail.multiSelect) {
			evtSelection.forEach((elem) => {
				selection.push(elem.value);
			});

			if (selection.find((element) => element.value !== 'ALL')) {
				dispatch('filterChanged', true);
			} else {
				dispatch('filterChanged', false);
			}
		} else {
			selection = evtSelection[0].value;
		}

		$activeFilters[filterType] = selection;
		initScrollPosition();
	}

	let filterDefinitionsElem;
	let scrollMinMax = [];

	onMount(() => {
		// console.log(filterDefinitionsElem);
		initScrollPosition();
	});

	// TODO: 20.07. fix being able to scroll even when the filter is smaller than the plugin window
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

	let scrollPos = 0;

	afterUpdate(() => {});

	function handleScroll(event) {
		// TODO: there has to be a better way than recalculating the scroll bounds on every scroll
		initScrollPosition();

		let delta;
		if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
			delta = event.deltaX;
		} else {
			delta = event.deltaY;
		}

		if (delta >= 5 || delta <= -5) {
			moveFilterList(delta);
		}
	}

	function moveFilterList(delta) {
		// multiply by -1 to reverse scroll direction (to make it conform to standard mouse wheel behavior)
		let targetPos = (scrollPos += delta * -1);

		// scrollMinMax[0] is 0
		if (targetPos >= scrollMinMax[0]) {
			targetPos = Math.min(0, targetPos);
		}

		//scrollMinMax[1] is the negative width of the scroll wrapper
		if (targetPos <= scrollMinMax[1]) {
			// +8 is a hack to simulate a padding right of 8 pixels for the filter list
			targetPos = Math.max(scrollMinMax[1], targetPos);
		}

		scrollPos = targetPos;

		// console.log(scrollPos, scrollMinMax);
	}

	function handleManualScroll(value) {
		moveFilterList(value);
	}

	let _searchQuery = $searchQuery;

	$: _searchQuery.node_types = _activeFilters;

	export let _externalSearchQuery;

	$: _externalSearchQuery, updateSelectedFilters();

	function updateSelectedFilters(params) {
		// console.log('external search query changed');

		if (_externalSearchQuery == undefined) {
			return;
		}

		// console.log('update selected');
		filterArray.forEach((filter) => {
			const filterType = filter.filterData.filterType;
			const options = filter.filterOptions;

			filter.filterOptions.forEach((option) => {
				option.selected = false;

				if (_externalSearchQuery[filterType]?.constructor === Array) {
					let selectedOption = _externalSearchQuery[filterType].includes(option.value);

					option.selected = selectedOption;
				}

				// _externalSearchQuery[filterType] could be "EXACT", true, false and option.value as well
				// so if _externalSearchQuery[filterType] is equal to the value, that means the value
				// is/should be selected
				if (_externalSearchQuery[filterType] == option.value) {
					option.selected = true;
				}
			});
		});

		// console.log('-------------');
		// console.log(filterListArray);
		// filterArray = sortAndBuildFilter(filterListArray);
		// console.log(_externalSearchQuery);
		// console.log(filterArray);
	}
</script>

<svelte:window on:resize={initScrollPosition} />
<div class="filter-wrapper">
	<div class="scroll-wrapper {className}">
		<!-- {#if scrollPos != scrollMinMax[0]}
        <FilterScrollButton
            on:scrollButton={() => handleManualScroll(-180)}
            left
            class="button--left">←</FilterScrollButton
        >
    {/if} -->

		<div
			id="filterDefinitions"
			bind:this={filterDefinitionsElem}
			class="filter-pill-group flex pl-xxsmall"
			on:wheel|preventDefault|stopPropagation={handleScroll}
			style="left: {scrollPos}px;">
			{#each filterArray as filter}
				<FilterPill
					on:selectFilter={handleFilter}
					optionList={filter.filterOptions}
					filterData={filter.filterData}
					bind:currentQuery={_externalSearchQuery} />
			{/each}
		</div>
		<!-- {#if scrollPos != scrollMinMax[1]}
        <FilterScrollButton
            on:scrollButton={() => handleManualScroll(180)}
            right
            class="button--right">→</FilterScrollButton
        >
    {/if} -->
	</div>
</div>

<style>
	.filter-pill-group {
		gap: 8px;
		/* overflow-x: hidden; */
		position: absolute;
		transition: left 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
	}

	.scroll-wrapper {
		position: relative;
		overflow-x: clip;
		height: 28px;
	}
</style>
