<!--
  Author: Ilikara 3435193369@qq.com
  Date: 2025-01-20 13:51:35
  LastEditors: Ilikara 3435193369@qq.com
  LastEditTime: 2025-01-23 14:19:37
  FilePath: /SynapForest/src/components/ResizableSidebar.svelte
  Description: 
  
  Copyright (c) 2025 AirFortressIlikara
  SynapForest is licensed under Mulan PubL v2.
  You can use this software according to the terms and conditions of the Mulan PubL v2.
  You may obtain a copy of Mulan PubL v2 at:
           http://license.coscl.org.cn/MulanPubL-2.0
  THIS SOFTWARE IS PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTIES OF ANY KIND,
  EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO NON-INFRINGEMENT,
  MERCHANTABILITY OR FIT FOR A PARTICULAR PURPOSE.
  See the Mulan PubL v2 for more details.
-->
<script lang="ts">
    export let width = 200; // 默认宽度
    export let isRight = false; // 是否为右侧边栏
    let isResizing = false;
    let startX = 0; // 记录拖动开始时的鼠标位置
    let startWidth = 0; // 记录拖动开始时的宽度

    function startResize(event: MouseEvent) {
        isResizing = true;
        startX = event.clientX; // 记录初始鼠标位置
        startWidth = width; // 记录初始宽度
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", stopResize);
    }

    function onMouseMove(event: MouseEvent) {
        if (isResizing) {
            const deltaX = event.clientX - startX; // 计算鼠标移动的距离
            if (isRight) {
                // 右侧边栏：宽度减少（因为鼠标向左拖动）
                width = startWidth - deltaX;
            } else {
                // 左侧边栏：宽度增加
                width = startWidth + deltaX;
            }
        }
    }

    function stopResize() {
        isResizing = false;
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", stopResize);
    }
</script>

<!-- 使用内联样式动态设置宽度 -->
<div class="sidebar" style="width: {width}px;">
    <slot />
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="resizer {isRight ? 'right' : ''}"
        on:mousedown={startResize}
    ></div>
</div>

<style>
    .sidebar {
        height: 100%;
        background-color: #f0f0f0;
        position: relative;
        border-right: 1px solid #ccc;
    }

    .resizer {
        width: 5px;
        height: 100%;
        background-color: #ccc;
        position: absolute;
        right: 0;
        top: 0;
        cursor: ew-resize;
    }
    /* 左侧边栏的拖动条在右侧 */
    .resizer:not(.right) {
        right: 0;
    }

    /* 右侧边栏的拖动条在左侧 */
    .resizer.right {
        left: 0;
    }
</style>
