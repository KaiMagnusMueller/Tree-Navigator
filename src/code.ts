// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser enviroment (see documentation).

console.clear();
// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 300, height: 500, themeColors: true });

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.

// Possibly offer this as option
figma.skipInvisibleInstanceChildren = true;
let documentNode = figma.root;

//reset plugindata
// documentNode.setPluginData('recentSearchList', '[]');

let filterDefinitions = documentNode.getPluginData('filterDefinitions');
let recentSearchList = documentNode.getPluginData('recentSearchList');
let settings = documentNode.getPluginData('settings');

if (recentSearchList) {
	recentSearchList = JSON.parse(recentSearchList);
}

if (filterDefinitions) {
	filterDefinitions = JSON.parse(filterDefinitions);
}

if (settings) {
	settings = JSON.parse(settings);
}

async function getTutorials() {
	let tutorial;
	try {
		tutorial = await figma.clientStorage.getAsync('tutorial');
	} catch (e) {
		console.log('Storage error:', e);
	}

	figma.ui.postMessage({
		type: 'loaded-tutorial',
		data: tutorial || undefined,
	});
}

getTutorials();

figma.ui.postMessage({ type: 'loaded-plugin-settings', data: settings });
figma.ui.postMessage({
	type: 'loaded-plugin-recent-search-list',
	data: recentSearchList,
});

figma.ui.postMessage({
	type: 'loaded-plugin-filter-counts',
	data: filterDefinitions,
});

function sendPluginmessage(params) {
	figma.ui.postMessage({ type: 'plugin', data: params });
	console.log('message sent to plugin');
}

