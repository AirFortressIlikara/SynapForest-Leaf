<!--
  Author: Ilikara 3435193369@qq.com
  Date: 2025-01-20 16:39:14
  LastEditors: Ilikara 3435193369@qq.com
  LastEditTime: 2025-02-10 19:33:51
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
	import {
		folders,
		itemTrigger,
		menuType,
		menuX,
		menuY,
		selectedItemIDs,
		showMenu
	} from './stores';
	import { addFolderForItems, updateFoldersParent, uploadFiles } from './api/index';
	import { type Writable } from 'svelte/store';

	export let selectedFolderIDs: Writable<Record<string, boolean>>;
	export let folderId: string;
	export let level: number = 0;

	$: folder = $folders[folderId];
	$: subFolderIDs = folder?.subFolders ?? [];

	console.log('Rendering folder id: ', folderId);

	function handleFolderClick(event: MouseEvent, folderId: string) {
		selectedFolderIDs.update(($selectedFolderIDs) => {
			let newselectedFolderIDs = { ...$selectedFolderIDs };
			if (event.ctrlKey) {
				if (newselectedFolderIDs[folderId]) {
					selectedItemIDs.set({});
					delete newselectedFolderIDs[folderId];
				} else {
					if (Object.keys(newselectedFolderIDs).length === 0) {
						selectedItemIDs.set({});
					}
					newselectedFolderIDs[folderId] = true;
				}
			} else {
				selectedItemIDs.set({});
				newselectedFolderIDs = { [folderId]: true };
			}
			return newselectedFolderIDs;
		});
		console.log('Selected folders:', Object.keys($selectedFolderIDs));
	}

	function handleDragStart(event: DragEvent, item: any) {
		event.dataTransfer?.setData('application/from_folder', JSON.stringify(item));
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
	}

	async function handleDrop(event: DragEvent) {
		event.preventDefault();

		console.log('Drag drop detected:', event.dataTransfer?.types);
		if (event.dataTransfer?.types.includes('application/from_item')) {
			const internalData = event.dataTransfer.getData('application/from_item');
			const item = JSON.parse(internalData);
			console.log(
				'Item to Folder Detected: ',
				item,
				'Items to drag: ',
				Object.keys($selectedItemIDs)
			);
			try {
				addFolderForItems({ itemIds: Object.keys($selectedItemIDs), folderId });
			} catch (error) {
				console.error('Error addFolderForItems:', error);
			} finally {
			}
		} else if (event.dataTransfer?.types.includes('application/from_folder')) {
			const internalData = event.dataTransfer.getData('application/from_folder');
			const item = JSON.parse(internalData);
			console.log(
				'Folder to Folder Detected:',
				item,
				'Folders to drag: ',
				Object.keys($selectedFolderIDs)
			);
			updateFoldersParent({ folderIds: Object.keys($selectedFolderIDs), newParent: folderId });
		} else if (event.dataTransfer?.types.includes('Files')) {
			const files = event.dataTransfer?.files;
			if (files && files.length > 0) {
				console.log('Files to Folder Detected: ', files.length, 'files');
				try {
					const result = await uploadFiles({ files: Array.from(files), folderIds: [folderId] });
					console.log('Upload result:', result);
				} catch (error) {
					console.error('Error uploading files:', error);
				} finally {
					itemTrigger.set(!$itemTrigger);
				}
			}
		}
	}
</script>

{#if level > 0}
	<div class="folder">
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="folder-name {folderId in $selectedFolderIDs ? 'selected' : ''}"
			on:click={(event) => {
				event.stopPropagation();
				handleFolderClick(event, folderId);
			}}
			on:dragstart={(event) => {
				if (!(folderId in $selectedFolderIDs)) {
					handleFolderClick(event, folderId);
				}
				handleFolderClick(event, folderId);
				handleDragStart(event, { id: 1, name: 'Internal Item' });
			}}
			on:dragover={handleDragOver}
			on:drop={handleDrop}
			draggable="true"
			on:contextmenu={(event) => {
				event.stopPropagation();
				event.preventDefault();
				if (!(folderId in $selectedFolderIDs)) {
					handleFolderClick(event, folderId);
				}
				menuX.set(event.clientX);
				menuY.set(event.clientY);
				menuType.set('Folder');
				showMenu.set(true);
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
					<svelte:self {selectedFolderIDs} folderId={subFolderID} level={level + 1} />
				{/each}
			</div>
		{/if}
	</div>
{:else}
	{#each subFolderIDs as subFolderID}
		<svelte:self {selectedFolderIDs} folderId={subFolderID} level={level + 1} />
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
