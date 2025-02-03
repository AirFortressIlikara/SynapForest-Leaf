/*
 * @Author: Ilikara 3435193369@qq.com
 * @Date: 2025-02-03 13:01:16
 * @LastEditors: Ilikara 3435193369@qq.com
 * @LastEditTime: 2025-02-03 16:23:37
 * @FilePath: /SynapForest/src/components/api/fileUploadApi.ts
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

/**
 * 上传文件到服务器
 * @param files 要上传的文件列表
 * @param folderIds 文件所属的文件夹ID列表
 * @returns 上传结果
 */
export const uploadFiles = async ({
    files,
    folderIds
}: {
    files: File[];
    folderIds: string[];
}) => {
    try {
        // 上传文件到服务器
        const uploadResult = await uploadFilesToServer({ files });
        console.log('Files uploaded:', uploadResult);

        // 将文件路径添加到数据库
        const addPathsResult = await addFilesFromPaths({
            fileNames: files.map((file) => file.name),
            folderIds,
        });
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
const uploadFilesToServer = async ({
    files
}: {
    files: File[];
}) => {
    const address = get(serverAddress);
    const authToken = get(token);

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
 * @param folderIds 文件所属的文件夹ID列表
 * @returns 添加结果
 */
const addFilesFromPaths = async ({
    fileNames,
    folderIds
}: {
    fileNames: string[];
    folderIds: string[];
}) => {
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
            fileNames,
            folderIds,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to add files from paths');
    }

    return response.json();
};
