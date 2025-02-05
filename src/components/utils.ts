/*
 * @Author: Ilikara 3435193369@qq.com
 * @Date: 2025-02-04 19:13:07
 * @LastEditors: Ilikara 3435193369@qq.com
 * @LastEditTime: 2025-02-05 21:22:10
 * @FilePath: /SynapForest/src/components/utils.ts
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
import { get } from "svelte/store";
import { folders, itemTrigger, selectedFolderIDs, selectedItemIDs } from "./stores";
import { delFolder, delItems, fetchFolders } from "./api";
import type { Folder } from "./type";

/**
 * 删除选定的项目
 * @param itemIds 需要删除的项目ID数组
 * @throws 如果删除过程中发生错误，抛出异常
 */
export const deleteSelectedItems = async ({
    itemIds,
    hardDelete
}: {
    itemIds: string[];
    hardDelete: boolean;
}) => {
    try {
        delItems({ itemIds, hardDelete });
    } catch (error) {
        console.error('Error deleting files:', error);
        throw error;
    } finally {
        console.log('Deleted items:', itemIds);
        selectedItemIDs.set({});
        setTimeout(() => itemTrigger.set(!get(itemTrigger)), 10);
    }
};

/**
 * 删除选定的文件夹
 * @param folderId 需要删除的文件夹ID
 * @throws 如果删除过程中发生错误，抛出异常
 */
export const deleteSelectedFolders = async ({
    folderId,
    deleteItems
}: {
    folderId: string;
    deleteItems: boolean;
}) => {
    try {
        delFolder({ folderId, deleteItems });
    } catch (error) {
        console.error('Error deleting folders:', error);
        throw error;
    } finally {
        console.log('Deleted folders:', folderId);
        selectedFolderIDs.set({});
        setTimeout(() => updateFolderTree(), 10);
    }
};

/**
 * 更新所有文件夹
 * @throws 如果更新过程中发生错误，抛出异常
 */
export const updateFolderTree = async () => {
    try {
        const fetchedFolders = await fetchFolders({});

        const foldersMap: Record<string, Folder> = {};
        fetchedFolders.forEach((folder) => {
            foldersMap[folder.id] = folder;
        });

        folders.set(foldersMap);
    } catch (error) {
        console.error('Error preparing folders:', error);
        throw error;
    } finally {
    }
}
