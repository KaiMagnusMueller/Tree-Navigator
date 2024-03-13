<script>
	import { tutorials } from '../stores';
	import { IconButton, IconClose, IconForward, IconBack, Icon } from 'figma-plugin-ds-svelte';
	import { fade } from 'svelte/transition';
	export let viewedTutorials = undefined;

	let visibleTutorials;
	$: visibleTutorials = $tutorials.filter((elem) => {
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
			'*',
		);
	}

	let currentCard = 0;
	function handleSwitchCard(direction) {
		if (direction === 'next' && currentCard < visibleTutorials.length - 1) {
			currentCard++;
		} else if (direction === 'prev' && currentCard > 0) {
			currentCard--;
		}

		// console.log(document.getElementById(`tc${currentCard}`));
		document.getElementById(`tc${currentCard}`).scrollIntoView({ behavior: 'smooth' });
	}
</script>

{#if visibleTutorials.length > 0 && viewedTutorials}
	<div class="tutorial--wrapper" in:fade={{ duration: 100 }}>
		<div class="tutorial--header">
			<IconButton iconName={IconClose} on:click={handleCloseTutorial} />
		</div>
		<div class="tutorial--section">
			<div class="tutorial--scroller">
				{#each visibleTutorials as tutorial, index}
					<div class="tutorial--card--wrapper" id="tc{index.toString()}">
						<div class="tutorial--card">
							<div class="card--bg" />
							<img src={tutorial.image} alt="" width="160" height="160" />
							<div class="card--text">
								<h3>
									{tutorial.title}
								</h3>
								<p>{tutorial.body}</p>

								{#if tutorial.link}
									<a target="_blank" href={tutorial.link.href}
										>{tutorial.link.title} -></a>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>

			{#if visibleTutorials.length > 1}
				<div class="tutorial--navigation">
					<div class="tutorial--btn--wrapper">
						<div class="btn--area">
							<IconButton
								iconName={IconBack}
								on:click={() => handleSwitchCard('prev')}
								disabled={currentCard === 0 ? true : false} />
						</div>
						<div class="btn--area">
							<!-- <Icon iconName={IconForward} /> -->
							<IconButton
								iconName={IconForward}
								on:click={() => handleSwitchCard('next')}
								disabled={currentCard >= visibleTutorials.length - 1
									? true
									: false} />
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.tutorial--wrapper {
		position: absolute;
		bottom: 0px;
		width: 100%;
	}

	.tutorial--wrapper::before {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 120%;
		background: linear-gradient(transparent, var(--figma-color-bg) 30%);
	}

	.tutorial--section {
		position: relative;
	}

	.tutorial--section > div {
		padding-top: 8px;
		padding-bottom: 8px;
	}

	.tutorial--header {
		display: flex;
		flex-direction: row;
		justify-content: end;
		position: relative;
	}

	.tutorial--scroller {
		display: flex;
		gap: 16px;
		overflow-x: hidden;
	}

	.tutorial--card--wrapper {
		padding: 0 8px;
		min-width: 100%;
	}

	.tutorial--card {
		box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.35);
		border-radius: 10px;
		height: 120px;
		font-size: var(--font-size-small);
		font-weight: var(--font-weight-normal);
		color: var(--figma-color-text-onsuccess);
		padding: 12px;
		overflow: hidden;
		position: relative;
	}

	.tutorial--card h3 {
		font-size: var(--font-size-large);
		font-weight: var(--font-weight-bold);
		margin: 0;
	}

	.card--text {
		width: 55%;
		display: flex;
		flex-direction: column;
		gap: 8px;
		height: 100%;
		justify-content: center;
		/* justify-content: space-between; */
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
		pointer-events: none;

		position: absolute;
		right: 0;
		top: 50%;
		width: 160px;
		height: auto;
		filter: drop-shadow(0px 2.697px 7.192px rgba(0, 0, 0, 0.25));
		transform: rotate(9.16deg) translate(15%, -50%);
	}
	/* .tutorial--card::after */
	.card--bg {
		border: 2px solid rgb(0 0 0 / 20%);
		border-radius: 10px;
		top: 0;
		left: 0;
		position: absolute;
		width: 100%;
		height: 100%;
		content: '';
		box-sizing: border-box;
		pointer-events: none;
	}

	.tutorial--navigation {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 100%;
		padding: 0 8px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		pointer-events: none;
	}

	.tutorial--btn--wrapper {
		width: 100%;
		padding: 0 8px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.btn--area {
		pointer-events: auto;
		opacity: 0;
		padding: 4px;
		border-radius: 50%;
		background: var(--figma-color-bg);
	}

	.btn--area:hover {
		opacity: 1;
	}

	.tutorial--card--wrapper:nth-of-type(3n + 1) .tutorial--card {
		background: linear-gradient(80.04deg, hsl(202, 96%, 50%) 0%, hsl(220, 81%, 48%) 100%);
	}

	.tutorial--card--wrapper:nth-of-type(3n + 2) .tutorial--card {
		background: linear-gradient(80.04deg, hsl(173, 96%, 35%) 0%, hsl(212, 82%, 44%) 100%);
	}

	.tutorial--card--wrapper:nth-of-type(3n + 3) .tutorial--card {
		background: linear-gradient(80deg, #04b983 0%, #0e5b86 100%);
	}

	@media (prefers-color-scheme: dark) {
		.tutorial--card--wrapper:nth-of-type(3n + 1) .tutorial--card {
			background: linear-gradient(80deg, #0478b9 0%, #0e3786 100%);
		}

		.tutorial--card--wrapper:nth-of-type(3n + 2) .tutorial--card {
			background: linear-gradient(80deg, hsl(173, 96%, 35%) 0%, hsl(212, 82%, 44%) 100%);
		}

		.tutorial--card--wrapper:nth-of-type(3n + 3) .tutorial--card {
			background: linear-gradient(80deg, #04b983 0%, #0e5b86 100%);
		}
	}
</style>
