<!--
  Author: Ilikara 3435193369@qq.com
  Date: 2025-01-20 16:39:14
  LastEditors: Ilikara 3435193369@qq.com
  LastEditTime: 2025-01-21 21:27:21
  FilePath: /SynapForest/src/components/FolderTree.svelte
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
	import { onMount, onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import { folders, selectedFolders } from './stores';
	import { fetchFoldersFromBackend } from './api';
	import type { Folder } from './type';

	let isLoading = false;
	let error = '';

	export let folderId: string;
	export let level: number = 0;

	$: folder = $folders[folderId];
	$: subFolderIDs = folder?.sub_folders ?? [];

	console.log('Rendering folder id: ', folderId);
	console.log('SubFolder id: ', subFolderIDs);
	console.log('Folder: ', folder);

	// 在组件加载时获取文件夹数据
	onMount(async () => {
		if (level === 0) {
			isLoading = true;
			try {
				// 调用 API 获取文件夹数据（返回的是数组）
				const fetchedFolders = await fetchFoldersFromBackend({});

				// 将数组转换为 Record<string, Folder> 格式
				const foldersMap: Record<string, Folder> = {};
				fetchedFolders.forEach((folder) => {
					foldersMap[folder.id] = folder;
				});

				console.log('FoldersMap:', foldersMap);

				// 更新 store
				folders.set(foldersMap);
			} catch (err) {
				error = (err as Error).message;
			} finally {
				isLoading = false;
			}
		}
	});

	// 处理文件夹点击事件
	function handleFolderClick(event: MouseEvent, folderId: string) {
		if (event.ctrlKey) {
			// Ctrl + 点击：多选
			$selectedFolders = new Set($selectedFolders);
			if ($selectedFolders.has(folderId)) {
				$selectedFolders.delete(folderId);
			} else {
				$selectedFolders.add(folderId);
			}
		} else {
			// 单选
			$selectedFolders = new Set([folderId]);
		}
	}
</script>

{#if isLoading}
	<p>Loading folders...</p>
{:else if error}
	<p style="color: red;">Error: {error}</p>
{:else if level > 0}
	<div class="folder">
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="folder-name {$selectedFolders.has(folder.id) ? 'selected' : ''}"
			on:click={(event) => {
				event.stopPropagation();
				handleFolderClick(event, folder.id);
			}}
		>
			<button
				type="button"
				on:click={(event) => {
					event.stopPropagation();
					folder.isExpand = !folder.isExpand;
				}}
			>
				{folder.isExpand ? '📂' : '📁'}
			</button>
			{folder.name}
		</div>
		{#if folder.isExpand}
			<div class="sub-folders">
				{#each subFolderIDs as subFolderID}
					<svelte:self folderId={subFolderID} level={level + 1} />
				{/each}
			</div>
		{/if}
	</div>
{:else}
	{#each subFolderIDs as subFolderID}
		<svelte:self folderId={subFolderID} level={level + 1} />
	{/each}
{/if}

<style>
	.folder {
		/* margin-left: 20px; */
		cursor: pointer;
	}
	.folder-name {
		font-weight: bold;
	}
	.selected {
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.3); /* 添加阴影效果 */
		background-color: #f0f0f0; /* 可选：添加背景色以增强效果 */
	}
	.sub-folders {
		margin-left: 20px;
	}
</style>
