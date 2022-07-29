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

    // Menu item test
    export let optionList = [];
    export let filterData;

    const filterType = filterData.filterType;

    if (optionList.length == 1) {
        disabled = true;
    }

    let className = '';

    let dispatch = createEventDispatcher();

    function handleClick() {
        //TODO: disabled state, event stoppen
        active = !active;
    }

    function dispatchEvent(event) {
        const selection = [...event.detail];

        dispatch('selectFilter', {
            filterType: filterType,
            multiSelect: filterData.multiSelect,
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
            <IconFlexible iconName={SVGComponent} {iconText} {size} color="transparent" />
        {/if}

        <slot>{value.label}</slot>

        <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3.646 3.854L0.645996 0.853996L1.354 0.145996L4 2.793L6.646 0.145996L7.354 0.853996L4.354 3.854L4 4.207L3.646 3.854Z"
                fill="black"
            />
        </svg>
    </div>
    {#if active}
        <div class="arrow">
            <svg
                width="12"
                height="7"
                viewBox="0 0 12 7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g clip-path="url(#clip0_351_2932)">
                    <path d="M0 7L6 1L12 7H0Z" fill="#1E1E1E" />
                    <line x1="6.35355" y1="1.35355" x2="0.353554" y2="7.35355" stroke="#393939" />
                    <line x1="11.6464" y1="7.35355" x2="5.64645" y2="1.35355" stroke="#393939" />
                </g>
                <defs>
                    <clipPath id="clip0_351_2932">
                        <rect width="12" height="7" fill="white" />
                    </clipPath>
                </defs>
            </svg>
        </div>

        <DropdownMenu
            bind:menuItems={optionList}
            bind:active
            bind:pillElem
            bind:value
            on:change={(event) => {
                dispatchEvent(event);
            }}
            rounded
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
        border-radius: 6px;
        color: var(--black);
        font-family: var(--font-stack);
        font-size: var(--font-size-xsmall);
        font-weight: var(--font-weight-medium);
        letter-spacing: var(--font-letter-spacing-neg-small);
        line-height: var(--font-line-height);
        height: 28px;
        padding: 6px 10px 6px 8px;
        text-decoration: none;
        outline: none;
        border: 1px solid rgba(0, 0, 0, 0.12);
        background: #ffffff;
        user-select: none;
        transition-duration: 0.15s;
        transition-property: box-shadow, background, color;
    }

    .bt-dropdown:focus,
    .bt-dropdown:hover {
        /* outline: 2px solid var(--blue);
        outline-offset: -2px; */
        box-shadow: 0 1px 6px rgba(194, 194, 194, 0.51);
    }

    .bt-dropdown:active {
        background: #d4d4d4;
    }

    .bt-dropdown.checked {
        background: #f0f0f0;
        border: 1px solid rgba(0, 0, 0, 0.12);
        outline: 2px solid var(--blue);
        outline-offset: -2px;
        z-index: 50;
    }

    .bt-dropdown.checked svg {
        transform: rotate(180deg);
    }
    .wrapper.disabled {
        cursor: help;
    }

    .wrapper.disabled > .bt-dropdown {
        pointer-events: none;
        color: #828282;
        background: #ffffff;
    }

    .wrapper.disabled svg path {
        fill: #828282;
    }

    .arrow {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }
</style>
