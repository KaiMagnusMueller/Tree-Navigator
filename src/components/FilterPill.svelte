<script>
    import { GlobalCSS, Icon } from 'figma-plugin-ds-svelte';

    import { createEventDispatcher } from 'svelte';
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
    export let optionList = [];
    export let filterData;

    const filterType = filterData.filterType;

    if (optionList.length == 1) {
        disabled = true;
        console.log(disabled);
    }

    let className = '';

    let dispatch = createEventDispatcher();

    function handleClick() {
        //TODO: disabled state, event stoppen
        checked = !checked;
        active = !active;

        //     console.log('-----------------');
        //     console.log('Dropdown: ' + active);
        //     console.log('pill elem: ' + pillElem);
    }

    function dispatchEvent(event) {
        const selection = [...event.detail];

        dispatch('selectFilter', {
            filterType: filterType,
            selection: selection,
        });
    }

    let active = false;
    let pillElem;
    let value = optionList.find((elem) => elem.selected == true);
</script>

<div class="wrapper" class:disabled title={filterData.filterTooltip}>
    <div
        on:click={() => {
            handleClick();
            // dispatchEvent();
        }}
        on:submit|preventDefault
        on:keydown={(event) => {
            if (event.key == 'Enter') {
                handleClick();
                dispatchEvent();
            }
        }}
        onclick="this.blur();"
        {variant}
        {disabled}
        class:destructive
        class="bt-dropdown {variant} {className}"
        class:checked={active}
        tabindex="0"
        bind:this={pillElem}
    >
        {#if iconName}
            <IconFlexible
                iconName={SVGComponent}
                {iconText}
                {size}
                color="transparent"
            />
        {/if}

        <label>
            <input type="checkbox" bind:checked={active} />
            <slot>{value.label}</slot>
        </label>
    </div>
    {#if active}
        <DropdownMenu
            bind:menuItems={optionList}
            bind:active
            bind:pillElem
            bind:value
            on:change={(event) => {
                handleClick();
                dispatchEvent(event);
            }}
        />
    {/if}
</div>

<style>
    .wrapper {
        position: relative;
        flex-shrink: 0;
    }

    .bt-dropdown {
        display: flex;
        gap: 4px;
        align-items: center;
        border-radius: 14px;
        color: var(--black);
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

    .bt-dropdown:focus,
    .bt-dropdown:hover {
        /* outline: 2px solid var(--blue);
        outline-offset: -2px; */
        box-shadow: 0 1px 6px rgba(128, 46, 111, 0.51);
    }

    .bt-dropdown:active {
        background: #a798ac;
    }

    .bt-dropdown.checked {
        background: #efcbfc;
    }

    .wrapper.disabled {
        cursor: help;
    }

    .wrapper.disabled > .bt-dropdown {
        pointer-events: none;
    }

    input[type='checkbox'] {
        display: none;
        /* visibility: hidden; */
    }
    label {
        pointer-events: none;
    }
</style>
