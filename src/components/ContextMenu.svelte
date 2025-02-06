<!--
  Author: Ilikara 3435193369@qq.com
  Date: 2025-02-01 19:38:24
  LastEditors: Ilikara 3435193369@qq.com
  LastEditTime: 2025-02-06 21:08:24
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
		selectedFolderIDs
	} from './stores';
	import { deleteSelectedFolders, deleteSelectedItems, showDeleteConfirmationModal } from './utils';

	const menuItemsMap: Record<string, { label: string; action: () => void }[]> = {
		Folder: [
			{
				label: '删除',
				action: () => {
					console.log('Delete clicked');
					showDeleteConfirmationModal();
				}
			},
			{ label: '展开', action: () => console.log('Open clicked') },
			{ label: '移动至', action: () => console.log('MoveTo clicked') }
		],
		Item: [
			{
				label: '删除',
				action: () => {
					console.log('Delete clicked');
					deleteSelectedItems({ itemIds: Object.keys($selectedItemIDs), hardDelete: $isDeleted });
				}
			},
			{ label: '移动至', action: () => console.log('MoveTo clicked') }
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
