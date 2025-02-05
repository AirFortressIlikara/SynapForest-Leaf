<!--
  Author: Ilikara 3435193369@qq.com
  Date: 2025-01-21 21:39:59
  LastEditors: Ilikara 3435193369@qq.com
  LastEditTime: 2025-02-05 21:27:58
  FilePath: /SynapForest/src/components/Leftbar.svelte
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
	import { onDestroy, onMount } from 'svelte';
	import FolderTree from './FolderTree.svelte';
	import { folders, selectedFolderIDs } from './stores';
	import { browser } from '$app/environment';
	import { fetchFolders } from './api';
	import type { Folder } from './type';
	import { deleteSelectedFolders } from './utils';

	let isLoading = false;
	let leftBarElement: HTMLElement;
	let isFocused = false;

	function handleSelectAll(event: KeyboardEvent) {
		if (isFocused) {
			if (event.ctrlKey && event.key === 'a') {
				event.preventDefault();
				selectedFolderIDs.update(() =>
					Object.keys($folders).reduce(
						(acc, folderID) => {
							acc[folderID] = true;
							return acc;
						},
						{} as Record<string, boolean>
					)
				);
				console.log('Selected folders:', Object.keys($selectedFolderIDs));
			} else if (event.key === 'Delete') {
				event.preventDefault();
				deleteSelectedFolders({
					folderId: Object.keys($selectedFolderIDs)[0],
					deleteItems: false
				});
			} else if (event.key === 'Enter') {
				event.preventDefault();
			}
		}
	}

	onMount(async () => {
		isLoading = true;
		try {
			const fetchedFolders = await fetchFolders({});

			const foldersMap: Record<string, Folder> = {};
			fetchedFolders.forEach((folder) => {
				foldersMap[folder.id] = folder;
			});

			folders.set(foldersMap);
		} catch (error) {
			console.error('Error preparing folders:', error);
		} finally {
			isLoading = false;
		}
	});

	$: console.log('Folders updated:', $folders);

	if (browser) {
		onMount(() => {
			document.addEventListener('keydown', handleSelectAll);
		});

		onDestroy(() => {
			document.removeEventListener('keydown', handleSelectAll);
		});
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	bind:this={leftBarElement}
	class="leftbar"
	on:click={(event) => {
		event.stopPropagation();
		$selectedFolderIDs = {};
		console.log('Selected folders:', Object.keys($selectedFolderIDs));
	}}
	on:focus={() => (isFocused = true)}
	on:blur={() => (isFocused = false)}
	tabindex="0"
>
	{#if isLoading}
		<p>Loading folders...</p>
	{:else}
		<FolderTree folderId={'00000000-0000-0000-0000-000000000000'} level={0} />
	{/if}
</div>

<style>
	.leftbar {
		height: 100%;
	}
</style>
