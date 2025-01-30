<!--
  Author: Ilikara 3435193369@qq.com
  Date: 2025-01-20 13:51:35
  LastEditors: Ilikara 3435193369@qq.com
  LastEditTime: 2025-01-30 16:10:53
  FilePath: /SynapForest/src/components/ResizableSidebar.svelte
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
	export let width = 300;
	export let isRight = false;
	let isResizing = false;
	let startX = 0;
	let startWidth = 0;

	function startResize(event: MouseEvent) {
		isResizing = true;
		startX = event.clientX;
		startWidth = width;
		window.addEventListener('mousemove', onMouseMove);
		window.addEventListener('mouseup', stopResize);
	}

	function onMouseMove(event: MouseEvent) {
		if (isResizing) {
			const deltaX = event.clientX - startX;
			if (isRight) {
				width = startWidth - deltaX;
			} else {
				width = startWidth + deltaX;
			}
		}
	}

	function stopResize() {
		isResizing = false;
		window.removeEventListener('mousemove', onMouseMove);
		window.removeEventListener('mouseup', stopResize);
	}
</script>

<div class="sidebar" style="width: {width}px;">
	<slot />
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="resizer {isRight ? 'right' : ''}" on:mousedown={startResize}></div>
</div>

<style>
	.sidebar {
		height: 100%;
		background-color: #e0e0e0;
		position: relative;
	}

	.resizer {
		width: 0.25vw;
		height: 100%;
		background-color: #ccc;
		position: absolute;
		top: 0;
		cursor: ew-resize;
	}

	.resizer:not(.right) {
		right: 0;
	}

	.resizer.right {
		left: 0;
	}
</style>
