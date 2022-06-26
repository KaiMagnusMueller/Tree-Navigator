<script>
    import { onMount } from 'svelte';

    onmessage = (event) => {
        if (event.data.pluginMessage.type == 'plugin') {
            console.log('-------------------');
            console.log('got figma message');
            console.log(event.data.pluginMessage.data);
        }
    };

    onMount(() => {});

    function submitEvent() {
        parent.postMessage(
            {
                pluginMessage: {
                    type: 'figma',
                    parameters: ['parameter sent from plugin'],
                },
            },
            '*'
        );
    }
</script>

<button on:click={submitEvent}>Test</button>
