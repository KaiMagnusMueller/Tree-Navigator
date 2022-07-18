<script>
    import { afterUpdate, onMount, createEventDispatcher } from 'svelte';

    import { activeFilters, searchQuery, settings } from '../stores';
    import FilterPill from './FilterPill.svelte';
    import FilterScrollButton from './FilterScrollButton.svelte';
    import { Checkbox } from 'figma-plugin-ds-svelte';

    export { className as class };
    let className = '';

    let nodeTypeArray = [];
    export { nodeTypeArray as nodeTypeList };

    $: nodeTypeArray;

    nodeTypeArray = sortAndBuildNodeTypeFilter(nodeTypeArray);

    function sortAndBuildNodeTypeFilter(filters) {
        // console.log(filters);
        let stickyTypes = filters.filter((elem) => elem.sticky == true);
        let regularTypes = filters.filter((elem) => elem.sticky == false || undefined);

        // Sort by filter counts if rememberNodeFilterCounts is on
        if ($settings.rememberNodeFilterCounts) {
            console.log($settings.rememberNodeFilterCounts);
            stickyTypes.sort((a, b) => {
                return b.count - a.count;
            });
            regularTypes.sort((a, b) => {
                return b.count - a.count;
            });
        }

        // console.log(regularTypes);

        let _filterArray = stickyTypes.concat(regularTypes);

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
            nodeTypeArray.forEach((elem) => {
                elem.checked = false;
            });
        }

        checkedLayerFilters = 0;

        checkedLayerFilters = nodeTypeArray.filter((elem) => elem.checked == true && elem.node_type != 'ALL');

        console.log(checkedLayerFilters);
        let ALL_FILTER_I = nodeTypeArray.findIndex((elem) => elem.node_type == 'ALL');
        if (checkedLayerFilters.length > 0) {
            nodeTypeArray[ALL_FILTER_I].checked = false;

            dispatch('filterChanged', true);
        } else {
            nodeTypeArray[ALL_FILTER_I].checked = true;
            dispatch('filterChanged', false);
        }

        const _activeFilterObj = nodeTypeArray.filter((elem) => elem.checked == true);

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
    $: _searchQuery.area_type = selectionCheck;
    $: $activeFilters.area_type = selectionCheck;
    // $: console.log(selectionCheck);

    let selectedTypes;
    let selectedArea;
    let selectedStringMatch;
    let selectedCase;
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

            <FilterPill on:selectFilter={handleFilter} bind:selectedValues={selectedTypes} />
            <!-- TODO: add slot in filter pill that sets the correct label like: "Instances, 2 more" -->
            <!-- <FilterPill iconName={IconComponent}>Component</FilterPill> -->
            <!-- 
            <FilterPill on:selectFilter={handleFilter} optionList={searchAreaArray} bind:selectedValues={selectedArea} />
            <FilterPill on:selectFilter={handleFilter} optionList={stringMatchArray} bind:selectedValues={selectedStringMatch} />
            <FilterPill on:selectFilter={handleFilter} optionList={caseArray} bind:selectedValues={selectedCase} /> -->
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
