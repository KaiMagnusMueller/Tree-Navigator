<script lang="ts">
  setTimeout(() => {
    onmessage = (event) => {
      if (event.data.pluginMessage.type == 'selection-changed') {
        if (!event.data.pluginMessage.interestingNodes) {
          interestingNodes = null;
          return;
        }
        interestingNodes = event.data.pluginMessage.interestingNodes;
      }
    };
  }, 50);
  // For some reason the message event is not registered without a slight delay

  let interestingNodes;

  $: (interestingNodes) => {
    console.log(interestingNodes.ancestorNode);
  };
</script>

{#if interestingNodes}
  <div class="search-suggestions"><h4>Suggested Searches</h4></div>
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
    text-transform: capitalize;
    color: var(--figma-color-text);
  }
</style>
