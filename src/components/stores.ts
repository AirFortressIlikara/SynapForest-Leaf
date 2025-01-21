/*
 * @Author: Ilikara 3435193369@qq.com
 * @Date: 2025-01-20 16:28:38
 * @LastEditors: Ilikara 3435193369@qq.com
 * @LastEditTime: 2025-01-21 17:00:55
 * @FilePath: /SynapForest/src/components/stores.ts
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
import { writable } from 'svelte/store';
import type { Folder, Item, Tag } from './type';

// 创建一个 writable store 来存储 Folder 数组
export const folders = writable<Record<string, Folder>>({
    "00000000-0000-0000-0000-000000000000": {
        id: "00000000-0000-0000-0000-000000000000",
        name: "root",
        description: "",
        items: [],
        parent: "",
        sub_folders: [],
        modified_at: new Date(),
        tags: [],
        isExpand: true,
    }
});
export const tags = writable<Record<string, Tag>>({});
export const items = writable<Record<string, Item>>({});

export const selectedFolders = writable<Set<string>>(new Set());

export const serverAddress = writable<string>('http://127.0.0.1:41595'); // 默认值为空字符串
export const token = writable<string>('TEST123123'); // 默认值为空字符串
