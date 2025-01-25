<!--
  Author: Ilikara 3435193369@qq.com
  Date: 2025-01-24 15:27:20
  LastEditors: Ilikara 3435193369@qq.com
  LastEditTime: 2025-01-25 21:10:21
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
	import { items, selectedFolderIDs, selectedItemIDs } from './stores';
	import * as m from '$lib/paraglide/messages.js';

	$: selectItemCount = Object.keys($selectedItemIDs).length;
	$: firstSelectedItem = $items[Object.keys($selectedItemIDs)[0]];

	console.log('right bar content:', firstSelectedItem);

	$: totalSize =
		selectItemCount == 0
			? Object.values($items).reduce((sum, item) => sum + item.size, 0)
			: Object.keys($selectedItemIDs).reduce((sum, itemID) => sum + $items[itemID].size, 0);
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
		<div>
			<strong>Tags:</strong>
			<ul>
				{#each firstSelectedItem.tag_ids as tag}
					<li>{tag}</li>
				{/each}
			</ul>
		</div>

		<div>
			<strong>Folders:</strong>
			<ul>
				{#each firstSelectedItem.folder_ids as folder}
					<li>{folder}</li>
				{/each}
			</ul>
		</div>
	{/if}

	<div>
		{#if selectItemCount == 0}
			<strong>Folder Info:</strong>
		{:else}
			<strong>File Info:</strong>
		{/if}
		<div class="info-grid">
			<div><strong>Size:</strong></div>
			<div>{totalSize} bytes</div>
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
		max-width: 100%;
		max-height: 20%;
		object-fit: contain;
	}
	.info-grid {
		width: 100%;
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: 8px;
		align-items: center;
	}
	.info-grid strong {
		font-weight: bold;
	}
	input {
		width: 100%; /* 设置输入框宽度 */
		text-align: left; /* 文字左对齐 */
		padding: 8px;
		margin: 5px 0;
		border: 1px solid #ccc;
		border-radius: 4px;
		white-space: nowrap; /* 防止文字换行 */
		overflow: hidden; /* 超出部分隐藏 */
		text-overflow: ellipsis; /* 超出部分显示省略号 */
	}
	input:not(:focus) {
		background-color: #f9f9f9; /* 非编辑状态下背景色 */
		cursor: default; /* 非编辑状态下鼠标样式 */
	}
</style>
