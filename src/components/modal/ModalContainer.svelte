<!--
  Author: Ilikara 3435193369@qq.com
  Date: 2025-02-06 19:31:46
  LastEditors: ilikara 3435193369@qq.com
  LastEditTime: 2025-03-05 13:14:42
  FilePath: /SynapForest/src/components/modal/ModalContainer.svelte
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
	import { currentModal, modalProps } from '../stores';
	import { closeModal } from '../utils';

	function handleClose() {
		closeModal();
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
{#if $currentModal}
	<div class="modal-overlay" on:click={handleClose}>
		<div class="modal-content" on:click|stopPropagation>
			<svelte:component this={$currentModal} {...$modalProps} onClose={handleClose} />
		</div>
	</div>
{/if}

<style>
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.modal-content {
		background-color: white;
		padding: 20px;
		border-radius: 8px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}

	.modal-content :global(.modal-title) {
		font-size: 1.5rem;
		font-weight: 600;
		color: #1a1a1a;
		margin-bottom: 1.5rem;
		border-bottom: 2px solid #eee;
		padding-bottom: 0.5rem;
	}

	.modal-content :global(.modal-actions) {
		display: flex;
		gap: 8px; /* 按钮间距 */
		width: 100%; /* 容器宽度根据父元素调整 */
	}

	.modal-content :global(.modal-button) {
		flex: 1; /* 关键属性：等分剩余空间 */
		padding: 0.5rem 1.25rem;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.2s ease;
		border: 1px solid transparent;
	}

	.modal-content :global(.modal-button.primary) {
		background-color: #4caf50;
		color: white;
	}

	.modal-content :global(.modal-button.primary:hover) {
		background-color: #45a049;
	}

	.modal-content :global(.modal-button.secondary) {
		background-color: #f0f0f0;
		color: #333;
		border-color: #ccc;
	}

	.modal-content :global(.modal-button.secondary:hover) {
		background-color: #e0e0e0;
	}
</style>
