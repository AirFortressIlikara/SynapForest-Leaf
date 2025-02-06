<!--
  Author: Ilikara 3435193369@qq.com
  Date: 2025-02-06 18:51:59
  LastEditors: Ilikara 3435193369@qq.com
  LastEditTime: 2025-02-06 21:05:46
  FilePath: /SynapForest/src/components/modal/FolderDeleteConfirmModal.svelte
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
	export let onConfirm: (deleteItems: boolean) => void;
	export let onClose: () => void;

	let deleteItems = false; // 勾选框的状态
</script>

<div>
	<p>Are you sure you want to delete items in folder?</p>
	<label>
		<input type="checkbox" bind:checked={deleteItems} />
		Delete permanently
	</label>
	<div>
		<button on:click={() => onConfirm(deleteItems)}>Confirm</button>
		<button on:click={onClose}>Cancel</button>
	</div>
</div>
