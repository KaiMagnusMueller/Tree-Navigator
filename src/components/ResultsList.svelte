<script>
    import { IconButton } from 'figma-plugin-ds-svelte';
    import AppIcon from '../assets/icons/AppIcon.svg';
    import IconFlexible from './IconFlexible';

    export let querySendTime;

    let queryDuration;

    onmessage = (event) => {
        if (event.data.pluginMessage.type == 'search-results') {
            searchResults = event.data.pluginMessage.data;
            // console.log('got results');
            queryDuration = Date.now() - querySendTime;
            console.log('elapsed Time:' + queryDuration);
        }
    };

    let searchResults = [];
</script>

<div class="results-container pr-xxsmall pl-xxsmall">
    {#if searchResults.length > 0}
        <p class="text--results-info">
            Found {searchResults.length} nodes in {Math.round(
                queryDuration / 100
            ) / 10}
            seconds.
        </p>
        <!-- 
        {#each searchResults as result}
            <p>{result.name}, {result.id}, {result.type}</p>
        {/each} -->

        <div>
            {#each searchResults as result}
                <div class="result-list-elem">
                    <div class="result-content">
                        <IconFlexible iconName={AppIcon} color="black" />
                        <span class="text--results-title">{result.name}</span>
                    </div>
                </div>
            {/each}
            <!-- TODO: select layer on click -->
        </div>
    {:else}
        <div class="loading-spinner-container">
            <div class="loading-spinner-wrapper">
                <span class="loading-spinner">Loading...</span>
            </div>
        </div>
    {/if}
</div>

<style>
    .results-container {
        overflow: auto;
        height: 100%;
        font-size: var(--font-size-xsmall);
        font-weight: var(--font-weight-medium);
        letter-spacing: var(--font-letter-spacing-neg-small);
        line-height: var(--font-line-height);
    }

    .text--results-info {
        color: var(--black8-opaque);
    }

    .text--results-title {
    }

    .result-list-elem {
        border-radius: 4px;
        /* TODO: finalize styling */
    }

    .result-content {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 12px;
        pointer-events: none;
    }

    .result-list-elem:hover {
        background-color: var(--silver);
    }

    .loading-spinner-container {
        display: flex;
    }

    .loading-spinner-wrapper {
    }

    .loading-spinner {
        animation: loading 1.5s infinite alternate steps(4, end);
        overflow: hidden;
        font-weight: var(--font-weight-bold);
    }

    @keyframes loading {
        from {
            width: 100%;
        }
        to {
            width: 75%;
        }
    }
</style>
