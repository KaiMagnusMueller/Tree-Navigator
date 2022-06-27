<script>
    import { createEventDispatcher } from 'svelte';

    import IconFlexible from './IconFlexible';
    import { IconButton, IconResizeToFit } from 'figma-plugin-ds-svelte';

    // Component Icons
    import AppIcon from '../assets/icons/AppIcon.svg';
    import Component from '../assets/icons/NodeTypes/Component.svg';
    import Instance from '../assets/icons/NodeTypes/Instance.svg';
    import Text from '../assets/icons/NodeTypes/Text.svg';

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

    function handleResClick(e) {
        dispatch('result-clicked', {
            resultID: result.id,
            shiftKey: e.shiftKey,
        });
    }

    function handleFoClick(e) {
        dispatch('focus-selection', {
            resultID: result.id,
        });
    }
</script>

<!-- The |self modifier prevents the selection from being updated before the handleFoClick() event is fired. -->
<!-- This makes it possible to zoom to unselected elements, if that is neccessary -->
<div class="result-list-elem flex row" class:selected={result.selected} on:click|self={handleResClick}>
    <div class="result-content flex row">
        <IconFlexible iconName={returnIcon()} color="black" />
        <span class="text--results-title">{result.name}</span>
    </div>
    <div class="result-hover">
        <IconButton iconName={IconResizeToFit} on:click={handleFoClick} />
    </div>
</div>

<style>
    .text--results-title {
        /* user-select: none; */
    }

    .result-list-elem {
        padding: 2px;
        align-items: center;
        justify-content: space-between;
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
        align-items: center;
        gap: 12px;
        pointer-events: none;
    }

    .result-hover {
        display: none;
    }

    .result-list-elem:hover .result-hover {
        display: block;
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
