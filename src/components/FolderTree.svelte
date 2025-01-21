<!--
  Author: Ilikara 3435193369@qq.com
  Date: 2025-01-20 16:39:14
  LastEditors: Ilikara 3435193369@qq.com
  LastEditTime: 2025-01-20 21:57:19
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
	import { get } from 'svelte/store';
	import { folders } from './stores';

	export let folderId: string | null = null;
	export let level: number = 0;

	$: folder = folderId ? $folders[folderId] : null;

	$: subFolders = folder?.subFolders.map((id) => $folders[id]) ?? [];
</script>

{#if folder}
	<div class="folder">
		<div class="folder-name">
			<button type="button" on:click={() => (folder.isExpand = !folder.isExpand)}>
				{folder.isExpand ? '📂' : '📁'}
			</button>
			{folder.name}
		</div>
		{#if folder.isExpand}
			<div class="sub-folders">
				{#each subFolders as subFolder}
					<svelte:self folderId={subFolder.id} level={level + 1} />
				{/each}
			</div>
		{/if}
	</div>
{:else}
	{#each Object.values(get(folders)).filter((f) => !f.parent) as rootFolder}
		<svelte:self folderId={rootFolder.id} {level} />
	{/each}
{/if}

<style>
	.folder {
		margin-left: 20px;
		cursor: pointer;
	}
	.folder-name {
		font-weight: bold;
	}
	.sub-folders {
		margin-left: 20px;
	}
</style>
