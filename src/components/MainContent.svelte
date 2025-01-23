<!--
  Author: Ilikara 3435193369@qq.com
  Date: 2025-01-20 13:52:10
  LastEditors: Ilikara 3435193369@qq.com
  LastEditTime: 2025-01-23 19:33:10
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
	import { sortedIds } from './stores';

	let isLoading = false;

	function chunkArray(array: string[], size: number) {
		return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
			array.slice(index * size, index * size + size)
		);
	}
	$: groupedItems = chunkArray($sortedIds, 4);
</script>

<div class="container">
	{#if false}
		<div class="drop-overlay">
			<span>Drop files here to upload</span>
		</div>
	{/if}

	<div class="image-grid">
		{#each groupedItems as rowItemIDs}
			<ItemRow {rowItemIDs} />
		{/each}
	</div>
</div>

<style>
	.container {
		position: relative;
		width: 100%;
		height: 100%;
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
		overflow-y: scroll;
		overflow-x:scroll;
	}
</style>
