<script>
    import { createEventDispatcher } from "svelte";
    export let left = false;
    export let right = false;
    // export let iconText = null;
    export { className as class };

    let className = "";

    const dispatch = createEventDispatcher();

    function handleClick() {
        dispatch("scrollButton");
    }
</script>

<div
    class="bt--manual-scroll {left ? 'button--left' : 'button--right'}"
    on:click={handleClick}
>
    <div>
        <slot />
    </div>
</div>

<style>
    .bt--manual-scroll {
        position: absolute;
        height: 28px;

        z-index: 1;
    }

    .bt--manual-scroll div {
        height: inherit;
        display: flex;
        align-items: center;
        padding: 0 8px;
        pointer-events: none;
        user-select: none;
    }

    :global(.icon-component *) {
        fill: inherit;
        color: inherit;
    }

    .button--left {
        left: 0;
    }

    .button--right {
        right: 0;
    }

    .button--left div {
        padding-right: 14px;
        background: var(--white);
        background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 1) 0%,
            rgba(255, 255, 255, 1) 75%,
            rgba(255, 255, 255, 0) 100%
        );
    }

    .button--right div {
        padding-left: 14px;

        background: linear-gradient(
            -90deg,
            rgba(255, 255, 255, 1) 0%,
            rgba(255, 255, 255, 1) 75%,
            rgba(255, 255, 255, 0) 100%
        );
    }
</style>
