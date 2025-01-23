<script lang="ts">
	import { get } from 'svelte/store';
	import { items } from './stores';

	export let rowItemIDs: string[];

	let elementWidth: number = 0;

	let itemSelection: Record<string, boolean> = {};
	let editingImageId = null;
	let editedName = '';

	console.log('Row item IDs:', rowItemIDs);

	$: rowHeight =
		(elementWidth - (rowItemIDs.length + 1) * 10) /
		rowItemIDs.reduce((acc: number, id: string) => {
			const item = get(items)[id];
			if (item && item.width !== 0) {
				return acc + item.height / item.width;
			} else {
				console.warn(`Item with id "${id}" not found or height is 0.`);
				return acc + 1;
			}
		}, 0);

	function measureWidth(node: HTMLElement) {
		const observer = new ResizeObserver((entries) => {
			for (let entry of entries) {
				elementWidth = entry.contentRect.width;
			}
		});
		observer.observe(node);

		return {
			destroy() {
				observer.unobserve(node);
			}
		};
	}
</script>

<div class="image-row" use:measureWidth>
	{#each rowItemIDs as itemID}
		<div
			class="image-item"
			style="height: {rowHeight + 40}px; width: {(rowHeight * get(items)[itemID].width) /
				get(items)[itemID].height}px; align-items: center;"
		>
			<div
				class="image-container {itemSelection[itemID] ? 'selected' : ''}"
				style="height: {rowHeight}px; width:{(rowHeight * get(items)[itemID].width) /
					get(items)[itemID].height}px;"
			>
				<img src={get(items)[itemID].thumbnail_url} alt={itemID} />
			</div>
			{#if editingImageId === itemID}
				<input type="text" bind:value={editedName} style="text-align: center; width: 100%;" />
			{:else}
				<div class="image-name">{get(items)[itemID].name}</div>
			{/if}
			<div class="image-date">{get(items)[itemID].modified_at}</div>
		</div>
	{/each}
</div>

<style>
	.image-row {
		width: 100%;
		display: flex;
		flex-direction: row;
		gap: 10px;
		margin: 10px;
	}
	.image-row .image-name {
		height: 20px;
	}
	.image-row .image-date {
		height: 20px;
	}
</style>
