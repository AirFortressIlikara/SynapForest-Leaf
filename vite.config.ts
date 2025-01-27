/*
 * @Author: Ilikara 3435193369@qq.com
 * @Date: 2025-01-20 21:02:23
 * @LastEditors: Ilikara 3435193369@qq.com
 * @LastEditTime: 2025-01-27 22:04:01
 * @FilePath: /SynapForest/vite.config.ts
 * @Description: 
 * 
 * Copyright (c) 2025 AirFortressIlikara
 * SynapForest is licensed under Mulan PubL v2.
 * You can use this software according to the terms and conditions of the Mulan PubL v2.
 * You may obtain a copy of Mulan PubL v2 at:
 *          http://license.coscl.org.cn/MulanPubL-2.0
 * THIS SOFTWARE IS PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTIES OF ANY KIND,
 * EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO NON-INFRINGEMENT,
 * MERCHANTABILITY OR FIT FOR A PARTICULAR PURPOSE.
 * See the Mulan PubL v2 for more details.
 */
import { paraglide } from '@inlang/paraglide-sveltekit/vite';
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { serverAddress, token } from './src/components/stores';
import { get } from 'svelte/store';

export default defineConfig({
	plugins: [
		sveltekit(),
		paraglide({
			project: './project.inlang',
			outdir: './src/lib/paraglide'
		})
	],
	// server: {
	// 	host: '0.0.0.0',
	// 	proxy: {
	// 		'raw_files': {
	// 			target: get(serverAddress),
	// 			changeOrigin: true,
	// 			secure: false,
	// 			headers: {
	// 				Authorization: get(token),
	// 			},
	// 		},
	// 	}
	// },
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
