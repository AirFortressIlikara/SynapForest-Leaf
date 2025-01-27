<!--
  Author: Ilikara 3435193369@qq.com
  Date: 2025-01-27 21:14:54
  LastEditors: Ilikara 3435193369@qq.com
  LastEditTime: 2025-01-27 21:19:53
  FilePath: /SynapForest/src/components/AuthImg.svelte
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
	import { onMount } from 'svelte';
	import { token } from './stores';

	export let src: string;
	export let alt: string;
	export let style: string = '';

	let imageUrl: string | null = null;

	async function fetchImage() {
		try {
			const response = await fetch(src, {
				method: 'GET',
				headers: {
					Authorization: `${$token}`
				}
			});

			if (response.ok) {
				const blob = await response.blob();
				imageUrl = URL.createObjectURL(blob);
			} else {
				console.error('Failed to fetch image:', response.statusText);
			}
		} catch (error) {
			console.error('Error fetching image:', error);
		}
	}

	onMount(() => {
		fetchImage();
	});
</script>

<img {alt} src={imageUrl} {style} />
