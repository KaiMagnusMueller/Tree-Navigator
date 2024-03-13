<script>
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import { SelectItem, SelectDivider } from 'figma-plugin-ds-svelte';

	export let disabled = false;
	export let macOSBlink = false;
	export let menuItems = []; //pass data in via this prop to generate menu items
	export let placeholder = 'Please make a selection.';
	export let value = null; //stores the current selection, note, the value will be an object from your array
	export let showGroupLabels = false; //default prop, true will show option group labels
	export let active = false;
	export let pillElem;
	export let rounded = false;

	export { className as class };

	const dispatch = createEventDispatcher();
	let className = '';
	let groups = checkGroups();
	let menuWrapper, menuList;
	let backdropElem;
	$: menuItems, updateSelectedAndIds();
	//FUNCTIONS

	//assign id's to the input array
	onMount(async () => {
		// updateSelectedAndIds();
		resizeAndPosition();
	});

	// this function runs everytime the menuItems array os updated
	// it will auto assign ids and keep the value var updated
	function updateSelectedAndIds() {
		if (menuItems) {
			menuItems.forEach((item, index) => {
				//update id
				item['id'] = index;
				//update selection
				if (item.selected === true) {
					value = item;
				}
			});
		}
		//set placeholder
		if (menuItems.length <= 0) {
			placeholder = 'There are no items to select';
			disabled = true;
		} else {
			placeholder = 'Please make a selection';
			disabled = false;
		}
	}

	//determine if option groups are present
	function checkGroups() {
		let groupCount = 0;
		if (menuItems) {
			menuItems.forEach((item) => {
				if (item.group != null) {
					groupCount++;
				}
			});
			if (groupCount === menuItems.length) {
				return true;
			} else {
				return false;
			}
		}
		return false;
	}

	//menu highlight function on the selected menu item
	function removeHighlight(event) {
		let items = Array.from(event.target.parentNode.children);
		items.forEach((item) => {
			item.blur();
			item.classList.remove('highlight');
		});
	}

	// $: active, menuClick();

	//run for all menu click events
	//this opens/closes the menu
	function menuClick(event) {
		resetMenuProperties();

		if (event.target == backdropElem) {
			active = false;
		} else if (event.target.contains(pillElem)) {
			// This if is never used
			let topPos = 0;

			if (value) {
				//toggle menu
				menuList.classList.remove('hidden');

				let id = value.id;
				let selectedItem = menuList.querySelector('[itemId="' + id + '"]');
				selectedItem.focus(); //set focus to the currently selected item

				// calculate distance from top so that we can position the dropdown menu
				let parentTop = menuList.getBoundingClientRect().top;
				let itemTop = selectedItem.getBoundingClientRect().top;
				let topPos = itemTop - parentTop - 3;
				menuList.style.top = -Math.abs(topPos) + 'px';

				//update size and position based on plugin UI
				resizeAndPosition();
			} else {
				menuList.classList.remove('hidden');
				menuList.style.top = '0px';
				let firstItem = menuList.querySelector('[itemId="0"]');
				firstItem.focus();

				//update size and position based on plugin UI
				resizeAndPosition();
			}
		} else if (menuList.contains(event.target)) {
			// console.log('menuList.contains(event.target)');
			//find selected item in array
			let itemId = parseInt(event.target.getAttribute('itemId'));

			//remove current selection if there is one
			if (value) {
				menuItems[value.id].selected = false;
			}
			menuItems[itemId].selected = true; //select current item
			updateSelectedAndIds();
			dispatch('change', [menuItems[itemId]]);

			if (macOSBlink) {
				var x = 4;
				var interval = 70;

				//blink the background
				for (var i = 0; i < x; i++) {
					setTimeout(function () {
						event.target.classList.toggle('blink');
					}, i * interval);
				}
				//delay closing the menu
				setTimeout(
					function () {
						menuList.classList.add('hidden'); //hide the menu
					},
					interval * x + 40,
				);
			} else {
				menuList.classList.add('hidden'); //hide the menu
				// menuButton.classList.remove('selected'); //remove selected state from button
				active = false;
			}
		}
	}

	// this function ensures that the select menu
	// fits inside the plugin viewport
	// if its too big, it will resize it and enable a scrollbar
	// if its off screen it will shift the position
	function resizeAndPosition() {
		//set the max height of the menu based on plugin/iframe window
		//set the x position based on plugin/iframe window and the dropdown width

		let maxMenuHeight = window.innerHeight - 16;
		let menuHeight = menuList.offsetHeight;
		let menuResized = false;
		const windowWidth = window.innerWidth;

		if (menuHeight > maxMenuHeight) {
			menuList.style.height = maxMenuHeight + 'px';
			menuResized = true;
		}

		//lets adjust the position of the menu if its cut off from viewport
		let bounding = menuList.getBoundingClientRect();
		let parentBounding = pillElem.getBoundingClientRect();

		if (bounding.top < 0) {
			menuList.style.top = -Math.abs(parentBounding.top - 8) + 'px';
		}
		if (bounding.bottom > (window.innerHeight || document.documentElement.clientHeight)) {
			let minTop = -Math.abs(parentBounding.top - (window.innerHeight - menuHeight - 8));
			let newTop = -Math.abs(bounding.bottom - window.innerHeight + 16);
			if (menuResized) {
				menuList.style.top = -Math.abs(parentBounding.top - 8) + 'px';
			} else if (newTop > minTop) {
				menuList.style.top = minTop + 'px';
			} else {
				menuList.style.top = newTop + 'px';
			}
		}

		// Adjust x position if the dropdown is wider than the plugin window or the position would be negative
		const xPos = Math.round(bounding.x);
		const width = Math.round(bounding.width);

		const xPosDefault = (parentBounding.width - bounding.width) / 2;

		if (xPos + width > windowWidth - 8) {
			// Subtract 8 from windowWidth, to simulate the global 8px padding
			const correction = (xPos + width - windowWidth) * -1;
			menuList.style.left = correction + 'px';
		} else if (xPos + xPosDefault < 0) {
			// Example: 8 + -40 = -32 => true
			// xPosDefault
			// Add 8 to windowWidth, to simulate the global 8px padding
			const correction = xPos * -1;
			menuList.style.left = correction + 'px';
		} else {
			menuList.style.left = xPosDefault;
		}
	}
	function resetMenuProperties() {
		menuList.style.height = 'auto';
		menuList.style.top = '0px';
	}
