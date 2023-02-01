# Find Nodes

A plugin to filter and find nodes.

<img alt="Start screen of the Find Nodes plugin showing search bar, filter pills and recent search list" src="https://user-images.githubusercontent.com/24393597/186773303-0f1f2740-6faf-4862-9a40-12a3449bd4d8.jpg" height="400px">

## Features

### Search

-   Leave the search field empty to find all nodes
-   Match exact: All with the search string as name
-   Match fuzzy (Default): results according to search library
-   Match fuzzy with search string in quotes: equals "Match exact" option

### Additional Filters

-   Node type: Filter by node type to speed up the search in large files and return only the selected types.
-   Current selection: Search only the currently selected nodes

### Recent Searches

Rerun previous searches

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
