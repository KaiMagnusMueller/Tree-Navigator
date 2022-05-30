<script>
    import { GlobalCSS, Icon } from "figma-plugin-ds-svelte";

    import { onMount } from "svelte";
    import IconFlexible from "./IconFlexible";

    export let variant = "primary";
    export let disabled = false;
    export let destructive = false;
    export { className as class };

    export let iconName = "";
    export let iconText = null;

    let size = 16;
    import SVGComponent from "../assets/icons/SVGComponent.svg";

    export let checked = false;

    let className = "";

    function handleClick(event) {
        checked = !checked;
    }
</script>

<div
    on:click
    on:click={handleClick}
    on:submit|preventDefault
    onclick="this.blur();"
    {variant}
    {disabled}
    class:destructive
    class="{variant} {className}"
    class:checked
>
    {#if iconName}
        <IconFlexible
            iconName={SVGComponent}
            {iconText}
            {size}
            color="transparent"
        />
    {/if}

    <label on:click|preventDefault>
        <input type="checkbox" bind:checked />
        <slot />
    </label>
</div>

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
        background: #c27cda;
        user-select: none;
    }

    div.checked {
        background: #e3aef6;
    }

    input[type="checkbox"] {
        display: none;
        /* visibility: hidden; */
    }
</style>
