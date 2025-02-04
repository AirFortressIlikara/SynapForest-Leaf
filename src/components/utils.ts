/*
 * @Author: Ilikara 3435193369@qq.com
 * @Date: 2025-02-04 19:13:07
 * @LastEditors: Ilikara 3435193369@qq.com
 * @LastEditTime: 2025-02-04 19:23:06
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
import { isDeleted, itemTrigger, selectedItemIDs } from "./stores";
import { delItems } from "./api";

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
