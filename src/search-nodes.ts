import { copyNodesToSend, getUltimateAncestorNode } from "./figma-backend-utils";

export function searchNodes(query: Search) {
    console.log('got message, searching');
    console.log(query);

    let nodeSearchSet: BaseNode[] = [];

    switch (query.area_type) {
        case 'SELECTION':
            if (figma.currentPage.selection.length > 0) {
                nodeSearchSet = filterNodesByType([...figma.currentPage.selection], query.node_types);
                findNodes(nodeSearchSet, query.node_types);
            }
            break;
        case 'ROOT_FRAME':
            nodeSearchSet = getUltimateAncestorNodes([...figma.currentPage.selection]);
            findNodes(nodeSearchSet, query.node_types);
            break;
        case 'SELECTION_PRESET':
            // Get the nodes from the selected nodes
            getSearchSet(query.selected_nodes).then((result) => {
                findNodes(result, query.node_types);
            });
            break;
        default:
            nodeSearchSet.push(figma.currentPage);
            findNodes(nodeSearchSet, query.node_types);
            break;
    }
}

/**
 * Filters an array of nodes based on the specified query node types.
 *
 * @param {SceneNode[]} nodes - The array of nodes to filter.
 * @param {} queryNodeTypes - The query node types to filter by.
 * @returns {SceneNode[]} - The filtered array of nodes.
 */
function filterNodesByType(nodes, queryNodeTypes) {
    let filteredNodes: SceneNode[] = [];
    nodes.forEach(node => {
        if (isSearchable(node) || queryNodeTypes.includes(node.type) || queryNodeTypes.includes('ALL')) {
            filteredNodes.push(node);
        }
    });
    return filteredNodes;
}

/**
 * Checks if a node is searchable. A node is only searchable if it has a `findAllWithCriteria` method.
 * @param node - The node to check.
 * @returns `true` if the node is searchable, `false` otherwise.
 */
function isSearchable(node: SceneNode & ChildrenMixin) {
    return node.findAllWithCriteria ? true : false;
}


/**
 * Retrieves the ultimate ancestor nodes for the given selection.
 * 
 * @param {SceneNode[]} selection - The selection of nodes.
 * @returns {SceneNode[]} - The ultimate ancestor nodes.
 */
function getUltimateAncestorNodes(selection: SceneNode[]) {
    return selection.map(elem => getUltimateAncestorNode(elem));
}

/**
 * Get all searchable nodes from the selected nodes. Usually from the tree view.
 * 
 * @param {string[]} - Selected nodes.
 * @returns {SceneNode[]} - The array of nodes that can be searched.
 */
async function getSearchSet(selectedNodes: string[]) {
    let nodeSearchSet: BaseNode[] = [];
    for (let nodeId of selectedNodes) {
        const node = await figma.getNodeByIdAsync(nodeId);
        if (node) {
            nodeSearchSet.push(node);
        }
    }
    return nodeSearchSet;
}

function findNodes(nodeSearchSet, queryNodeTypes) {
    let nodes = [];
    nodeSearchSet.forEach(node => {
        if (queryNodeTypes.length > 0 && queryNodeTypes[0] !== 'ALL') {
            nodes = nodes.concat(node.findAllWithCriteria({ types: queryNodeTypes }));
        } else {
            nodes = nodes.concat(node.findAll());
        }
    });
    nodes.reverse();
    sendResultsList(copyNodesToSend(nodes));
}

function sendResultsList(results) {
    figma.ui.postMessage({ type: 'search-results', data: results });
}