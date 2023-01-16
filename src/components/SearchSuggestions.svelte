<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  let dispatch = createEventDispatcher();
  import { filterDefinitions } from '../stores';

  setTimeout(() => {
    onmessage = (event) => {
      if (event.data.pluginMessage.type == 'selection-changed') {
        if (!event.data.pluginMessage.interestingNodes) {
          interestingNodes = null;
          return;
        }
        selectedNode = event.data.pluginMessage.data[0];
        interestingNodes = event.data.pluginMessage.interestingNodes;
        console.log(interestingNodes.ancestorNode);
        console.log(selectedNode);
      }
    };
  }, 50);
  // For some reason the message event is not registered without a slight delay

  let selectedNode;
  let interestingNodes;

  let search = {
    area_type: 'PAGE',
    case_sensitive: false,
    node_types: ['FRAME'],
    query_submit_time: 1661892929692,
    string_match: 'PART',
  };

  function handleClick() {
    dispatch('searchSuggestion', {
      search: search,
    });
  }
</script>

{#if interestingNodes}
  <div class="search-suggestions">
    <h4>Suggested Searches</h4>
    {#if interestingNodes.ancestorNode}
      <div on:click={handleClick}>
        Search for all {$filterDefinitions[0].getTypeName(selectedNode.type)} nodes called “{selectedNode.name}”
        in the current frame.
      </div>
    {/if}
  </div>
{/if}

<style>
  .search-suggestions {
    padding: 8px;
    margin: 8px;
    background: var(--figma-color-bg-secondary);
    border: 1px solid var(--figma-color-border);
    border-radius: 6px;
    color: var(--figma-color-text);
    font-size: var(--font-size-small);
    font-weight: var(--font-weight-normal);
  }

  .search-suggestions h4 {
    color: var(--figma-color-text);

    margin: 0;
    font-size: var(--font-size-small);
    font-weight: var(--font-weight-normal);
  }
  .search-suggestions p {
    margin: 0;
    font-size: var(--font-size-small);
    font-weight: var(--font-weight-normal);
    color: var(--figma-color-text);
  }
</style>
