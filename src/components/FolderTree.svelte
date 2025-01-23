<!--
  Author: Ilikara 3435193369@qq.com
  Date: 2025-01-20 16:39:14
  LastEditors: Ilikara 3435193369@qq.com
  LastEditTime: 2025-01-23 15:12:34
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
	import { onMount } from 'svelte';
	import { folders, selectedFolders } from './stores';
	import { fetchFolders } from './api';
	import type { Folder } from './type';

	let isLoading = false;
	let error = '';

	export let folderId: string;
	export let level: number = 0;

	$: folder = $folders[folderId];
	$: subFolderIDs = folder?.sub_folders ?? [];

	console.log('Rendering folder id: ', folderId);

	onMount(async () => {
		if (level === 0) {
			isLoading = true;
			try {
				const fetchedFolders = await fetchFolders({});

				const foldersMap: Record<string, Folder> = {};
				fetchedFolders.forEach((folder) => {
					foldersMap[folder.id] = folder;
				});

				console.log('FoldersMap:', foldersMap);

				folders.set(foldersMap);
			} catch (err) {
				error = (err as Error).message;
			} finally {
				isLoading = false;
			}
		}
	});

	function handleFolderClick(event: MouseEvent, folderId: string) {
		selectedFolders.update(($selectedFolders) => {
			let newSelectedFolders = { ...$selectedFolders };
			if (event.ctrlKey) {
				if (newSelectedFolders[folderId]) {
					delete newSelectedFolders[folderId];
				} else {
					newSelectedFolders[folderId] = true;
				}
			} else {
				newSelectedFolders = { [folderId]: true };
			}
			return newSelectedFolders;
		});
		console.log('Selected folders:', Object.keys($selectedFolders));
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
			class="folder-name {folder.id in $selectedFolders ? 'selected' : ''}"
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
		cursor: pointer;
	}
	.folder-name {
		font-weight: bold;
	}
	.selected {
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
		background-color: #f0f0f0;
	}
	.sub-folders {
		margin-left: 20px;
	}
</style>
