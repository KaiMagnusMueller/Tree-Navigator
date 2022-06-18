<script>
    import { createEventDispatcher } from 'svelte';

    import Text from '../assets/icons/NodeTypes/Text.svg';
    import Instance from '../assets/icons/NodeTypes/Instance.svg';
    import Component from '../assets/icons/NodeTypes/Component.svg';
    import IconFlexible from './IconFlexible';
    import AppIcon from '../assets/icons/AppIcon.svg';

    const dispatch = createEventDispatcher();
    export let result;

    let Icon;
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

<div
    class="result-list-elem"
    class:selected={result.selected}
    on:click={handleClick}
>
    <div class="result-content">
        <IconFlexible
            iconName={returnIcon()}
            color={result.selected ? 'white' : 'black'}
        />
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

    .result-list-elem.selected {
        background-color: var(--blue);
    }

    .result-list-elem.selected .text--results-title {
        color: var(--white);
    }
</style>
