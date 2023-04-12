# Tree Navigator

Quickly select similar elements in parent and sibling frames. Stop <kbd>⌘</kbd>+<kbd>⇧</kbd>-clicking through your designs to select layers in lists, tables or other repeating patterns.

<img alt="Start screen of the Find Nodes plugin showing search bar, filter pills and recent search list" src="https://user-images.githubusercontent.com/24393597/231573595-e4642d9f-fea4-46fd-b3a5-22b8705316c8.jpg" height="400px">

## Features

### Layer Tree

-   Displays the layer hierarchy from the selected layer up to the current page
-   Search for layers with the same name and type, scoped by the selected parent
-   Select layers in different screens to bring up a sibling selector

### Search

-   Leave the search field empty to find all layers that fit the current filters
-   Match exact: All with the search string as name
-   Match case sensitive: Return only layers with the search string as name (case sensitive)
-   Match fuzzy (Default): Return layers with partial matches, different spellings or typos
-   Match fuzzy with search string in quotes: equals "Match exact" option

### Additional Filters

-   Layer type: Filter by layer type to speed up the search in large files and return only the selected types.
-   Current selection: Search only the currently selected nodes
-   Top level frame: scope the search to the topmost parent. Layers in other frames are excluded from the search

### Recent Searches

Rerun previous searches with the same parameters.

---

## To get started with development:

Clone the repository and install dependencies

```bash
npm install
```

## Connecting your plugin to Figma

Connecting your plugin to Figma
After installing, go to **Plugins / Development / New Plugin** in the Figma desktop app for Mac OS or Windows and choose the option **"Link existing plugin"**.

_You can also just type "New Plugin" in Figma global search to go there_

From there you need to link a **manifest.json** file located at **public** folder in your directory:

```bash
/figma-plugin/public/manifest.json
```

Now edit this file to give a new name for your plugin, and you will be able call it from Figma: **Plugins / Development / Your Plugin Name**

## Development

During development, watch your project for changes with the following command.

```bash
npm run dev
```

When ready to package up your final Figma Plugin:

```bash
npm run build
```

### Build

Package the plugin for download by selecting the files in /public and creating a .zip file with them.

### Update figma-plugin-ds-svelte-improved

`npm update figma-plugin-ds-svelte`

Built using the Svelte Figma components library by Thomas Lowry [Figma Plugin DS Svelte](https://github.com/thomas-lowry/figma-plugin-ds-svelte)
