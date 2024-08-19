/**
 * Selects the specified nodes in the Figma editor.
 * 
 * @param nodes - An array of nodes to be selected.
 * @param zoomIntoView - A boolean indicating whether to zoom into the selected nodes.
 * @returns A promise that resolves when the nodes are selected.
 */
export async function selectNodes(nodes: [BaseNode], zoomIntoView = true): Promise<void> {
    let nodesToSelect = [];
    for (let i = 0; i < nodes.length; i++) {
        const node = await figma.getNodeByIdAsync(nodes[i].id);

        if (!node) {
            console.warn("Node doesn't exist");
            postMessageToast("Element doesn't exist");
            return;
        }
        nodesToSelect.push(node);
    }

    figma.currentPage.selection = nodesToSelect;

    if (zoomIntoView) {
        figma.viewport.scrollAndZoomIntoView(figma.currentPage.selection);
    }
}

/**
 * Checks if the given element is a valid recent search item.
 * 
 * @param element - The element to be checked.
 * @returns A boolean indicating whether the element is valid or not.
 */
export function validRecentSearchItem(element: {}): boolean {
    let vaildObject = true;
    // Check if the element is not empty
    if (Object.keys(element).length === 0) {
        vaildObject = false;
        console.warn('Empty recent search object');
        return;
    }

    const templateRecentSearch: Search = {
        node_types: ["ALL"],
        area_type: 'PAGE',
        case_sensitive: false,
        string_match: 'EXACT',
        query_text: '',
        query_submit_time: 12345,
    };

    const currentObjKeys = Object.keys(element);
    const templateObjKeys = Object.keys(templateRecentSearch);

    // Check if all required keys are in the element
    templateObjKeys.forEach((key) => {
        let isInArray = currentObjKeys.includes(key);

        if (!isInArray) {
            vaildObject = false;
        }
    });

    return vaildObject;
}


/**
 * Returns an array with duplicate objects removed according to a given property.
 *
 * @param array - The array where duplicates should be removed from
 * @param prop - The object property that should be checked
 */
export function uniqObjInArr(array: Object[], prop: string): any[] {
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

/**
 * Posts a message toast with the specified text and duration.
 * 
 * @param text - The text to display in the toast.
 * @param duration - The duration of the toast in milliseconds. If not provided, the duration is calculated based on the number of words in the text.
 */
export function postMessageToast(text: string, duration: number = undefined): void {
    // Calculate toast duration based on number of words in message
    const wordCount = text.split(' ').length;
    const dynamicDuration = Math.max(2000, Math.min((wordCount / (160 / 60)) * 1000, 8000));
    figma.notify(text, { timeout: duration ? duration : dynamicDuration });
}


/**
 * Retrieves the ultimate ancestor node of the given current node.
 * 
 * @param {BaseNode} currentNode - The current node to find the ultimate ancestor for.
 * @returns {BaseNode} The ultimate ancestor node of the current node.
 */
export function getUltimateAncestorNode(currentNode: BaseNode) {
    let ultimateAncestor = currentNode;
    while (ultimateAncestor.parent.type !== 'PAGE') {
        ultimateAncestor = ultimateAncestor.parent;
    }
    return ultimateAncestor;
}


export function getAncestorNodes(selection) {
    let ancestorNodes = [];
    selection.forEach((elem) => {
        ancestorNodes.push(copyNode(getUltimateAncestorNode(elem)));
    });
    return ancestorNodes;
}

export function getAncestorNodeArray(selection) {
    let ancestorNodeArray = [];
    selection.forEach((elem) => {
        ancestorNodeArray = ancestorNodeArray.concat(getLineageNodeArray(elem));
    });
    ancestorNodeArray.forEach((elem) => {
        if (elem.type === 'PAGE') {
            delete elem.parent;
        }
    });
    return ancestorNodeArray;
}

/**
 * Retrieves an array of lineage nodes for a given current node.
 * 
 * @param currentNode - The current node for which to retrieve the lineage.
 * @returns An array of nodes up to the ultimate ancestor.
 */
export function getLineageNodeArray(currentNode: BaseNode): any[] {
    let lineage = [];
    while (currentNode.type !== 'PAGE') {
        currentNode = currentNode.parent;
        lineage.push(copyNode(currentNode));
    }
    return lineage;
}

export function copyNode(node: BaseNode) {
    return {
        id: node.id,
        name: node.name,
        parent: node.parent,
        // children: node.children,
        type: node.type,
    };
}

export async function getTutorials() {
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

export function copyNodesToSend(nodes) {
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
    return nodesToSend;
}

// Extracted createDataTree function
export function createDataTree(dataset) {
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
}


//reset plugindata
// documentNode.setPluginData('recentSearchList', '[]');
// const dummyRecents = [
// 	{
// 		node_types: [],
// 		area_type: '',
// 		case_sensitive: false,
// 		string_match: '',
// 		query_text: '',
// 		query_submit_time: 12345,
// 	},
// 	{},
// 	{
// 		case_sensitive: false,
// 		string_match: '',
// 		query_text: '',
// 		query_submit_time: 12345,
// 	},
// ];

// documentNode.setPluginData('recentSearchList', JSON.stringify(dummyRecents));
