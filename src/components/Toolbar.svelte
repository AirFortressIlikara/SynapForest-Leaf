<!--
  Author: Ilikara 3435193369@qq.com
  Date: 2025-01-20 13:51:16
  LastEditors: Ilikara 3435193369@qq.com
  LastEditTime: 2025-01-20 20:39:22
  FilePath: /my-svelte-project/src/Toolbar.svelte
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
<script>
</script>

<div class="toolbar">
    <slot />
</div>

<style>
    .toolbar {
        height: 50px;
        background-color: #333;
        color: white;
        display: flex;
        align-items: center;
        padding: 0 10px;
    }
</style>