figma.ui.onmessage = (msg) => {
	// if (msg.type === 'get-data') {
	// 	console.log('get-data received');

	// 	setTimeout(() => {
	// 		setInterval(() => {
	// 			console.log('send: get-data-response');

	// 			figma.ui.postMessage({
	// 				type: 'get-data-response',
	// 			});
	// 		}, 1000);
	// 	}, 1000);
	// }

	if (msg.type === 'post-message-toast') {
		postMessageToast(msg.data);
	}

	if (msg.type === 'get-tutorials') {
		console.log('get-tutorials');
		getTutorials();
	}

	if (msg.type === 'save-tutorials') {
		// console.log('save tutorial');
		// console.log(msg.data);

		figma.clientStorage.setAsync('tutorial', msg.data);
		getTutorials();
	}

	if (msg.type === 'ui-loaded') {
		handleSelectionChange();
	}
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
		console.log('got message, searching');
		console.log(msg.parameters);

		const query = msg.parameters;

		//nodes to search
		let nodeSearchSet = [];
		//
		let nodes = [];

		if (query.area_type === 'SELECTION' && figma.currentPage.selection.length > 0) {
			let _nodeSelectionSet = [...figma.currentPage.selection];

			//Filter and remove non iterable nodes from search set
			nodeSearchSet = _nodeSelectionSet.filter(checkTypes);

			function checkTypes(node) {
				const searchable = node.findAllWithCriteria ? true : false;
				const typeIsInQuery = query.node_types.indexOf(node.type) !== -1 ? true : false;
				const typeFilterIsAll = query.node_types.indexOf('ALL') !== -1 ? true : false;
				const typeFilterExists = query.node_types.length > 0 ? true : false;

				// typeIsInQuery -  we add all non-searchable nodes to nodes[], so they get searched
				//                  by name later, if they belong to one of the current node types we want to
				//                  find
				// !typeFilterExists - we add all non-searchable nodes to nodes[], so they get searched
				//                     by name later, if no type filter exists
				// Searchable - add, because it won't be part of the found nodes later at findAllWithCriteria()
				//               an instance will be part of the nodeSearchSet, because it is searchable
				//              however, it would otherwise not be returned and get added to the nodes array

				// console.log(searchable, typeIsInQuery, typeFilterIsAll, typeFilterExists);
				// console.log((typeIsInQuery || typeFilterIsAll) && searchable, typeIsInQuery && !searchable);

				if (typeIsInQuery || typeFilterIsAll) {
					// console.log("add node to list");
					// console.log(node);

					nodes.push(node);
				}
				// Return true if the node has the findAllWithCriteria() and findAll() functions (only both occur)
				return searchable;
			}
			// TODO: add "SELECTION_PRESET" search
		} else if (query.area_type === 'ROOT_FRAME') {
			let ancestorNodes = [];
			figma.currentPage.selection.forEach((elem) => {
				ancestorNodes.push(getAncestorNode(elem));
				// TODO: if multiple elements with the same ancestor are selected, are they all added to the search set?
			});
			nodeSearchSet = ancestorNodes;
		} else if (query.area_type === 'SELECTION_PRESET') {
			query.selected_nodes.forEach((elem) => {
				let node = figma.getNodeById(elem);
				if (node) {
					nodeSearchSet.push(node);
				}
			});
		} else {
			nodeSearchSet.push(figma.currentPage);
		}

		// console.log('---------------');
		// console.log(nodeSearchSet);
		// console.log(figma.currentPage.selection);
		// console.log('---------------');

		nodeSearchSet.forEach((node) => {
			if (query.node_types.length > 0 && query.node_types[0] != 'ALL') {
				nodes = nodes.concat(
					node.findAllWithCriteria({
						types: query.node_types,
					})
				);
			} else {
				nodes = nodes.concat(node.findAll());
			}
		});

		nodes.reverse();

		// console.log('Found ' + nodes.length + ' nodes');
		// console.log(nodes);
		// // console.log('Found ' + filteredNodes.length + ' nodes after filtering names');
		// // console.log(filteredNodes);
		// for (let index = 0; index < nodes.length; index++) {
		// 	const element = nodes[index];

		// 	console.log(nodes[index].name);
		// 	console.log(nodes[index]);
		// }

		let nodesToSend = [];
		nodes.forEach((element) => {
			nodesToSend.push({
				id: element.id,
				name: element.name,
				parent: element.parent,
				children: element.children,
				type: element.type,
				selected: true,
			});
		});

		// // If no nodes found (length === 0), don't change the selection
		// if (filteredNodes.length > 0) {
		// 	figma.currentPage.selection = filteredNodes
		// 	figma.viewport.scrollAndZoomIntoView(filteredNodes);
		// }

		sendResultsList(nodesToSend);
	}

	// Make sure to close the plugin when you're done. Otherwise the plugin will
	// keep running, which shows the cancel button at the bottom of the screen.
	// figma.closePlugin();

	if (msg.type === 'select-layers') {
		let nodesToSelect = [];
		msg.parameters.nodes.forEach((element) => {
			const node = figma.getNodeById(element.id);

			if (!node) {
				console.warn("Node doesn't exist");
				postMessageToast("Element doesn't exist");
				return;
			}

			nodesToSelect.push(node);
		});
		figma.currentPage.selection = nodesToSelect;

		if (msg.parameters.zoomIntoView) {
			figma.viewport.scrollAndZoomIntoView(figma.currentPage.selection);
		}
	}

	if (msg.type === 'update-recent-searches') {
		if (msg.parameters.constructor !== Array) {
			console.error('Wrong data type' + msg.parameters.constructor);
			console.log(msg.parameters);
			return;
		}

		const string = JSON.stringify(msg.parameters);
		documentNode.setPluginData('recentSearchList', string);
	}

	if (msg.type === 'update-filter-ranking') {
		if (msg.parameters.constructor !== Array) {
			console.error('Wrong data type' + msg.parameters.constructor);
			console.log(msg.parameters);
			return;
		}

		const string = JSON.stringify(msg.parameters);
		documentNode.setPluginData('filterDefinitions', string);
	}

	if (msg.type === 'focus-selection') {
		// figma.notify("<- Return")

		figma.viewport.scrollAndZoomIntoView(figma.currentPage.selection);
	}

	// ############################################################
	if (msg.type === 'figma') {
		console.log('got message');

		console.log(msg.parameters);
		let message = ['sent from figma'];
		sendPluginmessage(message);
	}

	if (msg.type === 'update-settings') {
		const string = JSON.stringify(msg.parameters);
		documentNode.setPluginData('settings', string);
	}
};

