<!--
  Author: Ilikara 3435193369@qq.com
  Date: 2025-02-01 19:38:24
  LastEditors: Ilikara 3435193369@qq.com
  LastEditTime: 2025-02-10 19:57:45
  FilePath: /SynapForest/src/components/ContextMenu.svelte
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
	import {
		isDeleted,
		menuType,
		menuX,
		menuY,
		showMenu,
		selectedItemIDs,
		selectedFolderIDs,
		folders,
		currentModal,
		modalProps
	} from './stores';
	import { closeModal, deleteSelectedItems, showDeleteConfirmationModal, updateFolderTree } from './utils';
	import SelectTargetFolderModal from './modal/SelectTargetFolderModal.svelte';
	import { createFolder } from './api';

	const menuItemsMap: Record<string, { label: string; action: () => void }[]> = {
		Folder: [
			{
				label: '删除',
				action: () => {
					showDeleteConfirmationModal();
				}
			},
			{
				label: '展开/收起',
				action: () => {
					folders.update((folders) => {
						for (const folderId of Object.keys($selectedFolderIDs)) {
							folders[folderId].isExpand = !folders[folderId].isExpand;
						}
						return folders;
					});
				}
			},
			{
				label: '移动至',
				action: () => {
					currentModal.set(SelectTargetFolderModal);
					modalProps.set({
						onConfirm: (targetFolderId: string) => {}, // 传递确认回调
						onClose: closeModal, // 传递关闭回调
						maxSelectCount: 1
					});
				}
			},
			{
				label: '新建子文件夹',
				action: () => {
					console.log('clicked');
					createFolder({ folderName: 'OvO', parent: Object.keys($selectedFolderIDs)[0] });
					setTimeout(() => updateFolderTree(), 10);
				}
			},
			{
				label: '在同级目录新建文件夹',
				action: () => {
					console.log('clicked');
					const parent = $folders[Object.keys($selectedFolderIDs)[0]].parent;
					createFolder({ folderName: 'OvO', parent });
					setTimeout(() => updateFolderTree(), 10);
				}
			}
		],
		Item: [
			{
				label: '删除',
				action: () => {
					deleteSelectedItems({ itemIds: Object.keys($selectedItemIDs), hardDelete: $isDeleted });
				}
			},
			{
				label: '移动至',
				action: () => {
					currentModal.set(SelectTargetFolderModal);
					modalProps.set({
						onConfirm: (targetFolderId: string) => {}, // 传递确认回调
						onClose: closeModal, // 传递关闭回调
						maxSelectCount: null
					});
				}
			}
		]
	};

	let items: { label: string; action: () => void }[] = menuItemsMap[$menuType];

	let menuElement: HTMLDivElement;

	$: style = `position: absolute; left: ${$menuX}px; top: ${$menuY}px;`;

	onMount(() => {
		menuElement.focus(); // 自动聚焦
	});

	function handleItemClick(action: () => void) {
		action();
		closeMenu();
	}

	function closeMenu() {
		showMenu.set(false);
	}
</script>

<div bind:this={menuElement} {style} class="context-menu" tabindex="-1" on:blur={closeMenu}>
	<div>坐标: X:{$menuX} Y:{$menuY}</div>
	<div>类型: {$menuType}</div>
	{#each items as item}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div on:click={() => handleItemClick(item.action)} class="menu-item">
			{item.label}
		</div>
	{/each}
</div>

<style>
	.context-menu {
		background: white;
		border: 1px solid #ccc;
		box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
		z-index: 1000;
		outline: none; /* 移除聚焦时的默认轮廓 */
	}

	.menu-item {
		padding: 8px 16px;
		cursor: pointer;
	}

	.menu-item:hover {
		background: #f0f0f0;
	}
</style>
