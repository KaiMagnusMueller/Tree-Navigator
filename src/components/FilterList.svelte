<script lang="ts">
    import { afterUpdate, onMount } from "svelte";
    import { tweened } from "svelte/motion";
    import { cubicOut } from "svelte/easing";

    import { filterList } from "../stores";
    import FilterPill from "./FilterPill.svelte";

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

    // filterMap.set("ALL", true);

    savedFilters.forEach((element) => {
        filterMap.set(element.node_type, false);
    });

    console.log(filterMap);
    let checkedFilters = 0;

    function handleFilter(event) {
        //detail: [NODE_TYPE, checked]

        // if (event.detail[0] == "ALL") {
        //     [...filterMap.keys()].forEach((key) => {
        //         filterMap.set(key, false);
        //     });
        // }

        filterMap.set(event.detail[0], event.detail[1]);
        // console.log(filterMap);
        checkedFilters = 0;

        filterMap.forEach(isFilterChecked);

        if (checkedFilters > 0) {
            allTypesChecked = false;
            allTypesDisabled = true;
        } else {
            allTypesChecked = true;
            allTypesDisabled = false;
        }
    }

    function isFilterChecked(value, key) {
        if (key == "ALL") {
            return;
        }

        if (value == true) {
            checkedFilters++;
        }
    }

    let allTypesChecked = true;
    let allTypesDisabled = false;

    let filterListElem;
    let scrollMinMax;

    onMount(() => {
        console.log(filterListElem);
        scrollMinMax = [
            0,
            -1 *
                (filterListElem.scrollWidth -
                    filterListElem.parentElement.clientWidth),
        ];
        console.log(scrollMinMax);
    });

    let scrollPos = 0;

    afterUpdate(() => {});

    function handleScroll(event) {
        // console.log(event);
        // console.log(event.bubbles);
        // console.log(event.clientX);
        // console.log(event.clientY);
        // console.log(event.deltaX);

        // console.log(filterListElem);

        let targetPos = (scrollPos += event.deltaY);

        // console.log("-----");
        // console.log(event.deltaY);

        if (targetPos >= scrollMinMax[0]) {
            targetPos = Math.min(0, targetPos);
        }

        if (targetPos <= scrollMinMax[1]) {
            targetPos = Math.max(scrollMinMax[1], targetPos);
        }

        // console.log(targetPos);

        scrollPos = targetPos;

        // filterListElem.scrollLeft = pos;
        // console.log(event.layerX);
        // console.log(event.layerY);
        // console.log(event.movementX);
        // console.log(event.movementY);
        // console.log(event.offsetX);
        // console.log(event.offsetY);
        // console.log(event.pageX);
        // console.log(event.pageY);
        // console.log(event.rangeOffset);
        // console.log(event.screenX);
        // console.log(event.screenY);
    }
</script>

<p>{Math.floor(scrollPos)}</p>
<div class="scroll-wrapper">
    <div
        id="filterList"
        bind:this={filterListElem}
        class="filter-pill-group flex"
        on:wheel|stopPropagation={handleScroll}
        style="left: {scrollPos}px;"
    >
        <FilterPill
            on:selectFilter={handleFilter}
            nodeType={"ALL"}
            checked={allTypesChecked}
            disabled={allTypesDisabled}>All Types</FilterPill
        >

        {#each savedFilters as filter}
            <FilterPill
                on:selectFilter={handleFilter}
                nodeType={filter.node_type}>{filter.name}</FilterPill
            >

            <!-- <FilterPill iconName={IconComponent}>Component</FilterPill> -->
        {/each}
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
    }
</style>
