/*
 * @Author: Ilikara 3435193369@qq.com
 * @Date: 2025-02-03 13:00:47
 * @LastEditors: Ilikara 3435193369@qq.com
 * @LastEditTime: 2025-02-03 16:10:57
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

/**
 * 为指定项目添加文件夹关联
 * @param itemIds 需要关联文件夹的项目ID数组
 * @param folderId 目标文件夹ID
 * @throws 如果请求失败或服务器返回错误，抛出异常
 */
export const addFolderForItems = async ({
    itemIds,
    folderId
}: {
    itemIds: string[];
    folderId: string;
}) => {
    try {
        const address = get(serverAddress);
        const authToken = get(token);

        if (!address || !authToken) {
            throw new Error('Server address or token is missing');
        }

        const body = JSON.stringify({
            itemIds,
            folderId,
        });

        const response = await fetch(`${address}/api/item/add-folder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${authToken}`,
            },
            body: body,
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
};

/**
 * 更新文件夹的父文件夹
 * @param folderIds 需要更新的文件夹ID数组
 * @param newParent 新的父文件夹ID
 * @throws 如果请求失败或服务器返回错误，抛出异常
 */
export const updateFoldersParent = async ({
    folderIds,
    newParent
}: {
    folderIds: string[];
    newParent: string;
}) => {
    try {
        const address = get(serverAddress);
        const authToken = get(token);

        if (!address || !authToken) {
            throw new Error('Server address or token is missing');
        }

        const body = JSON.stringify({
            folderIds,
            newParent,
        });

        const response = await fetch(`${address}/api/folder/updateParent/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${authToken}`,
            },
            body: body,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update folder parent');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating folder parent:', error);
        throw error;
    }
};

/**
 * 从后端获取文件夹数据
 * @param parent 父文件夹ID（可选，用于获取指定父文件夹下的子文件夹）
 * @returns 文件夹列表
 */
export const fetchFolders = async ({
    parent
}: {
    parent?: string;
} = {}) => {
    try {
        const address = get(serverAddress);
        const authToken = get(token);

        if (!address || !authToken) {
            throw new Error('Server address or token is missing');
        }

        const body = JSON.stringify({
            parent,
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
            subFolders: folder.subFolders ? folder.subFolders : [],
            modifiedAt: folder.modifiedAt,
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
