/*
 * @Author: Ilikara 3435193369@qq.com
 * @Date: 2025-01-20 16:33:58
 * @LastEditors: Ilikara 3435193369@qq.com
 * @LastEditTime: 2025-01-20 21:25:25
 * @FilePath: /SynapForest/src/components/type.ts
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
export interface Folder {
    id: string;
    name: string;
    description: string;
    items: string[];
    parent: string;
    subFolders: string[];
    modifiedAt: Date;
    tags: string[];
    isExpand: boolean;
}

export type Tag = Folder;

export interface Item {
    id: string;
    createdAt: Date;
    importedAt: Date;
    modifiedAt: Date;
    deletedAt: Date | null;

    name: string;
    ext: string;

    width: number;
    height: number;
    size: number;

    url: string;
    annotation: string;

    tagIds: string[];
    folderIds: string[];

    star: number;

    haveThumbnail: boolean;
    havePreview: boolean;
}