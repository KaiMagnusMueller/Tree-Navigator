// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser enviroment (see documentation).

console.clear()
// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 320, height: 500, themeColors: false });

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.

let documentNode = figma.root

//reset plugindata
// documentNode.setPluginData("recentSearchList", "[]")
let nodeTypeFilterList = documentNode.getPluginData("nodeTypeFilterList")
let recentSearchList = documentNode.getPluginData("recentSearchList")

if (recentSearchList) {
	recentSearchList = JSON.parse(recentSearchList)
}

if (nodeTypeFilterList) {
	nodeTypeFilterList = JSON.parse(nodeTypeFilterList)
}

figma.ui.postMessage({ type: "loaded-plugin-recent-search-list", data: recentSearchList })
figma.ui.postMessage({ type: "loaded-plugin-filter-counts", data: nodeTypeFilterList })

function sendPluginmessage(params) {
	figma.ui.postMessage({ type: "plugin", data: params })
	console.log("message sent to plugin");
}

figma.ui.onmessage = msg => {



	// One way of distinguishing between different types of messages sent from
	// your HTML page is to use an object with a "type" property like this.
	if (msg.type === 'create-shapes') {

		const nodes: SceneNode[] = [];

		for (let i = 0; i < msg.count; i++) {

			var shape;

			if (msg.shape === 'rectangle') {
				shape = figma.createRectangle();
			} else if (msg.shape === 'triangle') {
				shape = figma.createPolygon();
			} else {
				shape = figma.createEllipse();
			}

			shape.x = i * 150;
			shape.fills = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }];
			figma.currentPage.appendChild(shape);
			nodes.push(shape);
		}

		figma.currentPage.selection = nodes;
		figma.viewport.scrollAndZoomIntoView(nodes);
	}

	if (msg.type === 'search-layers') {
		console.log("got message, searching");
		console.log(msg.parameters);

		const query = msg.parameters

		const node = figma.currentPage


		let nodes = []
		if (query.node_types.length > 0 && query.node_types[0] != "ALL") {
			nodes = node.findAllWithCriteria({
				types: query.node_types
			})
		} else {
			nodes = node.findAll()
		}

		nodes.reverse()

		let filteredNodes = nodes.filter(elem => elem.name === query.query_text)
		//TODO: Make case-insensitive



		console.log('Found ' + nodes.length + ' nodes');
		console.log(filteredNodes);
		console.log('Found ' + filteredNodes.length + ' nodes after filtering names');
		// for (let index = 0; index < nodes.length; index++) {
		// 	const element = nodes[index];

		// 	console.log(nodes[index].name);
		// 	console.log(nodes[index]);
		// }

		let nodesToSend = []
		filteredNodes.forEach(element => {
			nodesToSend.push({
				id: element.id,
				name: element.name,
				parent: element.parent,
				children: element.children,
				type: element.type,
				selected: true

			})
		});

		figma.currentPage.selection = filteredNodes
		figma.viewport.scrollAndZoomIntoView(filteredNodes);

		sendResultsList(nodesToSend)
	}

	// Make sure to close the plugin when you're done. Otherwise the plugin will
	// keep running, which shows the cancel button at the bottom of the screen.
	// figma.closePlugin();

	if (msg.type === 'select-layers') {
		let nodesToSelect = []
		msg.parameters.forEach(element => {
			nodesToSelect.push(figma.getNodeById(element.id))
		});
		figma.currentPage.selection = nodesToSelect
	}

	if (msg.type === 'update-recent-searches') {
		if (msg.parameters.constructor !== Array) {
			console.error("Wrong data type" + msg.parameters.constructor)
			console.log(msg.parameters);
		}

		const string = JSON.stringify(msg.parameters)
		documentNode.setPluginData("recentSearchList", string)
	}

	if (msg.type === 'update-filter-ranking') {
		if (msg.parameters.constructor !== Array) {
			console.error("Wrong data type" + msg.parameters.constructor)
			console.log(msg.parameters);
		}

		const string = JSON.stringify(msg.parameters)
		documentNode.setPluginData("nodeTypeFilterList", string)
	}


	if (msg.type === 'focus-selection') {

		// figma.notify("<- Return")

		figma.viewport.scrollAndZoomIntoView(figma.currentPage.selection);
	}


	// ############################################################
	if (msg.type === 'figma') {
		console.log("got message");

		console.log(msg.parameters);
		let message = ["sent from figma"]
		sendPluginmessage(message)
	}


};

function sendResultsList(results) {
	figma.ui.postMessage({ type: "search-results", data: results })
}


figma.on("selectionchange", handleSelectionChange)

function handleSelectionChange() {
	const currentSelection = figma.currentPage.selection

	// currentSelection:
	// [
	// 	{
	// 		"id": "104:2508"
	// 	},
	// 	{
	// 		"id": "113:3692"
	// 	}
	// ]

	// console.log(currentSelection);


	let nodesToSend = []
	currentSelection.forEach(element => {
		nodesToSend.push({
			id: element.id,
			name: element.name,
			parent: element.parent,
			// children: element.children,
			type: element.type,
			selected: true
		})
	});

	figma.ui.postMessage({ type: "selection-changed", data: nodesToSend })
}
