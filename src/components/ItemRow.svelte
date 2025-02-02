<!--
  Author: Ilikara 3435193369@qq.com
  Date: 2025-01-22 11:15:47
  LastEditors: Ilikara 3435193369@qq.com
  LastEditTime: 2025-02-01 19:57:37
  FilePath: /SynapForest/src/components/ItemRow.svelte
  Description: 
  
  Copyright (c) 2025 AirFortressIlikara
  SynapForest is licensed under Mulan PubL v2.
  You can use this software according to the terms and conditions of the Mulan PubL v2.
  You may obtain a copy of Mulan PubL v2 at:
           http://license.coscl.org.cn/MulanPubL-2.0
  THIS SOFTWARE IS PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTIES OF ANY KIND,
  EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO NON-INFRINGEMENT,
  MERCHANTABILITY OR FIT FOR A PARTICULAR PURPOSE.
  See the Mulan PubL v2 for more details.
-->
<script lang="ts">
	import { get } from 'svelte/store';
	import { items, menuType, menuX, menuY, showMenu } from './stores';
	import { selectedItemIDs } from './stores';
	import AuthImg from './AuthImg.svelte';

	export let rowItemIDs: string[];

	export let elementWidth: number = 0;

	let editingImageId = null;
	let editedName = '';

	console.log('Row item IDs:', rowItemIDs);

	$: rowHeight =
		(elementWidth - rowItemIDs.length * 20) /
		rowItemIDs.reduce((acc: number, id: string) => {
			const item = get(items)[id];
			if (item && item.height !== 0) {
				return acc + item.width / item.height;
			} else {
				console.warn(`Item with id "${id}" not found or height is 0.`);
				return acc + 1;
			}
		}, 0);

	function handleItemClick(event: MouseEvent, folderId: string) {
		selectedItemIDs.update(($selectedItemIDs) => {
			let newselectedItemIDs = { ...$selectedItemIDs };
			if (event.ctrlKey) {
				if (newselectedItemIDs[folderId]) {
					delete newselectedItemIDs[folderId];
				} else {
					newselectedItemIDs[folderId] = true;
				}
			} else {
				newselectedItemIDs = { [folderId]: true };
			}
			return newselectedItemIDs;
		});
		console.log('Selected items:', Object.keys($selectedItemIDs));
	}

	function handleDragStart(event: DragEvent, item: any) {
		event.dataTransfer?.setData('application/from_item', JSON.stringify(item));
	}
</script>

<div class="image-row" style="height: {rowHeight + 60}px;">
	{#each rowItemIDs as itemID}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="image-item {itemID in $selectedItemIDs ? 'selected' : ''}"
			style="height: {rowHeight + 60}px; width: {(rowHeight * get(items)[itemID].width) /
				get(items)[itemID].height}px;"
			on:click={(event) => {
				event.stopPropagation();
				handleItemClick(event, itemID);
			}}
			on:dragstart={(event) => {
				handleItemClick(event, itemID);
				handleDragStart(event, { id: 1, name: 'Internal Item' });
			}}
			on:contextmenu={(event) => {
				event.stopPropagation();
				event.preventDefault();
				menuX.set(event.clientX);
				menuY.set(event.clientY);
				menuType.set('Item');
				showMenu.set(true);
			}}
		>
			<img
				src={get(items)[itemID].raw_url}
				alt={itemID}
				style="height: {rowHeight}px; width:{(rowHeight * get(items)[itemID].width) /
					get(items)[itemID].height}px;"
			/>
			{#if editingImageId === itemID}
				<input
					type="text"
					bind:value={editedName}
					style="text-align: center; width: 100%; padding: 4px; border: 1px solid #ccc; border-radius: 4px;"
				/>
			{:else}
				<div class="image-name" style="padding: 4px;">
					{get(items)[itemID].name}
				</div>
			{/if}

			<div class="image-date" style="color: #666; font-size: 0.9em;">
				{get(items)[itemID].modified_at}
			</div>
		</div>
	{/each}
</div>

<style>
	.selected {
		box-shadow: 0 0 12px rgba(57, 192, 255, 0.3);
		background-color: #f0f0f0;
		border-radius: 0.5vw;
	}
	.image-row {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		margin-top: 10px;
		margin-bottom: 10px;
	}
	.image-row .image-item {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.image-row .image-name {
		height: 30px;
		width: 100%;
		text-align: center;
		font-size: 1rem;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	.image-row .image-date {
		height: 30px;
		width: 100%;
		text-align: center;
		font-size: 1rem;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	img {
		border-radius: 0.5vw;
		object-fit: cover;
	}
</style>
