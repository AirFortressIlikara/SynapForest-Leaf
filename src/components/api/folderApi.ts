/*
 * @Author: Ilikara 3435193369@qq.com
 * @Date: 2025-02-03 13:00:47
 * @LastEditors: Ilikara 3435193369@qq.com
 * @LastEditTime: 2025-02-03 13:42:03
 * @FilePath: /SynapForest/src/components/api/folderApi.ts
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
import { serverAddress, token } from '../stores';
import type { Folder } from '../type';

export const addFolderForItems = async (params = {}) => {
    try {
        const address = get(serverAddress);
        const authToken = get(token);

        if (!address || !authToken) {
            throw new Error('Server address or token is missing');
        }

        const body = JSON.stringify({
            ...params,
        });
        const response = await fetch(`${address}/api/item/add-folder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${authToken}`,
            },
            body: body
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add folder associations');
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding folder associations:', error);
        throw error;
    }
}

export const updateFoldersParent = async (folderIds: string[], newParent: string) => {
    try {
        const address = get(serverAddress);
        const authToken = get(token);

        if (!address || !authToken) {
            throw new Error('Server address or token is missing');
        }

        const body = JSON.stringify({
            folderIds: folderIds,
            newParent: newParent,
        });
        const response = await fetch(`${address}/api/folder/updateParent/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${authToken}`,
            },
            body: body
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add folder associations');
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding folder associations:', error);
        throw error;
    }
}

/**
 * 从后端获取文件夹数据
 * @param params 请求参数
 * @returns 文件夹列表
 */
export const fetchFolders = async (params = {}) => {
    try {
        const address = get(serverAddress);
        const authToken = get(token);

        if (!address || !authToken) {
            throw new Error('Server address or token is missing');
        }

        const body = JSON.stringify({
            ...params,
        });

        const response = await fetch(`${address}/api/folder/list`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${authToken}`,
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

        const folders: Folder[] = result.data.map((folder: Folder) => ({
            id: folder.id,
            name: folder.name,
            description: folder.description,
            items: folder.items ? folder.items : [],
            parent: folder.parent,
            sub_folders: folder.sub_folders ? folder.sub_folders : [],
            modified_at: folder.modified_at,
            tags: folder.tags ? folder.tags : [],
            isExpand: folder.isExpand,
        }));

        console.log('Fetched folders:', folders);

        return folders;
    } catch (error) {
        console.error('Error fetching folders:', error);
        return [];
    }
};