</script>

<div
	on:click|stopPropagation={menuClick}
	on:wheel|stopPropagation
	class="backdrop"
	bind:this={backdropElem} />
<!-- stopPropagation used to prevent events behind the backdrop from firing  -->

<div
	on:change
	on:focus
	on:blur
	on:wheel|stopPropagation
	bind:this={menuWrapper}
	{disabled}
	{placeholder}
	{showGroupLabels}
	{macOSBlink}
	class="wrapper {className}">
	<ul class="menu" class:rounded bind:this={menuList}>
		{#if menuItems && menuItems.length > 0}
			{#each menuItems as item, i}
				{#if i === 0}
					{#if item.group && showGroupLabels}
						<SelectDivider label>{item.group}</SelectDivider>
					{/if}
				{:else if i > 0 && item.group && menuItems[i - 1].group != item.group}
					{#if showGroupLabels}
						<SelectDivider />
						<SelectDivider label>{item.group}</SelectDivider>
					{:else}
						<SelectDivider />
					{/if}
				{/if}
				<SelectItem
					on:click={(event) => menuClick(event)}
					on:mouseenter|once={removeHighlight}
					itemId={item.id}
					disabled={item.hidden}
					bind:selected={item.selected}
					{rounded}>{item.label}</SelectItem>
			{/each}
		{/if}
	</ul>
</div>

<style>
	.wrapper {
		position: relative;
	}

	.label,
	.placeholder {
		font-size: var(--font-size-xsmall);
		font-weight: var(--font-weight-normal);
		letter-spacing: var(--font-letter-spacing-neg-xsmall);
		line-height: var(--line-height);
		color: var(--black8);
		margin-right: 6px;
		margin-top: -3px;
		white-space: nowrap;
		overflow-x: hidden;
		text-overflow: ellipsis;
	}

	.placeholder {
		color: var(--black3);
	}

	.caret {
		display: block;
		margin-top: -1px;
	}

	/* .caret svg path {
        fill: var(--black3);
    } */

	.icon {
		margin-left: -8px;
		margin-top: -2px;
		margin-right: 0;
	}

	.menu {
		position: absolute;
		top: 8px;
		left: 0;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background-color: var(--hud);
		box-shadow: var(--shadow-hud);
		padding: var(--size-xxsmall) 0 var(--size-xxsmall) 0;
		margin: 0;
		z-index: 50;
		overflow-x: overlay;
		overflow-y: auto;
	}
	.rounded {
		border-radius: var(--border-radius-large);
		/* 4px padding, together with .menu border */
		padding: 3px;
	}

	.backdrop {
		position: fixed;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		z-index: 50;
	}
</style>
