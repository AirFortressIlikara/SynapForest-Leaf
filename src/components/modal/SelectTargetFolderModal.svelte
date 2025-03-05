<!--
  Author: Ilikara 3435193369@qq.com
  Date: 2025-02-10 15:07:07
  LastEditors: ilikara 3435193369@qq.com
  LastEditTime: 2025-03-05 13:16:27
  FilePath: /SynapForest/src/components/modal/SelectTargetFolderModal.svelte
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
	import { writable } from 'svelte/store';
	import FolderTree from '../FolderTree.svelte';

	export let onConfirm: (targetFolderIds: string[]) => void;
	export let onClose: () => void;
	export let maxSelectCount: number | null = null;

	const selectedFolderIDs = writable<Record<string, boolean>>({});
	const selectedItemIDs = writable<Record<string, boolean>>({});

	let targetFolderIds: string[] = [];
</script>

<div>
	<p class="modal-title">Select Target Folder:</p>
	<FolderTree
		{selectedFolderIDs}
		{selectedItemIDs}
		folderId={'00000000-0000-0000-0000-000000000000'}
		level={0}
	/>
	<div class="modal-actions">
		<button
			class="modal-button primary"
			on:click={() => {
				const selectedIds = Object.keys($selectedFolderIDs);

				if (maxSelectCount === null) {
					targetFolderIds = selectedIds;
				} else {
					targetFolderIds = selectedIds.slice(0, maxSelectCount);
				}

				onConfirm(targetFolderIds);
			}}
			disabled={Object.keys($selectedFolderIDs).length === 0}
		>
			Confirm
		</button>
		<button class="modal-button secondary" on:click={onClose}>Cancel</button>
	</div>
</div>
