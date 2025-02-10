<!--
  Author: Ilikara 3435193369@qq.com
  Date: 2025-02-10 15:07:07
  LastEditors: Ilikara 3435193369@qq.com
  LastEditTime: 2025-02-10 15:41:53
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
	export let onConfirm: (deleteItems: string) => void;
	export let onClose: () => void;

	let targetFolderId: string | null = null;
</script>

<div>
	<p>这里放一个文件夹树供选择</p>
	<div>
		<button
			on:click={() => {
				if (targetFolderId !== null) {
					onConfirm(targetFolderId);
				}
			}}
			disabled={targetFolderId === null}
		>
			Confirm
		</button>
		<button on:click={onClose}>Cancel</button>
	</div>
</div>
