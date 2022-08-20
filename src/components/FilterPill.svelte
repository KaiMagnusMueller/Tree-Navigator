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
    export let currentQuery;

    let active = false;
    let pillElem;
    let value;
    $: currentQuery, updateValue();

    function updateValue() {
        value = optionList.find((elem) => elem.selected == true);
    }
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

        <slot>{value?.label}</slot>

        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3.646 5.854L0.645996 2.854L1.354 2.146L4 4.793L6.646 2.146L7.354 2.854L4.354 5.854L4 6.207L3.646 5.854Z"
                fill="black"
            />
        </svg>
    </div>
    {#if active}
        <div class="arrow">
            <svg
                width="22"
                height="9"
                viewBox="0 0 22 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g clip-path="url(#clip0_356_2938)">
                    <path
                        d="M0 8C4 8 8 4 11 1L11 1.00001C14 4.00001 18 8 22 8V10H0V8Z"
                        fill="#1E1E1E"
                    />
                    <path
                        d="M11 1.70689C12.4185 3.12274 14.0667 4.73564 15.8293 6.02821C17.5861 7.3165 19.5155 8.33176 21.5 8.48106V9.5H0.5V8.48106C2.48454 8.33176 4.41391 7.3165 6.17068 6.0282C7.93327 4.73564 9.5815 3.12274 11 1.70689Z"
                        stroke="#393939"
                    />
                </g>
                <defs>
                    <clipPath id="clip0_356_2938">
                        <rect width="22" height="9" fill="white" />
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
        font-weight: var(--font-weight-normal);
        letter-spacing: var(--font-letter-spacing-neg-small);
        line-height: var(--font-line-height);
        height: 28px;
        padding: 6px 10px 6px 8px;
        text-decoration: none;
        outline: none;
        border: 1px solid var(--border-white-on-light);
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
        bottom: -9px;
        /* On top of flyout, with z-index: 50 */
        z-index: 51;
    }
</style>
