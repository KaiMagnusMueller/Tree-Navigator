import { readable, writable } from 'svelte/store';

export let filterDefinitionsDefault = writable([]);

export let filterDefinitions = writable([
  {
    getTypeName(value) {
      let filterOption = this.filterOptions.find(
        (element) => element.value.toLowerCase() == value.toLowerCase()
      );
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
    ],
    // TODO: Add "Current Frame" as area
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
});

export let settings = writable({});

// function createTestStore() {
//     const { subscribe, set, update } = writable([]);

//     return {
//         subscribe,
//         // set: (value) => set(value),
//         increment: () => update(n => n + 1),
//         decrement: () => update(n => n - 1),
//         add: addSearch(),
//         reset: () => set(0)
//     };

//     function addSearch(params) {

//     }
// }

// const testStore = createTestStore()
// export { testStore }
