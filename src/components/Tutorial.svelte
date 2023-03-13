<script lang="ts">
	import { tutorials } from '../stores';
	import { IconButton, IconClose } from 'figma-plugin-ds-svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	export let viewedTutorials = undefined;

	let visibleTutorials = $tutorials.filter((elem) => {
		return !viewedTutorials.includes(elem.id);
	});

	function handleCloseTutorial() {
		visibleTutorials.forEach((elem) => {
			if (!viewedTutorials.includes(elem.id)) {
				viewedTutorials.push(elem.id);
			}
		});

		visibleTutorials = [];

		parent.postMessage(
			{
				pluginMessage: {
					type: 'save-tutorials',
					data: viewedTutorials,
				},
			},
			'*'
		);
	}
</script>

{#if visibleTutorials.length > 0 && viewedTutorials}
	<div class="tutorial--section">
		<div class="tutorial--header">
			<IconButton iconName={IconClose} on:click={handleCloseTutorial} />
		</div>

		<div class="tutorial--scroller">
			{#each visibleTutorials as tutorial}
				<div class="tutorial--card">
					<div class="card--bg">
						<img in:fade={{ duration: 0.2 }} src={tutorial.image} alt="" />
					</div>
					<div class="card--text">
						<h3>
							{tutorial.title}
						</h3>
						<p>{tutorial.body}</p>
						<a target="_blank" href={tutorial.link.href}>{tutorial.link.title} -></a>
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}

<style>
	.tutorial--section {
		position: absolute;
		bottom: 0px;
		width: 100%;

		background: linear-gradient(transparent, var(--figma-color-bg) 30%);
		padding: 8px;
	}

	.tutorial--header {
		display: flex;
		flex-direction: row;
		justify-content: end;
	}

	.tutorial--card {
		box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.35);
		border-radius: 10px;
		height: 120px;
		font-size: var(--font-size-small);
		font-weight: var(--font-weight-normal);
		color: var(--figma-color-text-onsuccess);
		padding: 12px;
		position: relative;
		overflow: hidden;
		border: 2px solid rgba(0, 0, 0, 0.2);
	}

	.tutorial--card h3 {
		font-size: var(--font-size-large);
		font-weight: var(--font-weight-bold);
		margin: 0;
	}

	.card--text {
		width: 60%;
		display: flex;
		flex-direction: column;
		gap: 8px;
		height: 100%;
	}

	.tutorial--card p {
		margin: 0;
	}

	.tutorial--card a {
		font-weight: var(--font-weight-bold);
		color: var(--figma-color-text-onsuccess);
		margin: auto 0 0 0;
	}
	.tutorial--card a:hover {
		text-decoration: underline;
	}

	img {
		position: absolute;
		right: 0;
		top: 50%;
		width: 160px;
		height: auto;
		filter: drop-shadow(0px 2.697px 7.192px rgba(0, 0, 0, 0.25));
		transform: rotate(9.16deg) translate(15%, -50%);
	}

	.tutorial--card:nth-of-type(3n + 1) {
		background: linear-gradient(80.04deg, hsl(202, 96%, 50%) 0%, hsl(220, 81%, 48%) 100%);
	}

	.tutorial--card:nth-of-type(3n + 2) {
		background: linear-gradient(80.04deg, hsl(173, 96%, 50%) 0%, hsl(212, 82%, 48%) 100%);
	}

	.tutorial--card:nth-of-type(3n + 3) {
		background: linear-gradient(80.04deg, hsl(162, 96%, 50%) 0%, hsl(202, 81%, 48%) 100%);
	}

	@media (prefers-color-scheme: dark) {
		.tutorial--card:nth-of-type(3n + 1) {
			background: linear-gradient(80.04deg, #0478b9 0%, #0e3786 100%);
		}

		.tutorial--card:nth-of-type(3n + 2) {
			background: linear-gradient(80.04deg, #04bea8 0%, #0e488b 100%);
		}

		.tutorial--card:nth-of-type(3n + 3) {
			background: linear-gradient(80.04deg, #04b983 0%, #0e5b86 100%);
		}
	}
</style>
