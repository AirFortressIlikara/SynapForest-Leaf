<!--
  Author: ilikara 3435193369@qq.com
  Date: 2025-03-05 11:45:56
  LastEditors: ilikara 3435193369@qq.com
  LastEditTime: 2025-03-05 13:13:21
  FilePath: /SynapForest-Leaf/src/components/modal/RenameModal.svelte
  Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE

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
	export let onConfirm: (newName: string) => void;
	export let onClose: () => void;

	let editedName: string; // 勾选框的状态
</script>

<div>
	<p class="modal-title">Type the new name</p>
	<input
		type="text"
		bind:value={editedName}
		style="text-align: center; width: 100%; padding: 4px; border: 1px solid #ccc; border-radius: 4px;"
	/>
	<div class="modal-actions">
		<button class="modal-button primary" on:click={() => onConfirm(editedName)}>Confirm</button>
		<button class="modal-button secondary" on:click={onClose}>Cancel</button>
	</div>
</div>
