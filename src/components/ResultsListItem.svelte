<script>
    import { createEventDispatcher } from 'svelte';

    import Text from '../assets/icons/NodeTypes/Text.svg';
    import Instance from '../assets/icons/NodeTypes/Instance.svg';
    import Component from '../assets/icons/NodeTypes/Component.svg';
    import IconFlexible from './IconFlexible';
    import AppIcon from '../assets/icons/AppIcon.svg';

    const dispatch = createEventDispatcher();
    export let result;

    function returnIcon() {
        switch (result.type) {
            case 'INSTANCE':
                return Instance;
            case 'COMPONENT':
                return Component;
            case 'TEXT':
                return Text;
            default:
                return AppIcon;
        }
    }

    function handleClick(e) {
        dispatch('result-clicked', {
            resultID: result.id,
            shiftKey: e.shiftKey,
        });
    }
</script>

<div class="result-list-elem" class:selected={result.selected} on:click={handleClick}>
    <div class="result-content">
        <IconFlexible iconName={returnIcon()} color="black" />
        <span class="text--results-title">{result.name}</span>
    </div>
</div>

<style>
    .text--results-title {
        /* user-select: none; */
    }

    .result-list-elem {
        padding: 2px 0;
    }

    .result-list-elem:first-of-type {
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
    }

    .result-list-elem:last-of-type {
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
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

    .result-list-elem.selected {
        background-color: #daebf7;
    }

    /* .result-list-elem.selected .text--results-title {
        color: var(--white);
    } */
</style>
