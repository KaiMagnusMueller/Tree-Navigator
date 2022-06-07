<script>
    import { afterUpdate, onMount, createEventDispatcher } from "svelte";
    import { element } from "svelte/internal";

    import { filterList, searchQuery } from "../stores";
    import FilterPill from "./FilterPill.svelte";
    import FilterScrollButton from "./FilterScrollButton.svelte";
    import { Checkbox } from "figma-plugin-ds-svelte";

    export { className as class };
    let className = "";

    let savedFilters = [];

    filterList.subscribe((value) => {
        savedFilters = value;
    });

    onmessage = (event) => {
        if (event.data.pluginMessage.type == "loaded-plugin-filter-list") {
            if (event.data.pluginMessage.data.length == 0) {
                console.log("no filters used previously");
                return;
            }
            let loadedFilters = event.data.pluginMessage.data;
        }
    };

    let filterMap = new Map();
    let filterArray = [];

    // filterMap.set("ALL", true);

    let stickyFilters = savedFilters.filter((elem) => elem.sticky == true);
    let regularFilters = savedFilters.filter(
        (elem) => elem.sticky == false || undefined
    );

    stickyFilters.forEach((element) => {
        const enabled = element.default ? true : false;
        filterMap.set(element.node_type, enabled);
    });

    regularFilters.forEach((element) => {
        filterMap.set(element.node_type, false);
    });

    filterArray = stickyFilters.concat(regularFilters);

    console.log(filterMap);
    console.log(filterArray);

    filterArray.forEach((element) => {
        const enabled = element.default ? true : false;
        element.checked = enabled;
    });

    let activeFilters = [];
    //array with all checked filters
    let _activeFilterObj = filterArray.filter((elem) => elem.checked == true);

    // array with checked filters excluding ALL
    let checkedLayerFilters;

    const dispatch = createEventDispatcher();

    function handleFilter(event) {
        //detail: [NODE_TYPE, checked]

        // console.log(event.detail);

        if (event.detail[0] == "ALL") {
            console.log("reset all");
            filterArray.forEach((elem) => {
                elem.checked = false;
            });
        }

        //TODO: cleanup
        filterMap.set(event.detail[0], event.detail[1]);
        // console.log(filterMap);
        checkedLayerFilters = 0;

        checkedLayerFilters = filterArray.filter(
            (elem) => elem.checked == true && elem.node_type != "ALL"
        );

        console.log(checkedLayerFilters);
        let ALL_FILTER_I = filterArray.findIndex(
            (elem) => elem.node_type == "ALL"
        );
        if (checkedLayerFilters.length > 0) {
            filterArray[ALL_FILTER_I].checked = false;

            dispatch("filterChanged", true);
        } else {
            filterArray[ALL_FILTER_I].checked = true;
            dispatch("filterChanged", false);
        }

        const _activeFilterObj = filterArray.filter(
            (elem) => elem.checked == true
        );

        activeFilters = [];
        _activeFilterObj.forEach((element) => {
            activeFilters.push(element.node_type);
        });
    }

    function isAFilterChecked(elem) {
        if (elem.node_type == "ALL") {
            return;
        }

        if (elem.checked == true) {
            checkedLayerFilters++;
        }
    }

    let filterListElem;
    let scrollMinMax = [];

    onMount(() => {
        console.log(filterListElem);
        initScrollPosition();
    });

    function initScrollPosition() {
        scrollMinMax = [
            0,

            -1 *
                (filterListElem.scrollWidth -
                    filterListElem.parentElement.clientWidth) -
                8,
        ];
        console.log(scrollMinMax);
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

        console.log(scrollPos, scrollMinMax);
    }

    function handleManualScroll(value) {
        moveFilterList(value);
    }

    let _searchQuery;

    searchQuery.subscribe((value) => {
        _searchQuery = value;
    });

    $: _searchQuery.node_types = activeFilters;

    //TODO: check what activeFilters contains, especially when no layer filter is selected and an ALL filer should be in there

    let selOnlyCheck = false;
    $: _searchQuery.restrict_to_selection = selOnlyCheck;
    $: console.log(selOnlyCheck);
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
            id="filterList"
            bind:this={filterListElem}
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

            {#each filterArray as filter}
                <FilterPill
                    on:selectFilter={handleFilter}
                    nodeType={filter.node_type}
                    bind:checked={filter.checked}>{filter.name}</FilterPill
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
    <Checkbox class="pl-xxsmall" bind:checked={selOnlyCheck}
        >Limit to selection</Checkbox
    >
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
