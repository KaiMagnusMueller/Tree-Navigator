<script>
    import { IconButton, IconSpinner } from 'figma-plugin-ds-svelte';
    import { fade } from 'svelte/transition';
</script>

<div class="loading-spinner-wrapper color--fake-grey" transition:fade={{ duration: 100 }}>
    <IconButton spin iconName={IconSpinner} />
</div>

<style>
    .color--fake-grey {
        opacity: 0.7;
    }
</style>
