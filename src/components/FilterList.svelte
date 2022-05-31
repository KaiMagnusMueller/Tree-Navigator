<script>
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
</script>

<div class="filter-pill-group flex">
    <FilterPill
        on:selectFilter={handleFilter}
        nodeType={"ALL"}
        checked={allTypesChecked}
        disabled={allTypesDisabled}>All Types</FilterPill
    >

    {#each savedFilters as filter}
        <FilterPill on:selectFilter={handleFilter} nodeType={filter.node_type}
            >{filter.name}</FilterPill
        >

        <!-- <FilterPill iconName={IconComponent}>Component</FilterPill> -->
    {/each}
</div>

<style>
    .filter-pill-group {
        gap: 8px;
        overflow-x: scroll;
    }
</style>
