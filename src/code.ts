import { uniqObjInArr, validRecentSearchItem, postMessageToast, getTutorials, selectNodes, copyNodesToSend, createDataTree, getAncestorNodes, getAncestorNodeArray } from './backend/figma-backend-utils';
import { searchNodes } from './backend/search-nodes';

console.clear();
// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 300, height: 500, themeColors: true });

// Possibly offer this as option
figma.skipInvisibleInstanceChildren = true;
let documentNode = figma.root;

let filterDefinitions = documentNode.getPluginData('filterDefinitions');
let _recentSearchList = documentNode.getPluginData('recentSearchList');
let settings = documentNode.getPluginData('settings');

let recentSearchList = [];
if (_recentSearchList) {
    let parsedList = JSON.parse(_recentSearchList);

    let errorHappened = false;
    parsedList.forEach((element) => {
        if (!validRecentSearchItem(element)) {
            console.warn('Discarding invalid recent search object');
            errorHappened = true;
            return;
        }
        recentSearchList.push(element);
    });

    // If there was an error, reset recent searches with fixed array
    errorHappened
        ? documentNode.setPluginData('recentSearchList', JSON.stringify(recentSearchList))
        : null;
}

if (filterDefinitions) {
    filterDefinitions = JSON.parse(filterDefinitions);
}

if (settings) {
    settings = JSON.parse(settings);
}

getTutorials();

figma.ui.postMessage({ type: 'loaded-plugin-settings', data: settings });
figma.ui.postMessage({
    type: 'loaded-plugin-recent-search-list',
    data: recentSearchList,
});

function sendPluginmessage(params) {
    figma.ui.postMessage({ type: 'plugin', data: params });
    console.log('message sent to plugin');
}

figma.ui.onmessage = (msg) => {
    switch (msg.type) {
        case 'post-message-toast':
            postMessageToast(msg.data);
            break;
        case 'get-tutorials':
            console.log('get-tutorials');
            getTutorials();
            break;
        case 'save-tutorials':
            figma.clientStorage.setAsync('tutorial', msg.data);
            getTutorials();
            break;
        case 'ui-loaded':
            handleSelectionChange();
            break;
        case 'search-layers':
            searchNodes(msg.parameters);
            break;
        case 'select-layers':
            selectNodes(msg.parameters.nodes, msg.parameters.zoomIntoView);
            break;
        case 'update-recent-searches':
            if (!Array.isArray(msg.parameters)) {
                console.error('Wrong data type', typeof msg.parameters);
                console.log(msg.parameters);
                return;
            }
            const pluginData = JSON.stringify(msg.parameters);
            documentNode.setPluginData('recentSearchList', pluginData);
            break;
        case 'focus-selection':
            figma.viewport.scrollAndZoomIntoView(figma.currentPage.selection);
            break;
        case 'figma':
            console.log('got message');
            console.log(msg.parameters);
            let message = ['sent from figma'];
            sendPluginmessage(message);
            break;
        case 'update-settings':
            const settingsData = JSON.stringify(msg.parameters);
            documentNode.setPluginData('settings', settingsData);
            break;
        default:
            break;
    }
};


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

    let nodesToSend = copyNodesToSend(currentSelection);

    if (currentSelection.length === 0) {
        figma.ui.postMessage({ type: 'selection-changed', data: nodesToSend });
        return;
    }

    let ancestorNodes = getAncestorNodes(currentSelection);
    let ancestorNodeArray = getAncestorNodeArray(currentSelection);

    ancestorNodes = uniqObjInArr(ancestorNodes, 'id');
    ancestorNodeArray = uniqObjInArr(ancestorNodeArray, 'id');

    let ancestorTree = createDataTree(ancestorNodeArray);

    let interestingNodes = {
        ancestorNodes: ancestorNodes,
        ancestorTree: ancestorTree,
    };

    figma.ui.postMessage({
        type: 'selection-changed',
        data: nodesToSend,
        interestingNodes: interestingNodes,
    });
}


