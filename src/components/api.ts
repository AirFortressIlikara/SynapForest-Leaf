/*
 * @Author: Ilikara 3435193369@qq.com
 * @Date: 2025-01-21 15:53:18
 * @LastEditors: Ilikara 3435193369@qq.com
 * @LastEditTime: 2025-01-21 16:57:48
 * @FilePath: /SynapForest/src/components/api.ts
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
import { get } from 'svelte/store';
import { serverAddress, token } from './stores';
import type { Folder } from './type';

/**
 * 从后端获取文件夹数据
 * @param params 请求参数
 * @returns 文件夹列表
 */
export const fetchFoldersFromBackend = async (params = {}) => {
    try {
        const address = get(serverAddress); // 从 store 中获取服务器地址
        const authToken = get(token); // 从 store 中获取 token

        if (!address || !authToken) {
            throw new Error('Server address or token is missing');
        }

        const body = JSON.stringify({
            ...params,
            token: authToken,
        });

        const response = await fetch(`${address}/api/folder/list`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: body,
        });

        if (!response.ok) {
            throw new Error('Failed to fetch folders');
        }

        const result = await response.json();

        if (result.status !== 'success') {
            throw new Error(result.message || 'Unknown error occurred');
        }

        // 将后端返回的数据转换为前端需要的格式
        const folders: Folder[] = result.data.map((folder: Folder) => ({
            id: folder.id,
            name: folder.name,
            description: folder.description,
            items: folder.items,
            parent: folder.parent,
            sub_folders: folder.sub_folders,
            modified_at: folder.modified_at,
            isExpanded: false, // 默认折叠
            isEditing: false, // 默认不在编辑状态
        }));

        console.log('Fetched folders:', folders);

        return folders;
    } catch (error) {
        console.error('Error fetching folders:', error);
        return []; // 返回空数组表示失败
    }
};
