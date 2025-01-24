<!--
  Author: Ilikara 3435193369@qq.com
  Date: 2025-01-24 15:27:20
  LastEditors: Ilikara 3435193369@qq.com
  LastEditTime: 2025-01-24 19:30:55
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
</script>

<div class="rightbar">
	{#if selectItemCount >= 1}
		<img src={firstSelectedItem.raw_url} alt="Thumbnail" />
		{#if selectItemCount > 1}
			<div>{m.selected_count({ count: selectItemCount })}</div>
		{/if}
		{#if selectItemCount === 1}
			<h3>{firstSelectedItem.name || '文件名'}</h3>
			<h3>{firstSelectedItem.annotation || '注释'}</h3>
			<h3>{firstSelectedItem.url || 'Url'}</h3>
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
			<ul>
				<li>Size: bytes</li>
			</ul>
		{:else}
			<strong>File Info:</strong>
			<ul>
				{#if selectItemCount == 1}
					<li>Size: {firstSelectedItem.size} bytes</li>
					<li>Type: {firstSelectedItem.ext}</li>
					<li>Dimensions: {firstSelectedItem.width}x{firstSelectedItem.height}</li>
					<li>Created: {firstSelectedItem.created_at}</li>
					<li>Modified: {firstSelectedItem.modified_at}</li>
				{:else}
					<li>Size: bytes</li>
				{/if}
			</ul>
		{/if}
	</div>
</div>

<style>
	.rightbar {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	img {
		max-width: 100%;
		height: auto;
	}
</style>
