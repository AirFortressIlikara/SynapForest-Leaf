<!--
  Author: Ilikara 3435193369@qq.com
  Date: 2025-01-21 21:39:59
  LastEditors: Ilikara 3435193369@qq.com
  LastEditTime: 2025-06-05 19:50:49
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
	import { ChevronDown, ChevronLeft, Plus } from '@lucide/svelte';
	import { onDestroy, onMount } from 'svelte';
	import FolderTree from './FolderTree.svelte';
	import {
		currentModal,
		folders,
		modalProps,
		quickAccessActive,
		selectedFolderIDs,
		selectedItemIDs
	} from './stores';
	import { browser } from '$app/environment';
	import { createFolder, fetchFolders } from './api';
	import type { Folder } from './type';
	import { closeModal, showDeleteConfirmationModal, updateFolderTree } from './utils';
	import RenameModal from './modal/RenameModal.svelte';

	let isLoading = false;
	let leftBarElement: HTMLElement;
	let isFocused = false;
	let isExpanded = true;

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
				showDeleteConfirmationModal();
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
	on:focus={() => (isFocused = true)}
	on:blur={() => (isFocused = false)}
	tabindex="0"
>
	{#if isLoading}
		<p>Loading folders...</p>
	{:else}
		<div class="quick-access-container">
			<button
				class="quick-access-button {$quickAccessActive === 'all' ? 'active' : ''}"
				on:click={() => {
					quickAccessActive.set('all');
					$selectedFolderIDs = {};
				}}
			>
				All Items
			</button>
			<button
				class="quick-access-button {$quickAccessActive === 'recent' ? 'active' : ''}"
				on:click={() => {
					quickAccessActive.set('recent');
					// WIP
				}}
			>
				Recent
			</button>
			<button
				class="quick-access-button {$quickAccessActive === 'starred' ? 'active' : ''}"
				on:click={() => {
					quickAccessActive.set('starred');
					// WIP
				}}
			>
				Starred
			</button>
		</div>

		<div class="folder-tree-container">
			<div class="folder-tree-header">
				<span>Folders</span>
				<button
					on:click={(event) => {
						event.stopPropagation();
						isExpanded = !isExpanded;
					}}
				>
					{#if isExpanded}
						<ChevronDown />
					{:else}
						<ChevronLeft />
					{/if}
				</button>
				<button
					on:click={(event) => {
						currentModal.set(RenameModal);
						modalProps.set({
							onConfirm: (newName: string) => {
								createFolder({
									folderName: newName
								});
								console.log('New Folder Name:', newName);
								closeModal();
								setTimeout(() => updateFolderTree(), 10);
							},
							onClose: closeModal,
							editedName: ""
						});
					}}
					class="add-button"
				>
					<Plus />
				</button>
			</div>
			{#if isExpanded}
				<FolderTree
					{selectedFolderIDs}
					{selectedItemIDs}
					folderId={'00000000-0000-0000-0000-000000000000'}
					level={0}
				/>
			{/if}
		</div>
	{/if}
</div>

<style>
	.leftbar {
		height: 100%;
	}
	.quick-access-container {
		/* 快速访问容器样式 */
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin: 8px 0;
	}

	.quick-access-button {
		/* 快速访问按钮样式 */
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			sans-serif;
		border-radius: 6px;
		background-color: #f8f9fa;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		padding: 12px;
		border: none;
		cursor: pointer;
		text-align: left;
		font-weight: 500;
		color: #212529;
		transition: all 0.2s ease;
	}

	.quick-access-button:hover {
		background-color: #e9ecef;
	}

	.quick-access-button.active {
		background-color: #e9ecef;
		box-shadow: inset 0 0 0 1px #dee2e6;
		font-weight: 600;
	}
	.folder-tree-container {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			sans-serif;
		border-radius: 6px;
		background-color: #f8f9fa;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		overflow: hidden;
		margin: 8px 0;
	}

	.folder-tree-header {
		display: flex;
		align-items: center;
		padding: 8px 12px;
		background-color: #e9ecef;
		border-bottom: 1px solid #dee2e6;
		cursor: pointer;
		user-select: none;
	}

	.folder-tree-header span {
		flex-grow: 1;
		margin-left: 8px;
		font-weight: 500;
		color: #212529;
	}

	.folder-tree-header button {
		display: flex;
		align-items: center;
		justify-content: center;
		background: none;
		border: none;
		cursor: pointer;
		padding: 4px;
		border-radius: 4px;
		color: #495057;
		transition: all 0.2s ease;
	}

	.folder-tree-header button:hover {
		background-color: #dee2e6;
		color: #212529;
	}

	.add-button {
		margin-left: auto;
	}

	/* 折叠/展开动画 */
	.folder-tree-container > :not(.folder-tree-header) {
		transition:
			opacity 0.15s ease,
			transform 0.15s ease;
	}

	.folder-tree-container:not(.expanded) > :not(.folder-tree-header) {
		opacity: 0;
		transform: translateY(-10px);
	}
</style>
