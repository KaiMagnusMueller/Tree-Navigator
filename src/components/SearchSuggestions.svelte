<script>
	import { filterDefinitions } from '../stores';
	import SuggestionItem from './SuggestionItem.svelte';
	import SelectionEmptyArt from '../assets/icons/SelectionEmptyArt.svg';
	parent.postMessage(
		{
			pluginMessage: {
				type: 'ui-loaded',
			},
		},
		'*',
	);

	let selectedSameName = true;
	let selectedSameType = true;
	let selectedNode = {};
	let selectedNodes;
	let interestingNodes;
	let treeDepth;
	let ancestorTree = [];

	window.addEventListener('message', (event) => {
		if (event.data.pluginMessage.type == 'selection-changed') {
			handleSelectionChanged(event.data.pluginMessage);
		}
	});

	function handleSelectionChanged(pluginMessage) {
		if (!pluginMessage.interestingNodes) {
			interestingNodes = null;
			return;
		}
		updateSelectedNodes(pluginMessage.data);
		updateInterestingNodes(pluginMessage.interestingNodes);
		updateAncestorTree(pluginMessage.interestingNodes.ancestorTree);
		updateSelectedNode();
		updateTreeDepth();
	}

	function updateSelectedNodes(data) {
		selectedNodes = data;
	}

	function updateInterestingNodes(nodes) {
		interestingNodes = nodes;
	}

	function updateAncestorTree(tree) {
		ancestorTree = tree;
	}

	function updateSelectedNode() {
		selectedSameName = selectedNodes.every((elem) => elem.name === selectedNodes[0].name);
		selectedSameType = selectedNodes.every((elem) => elem.type === selectedNodes[0].type);

		selectedNode = {
			name: selectedNodes[0].name,
			type: selectedNodes[0].type,
		};
	}

	function updateTreeDepth() {
		treeDepth = getDepth(ancestorTree);
	}

	function getDepth(array) {
		return 1 + Math.max(0, ...array.map(({ childNodes = [] }) => getDepth(childNodes)));
	}
</script>

{#if interestingNodes}
	<div class="search-suggestions flex column">
		<div>
			{#if selectedSameName && selectedSameType}
				<p>
					<span>
						Search for all {$filterDefinitions[0].getTypeName(selectedNode.type)} nodes called
						<i
							>'{selectedNode.name.length > 54
								? selectedNode.name.substring(0, 54) + '…'
								: selectedNode.name}'</i>
					</span> in:
				</p>
			{:else}
				<p>Select nodes of the same type and name to display the layer tree</p>
			{/if}
		</div>
		{#if selectedSameName && selectedSameType}
			<div class="suggestion-list" class:small-tree={treeDepth >= 8}>
				{#each ancestorTree as parent (parent.id)}
					<SuggestionItem
						{parent}
						on:clickTree
						{selectedNode}
						smallTree={treeDepth >= 8} />
				{/each}
			</div>
		{/if}
	</div>
{:else}
	<!-- EMPTY STATE -->
	<div class="search-suggestions flex column">
		<p>
			Select an element to display the layer tree. Select layers in different frames for even
			more control.
		</p>
		{@html SelectionEmptyArt}
	</div>
{/if}

<style>
	.search-suggestions {
		padding: 8px;
		color: var(--figma-color-text);
		font-size: var(--font-size-small);
		gap: 8px;
		user-select: none;
	}

	.search-suggestions p {
		margin: 6px 0 0 0;
		font-size: var(--font-size-small);
		font-weight: var(--font-weight-normal);
		color: var(--figma-color-text-secondary);
	}

	p:first-child {
		margin: 0;
	}

	.search-suggestions p i {
		color: var(--figma-color-text);
	}
</style>
