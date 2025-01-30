/*
 * @Author: Ilikara 3435193369@qq.com
 * @Date: 2025-01-21 15:53:18
 * @LastEditors: Ilikara 3435193369@qq.com
 * @LastEditTime: 2025-01-30 16:08:39
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
import type { Folder, Item } from './type';

export const delItems = async (params = {}) => {
    try {
        const address = get(serverAddress);
        const authToken = get(token);

        if (!address || !authToken) {
            throw new Error('Server address or token is missing');
        }

        const body = JSON.stringify({
            ...params,
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

/**
 * 从后端获取项目数据
 * @param params 请求参数
 * @returns 项目列表
 */
export const fetchItems = async (params = {}) => {
    try {
        const address = get(serverAddress);
        const authToken = get(token);

        if (!address || !authToken) {
            throw new Error('Server address or token is missing');
        }

        const body = JSON.stringify({
            ...params,
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

        const items: Item[] = result.data?.map((item: Item) => ({
            id: item.id,
            created_at: item.created_at,
            imported_at: item.imported_at,
            modified_at: item.modified_at,
            deleted_at: item.deleted_at,

            name: item.name,
            ext: item.ext,

            width: item.width,
            height: item.height,
            size: item.size,

            url: item.url,
            annotation: item.annotation,

            tag_ids: item.tag_ids ? item.tag_ids : [],
            folder_ids: item.folder_ids ? item.folder_ids : [],
            star: item.star,

            have_thumbnail: item.have_thumbnail,
            have_preview: item.have_preview,

            preview_url: item.ext == "gif" ? `${address}/public/raw_files/${item.id}` : item.have_thumbnail ? `${address}/public/previews/${item.id}` : '',
            thumbnail_url: item.ext == "gif" ? `${address}/public/raw_files/${item.id}` : item.have_thumbnail ? `${address}/public/thumbnails/${item.id}` : '',
            raw_url: `${address}/public/raw_files/${item.id}`,
        })) || []

        console.log('Fetched items:', items);

        return items;
    } catch (error) {
        console.error('Error fetching folders:', error);
        return [];
    }
};

/**
 * 上传文件到服务器
 * @param files 要上传的文件列表
 * @param folder_ids 文件所属的文件夹ID列表
 * @returns 上传结果
 */
export const uploadFiles = async (files: File[], folder_ids: string[]) => {
    try {
        // 上传文件到服务器
        const uploadResult = await uploadFilesToServer(files);
        console.log('Files uploaded:', uploadResult);

        // 将文件路径添加到数据库
        const addPathsResult = await addFilesFromPaths(
            files.map((file) => file.name),
            folder_ids
        );
        console.log('Paths added to database:', addPathsResult);

        return { uploadResult, addPathsResult };
    } catch (error) {
        console.error('Error during file upload and processing:', error);
        throw error;
    }
};

/**
 * 上传文件到服务器的逻辑
 * @param files 要上传的文件列表
 * @returns 上传结果
 */
const uploadFilesToServer = async (files: File[]) => {
    const address = get(serverAddress);
    const authToken = get(token);
    // todo: Auth
    if (!address || !authToken) {
        throw new Error('Server address or token is missing');
    }

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    const response = await fetch(`${address}/api/uploadfiles`, {
        method: 'POST',
        headers: {
            Authorization: `${authToken}`,
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to upload files');
    }

    return response.json();
};

/**
 * 将文件路径添加到数据库的逻辑
 * @param fileNames 文件名列表
 * @param folder_ids 文件所属的文件夹ID列表
 * @returns 添加结果
 */
const addFilesFromPaths = async (fileNames: string[], folder_ids: string[]) => {
    const address = get(serverAddress);
    const authToken = get(token);

    if (!address || !authToken) {
        throw new Error('Server address or token is missing');
    }

    const response = await fetch(`${address}/api/item/addFromPaths`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${authToken}`,
        },
        body: JSON.stringify({
            file_names: fileNames,
            folder_ids: folder_ids,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to add files from paths');
    }

    return response.json();
};