function sendResultsList(results) {
	figma.ui.postMessage({ type: 'search-results', data: results });
}

// ############################################################
figma.on('selectionchange', handleSelectionChange);

function handleSelectionChange() {
	// @ts-ignore
	let currentSelection: Array<SceneNode>;

	try {
		// @ts-ignore
		currentSelection = figma.currentPage.selection;
	} catch (error) {
		postMessageToast('Node is hidden and inacessible to the plugin');
		return;
	}

	let nodesToSend = [];
	currentSelection.forEach((element) => {
		nodesToSend.push({
			id: element.id,
			name: element.name,
			parent: element.parent,
			// children: element.children,
			type: element.type,
			selected: true,
		});
	});

	if (currentSelection.length === 0) {
		figma.ui.postMessage({ type: 'selection-changed', data: nodesToSend });
		return;
	}

	let ancestorNodeArray = [];

	let sameAncestor: boolean;
	let ancestorNodes = [];
	currentSelection.forEach((elem) => {
		ancestorNodes.push(copyNode(getAncestorNode(elem)));
		ancestorNodeArray = ancestorNodeArray.concat(getAncestorNodeArray(elem));
	});

	const createDataTree = (dataset) => {
		const hashTable = Object.create(null);
		dataset.forEach((aData) => (hashTable[aData.id] = { ...aData, childNodes: [] }));
		const dataTree = [];

		dataset.forEach((aData) => {
			if (aData.parent?.id) {
				hashTable[aData.parent.id].childNodes.push(hashTable[aData.id]);
			} else {
				dataTree.push(hashTable[aData.id]);
			}
		});
		return dataTree;
	};

	ancestorNodeArray.forEach((elem) => {
		if (elem.type === 'PAGE') {
			delete elem.parent;
		}
	});

	ancestorNodeArray = uniqObjInArr(ancestorNodeArray, 'id');

	let ancestorTree = createDataTree(ancestorNodeArray);

	ancestorNodes = uniqObjInArr(ancestorNodes, 'id');

	let interestingNodes = {
		ancestorNodes: ancestorNodes,
		sameAncestor: sameAncestor,
		ancestorTree: ancestorTree,
	};

	figma.ui.postMessage({
		type: 'selection-changed',
		data: nodesToSend,
		interestingNodes: interestingNodes,
	});
}

// HELPERS
// ############################################################

function postMessageToast(text: string, duration: number) {
	const wordCount = text.split(' ').length;

	console.log(wordCount, wordCount / (160 / 60));

	figma.notify(text, { timeout: duration ? duration : (wordCount / (160 / 60)) * 1000 });
}

function getAncestorNode(currentNode: BaseNode) {
	while (currentNode.parent.type !== 'PAGE') {
		currentNode = currentNode.parent;
	}
	return currentNode;
}

function getAncestorNodeArray(currentNode: BaseNode) {
	let lineage = [];
	while (currentNode.type !== 'PAGE') {
		currentNode = currentNode.parent;
		lineage.push(copyNode(currentNode));
	}
	return lineage;
}

function copyNode(node: BaseNode) {
	return {
		id: node.id,
		name: node.name,
		parent: node.parent,
		// children: node.children,
		type: node.type,
	};
}

/**
 * Returns an array with duplicate objects removed according to a given property.
 *
 * @param array - The array where duplicates should be removed from
 * @param prop - The object property that should be checked
 */
function uniqObjInArr(array: Array<{}>, prop: string) {
	let distinct = [];
	let uniq = [];
	for (let i = 0; i < array.length; i++) {
		if (!distinct.includes(array[i][prop])) {
			distinct.push(array[i][prop]);
			uniq.push(array[i]);
		}
	}

	return uniq;
}
