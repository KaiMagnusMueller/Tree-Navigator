<script>
    import { afterUpdate, onMount, createEventDispatcher } from 'svelte';

    import { activeFilters, searchQuery, settings } from '../stores';
    import FilterPill from './FilterPill.svelte';
    import FilterScrollButton from './FilterScrollButton.svelte';
    import { Checkbox } from 'figma-plugin-ds-svelte';

    export { className as class };
    let className = '';

    let filterArray = [];
    export { filterArray as filterList };

    $: filterArray;

    filterArray = sortAndBuildFilterList(filterArray);

    function sortAndBuildFilterList(filters) {
        // console.log(filters);
        let stickyFilters = filters.filter((elem) => elem.sticky == true);
        let regularFilters = filters.filter((elem) => elem.sticky == false || undefined);

        // Sort by filter counts if rememberNodeFilterCounts is on
        if ($settings.rememberNodeFilterCounts) {
            console.log($settings.rememberNodeFilterCounts);
            stickyFilters.sort((a, b) => {
                return b.count - a.count;
            });
            regularFilters.sort((a, b) => {
                return b.count - a.count;
            });
        }

        // console.log(regularFilters);

        let _filterArray = stickyFilters.concat(regularFilters);

        _filterArray.forEach((element) => {
            const enabled = element.default ? true : false;
            element.checked = enabled;
        });

        return _filterArray;
    }

    let _activeFilters = [];

    // array with checked filters excluding ALL
    let checkedLayerFilters;

    const dispatch = createEventDispatcher();

    function handleFilter(event) {
        //detail: [NODE_TYPE, checked]

        // console.log(event.detail);

        if (event.detail[0] == 'ALL') {
            console.log('reset all');
            filterArray.forEach((elem) => {
                elem.checked = false;
            });
        }

        checkedLayerFilters = 0;

        checkedLayerFilters = filterArray.filter((elem) => elem.checked == true && elem.node_type != 'ALL');

        console.log(checkedLayerFilters);
        let ALL_FILTER_I = filterArray.findIndex((elem) => elem.node_type == 'ALL');
        if (checkedLayerFilters.length > 0) {
            filterArray[ALL_FILTER_I].checked = false;

            dispatch('filterChanged', true);
        } else {
            filterArray[ALL_FILTER_I].checked = true;
            dispatch('filterChanged', false);
        }

        const _activeFilterObj = filterArray.filter((elem) => elem.checked == true);

        let _activeFilters = [];
        _activeFilterObj.forEach((element) => {
            _activeFilters.push(element.node_type);
        });

        $activeFilters.node_types = _activeFilters;
    }

    let nodeTypeFiltersElem;
    let scrollMinMax = [];

    onMount(() => {
        // console.log(nodeTypeFiltersElem);
        initScrollPosition();
    });

    function initScrollPosition() {
        scrollMinMax = [0, -1 * (nodeTypeFiltersElem.scrollWidth - nodeTypeFiltersElem.parentElement.clientWidth) - 8 - 45];

        //TODO: fix figma not correctly assigning scrolllWidth
        // scrollWidth: 1051
        //         1007
        // VM111974:2852 320
        // VM111974:2853 (2) [0, -695]

        // console.log(nodeTypeFiltersElem.scrollWidth);
        // console.log(nodeTypeFiltersElem.parentElement.clientWidth);
        // console.log(scrollMinMax);
    }

    let scrollPos = 0;

    afterUpdate(() => {});

    function handleScroll(event) {
        moveFilterList(event.deltaY);
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

    //TODO: check what _activeFilters contains, especially when no layer filter is selected and an ALL filer should be in there

    let selectionCheck = false;
    $: _searchQuery.restrict_to_selection = selectionCheck;
    $: $activeFilters.restrict_to_selection = selectionCheck;
    // $: console.log(selectionCheck);
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
            id="nodeTypeFilters"
            bind:this={nodeTypeFiltersElem}
            class="filter-pill-group flex pl-xxsmall"
            on:wheel|preventDefault|stopPropagation={handleScroll}
            style="left: {scrollPos}px;"
            tabindex="0"
        >
            <!-- <FilterPill
            on:selectFilter={handleFilter}
            nodeType={"ALL"}
            checked={allTypesChecked}
            disabled={allTypesDisabled}>All Types</FilterPill
        > -->

            {#each filterArray as filter (filter.node_type)}
                <FilterPill on:selectFilter={handleFilter} nodeType={filter.node_type} bind:checked={filter.checked}
                    >{filter.name}</FilterPill
                >

                <!-- <FilterPill iconName={IconComponent}>Component</FilterPill> -->
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
    <Checkbox class="pl-xxsmall" bind:checked={selectionCheck}>Limit to selection</Checkbox>
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
