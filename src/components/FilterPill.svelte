<script>
    import { GlobalCSS, Icon } from 'figma-plugin-ds-svelte';

    import { createEventDispatcher, onMount } from 'svelte';
    import IconFlexible from './IconFlexible';
    import DropdownMenu from './DropdownMenu';

    export let variant = 'primary';
    export let disabled = false;
    export let destructive = false;
    export { className as class };

    export let iconName = '';
    export let iconText = null;

    let size = 16;
    import SVGComponent from '../assets/icons/SVGComponent.svg';

    export let checked = false;

    // Menu item test
    export let optionList = [
        { value: 'item1', label: 'Passthrough', group: 'group1', selected: true },
        { value: 'item2', label: 'Normal ', group: 'group1', selected: false },
        { value: 'item3', label: 'Darken', group: 'group2', selected: false },
        { value: 'item4', label: 'Multiply', group: 'group2', selected: false },
        { value: 'item4', label: 'Color Burn', group: 'group2', selected: false },
    ];

    export let nodeType = '';

    let className = '';

    let dispatch = createEventDispatcher();

    function handleClick() {
        //TODO: disabled state, event stoppen
        checked = !checked;
        visible = !visible;
    }

    let visible = false;
</script>

<div
    on:click={handleClick}
    on:click={() => dispatch('selectFilter', [nodeType, checked])}
    on:submit|preventDefault
    on:keydown={(event) => {
        if (event.key == 'Enter') {
            handleClick();
            dispatch('selectFilter', [nodeType, checked]);
        }
    }}
    onclick="this.blur();"
    {variant}
    {disabled}
    class:destructive
    class="{variant} {className}"
    class:checked
    data-node-type={nodeType}
    tabindex="0"
>
    {#if iconName}
        <IconFlexible iconName={SVGComponent} {iconText} {size} color="transparent" />
    {/if}

    <label>
        <input type="checkbox" bind:checked />
        <slot />
    </label>
</div>

<DropdownMenu bind:menuItems={optionList} bind:visible />

<style>
    div {
        display: flex;
        gap: 4px;
        align-items: center;
        border-radius: 14px;
        color: var(--black);
        flex-shrink: 0;
        font-family: var(--font-stack);
        font-size: var(--font-size-xsmall);
        font-weight: var(--font-weight-medium);
        letter-spacing: var(--font-letter-spacing-neg-small);
        line-height: var(--font-line-height);
        height: 28px;
        padding: 6px 8px;
        text-decoration: none;
        outline: none;
        border: 1px solid #9c2ac3;
        background: #d791ef;
        user-select: none;
        transition: all 0.15s;
    }

    div:focus,
    :hover {
        /* outline: 2px solid var(--blue);
        outline-offset: -2px; */
        box-shadow: 0 1px 6px rgba(128, 46, 111, 0.51);
    }

    div:active {
        background: #c484da;
    }

    div.checked {
        background: #efcbfc;
    }

    input[type='checkbox'] {
        display: none;
        /* visibility: hidden; */
    }
    label {
        pointer-events: none;
    }
</style>
