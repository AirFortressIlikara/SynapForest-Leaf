<!--
  Author: Ilikara 3435193369@qq.com
  Date: 2025-01-25 17:32:44
  LastEditors: Ilikara 3435193369@qq.com
  LastEditTime: 2025-01-25 18:01:23
  FilePath: /SynapForest/src/components/Slider.svelte
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
	import { onMount, onDestroy } from 'svelte';

	export let value: number;
	export let min: number = 0;
	export let max: number = 100;
	export let step: number = 1;
	export let style_class: string = '';

	let slider: HTMLElement;
	let isDragging: boolean = false;

	const alignToStep = (value: number): number => {
		return Math.round((value - min) / step) * step + min;
	};

	const getPercentage = (clientX: number): number => {
		const rect = slider.getBoundingClientRect();
		const offsetX = clientX - rect.left;
		const percentage = (offsetX / rect.width) * 100;
		return Math.min(Math.max(percentage, 0), 100);
	};

	const handleMouseDown = (event: MouseEvent) => {
		isDragging = true;
		const newValue = (getPercentage(event.clientX) / 100) * (max - min) + min;
		value = alignToStep(newValue);
	};

	const handleMouseMove = (event: MouseEvent) => {
		if (isDragging) {
			const newValue = (getPercentage(event.clientX) / 100) * (max - min) + min;
			value = alignToStep(newValue);
		}
	};

	const handleMouseUp = () => {
		isDragging = false;
	};

	onMount(() => {
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseup', handleMouseUp);
	});

	onDestroy(() => {
		window.removeEventListener('mousemove', handleMouseMove);
		window.removeEventListener('mouseup', handleMouseUp);
	});
</script>

<div class="slider {style_class}" bind:this={slider} on:mousedown={handleMouseDown}>
	<div class="slider-thumb" style="left: {((value - min) / (max - min)) * 100}%;"></div>
</div>

<style>
	.slider {
		position: relative;
		width: 100%;
		height: 10px;
		background-color: #ddd;
		border-radius: 5px;
		cursor: pointer;
        margin: 10px;
	}

	.slider-thumb {
		position: absolute;
		top: 50%;
		width: 20px;
		height: 20px;
		background-color: #0078d4;
		border-radius: 50%;
		cursor: grab;
		transform: translate(-50%, -50%);
	}
</style>
