<!--
  Author: Ilikara 3435193369@qq.com
  Date: 2025-01-20 13:51:16
  LastEditors: Ilikara 3435193369@qq.com
  LastEditTime: 2025-01-30 16:28:42
  FilePath: /SynapForest/src/components/Toolbar.svelte
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
<script>
	import Slider from './Slider.svelte';
	import { isDeleted, itemsPerRow } from './stores';
</script>

<div class="toolbar">
	<div class="slider">
		<Slider bind:value={$itemsPerRow} min={1} max={7} />
	</div>
	<label class="checkbox">
		<input type="checkbox" bind:checked={$isDeleted} />
		回收站
	</label>
</div>

<style>
	.toolbar {
		height: 50px;
		background-color: #d0d0d0;
		color: white;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 0 10px;
	}
	.slider {
		width: 20vh;
		max-width: 40%;
	}
	.checkbox {
		margin-left: 20px;
		color: black; /* 为了在白色背景上显示文字 */
	}
</style>
