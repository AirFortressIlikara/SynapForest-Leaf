/*
 * @Author: Ilikara 3435193369@qq.com
 * @Date: 2025-01-20 16:28:38
 * @LastEditors: Ilikara 3435193369@qq.com
 * @LastEditTime: 2025-02-03 16:25:43
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
import { derived, writable } from 'svelte/store';
import type { Folder, Item, Tag } from './type';
import { fetchItems } from './api/index';

export const isDeleted = writable<boolean>(false);

export const itemsPerRow = writable<number>(3);

export const serverAddress = writable<string>('http://127.0.0.1:41595');
export const token = writable<string>('TEST123123');

export const folders = writable<Record<string, Folder>>({
    "00000000-0000-0000-0000-000000000000": {
        id: "00000000-0000-0000-0000-000000000000",
        name: "root",
        description: "",
        items: [],
        parent: "",
        subFolders: [],
        modifiedAt: new Date(),
        tags: [],
        isExpand: true,
    }
});
export const tags = writable<Record<string, Tag>>({});
export const items = writable<Record<string, Item>>({});

export const selectedFolderIDs = writable<Record<string, boolean>>({});
export const selectedItemIDs = writable<Record<string, boolean>>({});

export const sortOrder = writable<'asc' | 'desc'>('asc');

export const sortedIds = derived(
    [items, sortOrder],
    ([$items, $sortOrder], set) => {
        const itemsArray = Object.values($items);

        const sorted = itemsArray.sort();

        const ids = sorted.map((item) => item.id);
        set(ids);
        console.log('Sorted ItemIDs:', ids);
    },
    [] as string[]
);

export const itemTrigger = writable<boolean>(false);

const fetchedItems = derived(
    [selectedFolderIDs, itemTrigger, isDeleted],
    ([$selectedFolderIDs, $itemTrigger, $isDeleted], set) => {
        const folderIds = Object.keys($selectedFolderIDs);

        fetchItems({ folderIds, isDeleted: $isDeleted })
            .then((data) => {
                set(data);
            })
            .catch((error) => {
                console.error('Failed to fetch items:', error);
            });
    },
    [] as Item[]
);

fetchedItems.subscribe((value) => {
    let itemsRecord: Record<string, Item> = {};
    itemsRecord = value.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
    }, {} as Record<string, Item>);

    items.set(itemsRecord);
    console.log('Update Items:', itemsRecord);
});

export const menuX = writable<number>(0);
export const menuY = writable<number>(0);
export const showMenu = writable<boolean>(false);
export const menuType = writable<string>("");