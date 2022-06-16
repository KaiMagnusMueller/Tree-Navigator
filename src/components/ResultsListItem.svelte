<script>
    import { createEventDispatcher } from 'svelte';

    import AppIcon from '../assets/icons/AppIcon.svg';
    import IconFlexible from './IconFlexible';

    const dispatch = createEventDispatcher();
    export let result;

    function handleClick(e) {
        dispatch('result-clicked', {
            resultID: result.id,
            shiftKey: e.shiftKey,
        });
    }
</script>

<div class="result-list-elem" on:click={handleClick}>
    <div class="result-content">
        <IconFlexible iconName={AppIcon} color="black" />
        <span class="text--results-title">{result.name}</span>
    </div>
</div>

<style>
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
</style>
