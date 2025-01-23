/*
 * @Author: Ilikara 3435193369@qq.com
 * @Date: 2025-01-20 21:02:52
 * @LastEditors: Ilikara 3435193369@qq.com
 * @LastEditTime: 2025-01-23 14:29:53
 * @FilePath: /SynapForest/src/hooks.server.ts
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
import type { Handle } from '@sveltejs/kit';
import { i18n } from '$lib/i18n';
const handleParaglide: Handle = i18n.handle();
export const handle: Handle = handleParaglide;
