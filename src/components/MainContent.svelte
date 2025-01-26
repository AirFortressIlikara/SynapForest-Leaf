<!--
  Author: Ilikara 3435193369@qq.com
  Date: 2025-01-20 13:52:10
  LastEditors: Ilikara 3435193369@qq.com
  LastEditTime: 2025-01-26 16:00:43
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
	import { get } from 'svelte/store';
	import ItemRow from './ItemRow.svelte';
	import { itemsPerRow, selectedItemIDs, sortedIds } from './stores';
	import { browser } from '$app/environment';
	import { onDestroy } from 'svelte';

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

	if (browser) {
		function handleSelectAll(event: KeyboardEvent) {
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
			}
		}

		document.addEventListener('keydown', handleSelectAll);

		onDestroy(() => {
			document.removeEventListener('keydown', handleSelectAll);
		});
	}
</script>

<div class="container" use:measureWidth>
	{#if false}
		<div class="drop-overlay">
			<span>Drop files here to upload</span>
		</div>
	{/if}

	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="image-grid"
		on:click={(event) => {
			event.stopPropagation();
			$selectedItemIDs = {};
			console.log('Selected Items:', Object.keys($selectedItemIDs));
		}}
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

	.drop-overlay {
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.6);
		z-index: 9999;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-size: 1.5rem;
		pointer-events: none;
	}

	.image-grid {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
		overflow-y: auto;
		contain: size;
	}
</style>
