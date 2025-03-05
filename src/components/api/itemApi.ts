/*
 * @Author: Ilikara 3435193369@qq.com
 * @Date: 2025-02-03 13:01:07
 * @LastEditors: ilikara 3435193369@qq.com
 * @LastEditTime: 2025-03-05 13:53:11
 * @FilePath: /SynapForest/src/components/api/itemApi.ts
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
import { items, serverAddress, token } from '../stores';
import type { Item } from '../type';

/**
 * 将指定项目移动到回收站或永久删除
 * @param itemIDs 需要删除的项目ID数组
 * @param hardDelete 是否永久删除（true 为永久删除，false 为移动到回收站）
 * @throws 如果请求失败或服务器返回错误，抛出异常
 */
export const delItems = async ({
    itemIds,
    hardDelete
}: {
    itemIds: string[];
    hardDelete: boolean;
}) => {
    try {
        const address = get(serverAddress);
        const authToken = get(token);

        if (!address || !authToken) {
            throw new Error('Server address or token is missing');
        }

        const body = JSON.stringify({
            itemIds,
            hardDelete,
        });

        const response = await fetch(`${address}/api/item/moveToTrash`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${authToken}`,
            },
            body: body,
        });

        if (!response.ok) {
            throw new Error('Failed to move items to trash');
        }

        const result = await response.json();

        if (result.status !== 'success') {
            throw new Error(result.message || 'Unknown error occurred');
        }

        return;
    } catch (error) {
        console.error('Error moving items to trash:', error);
        throw error;
    }
};

/**
 * 从后端获取项目数据
 * @param limit 每页显示的项目数量
 * @param offset 分页偏移量
 * @param orderBy 排序字段
 * @param exts 文件扩展名过滤
 * @param keyword 关键字搜索
 * @param tagIds 标签ID过滤
 * @param folderIds 文件夹ID过滤
 * @param isDeleted 是否显示已删除的项目
 * @returns 项目列表
 */
export const fetchItems = async ({
    limit,
    offset,
    orderBy,
    exts,
    keyword,
    tagIds,
    folderIds,
    isDeleted
}: {
    limit?: number;
    offset?: number;
    orderBy?: string;
    exts?: string[];
    keyword?: string;
    tagIds?: string[];
    folderIds?: string[];
    isDeleted?: boolean;
} = {}) => {
    try {
        const address = get(serverAddress);
        const authToken = get(token);

        if (!address || !authToken) {
            throw new Error('Server address or token is missing');
        }

        const body = JSON.stringify({
            limit,
            offset,
            orderBy,
            exts,
            keyword,
            tagIds,
            folderIds,
            isDeleted,
        });

        const response = await fetch(`${address}/api/item/list`, {
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

        const items: Item[] = result.data?.map((item: Item) => {
            const formattedItem: Item = {
                id: item.id,
                createdAt: item.createdAt,
                importedAt: item.importedAt,
                modifiedAt: item.modifiedAt,
                deletedAt: item.deletedAt,

                name: item.name,
                ext: item.ext,

                width: item.width,
                height: item.height,
                size: item.size,

                url: item.url,
                annotation: item.annotation,

                tagIds: item.tagIds ? (item.tagIds) : [],
                folderIds: item.folderIds ? (item.folderIds) : [],
                star: item.star,

                haveThumbnail: item.haveThumbnail,
                havePreview: item.havePreview,

                previewUrl: item.ext == "gif" ? `${address}/public/raw_files/${item.id}` : item.havePreview ? `${address}/public/previews/${item.id}` : '',
                thumbnailUrl: item.ext == "gif" ? `${address}/public/raw_files/${item.id}` : item.haveThumbnail ? `${address}/public/thumbnails/${item.id}` : '',
                rawUrl: `${address}/public/raw_files/${item.id}`,
            };
            return formattedItem;
        }) || [];

        console.log('Fetched items:', items);

        return items;
    } catch (error) {
        console.error('Error fetching folders:', error);
        return [];
    }
};

/**
 * 更新项目名称
 * @param newName 项目的新名称
 * @param itemId 项目的ID
 * @throws 如果请求失败或服务器返回错误，抛出异常
 */
export const updateItemName = async ({
    newName,
    itemId,
}: {
    newName: string;
    itemId: string;
}) => {
    try {
        const address = get(serverAddress);
        const authToken = get(token);

        if (!address || !authToken) {
            throw new Error('Server address or token is missing');
        }

        const body = JSON.stringify({
            name: newName,
            id: itemId,
        });

        const response = await fetch(`${address}/api/item/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${authToken}`,
            },
            body: body,
        });

        if (!response.ok) {
            throw new Error('Failed to update item name');
        }

        const result = await response.json();

        if (result.status !== 'success') {
            throw new Error(result.message || 'Unknown error occurred');
        }

        return result.data;
    } catch (error) {
        console.error('Error updating item name:', error);
        throw error;
    } finally {
        items.update(currentItems => {
            currentItems[itemId].name = newName;
            return currentItems;
        });
    }
};
