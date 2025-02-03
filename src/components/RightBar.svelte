<!--
  Author: Ilikara 3435193369@qq.com
  Date: 2025-01-24 15:27:20
  LastEditors: Ilikara 3435193369@qq.com
  LastEditTime: 2025-02-03 13:07:38
  FilePath: /SynapForest/src/components/RightBar.svelte
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
	import { folders, items, selectedItemIDs } from './stores';
	import * as m from '$lib/paraglide/messages.js';

	$: selectItemCount = Object.keys($selectedItemIDs).length;
	$: firstSelectedItem = $items[Object.keys($selectedItemIDs)[0]];

	console.log('right bar content:', firstSelectedItem);

	$: totalSize =
		selectItemCount == 0
			? Object.values($items).reduce((sum, item) => sum + item.size, 0)
			: Object.keys($selectedItemIDs).reduce((sum, itemID) => sum + $items[itemID].size, 0);

	function formatSize(bytes: number) {
		const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
		let unitIndex = 0;

		while (bytes >= 1024 && unitIndex < units.length - 1) {
			bytes /= 1024;
			unitIndex++;
		}

		return `${bytes.toFixed(2)} ${units[unitIndex]}`;
	}

	$: commonTagIDs = (() => {
		const selectedKeys = Object.keys($selectedItemIDs);
		if (selectedKeys.length === 0) return [];

		const allTagIDs = selectedKeys.map((key) => $items[key].tag_ids);

		return allTagIDs.reduce((acc, tagIDs) => {
			return acc.filter((id) => tagIDs.includes(id));
		}, allTagIDs[0] || []);
	})();

	$: commonFolderIDs = (() => {
		const selectedKeys = Object.keys($selectedItemIDs);
		if (selectedKeys.length === 0) return [];

		const allFolderIDs = selectedKeys.map((key) => $items[key].folder_ids);

		return allFolderIDs.reduce((acc, folderIDs) => {
			return acc.filter((id) => folderIDs.includes(id));
		}, allFolderIDs[0] || []);
	})();
</script>

<div class="rightbar">
	{#if selectItemCount >= 1}
		<img src={firstSelectedItem.raw_url} alt="Thumbnail" />
		{#if selectItemCount > 1}
			<div>{m.selected_count({ count: selectItemCount })}</div>
		{/if}
		{#if selectItemCount === 1}
			<input type="text" bind:value={firstSelectedItem.name} placeholder="文件名" />
			<input type="text" bind:value={firstSelectedItem.annotation} placeholder="注释" />
			<input type="text" bind:value={firstSelectedItem.url} placeholder="Url" />
		{/if}
		<div class="tags">
			<strong>Tags:</strong>
			<ul>
				{#each commonTagIDs as tag}
					<li class="tag">{tag}</li>
				{/each}
			</ul>
		</div>

		<div class="tags">
			<strong>Folders:</strong>
			<ul>
				{#each commonFolderIDs as folderID}
					<li class="tag">{$folders[folderID].name}</li>
				{/each}
			</ul>
		</div>
	{/if}

	<div class="basic-info">
		{#if selectItemCount == 0}
			<strong>Folder Info:</strong>
		{:else}
			<strong>File Info:</strong>
		{/if}
		<div class="info-grid">
			<div><strong>Size:</strong></div>
			<div>{formatSize(totalSize)}</div>
			{#if selectItemCount == 1}
				<div><strong>Type:</strong></div>
				<div>{firstSelectedItem.ext}</div>
				<div><strong>Dimensions:</strong></div>
				<div>{firstSelectedItem.width}x{firstSelectedItem.height}</div>
				<div><strong>Created:</strong></div>
				<div>{firstSelectedItem.created_at}</div>
				<div><strong>Modified:</strong></div>
				<div>{firstSelectedItem.modified_at}</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.rightbar {
		display: flex;
		flex-direction: column;
		overflow-x: hidden;
		overflow-y: auto;
		height: 100%;
		width: 100%;
	}
	img {
		margin: 2px 0.25vw;
		width: 100%;
		height: 20vh;
		object-fit: contain;
		border-radius: 0.5vw;
	}
	.tags {
		margin: 0 0.25vw;
	}
	.tags .tag {
		background-color: #e0e0e0;
		color: #333;
		padding: 4px 8px;
		border-radius: 12px;
		font-size: 1rem;
		display: inline-block;
		border: 2px solid #aaa;
		margin: 2px;
	}
	.basic-info {
		margin: 0 0.25vw;
	}
	.basic-info .info-grid {
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: 8px;
		align-items: center;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.basic-info .info-grid strong {
		font-weight: bold;
	}
	input {
		text-align: left;
		margin: 2px 0.25vw;
		border: 1px solid #ccc;
		border-radius: 0.5vw;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	input:not(:focus) {
		background-color: #f9f9f9;
		cursor: default;
	}
</style>
