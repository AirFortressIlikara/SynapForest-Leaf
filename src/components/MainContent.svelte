<!--
  Author: Ilikara 3435193369@qq.com
  Date: 2025-01-20 13:52:10
  LastEditors: Ilikara 3435193369@qq.com
  LastEditTime: 2025-01-31 17:38:08
  FilePath: /SynapForest/src/components/MainContent.svelte
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
	import ItemRow from './ItemRow.svelte';
	import {
		isDeleted,
		itemsPerRow,
		itemTrigger,
		selectedFolderIDs,
		selectedItemIDs,
		sortedIds
	} from './stores';
	import { browser } from '$app/environment';
	import { onDestroy } from 'svelte';
	import { delItems, uploadFiles } from './api';

	let isLoading = false;

	function chunkArray(array: string[], size: number) {
		return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
			array.slice(index * size, index * size + size)
		);
	}
	$: groupedItems = chunkArray($sortedIds, $itemsPerRow);

	let elementWidth: number = 0;

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

	let isDragging = false;

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		if (event.dataTransfer?.types.includes('Files')) {
			isDragging = true;
		}
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		isDragging = false;
	}

	async function handleDrop(event: DragEvent) {
		event.preventDefault();
		isDragging = false;

		console.log('Drag drop detected:', event.dataTransfer?.types);
		if (event.dataTransfer?.types.includes('Files')) {
			const files = event.dataTransfer?.files;
			if (files && files.length > 0) {
				console.log('Files to main window Detected: ', files.length, 'files');
				try {
					const result = await uploadFiles(Array.from(files), Object.keys($selectedFolderIDs));
					console.log('Upload result:', result);
				} catch (error) {
					console.error('Error uploading files:', error);
				} finally {
					itemTrigger.set(!$itemTrigger);
				}
			}
		}
	}

	if (browser) {
		async function handleKeyDown(event: KeyboardEvent) {
			if (event.ctrlKey && event.key === 'a') {
				event.preventDefault();
				selectedItemIDs.update(() =>
					$sortedIds.reduce(
						(acc, itemId) => {
							acc[itemId] = true;
							return acc;
						},
						{} as Record<string, boolean>
					)
				);
				console.log('Selected items:', Object.keys($selectedItemIDs));
			} else if (event.key === 'Delete') {
				event.preventDefault();
				try {
					delItems({ item_ids: Object.keys($selectedItemIDs), hard_delete: $isDeleted });
				} catch (error) {
					console.error('Error deleting files:', error);
				} finally {
					console.log('Deleted items:', Object.keys($selectedItemIDs));
					$selectedItemIDs = {};
					setTimeout(() => itemTrigger.set(!$itemTrigger), 10);
				}
			} else if (event.key === 'Enter') {
			}
		}

		document.addEventListener('keydown', handleKeyDown);

		onDestroy(() => {
			document.removeEventListener('keydown', handleKeyDown);
		});
	}
</script>

<div class="container" use:measureWidth>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="image-grid"
		on:click={(event) => {
			event.stopPropagation();
			$selectedItemIDs = {};
			console.log('Selected Items:', Object.keys($selectedItemIDs));
		}}
		on:dragover={handleDragOver}
		on:dragleave={handleDragLeave}
		on:drop={handleDrop}
		class:is-dragging={isDragging}
	>
		{#each groupedItems as rowItemIDs}
			<ItemRow {rowItemIDs} {elementWidth} />
		{/each}
	</div>
</div>

<style>
	.container {
		position: relative;
		width: 100%;
		height: 100%;
		background-color: #e0e0e0;
	}

	.image-grid {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
		overflow-y: auto;
		contain: size;
	}

	.is-dragging {
		border: 2px dashed #000;
		background-color: #f0f0f0;
	}
</style>
