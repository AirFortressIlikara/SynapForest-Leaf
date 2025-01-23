<!--
  Author: Ilikara 3435193369@qq.com
  Date: 2025-01-21 21:39:59
  LastEditors: Ilikara 3435193369@qq.com
  LastEditTime: 2025-01-23 15:14:55
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
	import { onDestroy } from 'svelte';
	import FolderTree from './FolderTree.svelte';
	import { folders, selectedFolders } from './stores';
	import { browser } from '$app/environment';
	import { get } from 'svelte/store';

	if (browser) {
		function handleSelectAll(event: KeyboardEvent) {
			if (event.ctrlKey && event.key === 'a') {
				event.preventDefault();
				selectedFolders.update(() =>
					Object.keys($folders).reduce(
						(acc, folderID) => {
							acc[folderID] = true;
							return acc;
						},
						{} as Record<string, boolean>
					)
				);
				console.log('Selected folders:', Object.keys($selectedFolders));
			}
		}

		document.addEventListener('keydown', handleSelectAll);

		onDestroy(() => {
			document.removeEventListener('keydown', handleSelectAll);
		});
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="leftbar"
	on:click={(event) => {
		event.stopPropagation();
		$selectedFolders = {};
		console.log('Selected folders:', Object.keys($selectedFolders));
	}}
>
	<FolderTree folderId={'00000000-0000-0000-0000-000000000000'} />
</div>

<style>
	.leftbar {
		height: 100%;
	}
</style>
